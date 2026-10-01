import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { toggleTaskAtLine } from '@/features/markdown/engine/source'

import { createDebouncedStorage } from './debounced-storage'
import sampleMarkdown from './sample.md?raw'

export const SAMPLE_MARKDOWN = sampleMarkdown

export type DocumentSource = 'sample' | 'local' | 'file' | 'url' | 'shared'

export type DocumentRecord = {
  id: string
  markdown: string
  /** File name when opened from disk, e.g. "README.md". */
  name: string | null
  /** Origin that relative links/images resolve against. */
  baseUrl: string | null
  source: DocumentSource
  updatedAt: number
}

export type OpenDocumentInput = Pick<DocumentRecord, 'markdown' | 'source'> &
  Partial<Pick<DocumentRecord, 'name' | 'baseUrl'>>

type DocumentStore = DocumentRecord & {
  recents: DocumentRecord[]
  /** Bumped whenever a different document is loaded (not persisted). */
  loadKey: number
  setMarkdown: (markdown: string) => void
  openDocument: (input: OpenDocumentInput) => void
  restoreRecent: (id: string) => void
  removeRecent: (id: string) => void
  clearRecents: () => void
  toggleTask: (line: number) => void
}

const STORAGE_KEY = 'render-md:document'
const MAX_RECENTS = 8
/** Rough localStorage budget (UTF-16 chars) shared by the recents shelf. */
const PERSIST_BUDGET = 2_000_000

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

function createSampleDocument(): DocumentRecord {
  return {
    id: 'sample',
    markdown: SAMPLE_MARKDOWN,
    name: null,
    baseUrl: null,
    source: 'sample',
    updatedAt: 0,
  }
}

function snapshot(state: DocumentRecord): DocumentRecord {
  const { id, markdown, name, baseUrl, source, updatedAt } = state
  return { id, markdown, name, baseUrl, source, updatedAt }
}

/** Put the current document on top of the recents shelf (deduped, capped). */
export function archiveDocument(recents: DocumentRecord[], current: DocumentRecord) {
  const isPristineSample = current.source === 'sample' && current.markdown === SAMPLE_MARKDOWN
  if (isPristineSample || !current.markdown.trim()) return recents
  const rest = recents.filter(
    (recent) => recent.id !== current.id && recent.markdown !== current.markdown,
  )
  return [snapshot(current), ...rest].slice(0, MAX_RECENTS)
}

/** Merge another tab's documents into our shelf (union, newest first). */
export function mergeRecents(ours: DocumentRecord[], theirs: DocumentRecord[], currentId: string) {
  const merged: DocumentRecord[] = []
  for (const record of [...ours, ...theirs].sort((a, b) => b.updatedAt - a.updatedAt)) {
    if (record.id === currentId || !record.markdown.trim()) continue
    if (record.source === 'sample' && record.markdown === SAMPLE_MARKDOWN) continue
    if (merged.some((entry) => entry.id === record.id || entry.markdown === record.markdown))
      continue
    merged.push(snapshot(record))
  }
  return merged.slice(0, MAX_RECENTS)
}

/** Recents that fit in the storage budget alongside the current document. */
function recentsWithinBudget(recents: DocumentRecord[], currentSize: number) {
  let budget = PERSIST_BUDGET - currentSize
  return recents.filter((recent) => {
    budget -= recent.markdown.length
    return budget >= 0
  })
}

/** Whether the last write to browser storage succeeded. */
export const usePersistStatus = create<{ saved: boolean }>()(() => ({ saved: true }))

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      ...createSampleDocument(),
      recents: [],
      loadKey: 0,

      setMarkdown: (markdown) => {
        if (markdown === get().markdown) return
        set((state) => ({
          markdown,
          updatedAt: Date.now(),
          // An edited sample becomes its own document.
          id: state.id === 'sample' ? createId() : state.id,
          source: state.source === 'sample' || state.source === 'shared' ? 'local' : state.source,
        }))
      },

      openDocument: ({ markdown, source, name = null, baseUrl = null }) => {
        const current = get()
        set({
          recents: archiveDocument(current.recents, current),
          id: source === 'sample' ? 'sample' : createId(),
          markdown,
          name,
          baseUrl,
          source,
          updatedAt: Date.now(),
          loadKey: current.loadKey + 1,
        })
      },

      restoreRecent: (id) => {
        const current = get()
        const recent = current.recents.find((entry) => entry.id === id)
        if (!recent) return
        set({
          ...recent,
          loadKey: current.loadKey + 1,
          recents: archiveDocument(
            current.recents.filter((entry) => entry.id !== id),
            current,
          ),
        })
      },

      removeRecent: (id) =>
        set((state) => ({ recents: state.recents.filter((entry) => entry.id !== id) })),

      clearRecents: () => set({ recents: [] }),

      toggleTask: (line) => {
        const next = toggleTaskAtLine(get().markdown, line)
        if (next !== null) get().setMarkdown(next)
      },
    }),
    {
      name: STORAGE_KEY,
      version: 2,
      storage: createJSONStorage(() =>
        createDebouncedStorage(400, (_, ok) => usePersistStatus.setState({ saved: ok })),
      ),
      partialize: ({ id, markdown, name, baseUrl, source, updatedAt, recents }) => ({
        id,
        markdown,
        name,
        baseUrl,
        source,
        updatedAt,
        recents: recentsWithinBudget(recents, markdown.length),
      }),
      migrate: () => ({ ...createSampleDocument(), recents: [] }),
      // The sample evolves between releases; never pin an old copy of it.
      merge: (persisted, current) => {
        const state = { ...current, ...(persisted as Partial<DocumentStore>) }
        return state.source === 'sample' ? { ...state, markdown: SAMPLE_MARKDOWN } : state
      },
    },
  ),
)

/*
 * Several tabs share one storage slot. When another tab writes, keep our own
 * document and fold theirs into the recents shelf, so nothing is ever lost.
 * Edits to the same document simply sync.
 */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try {
      const incoming = (JSON.parse(event.newValue) as { state?: DocumentStore }).state
      if (!incoming || typeof incoming.markdown !== 'string') return
      const current = useDocumentStore.getState()

      if (incoming.id === current.id) {
        if (incoming.markdown !== current.markdown && incoming.updatedAt > current.updatedAt) {
          useDocumentStore.setState({ markdown: incoming.markdown, updatedAt: incoming.updatedAt })
        }
        return
      }

      const recents = mergeRecents(
        current.recents,
        [incoming, ...(incoming.recents ?? [])],
        current.id,
      )
      const unchanged =
        recents.length === current.recents.length &&
        recents.every(
          (entry, index) =>
            entry.id === current.recents[index].id &&
            entry.markdown === current.recents[index].markdown,
        )
      if (!unchanged) useDocumentStore.setState({ recents })
    } catch {
      // Ignore malformed writes.
    }
  })
}

/* Migrate content saved by the previous version of the app (pre-rebuild). */
if (typeof window !== 'undefined') {
  try {
    const legacy = window.localStorage.getItem('render-md:editor-content')
    if (legacy) {
      const parsed = JSON.parse(legacy) as { state?: { markdown?: unknown } }
      const markdown = parsed.state?.markdown
      if (
        typeof markdown === 'string' &&
        markdown.trim() &&
        useDocumentStore.getState().source === 'sample'
      ) {
        useDocumentStore.getState().openDocument({ markdown, source: 'local' })
      }
      window.localStorage.removeItem('render-md:editor-content')
    }
  } catch {
    // Ignore unreadable legacy data.
  }
}

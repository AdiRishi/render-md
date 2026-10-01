import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import sampleMarkdown from '@/content/sample.md?raw'
import { toggleTaskAtLine } from '@/lib/markdown/source'
import { createDebouncedStorage } from '@/lib/storage'

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
  setMarkdown: (markdown: string) => void
  openDocument: (input: OpenDocumentInput) => void
  restoreRecent: (id: string) => void
  removeRecent: (id: string) => void
  clearRecents: () => void
  toggleTask: (line: number) => void
}

const MAX_RECENTS = 8
const MAX_RECENT_SIZE = 400_000

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
  if (isPristineSample || !current.markdown.trim() || current.markdown.length > MAX_RECENT_SIZE) {
    return recents
  }
  const rest = recents.filter(
    (recent) => recent.id !== current.id && recent.markdown !== current.markdown,
  )
  return [snapshot(current), ...rest].slice(0, MAX_RECENTS)
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      ...createSampleDocument(),
      recents: [],

      setMarkdown: (markdown) => {
        if (markdown === get().markdown) return
        set((state) => ({
          markdown,
          updatedAt: Date.now(),
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
        })
      },

      restoreRecent: (id) => {
        const current = get()
        const recent = current.recents.find((entry) => entry.id === id)
        if (!recent) return
        set({
          ...recent,
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
      name: 'render-md:document',
      version: 2,
      storage: createJSONStorage(() => createDebouncedStorage()),
      partialize: ({ id, markdown, name, baseUrl, source, updatedAt, recents }) => ({
        id,
        markdown,
        name,
        baseUrl,
        source,
        updatedAt,
        recents,
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

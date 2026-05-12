import { create } from 'zustand'
import { type StateStorage, createJSONStorage, persist } from 'zustand/middleware'

import { defaultContent } from '@/components/editor/markdown/default-content'

const MARKDOWN_STORAGE_KEY = 'render-md:editor-content'
const MARKDOWN_STORAGE_TTL_MS = 30 * 24 * 60 * 60 * 1000

type PersistedEditorContent = {
  markdown: string
  expiresAt: number | null
}

interface EditorContentStore extends PersistedEditorContent {
  setMarkdown: (markdown: string) => void
  clearMarkdown: () => void
}

function getLocalStorage() {
  if (typeof window === 'undefined') return null

  try {
    return window.localStorage
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getStoredMarkdownExpiresAt(storedValue: string) {
  try {
    const parsed: unknown = JSON.parse(storedValue)

    if (!isRecord(parsed) || !isRecord(parsed.state)) return null
    if (typeof parsed.state.markdown !== 'string') return null
    if (typeof parsed.state.expiresAt !== 'number') return null

    return parsed.state.expiresAt
  } catch {
    return null
  }
}

function shouldDiscardStoredMarkdown(storedValue: string) {
  const expiresAt = getStoredMarkdownExpiresAt(storedValue)

  return expiresAt === null || expiresAt <= Date.now()
}

const expiringLocalStorage: StateStorage = {
  getItem: (name) => {
    const storage = getLocalStorage()
    if (!storage) return null

    const storedValue = storage.getItem(name)
    if (!storedValue) return null

    if (shouldDiscardStoredMarkdown(storedValue)) {
      storage.removeItem(name)
      return null
    }

    return storedValue
  },
  setItem: (name, value) => {
    const storage = getLocalStorage()
    if (!storage) return

    storage.setItem(name, value)
  },
  removeItem: (name) => {
    const storage = getLocalStorage()
    if (!storage) return

    storage.removeItem(name)
  },
}

export const useEditorContentStore = create<EditorContentStore>()(
  persist(
    (set) => ({
      markdown: defaultContent,
      expiresAt: null,
      setMarkdown: (markdown) =>
        set({
          markdown,
          expiresAt: Date.now() + MARKDOWN_STORAGE_TTL_MS,
        }),
      clearMarkdown: () => {
        set({
          markdown: defaultContent,
          expiresAt: null,
        })
        useEditorContentStore.persist.clearStorage()
      },
    }),
    {
      name: MARKDOWN_STORAGE_KEY,
      storage: createJSONStorage(() => expiringLocalStorage),
      partialize: (state): PersistedEditorContent => ({
        markdown: state.markdown,
        expiresAt: state.expiresAt,
      }),
    },
  ),
)

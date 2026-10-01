import { type StateStorage } from 'zustand/middleware'

function getLocalStorage() {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage
  } catch {
    return null
  }
}

/**
 * localStorage adapter that coalesces writes. Persisting a large document on
 * every keystroke would serialize megabytes per character typed; instead we
 * write at most every `delay` ms and flush when the page is hidden.
 */
export function createDebouncedStorage(delay = 400): StateStorage {
  const queued = new Map<string, string>()
  let timer: ReturnType<typeof setTimeout> | null = null

  const flush = () => {
    if (timer) clearTimeout(timer)
    timer = null
    const storage = getLocalStorage()
    if (!storage) return
    for (const [name, value] of queued) {
      try {
        storage.setItem(name, value)
      } catch {
        // Quota exceeded or storage disabled — keep working in memory.
      }
    }
    queued.clear()
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush()
    })
  }

  return {
    getItem: (name) => queued.get(name) ?? getLocalStorage()?.getItem(name) ?? null,
    setItem: (name, value) => {
      queued.set(name, value)
      timer ??= setTimeout(flush, delay)
    },
    removeItem: (name) => {
      queued.delete(name)
      try {
        getLocalStorage()?.removeItem(name)
      } catch {
        // Ignore.
      }
    },
  }
}

import {
  type PropsWithChildren,
  createContext,
  use,
  useEffect,
  useState,
  useSyncExternalStore,
} from 'react'
import { flushSync } from 'react-dom'

import {
  type ResolvedTheme,
  type ThemePreference,
  persistThemePreference,
  resolveTheme,
} from '@/lib/theme'

type ThemeContextValue = {
  preference: ThemePreference
  resolved: ResolvedTheme
  setPreference: (preference: ThemePreference, origin?: { x: number; y: number }) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/** The <html> class is the source of truth (the boot script sets it pre-paint). */
function subscribeToDocumentTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const readDocumentTheme = (): ResolvedTheme =>
  document.documentElement.classList.contains('dark') ? 'dark' : 'light'

function applyToDocument(theme: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
}

export function ThemeProvider({
  initialPreference,
  children,
}: PropsWithChildren<{ initialPreference: ThemePreference }>) {
  const [preference, setPreferenceState] = useState(initialPreference)
  const resolved = useSyncExternalStore(subscribeToDocumentTheme, readDocumentTheme, () =>
    initialPreference === 'dark' ? 'dark' : 'light',
  )

  useEffect(() => {
    if (preference !== 'system') return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyToDocument(query.matches ? 'dark' : 'light')
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [preference])

  function setPreference(next: ThemePreference, origin?: { x: number; y: number }) {
    const nextResolved = resolveTheme(next)
    const commit = () => {
      flushSync(() => setPreferenceState(next))
      applyToDocument(nextResolved)
    }
    persistThemePreference(next)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (nextResolved === resolved || reduceMotion || !document.startViewTransition) {
      commit()
      return
    }

    const root = document.documentElement
    const x = origin?.x ?? window.innerWidth - 40
    const y = origin?.y ?? 24
    root.style.setProperty('--reveal-x', `${x}px`)
    root.style.setProperty('--reveal-y', `${y}px`)
    root.style.setProperty(
      '--reveal-r',
      `${Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))}px`,
    )
    document.startViewTransition(commit)
  }

  return <ThemeContext value={{ preference, resolved, setPreference }}>{children}</ThemeContext>
}

export function useTheme() {
  const context = use(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}

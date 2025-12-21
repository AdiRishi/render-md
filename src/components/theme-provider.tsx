import { useRouter } from '@tanstack/react-router'
import { type PropsWithChildren, createContext, use } from 'react'

import { type Theme, setThemeServerFn } from '@/lib/theme'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

type ThemeProviderProps = PropsWithChildren<{ theme: Theme }>

export function ThemeProvider({ children, theme }: ThemeProviderProps) {
  const router = useRouter()

  function setTheme(newTheme: Theme) {
    setThemeServerFn({ data: newTheme }).then(() => router.invalidate())
  }

  return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>
}

export function useTheme() {
  const context = use(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

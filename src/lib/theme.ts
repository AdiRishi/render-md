import { createServerFn } from '@tanstack/react-start'
import { getCookie } from '@tanstack/react-start/server'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

export const THEME_COOKIE = 'render-md-theme'

export const getThemePreferenceServerFn = createServerFn().handler((): ThemePreference => {
  const value = getCookie(THEME_COOKIE)
  return value === 'light' || value === 'dark' ? value : 'system'
})

/**
 * Runs before first paint. Resolves "system" with matchMedia so there is never
 * a flash of the wrong theme, even without a cookie.
 */
export const themeBootScript = `(()=>{try{var m=document.cookie.match(/(?:^|; )${THEME_COOKIE}=(light|dark)/);var t=m?m[1]:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');var r=document.documentElement;r.classList.toggle('dark',t==='dark');r.dataset.theme=t}catch(e){}})()`

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference !== 'system') return preference
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export function persistThemePreference(preference: ThemePreference) {
  const maxAge = preference === 'system' ? 0 : 60 * 60 * 24 * 400
  document.cookie = `${THEME_COOKIE}=${preference};path=/;max-age=${maxAge};samesite=lax`
}

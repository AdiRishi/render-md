import { createServerFn } from '@tanstack/react-start'
import { getCookie, setCookie } from '@tanstack/react-start/server'

export type Theme = 'light' | 'dark'

const THEME_COOKIE_KEY = 'render-md-theme'

export const getThemeServerFn = createServerFn().handler((): Theme => {
  const cookie = getCookie(THEME_COOKIE_KEY)
  return cookie === 'dark' ? 'dark' : 'light'
})

export const setThemeServerFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Theme) => data)
  .handler(({ data }) => {
    setCookie(THEME_COOKIE_KEY, data)
  })

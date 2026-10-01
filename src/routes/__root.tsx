import geistMonoWoff2 from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url'
import instrumentSansWoff2 from '@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2?url'
import instrumentSerifWoff2 from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ClientOnly, HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { type ReactNode } from 'react'

import { ErrorBoundary } from '@/features/site/ErrorBoundary'
import { GoogleAnalytics } from '@/features/site/GoogleAnalytics'
import { getThemePreferenceServerFn, themeBootScript } from '@/features/theme/theme'
import { ThemeProvider, useTheme } from '@/features/theme/ThemeProvider'
import { THEME_COLOR } from '@/lib/seo'
import { Toaster } from '@/ui/sonner'
import { TooltipProvider } from '@/ui/tooltip'

import appCss from '@/styles/app.css?url'

const preloadFont = (href: string) => ({
  rel: 'preload',
  href,
  as: 'font',
  type: 'font/woff2',
  crossOrigin: 'anonymous' as const,
})

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'theme-color', content: THEME_COLOR },
    ],
    links: [
      preloadFont(instrumentSansWoff2),
      preloadFont(geistMonoWoff2),
      preloadFont(instrumentSerifWoff2),
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '48x48', href: '/favicon-48.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  loader: () => getThemePreferenceServerFn(),
  shellComponent: RootDocument,
})

/** Toasts follow the app's own theme preference (not the OS one). */
function ThemedToaster() {
  const { resolved } = useTheme()
  return <Toaster theme={resolved} position="bottom-center" offset={44} />
}

function RootDocument({ children }: { children: ReactNode }) {
  const preference = Route.useLoaderData()

  return (
    <html
      lang="en"
      className={preference === 'dark' ? 'dark' : undefined}
      data-theme={preference === 'system' ? undefined : preference}
      suppressHydrationWarning
    >
      <head>
        {/* Resolve the theme before first paint — never a flash of the wrong one. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <HeadContent />
        <ClientOnly fallback={null}>
          <GoogleAnalytics />
        </ClientOnly>
      </head>
      <body>
        <ThemeProvider initialPreference={preference}>
          <TooltipProvider delay={350}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </TooltipProvider>
          <ThemedToaster />
        </ThemeProvider>
        <TanStackDevtools
          config={{ position: 'bottom-left' }}
          plugins={[{ name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> }]}
        />
        <Scripts />
      </body>
    </html>
  )
}

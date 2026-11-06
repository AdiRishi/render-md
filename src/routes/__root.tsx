import geistMonoWoff2 from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url'
import hankenGroteskWoff2 from '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2?url'
import newsreaderWoff2 from '@fontsource-variable/newsreader/files/newsreader-latin-standard-normal.woff2?url'
import { PostHogProvider } from '@posthog/react'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ClientOnly, HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { type ReactNode } from 'react'

import { ErrorBoundary } from '@/features/site/ErrorBoundary'
import { GoogleAnalytics } from '@/features/site/GoogleAnalytics'
import { getThemePreferenceServerFn, themeBootScript } from '@/features/theme/theme'
import { ThemeProvider } from '@/features/theme/ThemeProvider'
import { THEME_COLOR } from '@/lib/seo'
import { Toaster } from '@/ui/toast'
import { TooltipProvider } from '@/ui/tooltip'

import appCss from '@/styles/app.css?url'

const preloadFont = (href: string) => ({
  rel: 'preload',
  href,
  as: 'font',
  type: 'font/woff2',
  crossOrigin: 'anonymous' as const,
})

const posthogProjectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

function PostHogRoot({ children }: { children: ReactNode }) {
  if (!posthogProjectToken || !posthogHost) {
    if (import.meta.env.DEV) {
      const missingVariable = posthogProjectToken
        ? 'VITE_PUBLIC_POSTHOG_HOST'
        : 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return children
  }

  return (
    <PostHogProvider
      apiKey={posthogProjectToken}
      options={{
        api_host: posthogHost,
        capture_exceptions: true,
        debug: import.meta.env.DEV,
        defaults: '2025-05-24',
        logs: {
          serviceName: 'render-md-web',
          environment: import.meta.env.MODE,
        },
      }}
    >
      {children}
    </PostHogProvider>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { name: 'color-scheme', content: 'light dark' },
      { name: 'theme-color', content: THEME_COLOR },
    ],
    links: [
      preloadFont(hankenGroteskWoff2),
      preloadFont(geistMonoWoff2),
      preloadFont(newsreaderWoff2),
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
        <PostHogRoot>
          <ThemeProvider initialPreference={preference}>
            <TooltipProvider delay={350}>
              <ErrorBoundary>{children}</ErrorBoundary>
            </TooltipProvider>
            {/* Centered above the workspace status bar. */}
            <Toaster className="bottom-11 sm:inset-x-4 sm:mx-auto" />
          </ThemeProvider>
          <TanStackDevtools
            config={{ position: 'bottom-left' }}
            plugins={[{ name: 'TanStack Router', render: <TanStackRouterDevtoolsPanel /> }]}
          />
        </PostHogRoot>
        <Scripts />
      </body>
    </html>
  )
}

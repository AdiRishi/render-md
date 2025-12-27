// react-scan must be imported before React and TanStack Start
import { scan } from 'react-scan'
import { useEffect } from 'react'
import { ClientOnly, HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import geistLatinWoff2 from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'
import geistMonoLatinWoff2 from '@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2?url'
import geistSansLatinWoff2 from '@fontsource/geist-sans/files/geist-sans-latin-400-normal.woff2?url'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/theme-provider'
import { getThemeServerFn } from '@/lib/theme'
import tailwindCss from '@/global-styles/tailwind.css?url'

const GA_ID = 'G-BF428L3QLQ'

// Render GA scripts only on client to avoid hydration mismatch
// See: https://tanstack.com/start/latest/docs/framework/react/guide/execution-model
function GoogleAnalytics() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script async src="/ga-init.js" />
    </>
  )
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      // Default fallback - child routes should override with their own SEO
      { name: 'theme-color', content: '#137fec' },
      { name: 'author', content: 'RenderMD' },
    ],
    links: [
      {
        rel: 'preconnect',
        href: 'https://imagedelivery.net',
      },
      // Preload critical fonts to avoid CSS-to-font request chain
      {
        rel: 'preload',
        href: geistLatinWoff2,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: geistMonoLatinWoff2,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: geistSansLatinWoff2,
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: tailwindCss,
      },
      // Favicon declarations - SVG is prioritized by Google, then PNG (48px minimum)
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/favicon.svg',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '48x48',
        href: '/favicon-48.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        href: '/logo192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        href: '/logo512.png',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '192x192',
        href: '/logo192.png',
      },
      {
        rel: 'manifest',
        href: '/manifest.json',
      },
    ],
  }),

  loader: () => getThemeServerFn(),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const theme = Route.useLoaderData()

  // Initialize React Scan after hydration (dev mode only)
  useEffect(() => {
    scan({
      enabled: false,
    })
  }, [])

  return (
    <html lang="en" className={theme}>
      <head>
        <HeadContent />
        <ClientOnly fallback={null}>
          <GoogleAnalytics />
        </ClientOnly>
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </ThemeProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}

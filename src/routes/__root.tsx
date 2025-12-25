import { ClientOnly, HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/theme-provider'
import { getThemeServerFn } from '@/lib/theme'
import tailwindCss from '@/global-styles/tailwind.css?url'
import editorCss from '@/global-styles/editor.css?url'

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
      {
        rel: 'stylesheet',
        href: tailwindCss,
      },
      {
        rel: 'stylesheet',
        href: editorCss,
      },
      {
        rel: 'apple-touch-icon',
        sizes: '192x192',
        href: '/logo192.png',
      },
      {
        rel: 'icon',
        href: '/favicon.ico',
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

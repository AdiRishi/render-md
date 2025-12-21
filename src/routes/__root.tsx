import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/theme-provider'
import { getThemeServerFn } from '@/lib/theme'
import tailwindCss from '@/global-styles/tailwind.css?url'
import editorCss from '@/global-styles/editor.css?url'

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
      {
        title: 'RenderMD - Markdown Editor',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: tailwindCss,
      },
      {
        rel: 'stylesheet',
        href: editorCss,
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

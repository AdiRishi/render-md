import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ThemeProvider } from '@/components/theme-provider'
import { getThemeServerFn } from '@/lib/theme'
import { seo } from '@/lib/seo'
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
      ...seo({
        title: 'RenderMD - Real-Time Markdown Editor with Live Preview',
        description:
          'RenderMD is a free real-time markdown editor with instant live preview. Write GitHub Flavored Markdown with LaTeX math support, syntax highlighting for 150+ languages, tables, and code blocks.',
        keywords:
          'markdown editor, live preview, markdown preview, online markdown editor, GFM, GitHub Flavored Markdown, LaTeX math, KaTeX, syntax highlighting, code blocks, markdown to HTML, real-time editor',
      }),
    ],
    scripts: [
      {
        src: 'https://www.googletagmanager.com/gtag/js?id=G-BF428L3QLQ',
        async: true,
      },
      {
        children: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-BF428L3QLQ');
        `,
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
      {
        rel: 'canonical',
        href: 'https://www.render-md.com',
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

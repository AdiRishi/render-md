import { createFileRoute } from '@tanstack/react-router'

import { EditorLayout } from '@/components/editor/EditorLayout'
import { seo } from '@/lib/seo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      ...seo({
        title: 'RenderMD - Real-Time Markdown Editor with Live Preview',
        description:
          'RenderMD is a free real-time markdown editor with instant live preview. Write GitHub Flavored Markdown with LaTeX math support, syntax highlighting for 150+ languages, tables, and code blocks.',
        keywords:
          'markdown editor, live preview, markdown preview, online markdown editor, GFM, GitHub Flavored Markdown, LaTeX math, KaTeX, syntax highlighting, code blocks, markdown to HTML, real-time editor',
        url: 'https://www.render-md.com',
      }),
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://www.render-md.com',
      },
    ],
  }),
  component: App,
})

function App() {
  return <EditorLayout />
}

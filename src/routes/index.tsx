import { createFileRoute } from '@tanstack/react-router'

import { EditorLayout } from '@/components/editor/EditorLayout'
import { getCfImageUrl } from '@/lib/cf-image'
import { getHomeJsonLd, jsonLdScripts, seo } from '@/lib/seo'
import editorCss from '@/global-styles/editor.css?url'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      ...seo({
        title: 'RenderMD | Real-Time Markdown Editor',
        description:
          'Write markdown and see the rendered result instantly. RenderMD supports GitHub Flavored Markdown, Mermaid diagrams, LaTeX math, tables, and syntax highlighting.',
        url: 'https://www.render-md.com',
        image: getCfImageUrl('editorOg'),
      }),
    ],
    links: [
      {
        rel: 'stylesheet',
        href: editorCss,
      },
      {
        rel: 'canonical',
        href: 'https://www.render-md.com',
      },
    ],
    scripts: jsonLdScripts(getHomeJsonLd()),
  }),
  component: App,
})

function App() {
  return <EditorLayout />
}

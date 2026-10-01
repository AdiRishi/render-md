import { ClientOnly, createFileRoute } from '@tanstack/react-router'

import { getSiteJsonLd } from '@/features/site/structured-data'
import { Workspace } from '@/features/workspace/Workspace'
import { WorkspaceSkeleton } from '@/features/workspace/WorkspaceSkeleton'
import { jsonLdScripts, seo, SITE_URL } from '@/lib/seo'

type HomeSearch = { url?: string; new?: boolean }

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>): HomeSearch => ({
    url: typeof search.url === 'string' && search.url ? search.url : undefined,
    new: search.new !== undefined ? true : undefined,
  }),
  head: () => ({
    meta: seo({
      title: 'RenderMD — Beautiful markdown, rendered instantly',
      description:
        'Paste, drop or link any markdown file and read it beautifully typeset. Live editor, GitHub Flavored Markdown, Mermaid, LaTeX, syntax highlighting, private share links and PDF export. Free, no ads, no sign-up.',
      url: SITE_URL,
    }),
    links: [{ rel: 'canonical', href: SITE_URL }],
    scripts: jsonLdScripts(getSiteJsonLd()),
  }),
  component: Home,
})

function Home() {
  const search = Route.useSearch()
  return (
    <ClientOnly fallback={<WorkspaceSkeleton />}>
      <Workspace initialUrl={search.url} startBlank={search.new} />
    </ClientOnly>
  )
}

import { createFileRoute } from '@tanstack/react-router'

import { loadGuide } from '@/features/guides/data'
import { GuidePage } from '@/features/guides/GuidePage'
import { guideHead } from '@/features/guides/seo'

export const Route = createFileRoute('/markdown-to-pdf')({
  loader: () => loadGuide('markdown-to-pdf'),
  staleTime: Infinity,
  head: () => guideHead('markdown-to-pdf'),
  component: function MarkdownToPdfRoute() {
    return <GuidePage slug="markdown-to-pdf" data={Route.useLoaderData()} />
  },
})

import { createFileRoute } from '@tanstack/react-router'

import { loadGuide } from '@/features/guides/data'
import { GuidePage } from '@/features/guides/GuidePage'
import { guideHead } from '@/features/guides/seo'

export const Route = createFileRoute('/markdown-table-generator')({
  loader: () => loadGuide('markdown-table-generator'),
  staleTime: Infinity,
  head: () => guideHead('markdown-table-generator'),
  component: function MarkdownTableGeneratorRoute() {
    return <GuidePage slug="markdown-table-generator" data={Route.useLoaderData()} />
  },
})

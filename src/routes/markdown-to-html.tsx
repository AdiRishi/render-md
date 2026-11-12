import { createFileRoute } from '@tanstack/react-router'

import { loadGuide } from '@/features/guides/data'
import { GuidePage } from '@/features/guides/GuidePage'
import { guideHead } from '@/features/guides/seo'

export const Route = createFileRoute('/markdown-to-html')({
  loader: () => loadGuide('markdown-to-html'),
  staleTime: Infinity,
  head: () => guideHead('markdown-to-html'),
  component: function MarkdownToHtmlRoute() {
    return <GuidePage slug="markdown-to-html" data={Route.useLoaderData()} />
  },
})

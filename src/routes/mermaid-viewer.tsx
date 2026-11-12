import { createFileRoute } from '@tanstack/react-router'

import { loadGuide } from '@/features/guides/data'
import { GuidePage } from '@/features/guides/GuidePage'
import { guideHead } from '@/features/guides/seo'

export const Route = createFileRoute('/mermaid-viewer')({
  loader: () => loadGuide('mermaid-viewer'),
  staleTime: Infinity,
  head: () => guideHead('mermaid-viewer'),
  component: function MermaidViewerRoute() {
    return <GuidePage slug="mermaid-viewer" data={Route.useLoaderData()} />
  },
})

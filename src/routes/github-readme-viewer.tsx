import { createFileRoute } from '@tanstack/react-router'

import { loadGuide } from '@/features/guides/data'
import { GuidePage } from '@/features/guides/GuidePage'
import { guideHead } from '@/features/guides/seo'

export const Route = createFileRoute('/github-readme-viewer')({
  loader: () => loadGuide('github-readme-viewer'),
  staleTime: Infinity,
  head: () => guideHead('github-readme-viewer'),
  component: function GithubReadmeViewerRoute() {
    return <GuidePage slug="github-readme-viewer" data={Route.useLoaderData()} />
  },
})

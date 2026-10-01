import { createFileRoute } from '@tanstack/react-router'

import { CheatsheetPage } from '@/features/cheatsheet/CheatsheetPage'
import { loadCheatsheet } from '@/features/cheatsheet/data'
import { cheatsheetHead } from '@/features/cheatsheet/seo'

export const Route = createFileRoute('/cheatsheet')({
  loader: loadCheatsheet,
  staleTime: Infinity,
  head: cheatsheetHead,
  component: function CheatsheetRoute() {
    return <CheatsheetPage data={Route.useLoaderData()} />
  },
})

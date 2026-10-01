/**
 * The cheat sheet's rendered content. Every example, tip and FAQ answer runs
 * through the real markdown pipeline on the server, so the page ships rendered
 * HTML (great for crawlers) instead of the markdown engine itself.
 */
import { createServerFn } from '@tanstack/react-start'
import { type Root } from 'hast'

import { stripHeadingIds } from '@/features/markdown/engine/hast'

import { FAQ, SECTIONS } from './content'

/** The hero's specimen, shown as source and as the typeset page. */
export const HERO_SOURCE = `## Proof, not *promise*

- [x] Typeset in your browser
- [ ] Ads, trackers, sign-ups

> Write like nobody's rendering.`

export type CheatsheetData = {
  hero: Root
  examples: Record<string, Root>
  tips: Record<string, Root>
  faq: Root[]
}

const renderCheatsheet = createServerFn().handler(async () => {
  const { renderMarkdown } = await import('@/features/markdown/engine/pipeline')
  const render = (source: string) => renderMarkdown(source, { stripPositions: true }).hast
  const data: CheatsheetData = {
    hero: stripHeadingIds(render(HERO_SOURCE)),
    examples: Object.fromEntries(
      SECTIONS.flatMap((section) => section.entries).map((entry) => [
        entry.source,
        stripHeadingIds(render(entry.source)),
      ]),
    ),
    tips: Object.fromEntries(
      SECTIONS.filter((section) => section.tips?.length).map((section) => [
        section.id,
        render(section.tips!.map((tip) => `- ${tip}`).join('\n')),
      ]),
    ),
    faq: FAQ.map((item) => render(item.answer)),
  }
  // HAST is plain JSON; a string keeps the server-function contract simple.
  return JSON.stringify(data)
})

/** Route loader: rendered on the server, parsed on whichever side asked. */
export async function loadCheatsheet() {
  return JSON.parse(await renderCheatsheet()) as CheatsheetData
}

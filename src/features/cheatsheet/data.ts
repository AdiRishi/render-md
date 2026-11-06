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
export const HERO_SOURCE = `## Weekly *notes*

- [x] Ship the share dialog
- [ ] Write the changelog

> Review on Friday.`

export type CheatsheetData = {
  hero: Root
  examples: Record<string, Root>
  tips: Record<string, Root>
  faq: Root[]
}

const renderCheatsheet = createServerFn().handler(async () => {
  const [{ renderMarkdown }, { highlightCodeBlocks }] = await Promise.all([
    import('@/features/markdown/engine/pipeline'),
    import('@/features/markdown/engine/highlight'),
  ])
  const render = (source: string) =>
    highlightCodeBlocks(renderMarkdown(source, { stripPositions: true }).hast)
  const entries = SECTIONS.flatMap((section) => section.entries)
  const tipSections = SECTIONS.filter((section) => section.tips?.length)
  const [hero, examples, tips, faq] = await Promise.all([
    render(HERO_SOURCE),
    Promise.all(entries.map((entry) => render(entry.source))),
    Promise.all(
      tipSections.map((section) => render(section.tips!.map((tip) => `- ${tip}`).join('\n'))),
    ),
    Promise.all(FAQ.map((item) => render(item.answer))),
  ])
  const data: CheatsheetData = {
    hero: stripHeadingIds(hero),
    examples: Object.fromEntries(
      entries.map((entry, index) => [entry.source, stripHeadingIds(examples[index])]),
    ),
    tips: Object.fromEntries(tipSections.map((section, index) => [section.id, tips[index]])),
    faq,
  }
  // HAST is plain JSON; a string keeps the server-function contract simple.
  return JSON.stringify(data)
})

/** Route loader: rendered on the server, parsed on whichever side asked. */
export async function loadCheatsheet() {
  return JSON.parse(await renderCheatsheet()) as CheatsheetData
}

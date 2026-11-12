/**
 * The cheat sheet's rendered content. Every example, tip and FAQ answer runs
 * through the real markdown pipeline on the server, so the page ships rendered
 * HTML (great for crawlers) instead of the markdown engine itself.
 */
import { createServerFn } from '@tanstack/react-start'
import { type Root } from 'hast'

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

const tipsMarkdown = (tips: string[]) => tips.map((tip) => `- ${tip}`).join('\n')

const renderCheatsheet = createServerFn().handler(async () => {
  const { renderStatic } = await import('@/features/markdown/engine/render-static')
  const entries = SECTIONS.flatMap((section) => section.entries)
  const tipSections = SECTIONS.flatMap((section) =>
    section.tips?.length ? [{ id: section.id, markdown: tipsMarkdown(section.tips) }] : [],
  )
  const rendered = await renderStatic([
    HERO_SOURCE,
    ...entries.map((entry) => entry.source),
    ...tipSections.map((section) => section.markdown),
    ...FAQ.map((item) => item.answer),
  ])
  const data: CheatsheetData = {
    hero: rendered[HERO_SOURCE],
    examples: Object.fromEntries(entries.map((entry) => [entry.source, rendered[entry.source]])),
    tips: Object.fromEntries(
      tipSections.map((section) => [section.id, rendered[section.markdown]]),
    ),
    faq: FAQ.map((item) => rendered[item.answer]),
  }
  // HAST is plain JSON; a string keeps the server-function contract simple.
  return JSON.stringify(data)
})

/** Route loader: rendered on the server, parsed on whichever side asked. */
export async function loadCheatsheet() {
  return JSON.parse(await renderCheatsheet()) as CheatsheetData
}

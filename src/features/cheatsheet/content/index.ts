import { basics } from './chapters/basics'
/**
 * The markdown cheat sheet's content. Every example `source`, tip and FAQ
 * answer is markdown, rendered by the real pipeline on the server.
 */
import { beyond } from './chapters/beyond'
import { gfm } from './chapters/gfm'
import { type CheatsheetChapter } from './types'

export { FAQ } from './faq'
export { QUICK_REFERENCE } from './quick-reference'
export { SUPPORT_LABEL, type Support } from './support'
export type { CheatsheetChapter, CheatsheetEntry, CheatsheetSection } from './types'

/** Bump when the content changes meaningfully — it's published as dateModified. */
export const CHEATSHEET_UPDATED = '2026-10-01'

export const CHAPTERS: CheatsheetChapter[] = [basics, gfm, beyond]

export const SECTIONS = CHAPTERS.flatMap((chapter) => chapter.sections)

/** A section's 1-based position across all chapters (its "§" number). */
export const sectionNumber = (id: string) => SECTIONS.findIndex((section) => section.id === id) + 1

export const EXAMPLE_COUNT = SECTIONS.reduce((total, section) => total + section.entries.length, 0)

import { type Support } from './support'

export type CheatsheetEntry = {
  /** Optional caption for this variant, e.g. "Alignment". */
  label?: string
  source: string
}

export type CheatsheetSection = {
  id: string
  title: string
  support: Support
  /** One or two sentences of plain explanation (shown under the heading). */
  summary: string
  entries: CheatsheetEntry[]
  /** Markdown bullets: gotchas and good-to-knows. */
  tips?: string[]
}

export type CheatsheetChapter = {
  id: string
  numeral: string
  title: string
  intro: string
  sections: CheatsheetSection[]
}

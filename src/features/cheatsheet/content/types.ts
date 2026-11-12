import { type SpecimenEntry } from '@/features/markdown/specimen/Specimen'

import { type Support } from './support'

export type CheatsheetSection = {
  id: string
  title: string
  support: Support
  /** One or two sentences of plain explanation (shown under the heading). */
  summary: string
  entries: SpecimenEntry[]
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

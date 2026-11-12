import { type SpecimenEntry } from '@/features/markdown/specimen/Specimen'
import { type ContentPage } from '@/features/site/pages'

import { type Table } from '../table/table-model'

type SlugOf<Path> = Path extends `/${infer Slug}` ? Slug : never

/** A guide's URL segment. Every guide is a content page, so the site links to all of them. */
export type GuideSlug = SlugOf<Exclude<ContentPage['to'], '/cheatsheet'>>

export type GalleryItem = {
  /** A public anchor, like section ids. */
  id: string
  title: string
  /** One or two sentences of markdown, shown under the H3. */
  summary: string
  source: string
}

/**
 * One piece of a guide. Markdown in a block is rendered on the server; the
 * other kinds are interactive tools the page draws around that content.
 */
export type GuideBlock =
  | { kind: 'prose'; markdown: string }
  /** Live examples; `shows` picks the result pane: the typeset page or its HTML. */
  | { kind: 'specimens'; entries: SpecimenEntry[]; shows: 'page' | 'html' }
  /** Live examples under their own H3 anchors, with a jump list. */
  | { kind: 'gallery'; items: GalleryItem[] }
  | { kind: 'steps'; steps: Array<{ title: string; markdown: string }> }
  | { kind: 'pdf-settings' }
  /** The generator, starting from `initial`, which is also rendered on the server. */
  | { kind: 'table-generator'; initial: Table }

export type GuideSection = {
  /** A public anchor (`/mermaid-viewer#sequence`); don't rename once published. */
  id: string
  title: string
  blocks: GuideBlock[]
}

export type GuideFaqItem = { question: string; answer: string }

export type Guide = {
  slug: GuideSlug
  /** The H1, in two parts: the second is set in italic. */
  h1: readonly [lead: string, emphasis: string]
  lede: string
  metaTitle: string
  metaDescription: string
  ogImageAlt: string
  /** The page's tool, shown in the hero beside the H1. */
  tool: GuideBlock
  sections: GuideSection[]
  faq: GuideFaqItem[]
  /** The closing call to action's headline. */
  cta: string
}

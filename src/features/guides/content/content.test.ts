import { toHtml } from 'hast-util-to-html'
import { describe, expect, it } from 'vitest'

import { renderMarkdown } from '@/features/markdown/engine/pipeline'

import { GUIDES } from './index'
import { guideSources } from './sources'
import { type GuideBlock } from './types'

const html = (source: string) => toHtml(renderMarkdown(source).hast)
const guides = Object.values(GUIDES)
const blocksOf = (slug: keyof typeof GUIDES) => {
  const guide = GUIDES[slug]
  return [guide.tool, ...guide.sections.flatMap((section) => section.blocks)]
}
const blockOf = <K extends GuideBlock['kind']>(slug: keyof typeof GUIDES, kind: K) =>
  blocksOf(slug).filter((block): block is Extract<GuideBlock, { kind: K }> => block.kind === kind)

describe('guide content', () => {
  it('renders every markdown string to HTML', () => {
    for (const guide of guides) {
      for (const source of guideSources(guide)) {
        expect(html(source).trim()).not.toBe('')
      }
    }
  })

  it('gives every section and gallery item a unique anchor within its page', () => {
    for (const guide of guides) {
      const ids = [
        ...guide.sections.map((section) => section.id),
        ...blocksOf(guide.slug).flatMap((block) =>
          block.kind === 'gallery' ? block.items.map((item) => item.id) : [],
        ),
        'faq',
      ]
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  it('draws every Mermaid example as a diagram', () => {
    const sources = [
      ...blockOf('mermaid-viewer', 'specimens').flatMap((block) =>
        block.entries.map((entry) => entry.source),
      ),
      ...blockOf('mermaid-viewer', 'gallery').flatMap((block) =>
        block.items.map((item) => item.source),
      ),
    ]
    expect(sources.length).toBeGreaterThanOrEqual(10)
    for (const source of sources) expect(html(source)).toContain('language-mermaid')
  })
})

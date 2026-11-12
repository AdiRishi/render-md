import { toHtml } from 'hast-util-to-html'
import { describe, expect, it } from 'vitest'

import { renderMarkdown } from '@/features/markdown/engine/pipeline'

import { GUIDES } from './index'
import { guideSources } from './sources'

const html = (source: string) => toHtml(renderMarkdown(source).hast)
const guides = Object.values(GUIDES)
const blocksOf = (slug: keyof typeof GUIDES) => {
  const guide = GUIDES[slug]
  return [guide.tool, ...guide.sections.flatMap((section) => section.blocks)]
}

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
})

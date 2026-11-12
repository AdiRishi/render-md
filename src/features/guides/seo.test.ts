import { describe, expect, it } from 'vitest'

import { GUIDES, type GuideSlug } from './content'
import { guideHead } from './seo'

const slugs = Object.keys(GUIDES).filter((slug): slug is GuideSlug => Object.hasOwn(GUIDES, slug))

const metaContent = (slug: GuideSlug, key: string) =>
  guideHead(slug).meta.find(
    (tag) => ('property' in tag && tag.property === key) || ('name' in tag && tag.name === key),
  )

describe('guide <head>', () => {
  it('points the canonical link and og:url at the guide’s own URL', () => {
    const urls = {
      'github-readme-viewer': 'https://www.render-md.com/github-readme-viewer',
      'mermaid-viewer': 'https://www.render-md.com/mermaid-viewer',
      'markdown-to-pdf': 'https://www.render-md.com/markdown-to-pdf',
      'markdown-to-html': 'https://www.render-md.com/markdown-to-html',
      'markdown-table-generator': 'https://www.render-md.com/markdown-table-generator',
    } satisfies Record<GuideSlug, string>
    for (const slug of slugs) {
      expect(guideHead(slug).links).toEqual([{ rel: 'canonical', href: urls[slug] }])
      expect(metaContent(slug, 'og:url')).toMatchObject({ content: urls[slug] })
    }
  })

  it('gives every guide its own title, description and Open Graph image', () => {
    for (const key of ['description', 'og:image']) {
      const values = slugs.map((slug) => metaContent(slug, key))
      expect(new Set(values.map((tag) => JSON.stringify(tag))).size).toBe(slugs.length)
    }
    const titles = slugs.map((slug) => guideHead(slug).meta.find((tag) => 'title' in tag))
    expect(new Set(titles.map((tag) => JSON.stringify(tag))).size).toBe(slugs.length)
  })

  it('keeps titles short enough to show in full in search results', () => {
    for (const slug of slugs) {
      expect(GUIDES[slug].metaTitle.length).toBeLessThanOrEqual(70)
      expect(GUIDES[slug].metaDescription.length).toBeLessThanOrEqual(220)
    }
  })
})

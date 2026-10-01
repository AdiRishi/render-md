import { toHtml } from 'hast-util-to-html'
import { describe, expect, it } from 'vitest'

import { renderMarkdown } from '@/lib/markdown/pipeline'

import { CHAPTERS, FAQ, QUICK_REFERENCE, SECTIONS } from './cheatsheet'

const html = (source: string) => toHtml(renderMarkdown(source).hast)
const find = (id: string) => SECTIONS.find((section) => section.id === id)!

describe('cheatsheet content', () => {
  it('has unique section ids and quick-reference links that resolve', () => {
    const ids = SECTIONS.map((section) => section.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const row of QUICK_REFERENCE) expect(ids).toContain(row.id)
    expect(CHAPTERS.length).toBe(3)
  })

  it('renders every example, tip and FAQ answer to non-empty HTML', () => {
    for (const section of SECTIONS) {
      for (const entry of section.entries) {
        expect(html(entry.source).trim().length, `${section.id}: ${entry.source}`).toBeGreaterThan(
          0,
        )
      }
      for (const tip of section.tips ?? []) expect(html(tip)).toContain('<p')
    }
    for (const item of FAQ) expect(html(item.answer)).toContain('<p')
  })

  it('demonstrates what each section claims', () => {
    expect(html(find('headings').entries[1].source)).toMatch(/<h1[^>]*>Heading 1<\/h1>/)
    expect(html(find('paragraphs').entries[1].source).match(/<br>/g)).toHaveLength(2)
    expect(html(find('escaping').entries[0].source)).not.toContain('<em>')
    expect(html(find('comments').entries[0].source)).not.toContain('TODO')
    expect(html(find('tables').entries[1].source)).toContain('a | b')
    expect(html(find('footnotes').entries[0].source)).toContain('data-footnotes')
    expect(html(find('alerts').entries[4].source)).toContain('markdown-alert-caution')
    expect(html(find('math').entries[2].source)).toContain('katex-display')
    expect(html(find('emoji').entries[0].source)).toContain('🚀')
    expect(renderMarkdown(find('frontmatter').entries[0].source).frontmatter?.title).toBe(
      'Release notes',
    )
  })
})

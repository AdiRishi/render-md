import { toHtml } from 'hast-util-to-html'
import { describe, expect, it } from 'vitest'

import { renderMarkdown } from './pipeline'

const html = (markdown: string, baseUrl?: string) =>
  toHtml(renderMarkdown(markdown, { baseUrl }).hast)

describe('renderMarkdown', () => {
  it('renders GitHub flavored markdown', () => {
    const out = html('| a | b |\n|---|:-:|\n| 1 | 2 |\n\n- [x] done\n- [ ] todo\n\n~~gone~~')
    expect(out).toContain('<table')
    expect(out).toContain('align="center"')
    expect(out).toContain('type="checkbox"')
    expect(out).toContain('<del>gone</del>')
  })

  it('stamps block elements with source lines', () => {
    const out = html('# Title\n\nParagraph\n\n- item')
    expect(out).toContain('<h1 data-line="1" id="title">')
    expect(out).toContain('<p data-line="3">')
    expect(out).toContain('<li data-line="5">')
  })

  it('sanitizes dangerous raw HTML but keeps safe HTML', () => {
    const out = html(
      '<p align="center"><img src="logo.png" width="80"></p>\n\n<script>alert(1)</script>\n\n<a href="javascript:alert(1)" onclick="x()">x</a>\n\n<details><summary>More</summary>Hidden</details>',
    )
    expect(out).not.toContain('<script')
    expect(out).not.toContain('javascript:')
    expect(out).not.toContain('onclick')
    expect(out).toContain('align="center"')
    expect(out).toContain('width="80"')
    expect(out).toContain('<details')
  })

  it('renders inline, display and fenced math with KaTeX', () => {
    const out = html('Inline $E=mc^2$\n\n$$\n\\int_0^1 x\\,dx\n$$\n\n```math\na^2+b^2=c^2\n```')
    expect(out).toContain('class="math math-inline"')
    expect(out.match(/class="math math-display"/g)).toHaveLength(2)
    expect(out).toContain('class="katex"')
  })

  it('turns GitHub alerts into callouts', () => {
    const out = html('> [!WARNING]\n> Mind the gap.')
    expect(out).toContain('class="markdown-alert markdown-alert-warning"')
    expect(out).toContain('data-alert="warning"')
    expect(out).toContain('Mind the gap.')
    expect(out).not.toContain('[!WARNING]')
  })

  it('collects headings, title and frontmatter', () => {
    const result = renderMarkdown(
      '---\ntitle: Front Title\ntags: [a, b]\n---\n\n# Hello\n\n## World',
    )
    expect(result.frontmatter).toEqual({ title: 'Front Title', tags: ['a', 'b'] })
    expect(result.title).toBe('Front Title')
    expect(result.headings.map((h) => [h.depth, h.id, h.text])).toEqual([
      [1, 'hello', 'Hello'],
      [2, 'world', 'World'],
    ])
    expect(toHtml(result.hast)).not.toContain('tags:')
  })

  it('falls back to the first h1 as title', () => {
    expect(renderMarkdown('## Intro\n\n# Real Title').title).toBe('Real Title')
    expect(renderMarkdown('plain text').title).toBeNull()
  })

  it('resolves relative URLs against a base URL', () => {
    const out = html(
      '![logo](docs/logo.png) [guide](./GUIDE.md) [abs](https://x.dev) [anchor](#top)',
      'https://raw.githubusercontent.com/o/r/HEAD/README.md',
    )
    expect(out).toContain('src="https://raw.githubusercontent.com/o/r/HEAD/docs/logo.png"')
    expect(out).toContain('href="https://raw.githubusercontent.com/o/r/HEAD/GUIDE.md"')
    expect(out).toContain('href="https://x.dev"')
    expect(out).toContain('href="#top"')
  })

  it('keeps code languages and fence meta', () => {
    const out = html('```ts title="app.ts"\nconst a = 1\n```')
    expect(out).toContain('class="language-ts"')
    expect(out).toContain('data-meta="title=&#x22;app.ts&#x22;"')
  })

  it('supports emoji shortcodes and footnotes', () => {
    const out = html('Party :tada:[^1]\n\n[^1]: A note.')
    expect(out).toContain('🎉')
    expect(out).toContain('data-footnotes')
    expect(out).toContain('href="#fn-1"')
  })

  it('counts words across scripts', () => {
    const { stats } = renderMarkdown('# Hello world\n\nこんにちは世界')
    expect(stats.words).toBeGreaterThanOrEqual(4)
    expect(stats.lines).toBe(3)
    expect(stats.readingMinutes).toBe(1)
  })
})

import { toHtml } from 'hast-util-to-html'
import { describe, expect, it } from 'vitest'

import { renderMarkdown } from './pipeline'

const html = (markdown: string, baseUrl?: string) =>
  toHtml(renderMarkdown(markdown, { baseUrl }).hast)

/** KaTeX keeps the TeX it was given in the MathML annotation. */
const tex = (source: string) => `<annotation encoding="application/x-tex">${source}</annotation>`

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

  describe('LaTeX delimiters', () => {
    it('renders \\(…\\) as inline math without reading markdown inside it', () => {
      const out = html('Sum \\(a_1 * b_2\\) and *real*')
      expect(out.match(/class="math math-inline"/g)).toHaveLength(1)
      expect(out).toContain(tex('a_1 * b_2'))
      expect(out).toContain('<em>real</em>')
      expect(out.match(/<em>/g)).toHaveLength(1)
    })

    it('renders \\[…\\] as display math right after a paragraph line, keeping source lines', () => {
      const out = html(
        'Text:\n\\[\n\\begin{aligned}\na_1 &= b \\\\\nc &= d\n\\end{aligned}\n\\]\nAfter',
      )
      expect(out).toContain('<p data-line="1">Text:</p>')
      expect(out).toContain('<div class="math math-display" data-line="2">')
      expect(out).toContain(
        tex('\\begin{aligned}\na_1 &#x26;= b \\\\\nc &#x26;= d\n\\end{aligned}'),
      )
      expect(out).toContain('<p data-line="8">After</p>')
    })

    it('renders \\[…\\] inside list items and blockquotes', () => {
      const list = html('1. Step\n   \\[\n   x = 1\n   \\]\n2. Next')
      expect(list).toMatch(/<li[^>]*>Step\s*<div class="math math-display"/)
      const quote = html('> \\[\n> x = 1\n> \\]')
      expect(quote).toMatch(/<blockquote[^>]*>\s*<div class="math math-display"/)
    })

    it('leaves escaped punctuation that is not math as text', () => {
      const out = html('He said \\[sic\\] it.\n\nAn unclosed \\(aside.')
      expect(out).not.toContain('class="math')
      expect(out).toContain('He said [sic] it.')
      expect(out).toContain('An unclosed (aside.')
    })

    // ChatGPT's copy button escapes the LaTeX so the markdown renders back to its source.
    it("renders math copied with ChatGPT's copy button", () => {
      const out = html(
        [
          'Einstein:',
          '',
          '\\\\[ \\boxed{ R\\_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T\\_{\\mu\\nu} } \\\\]',
          '',
          'A path integral \\\\(Z[J] = \\int \\mathcal{D}\\phi\\\\, \\exp\\Bigg\\\\{ x \\Bigg\\\\}\\\\) inline.',
          '',
          '\\\\[ a \\\\] then \\\\[ b \\\\]',
        ].join('\n'),
      )
      expect(out).toContain('<div class="math math-display" data-line="3">')
      expect(out).toContain(tex(' \\boxed{ R_{\\mu\\nu} = \\frac{8\\pi G}{c^4}T_{\\mu\\nu} } '))
      expect(out).toContain('<span class="math math-inline">')
      expect(out).toContain(tex('Z[J] = \\int \\mathcal{D}\\phi\\, \\exp\\Bigg\\{ x \\Bigg\\}'))
      expect(out).toMatch(
        /<p data-line="7"><span class="math math-display">.*<\/span> then <span class="math math-display">/,
      )
      expect(out).not.toContain('\\[')
    })

    it('keeps the delimiters literal in code', () => {
      const out = html('`\\(x\\)` `\\\\(w\\\\)`\n\n```\n\\[y\\]\n```')
      expect(out).toContain('<code>\\(x\\)</code>')
      expect(out).toContain('<code>\\\\(w\\\\)</code>')
      expect(out).toContain('\\[y\\]')
      expect(out).not.toContain('katex')
    })
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
    // Footnote links must point at ids that exist (also in exported HTML).
    const href = /href="#([^"]+)"[^>]*data-footnote-ref/.exec(out)?.[1]
    expect(href).toBeTruthy()
    expect(out).toContain(`id="${href}"`)
  })

  it('keeps the footnote label out of the outline and title', () => {
    const result = renderMarkdown('Text[^1]\n\n[^1]: Note.')
    expect(result.headings).toEqual([])
    expect(result.title).toBeNull()
  })

  it('survives cyclic YAML frontmatter', () => {
    const result = renderMarkdown('---\na: &x\n  b: *x\n---\n\n# Doc')
    expect(() => JSON.stringify(result.frontmatter)).not.toThrow()
    expect(result.title).toBe('Doc')
  })

  it('turns a pagebreak comment into a page break', () => {
    const out = html('One\n\n<!-- pagebreak -->\n\nTwo\n\n<!--newpage-->\n\nThree')
    expect(out.match(/<hr class="page-break" data-line="\d+">/g)).toHaveLength(2)
  })

  it('turns the empty page-break div other editors write into a page break', () => {
    const out = html(
      'One\n\n<div style="page-break-after: always;"></div>\n\nTwo\n\n<div style="break-before: page"></div>',
    )
    expect(out.match(/<hr class="page-break"/g)).toHaveLength(2)
    expect(out).not.toContain('style=')
  })

  it('leaves page-break text alone outside a standalone marker', () => {
    const out = html(
      '```html\n<!-- pagebreak -->\n```\n\nInline `<!-- pagebreak -->` here\n\n<div style="page-break-after: always">Text</div>\n\n<p class="page-break">x</p>',
    )
    expect(out).not.toContain('<hr')
    expect(out).toContain('&#x3C;!-- pagebreak -->')
    expect(out).not.toContain('class="page-break"')
  })

  it('counts words across scripts', () => {
    const { stats } = renderMarkdown('# Hello world\n\nこんにちは世界')
    expect(stats.words).toBeGreaterThanOrEqual(4)
    expect(stats.lines).toBe(3)
    expect(stats.readingMinutes).toBe(1)
  })
})

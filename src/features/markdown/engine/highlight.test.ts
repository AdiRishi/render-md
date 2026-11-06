import { toHtml } from 'hast-util-to-html'
import { toText } from 'hast-util-to-text'
import { describe, expect, it } from 'vitest'

import { highlightCodeBlocks } from './highlight'
import { renderMarkdown } from './pipeline'

const html = async (markdown: string) =>
  toHtml(await highlightCodeBlocks(renderMarkdown(markdown).hast))

describe('highlightCodeBlocks', () => {
  it('colours a known language for both themes, line by line', async () => {
    const out = await html('```ts\nconst answer = 42\nexport { answer }\n```')
    expect(out.match(/<span class="line">/g)).toHaveLength(2)
    expect(out).toMatch(
      /<span class="token" style="--shiki-light:#[\da-f]+;--shiki-dark:#[\da-f]+/i,
    )
    expect(out).toContain('>const<')
  })

  it('keeps the source text exactly', async () => {
    const source = 'if (a < b) {\n  return "x & y"\n}\n\nlast()'
    const { hast } = renderMarkdown(`\`\`\`js\n${source}\n\`\`\``)
    await highlightCodeBlocks(hast)
    expect(toText(hast, { whitespace: 'pre' }).trimEnd()).toBe(source)
  })

  it('splits unknown and unlabelled fences into plain lines', async () => {
    const out = await html('```not-a-language\none\ntwo\n```\n\n```\nthree\n```')
    expect(out).toContain('<span class="line">one</span>\n<span class="line">two</span>')
    expect(out).toContain('<span class="line">three</span>')
    expect(out).not.toContain('class="token"')
  })

  it('marks added and removed diff lines but not file headers', async () => {
    const out = await html('```diff\n--- a.txt\n+++ b.txt\n-old\n+new\n same\n```')
    expect(out.match(/class="line diff-remove"/g)).toHaveLength(1)
    expect(out.match(/class="line diff-add"/g)).toHaveLength(1)
  })

  it('leaves Mermaid fences as source for the diagram renderer', async () => {
    const out = await html('```mermaid\ngraph LR; A-->B\n```')
    expect(out).toContain('<code class="language-mermaid">graph LR; A-->B\n</code>')
  })
})

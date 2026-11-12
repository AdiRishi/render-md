// @vitest-environment jsdom
import mermaid from 'mermaid'
import { describe, expect, it } from 'vitest'

import { mermaidViewer } from './mermaid-viewer'

const fenced = /^```mermaid\n([\s\S]*?)\n```$/m

const diagrams = [mermaidViewer.tool, ...mermaidViewer.sections.flatMap((s) => s.blocks)].flatMap(
  (block) => {
    if (block.kind === 'specimens') return block.entries.map((entry) => entry.source)
    if (block.kind === 'gallery') return block.items.map((item) => item.source)
    return []
  },
)

describe('Mermaid viewer examples', () => {
  it.each(diagrams)('parses as Mermaid: %s', async (source) => {
    const code = fenced.exec(source)?.[1]
    expect(code).toBeDefined()
    await expect(mermaid.parse(code ?? '')).resolves.toBeTruthy()
  })
})

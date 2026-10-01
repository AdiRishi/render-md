import { type Root } from 'hast'
import { toText } from 'hast-util-to-text'
import { visit } from 'unist-util-visit'
import { type VFile } from 'vfile'

import { type HeadingEntry } from '../types'

const HEADING_PATTERN = /^h([1-6])$/

/**
 * rehype: collect the heading outline (after rehype-slug has assigned ids).
 */
export function rehypeCollectHeadings() {
  return (tree: Root, file: VFile) => {
    const headings: HeadingEntry[] = []

    visit(tree, 'element', (node) => {
      const match = HEADING_PATTERN.exec(node.tagName)
      if (!match) return
      const id = node.properties.id
      if (typeof id !== 'string') return
      // Skip the visually hidden "Footnotes" label GFM adds.
      const className = node.properties.className
      if (Array.isArray(className) && className.includes('sr-only')) return

      const line = node.properties.dataLine
      headings.push({
        id,
        depth: Number(match[1]),
        text: toText(node).trim(),
        line: typeof line === 'number' ? line : null,
      })
    })

    file.data.headings = headings
  }
}

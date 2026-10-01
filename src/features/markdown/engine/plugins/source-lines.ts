import { type Root } from 'hast'
import { visit } from 'unist-util-visit'

/** Block-level elements worth mapping back to a source line. */
const BLOCK_TAGS = new Set([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  'ul',
  'ol',
  'li',
  'table',
  'tr',
  'hr',
  'div',
  'details',
  'section',
  'img',
  'dl',
  'dt',
  'dd',
  'picture',
  'video',
  'figure',
])

/**
 * rehype: stamp block elements with their source line for scroll sync and
 * click-to-locate. Runs before sanitize; `dataLine` is allow-listed there.
 */
export function rehypeSourceLines() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      const line = node.position?.start.line
      if (line && BLOCK_TAGS.has(node.tagName)) {
        node.properties.dataLine = line
      }
    })
  }
}

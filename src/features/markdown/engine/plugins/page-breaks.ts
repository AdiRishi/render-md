import { type Element, type ElementContent, type Root, type RootContent } from 'hast'

/**
 * rehype: forced page breaks. `<!-- pagebreak -->` on its own line becomes
 * `<hr class="page-break">`, and so does the empty
 * `<div style="page-break-after: always"></div>` that documents written in
 * Typora, Obsidian or markdown-pdf use. Runs after rehype-raw (so the comment
 * exists) and before sanitizing (which would drop both).
 */

const COMMENT = /^\s*(?:page-?break|new-?page)\s*$/i
const BREAK_STYLE = /(?:^|;)\s*(?:page-)?break-(?:before|after)\s*:\s*(?:always|page)\b/i

function isEmpty(element: Element) {
  return element.children.every((child) => child.type === 'text' && child.value.trim() === '')
}

function isBreakDiv(node: RootContent | ElementContent) {
  return (
    node.type === 'element' &&
    node.tagName === 'div' &&
    typeof node.properties.style === 'string' &&
    BREAK_STYLE.test(node.properties.style) &&
    isEmpty(node)
  )
}

export function rehypePageBreaks() {
  return (tree: Root) => {
    tree.children = tree.children.map((node) => {
      const isMarker = (node.type === 'comment' && COMMENT.test(node.value)) || isBreakDiv(node)
      if (!isMarker) return node
      const pageBreak: Element = {
        type: 'element',
        tagName: 'hr',
        properties: { className: ['page-break'] },
        children: [],
        position: node.position,
      }
      return pageBreak
    })
  }
}

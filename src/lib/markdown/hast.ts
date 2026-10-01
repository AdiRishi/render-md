import { type Root } from 'hast'
import { visit } from 'unist-util-visit'

const HEADING = /^h[1-6]$/

/**
 * Drop heading ids from a rendered fragment. Used for examples embedded in a
 * page, whose ids would collide with each other and with the page's own.
 */
export function stripHeadingIds(tree: Root) {
  visit(tree, 'element', (node) => {
    if (HEADING.test(node.tagName)) delete node.properties.id
  })
  return tree
}

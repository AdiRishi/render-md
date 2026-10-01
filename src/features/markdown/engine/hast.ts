import { type Element, type Root } from 'hast'
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

/** Does an element carry the given class name? */
export function hasClass(node: Element, name: string) {
  const className = node.properties.className
  return Array.isArray(className) && className.includes(name)
}

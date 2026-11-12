import { type Element, type ElementContent, type Root } from 'hast'

/**
 * The print sheet renders the document a second time, next to the on-screen
 * preview. Prefixing every id and in-document link keeps the PDF's links
 * pointing at the printed copy rather than at the hidden screen copy, which
 * comes first in the page and would win.
 */
export const PRINT_ID_PREFIX = 'print-'

function prefixElement(element: Element): Element {
  const { id, href } = element.properties
  return {
    ...element,
    properties: {
      ...element.properties,
      ...(typeof id === 'string' ? { id: PRINT_ID_PREFIX + id } : {}),
      ...(typeof href === 'string' && href.startsWith('#')
        ? { href: `#${PRINT_ID_PREFIX}${href.slice(1)}` }
        : {}),
    },
    children: element.children.map(prefixNode),
  }
}

function prefixNode(node: ElementContent): ElementContent {
  return node.type === 'element' ? prefixElement(node) : node
}

export function withPrintIds(tree: Root): Root {
  return {
    ...tree,
    children: tree.children.map((node) => (node.type === 'doctype' ? node : prefixNode(node))),
  }
}

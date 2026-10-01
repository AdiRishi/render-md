import { type Root } from 'hast'
import { visit } from 'unist-util-visit'

/**
 * rehype: drop positional info so the tree is cheap to post across threads.
 */
export function rehypeStripPositions() {
  return (tree: Root) => {
    visit(tree, (node) => {
      delete node.position
    })
  }
}

import { type Root } from 'hast'
import { visit } from 'unist-util-visit'

const CLOBBER_PREFIX = 'user-content-'

/**
 * rehype: point `#fragment` links at ids that exist. Sanitizing prefixes ids
 * from markdown/HTML with `user-content-` (against DOM clobbering), so links
 * like footnote refs are rewritten to match — statically, so they also work in
 * exported HTML.
 */
export function rehypeResolveFragmentLinks() {
  return (tree: Root) => {
    const ids = new Set<string>()
    visit(tree, 'element', (node) => {
      if (typeof node.properties.id === 'string') ids.add(node.properties.id)
    })

    visit(tree, 'element', (node) => {
      const href = node.tagName === 'a' ? node.properties.href : undefined
      if (typeof href !== 'string' || !href.startsWith('#') || href.length < 2) return
      let fragment = href.slice(1)
      try {
        fragment = decodeURIComponent(fragment)
      } catch {
        // Keep the raw fragment.
      }
      if (!ids.has(fragment) && ids.has(CLOBBER_PREFIX + fragment)) {
        node.properties.href = `#${CLOBBER_PREFIX}${fragment}`
      }
    })
  }
}

import { type Root } from 'hast'
import { visit } from 'unist-util-visit'

const URL_ATTRIBUTES: Record<string, string> = {
  a: 'href',
  img: 'src',
  source: 'src',
  video: 'src',
}

function isRelativeUrl(value: string) {
  return !/^(?:[a-z][a-z\d+\-.]*:|\/\/|#)/i.test(value)
}

/**
 * rehype: resolve relative links and images against the document's origin
 * (e.g. a README fetched from GitHub).
 */
export function rehypeBaseUrl(baseUrl?: string | null) {
  return (tree: Root) => {
    if (!baseUrl) return

    visit(tree, 'element', (node) => {
      const attribute = URL_ATTRIBUTES[node.tagName]
      if (!attribute) return

      const value = node.properties[attribute]
      if (typeof value !== 'string' || !value || !isRelativeUrl(value)) return

      try {
        node.properties[attribute] = new URL(value, baseUrl).href
      } catch {
        // Leave unparsable URLs untouched.
      }
    })
  }
}

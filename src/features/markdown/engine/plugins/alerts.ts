import { type Element, type Root } from 'hast'
import { visit } from 'unist-util-visit'

export const ALERT_TYPES = ['note', 'tip', 'important', 'warning', 'caution'] as const
export type AlertType = (typeof ALERT_TYPES)[number]

const ALERT_PATTERN = /^\s*\[!(note|tip|important|warning|caution)\]\s*/i

/**
 * rehype: GitHub alerts — `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`,
 * `> [!WARNING]`, `> [!CAUTION]`.
 */
export function rehypeAlerts() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'blockquote') return

      const firstParagraph = node.children.find(
        (child): child is Element => child.type === 'element',
      )
      if (firstParagraph?.tagName !== 'p') return

      const firstText = firstParagraph.children[0]
      if (firstText?.type !== 'text') return

      const match = ALERT_PATTERN.exec(firstText.value)
      if (!match) return

      const type = match[1].toLowerCase() as AlertType
      firstText.value = firstText.value.slice(match[0].length)

      // Drop a leading <br> / empty text left behind by the marker line.
      while (firstParagraph.children.length > 0) {
        const head = firstParagraph.children[0]
        const isEmptyText = head.type === 'text' && head.value.trim() === ''
        const isBreak = head.type === 'element' && head.tagName === 'br'
        if (!isEmptyText && !isBreak) break
        firstParagraph.children.shift()
      }

      const body = node.children.filter(
        (child) => !(child === firstParagraph && firstParagraph.children.length === 0),
      )

      node.tagName = 'div'
      node.properties = {
        className: ['markdown-alert', `markdown-alert-${type}`],
        dataAlert: type,
        dataLine: node.properties.dataLine,
      }
      node.children = body
    })
  }
}

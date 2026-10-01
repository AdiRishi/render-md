import { type Element, type ElementContent, type Root, type RootContent } from 'hast'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import { toText } from 'hast-util-to-text'
import { renderToString } from 'katex'
import { SKIP, visit } from 'unist-util-visit'

import { hasClass } from '../hast'

function renderMath(value: string, displayMode: boolean): ElementContent[] {
  const html = renderToString(value, {
    displayMode,
    throwOnError: false,
    strict: 'ignore',
    output: 'htmlAndMathml',
    trust: false,
  })
  return fromHtmlIsomorphic(html, { fragment: true }).children as ElementContent[]
}

/**
 * rehype: render `$…$`, `$$…$$` and ```math blocks with KaTeX.
 */
export function rehypeMath() {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      if (!parent || index === undefined) return

      // Display math: <pre><code class="language-math [math-display]">
      if (node.tagName === 'pre') {
        const code = node.children.find(
          (child): child is Element => child.type === 'element' && child.tagName === 'code',
        )
        if (!code || !hasClass(code, 'language-math')) return
        const replacement: Element = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['math', 'math-display'], dataLine: node.properties.dataLine },
          children: renderMath(toText(code, { whitespace: 'pre' }), true),
        }
        parent.children[index] = replacement as RootContent & ElementContent
        return SKIP
      }

      // Inline math: <code class="language-math math-inline">
      if (node.tagName === 'code' && hasClass(node, 'math-inline')) {
        const replacement: Element = {
          type: 'element',
          tagName: 'span',
          properties: { className: ['math', 'math-inline'] },
          children: renderMath(toText(node, { whitespace: 'pre' }), false),
        }
        parent.children[index] = replacement as RootContent & ElementContent
        return SKIP
      }
    })
  }
}

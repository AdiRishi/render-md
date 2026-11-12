import { type PhrasingContent, type Root } from 'mdast'
import { type InlineMath, type Math } from 'mdast-util-math'
import { SKIP, visit } from 'unist-util-visit'

const DELIMITED = /(?<!\\)\\\(([\s\S]+?)\\\)|(?<!\\)\\\[([\s\S]+?)\\\]/g
const WHOLE_DISPLAY = /^\s*\\\[([\s\S]+?)\\\]\s*$/

// Shaped like the nodes mdast-util-math parses: remark-rehype renders them from `data`.
function blockMath(value: string): Math {
  const code = {
    type: 'element' as const,
    tagName: 'code',
    properties: { className: ['language-math', 'math-display'] },
    children: [{ type: 'text' as const, value }],
  }
  return { type: 'math', value, data: { hName: 'pre', hChildren: [code] } }
}

/** Mid-paragraph `\[…\]` stays inline but renders in display mode (see rehypeMath). */
function inlineMath(value: string, display: boolean): InlineMath {
  return {
    type: 'inlineMath',
    value,
    data: {
      hName: 'code',
      hProperties: { className: ['language-math', display ? 'math-display' : 'math-inline'] },
      hChildren: [{ type: 'text', value }],
    },
  }
}

/**
 * remark: turn `\(…\)` and `\[…\]` that survive parsing as text into math.
 * They do when the source escapes its own backslashes, as ChatGPT's copy
 * button does (`\\[ R\_{\mu\nu} \\]`), so the text holds the original LaTeX.
 */
export function remarkTextMath() {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node, index, parent) => {
      const [only] = node.children
      if (!parent || index === undefined || node.children.length !== 1 || only.type !== 'text') {
        return
      }
      const display = WHOLE_DISPLAY.exec(only.value)
      if (!display) return
      parent.children[index] = { ...blockMath(display[1]), position: node.position }
      return SKIP
    })

    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === undefined) return
      const parts: PhrasingContent[] = []
      let last = 0
      for (const match of node.value.matchAll(DELIMITED)) {
        if (match.index > last) {
          parts.push({ type: 'text', value: node.value.slice(last, match.index) })
        }
        const [, inline, display] = match
        parts.push(inline === undefined ? inlineMath(display, true) : inlineMath(inline, false))
        last = match.index + match[0].length
      }
      if (parts.length === 0) return
      if (last < node.value.length) parts.push({ type: 'text', value: node.value.slice(last) })
      parent.children.splice(index, 1, ...parts)
      return [SKIP, index + parts.length]
    })
  }
}

import { type Element, type ElementContent, type Root, type RootContent } from 'hast'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
import { toText } from 'hast-util-to-text'
import { renderToString } from 'katex'
import { type Root as MdastRoot } from 'mdast'
import { visit, SKIP } from 'unist-util-visit'
import { type VFile } from 'vfile'
import { parse as parseYaml } from 'yaml'

export type HeadingEntry = {
  id: string
  depth: number
  text: string
  line: number | null
}

export type Frontmatter = Record<string, unknown>

declare module 'vfile' {
  interface DataMap {
    headings: HeadingEntry[]
    frontmatter: Frontmatter | null
  }
}

const BLOCK_TAGS = new Set([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'blockquote',
  'pre',
  'ul',
  'ol',
  'li',
  'table',
  'tr',
  'hr',
  'div',
  'details',
  'section',
  'img',
  'dl',
  'dt',
  'dd',
  'picture',
  'video',
  'figure',
])

function hasClass(node: Element, name: string) {
  const className = node.properties.className
  return Array.isArray(className) && className.includes(name)
}

/* -----------------------------------------------------------------------------
 * remark: extract YAML frontmatter into file.data and drop it from the tree.
 * -------------------------------------------------------------------------- */
export function remarkExtractFrontmatter() {
  return (tree: MdastRoot, file: VFile) => {
    file.data.frontmatter = null
    const first = tree.children[0]
    if (first?.type !== 'yaml') return

    try {
      const parsed: unknown = parseYaml(first.value)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        // A JSON round-trip makes it plain data: YAML anchors can create cycles,
        // which would crash rendering and can't cross the worker boundary.
        file.data.frontmatter = JSON.parse(JSON.stringify(parsed)) as Frontmatter
      }
    } catch {
      // Malformed frontmatter is kept out of the document but otherwise ignored.
    }
    tree.children.shift()
  }
}

/* -----------------------------------------------------------------------------
 * remark: carry fenced-code meta strings (```ts title="a.ts") through to hast.
 * -------------------------------------------------------------------------- */
export function remarkCodeMeta() {
  return (tree: MdastRoot) => {
    visit(tree, 'code', (node) => {
      if (!node.meta) return
      node.data ??= {}
      node.data.hProperties = { ...node.data.hProperties, dataMeta: node.meta }
    })
  }
}

/* -----------------------------------------------------------------------------
 * rehype: stamp block elements with their source line for scroll sync and
 * click-to-locate. Runs before sanitize; `dataLine` is allow-listed there.
 * -------------------------------------------------------------------------- */
export function rehypeSourceLines() {
  return (tree: Root) => {
    visit(tree, 'element', (node) => {
      const line = node.position?.start.line
      if (line && BLOCK_TAGS.has(node.tagName)) {
        node.properties.dataLine = line
      }
    })
  }
}

/* -----------------------------------------------------------------------------
 * rehype: render `$…$`, `$$…$$` and ```math blocks with KaTeX.
 * -------------------------------------------------------------------------- */
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

/* -----------------------------------------------------------------------------
 * rehype: GitHub alerts — `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`,
 * `> [!WARNING]`, `> [!CAUTION]`.
 * -------------------------------------------------------------------------- */
export const ALERT_TYPES = ['note', 'tip', 'important', 'warning', 'caution'] as const
export type AlertType = (typeof ALERT_TYPES)[number]

const ALERT_PATTERN = /^\s*\[!(note|tip|important|warning|caution)\]\s*/i

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

/* -----------------------------------------------------------------------------
 * rehype: resolve relative links and images against the document's origin
 * (e.g. a README fetched from GitHub).
 * -------------------------------------------------------------------------- */
const URL_ATTRIBUTES: Record<string, string> = {
  a: 'href',
  img: 'src',
  source: 'src',
  video: 'src',
}

function isRelativeUrl(value: string) {
  return !/^(?:[a-z][a-z\d+\-.]*:|\/\/|#)/i.test(value)
}

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

/* -----------------------------------------------------------------------------
 * rehype: point `#fragment` links at ids that exist. Sanitizing prefixes ids
 * from markdown/HTML with `user-content-` (against DOM clobbering), so links
 * like footnote refs are rewritten to match — statically, so they also work in
 * exported HTML.
 * -------------------------------------------------------------------------- */
const CLOBBER_PREFIX = 'user-content-'

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

/* -----------------------------------------------------------------------------
 * rehype: collect the heading outline (after rehype-slug has assigned ids).
 * -------------------------------------------------------------------------- */
const HEADING_PATTERN = /^h([1-6])$/

export function rehypeCollectHeadings() {
  return (tree: Root, file: VFile) => {
    const headings: HeadingEntry[] = []

    visit(tree, 'element', (node) => {
      const match = HEADING_PATTERN.exec(node.tagName)
      if (!match) return
      const id = node.properties.id
      if (typeof id !== 'string') return
      // Skip the visually hidden "Footnotes" label GFM adds.
      const className = node.properties.className
      if (Array.isArray(className) && className.includes('sr-only')) return

      const line = node.properties.dataLine
      headings.push({
        id,
        depth: Number(match[1]),
        text: toText(node).trim(),
        line: typeof line === 'number' ? line : null,
      })
    })

    file.data.headings = headings
  }
}

/* -----------------------------------------------------------------------------
 * rehype: drop positional info so the tree is cheap to post across threads.
 * -------------------------------------------------------------------------- */
export function rehypeStripPositions() {
  return (tree: Root) => {
    visit(tree, (node) => {
      delete node.position
    })
  }
}

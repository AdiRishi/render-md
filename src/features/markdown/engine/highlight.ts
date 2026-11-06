import { type Element, type ElementContent, type Root } from 'hast'
import { toText } from 'hast-util-to-text'
import { type HighlighterCore, type ThemedToken } from 'shiki/core'
import { visit } from 'unist-util-visit'

/**
 * Shiki syntax highlighting as a pass over rendered HAST. Every fenced code
 * block becomes `span.line` rows; in a known language each row holds
 * `span.token`s coloured by `--shiki-light` and `--shiki-dark`, which the
 * document stylesheet picks between. Grammars load on first use, so this is
 * the engine's one async step: `renderMarkdown` stays synchronous, and callers
 * await this on its result.
 */

const THEMES = { light: 'kanagawa-lotus', dark: 'kanagawa-dragon' } as const

const LANGUAGE_ALIASES: Record<string, string> = {
  sh: 'shellscript',
  shell: 'shellscript',
  zsh: 'shellscript',
  console: 'shellsession',
  'c++': 'cpp',
  'c#': 'csharp',
  golang: 'go',
  rs: 'rust',
  py: 'python',
  rb: 'ruby',
  yml: 'yaml',
  md: 'markdown',
  text: 'plaintext',
  txt: 'plaintext',
  plain: 'plaintext',
}

/** Fences that render as something other than code. */
const NOT_CODE = new Set(['mermaid', 'mmd'])

const MAX_CACHE = 300
const cache = new Map<string, ElementContent[]>()

let highlighterPromise: Promise<HighlighterCore> | null = null

function getHighlighter() {
  // Fine-grained imports: the JS regex engine (no WASM), two themes, and
  // grammars that are code-split and fetched only when a language appears.
  highlighterPromise ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ])
    return createHighlighterCore({
      themes: [
        import('shiki/themes/kanagawa-lotus.mjs'),
        import('shiki/themes/kanagawa-dragon.mjs'),
      ],
      langs: [],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    })
  })()
  return highlighterPromise
}

/** Load a fence language's grammar. Resolves null for languages Shiki doesn't know. */
async function loadLanguage(highlighter: HighlighterCore, language: string) {
  const id = LANGUAGE_ALIASES[language] ?? language
  if (id === 'plaintext') return null
  if (highlighter.getLoadedLanguages().includes(id)) return id
  const { bundledLanguages } = await import('shiki/langs')
  const loader = bundledLanguages[id as keyof typeof bundledLanguages]
  if (!loader) return null
  await highlighter.loadLanguage(loader)
  return id
}

/** The label a code block shows for its fence language. */
export function languageLabel(language: string | null) {
  if (!language) return 'text'
  return LANGUAGE_ALIASES[language] === 'shellscript' ? 'shell' : language
}

function fenceLanguage(code: Element) {
  const classes = Array.isArray(code.properties.className) ? code.properties.className : []
  const languageClass = classes.find(
    (value): value is string => typeof value === 'string' && value.startsWith('language-'),
  )
  return languageClass ? languageClass.slice('language-'.length).toLowerCase() : null
}

function diffClass(language: string | null, text: string) {
  if (language !== 'diff') return []
  if (text.startsWith('+') && !text.startsWith('+++')) return ['diff-add']
  if (text.startsWith('-') && !text.startsWith('---')) return ['diff-remove']
  return []
}

function toToken(token: ThemedToken): Element {
  const style = Object.entries(token.htmlStyle ?? {})
    .map(([property, value]) => `${property}:${value}`)
    .join(';')
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['token'], style },
    children: [{ type: 'text', value: token.content }],
  }
}

/** One `span.line` per source line, separated by newlines so `pre` breaks lines itself. */
function toLines(text: string, language: string | null, tokens: ThemedToken[][] | null) {
  return text.split('\n').flatMap((line, index): ElementContent[] => {
    const row: Element = {
      type: 'element',
      tagName: 'span',
      properties: { className: ['line', ...diffClass(language, line)] },
      children: tokens?.[index]
        ? tokens[index].map(toToken)
        : line
          ? [{ type: 'text', value: line }]
          : [],
    }
    return index === 0 ? [row] : [{ type: 'text', value: '\n' }, row]
  })
}

async function highlightBlock(text: string, language: string | null) {
  if (!language) return toLines(text, language, null)
  try {
    const highlighter = await getHighlighter()
    const lang = await loadLanguage(highlighter, language)
    if (!lang) return toLines(text, language, null)
    const { tokens } = highlighter.codeToTokens(text, { lang, themes: THEMES, defaultColor: false })
    return toLines(text, language, tokens)
  } catch {
    // A grammar chunk that fails to load leaves the block readable, just uncoloured.
    return toLines(text, language, null)
  }
}

/**
 * Highlight every fenced code block in a rendered document, in place. Only the
 * markup changes: each block's text, final newline included, stays as rendered.
 */
export async function highlightCodeBlocks(tree: Root) {
  const blocks: Array<{
    code: Element
    key: string
    text: string
    language: string | null
    finalNewline: boolean
  }> = []
  visit(tree, 'element', (node) => {
    if (node.tagName !== 'pre') return
    const code = node.children.find(
      (child): child is Element => child.type === 'element' && child.tagName === 'code',
    )
    if (!code) return
    const language = fenceLanguage(code)
    if (language && NOT_CODE.has(language)) return
    const source = toText(code, { whitespace: 'pre' })
    const finalNewline = source.endsWith('\n')
    const text = finalNewline ? source.slice(0, -1) : source
    blocks.push({ code, key: `${language}\u0000${text}`, text, language, finalNewline })
  })

  await Promise.all(
    blocks.map(async ({ code, key, text, language, finalNewline }) => {
      let lines = cache.get(key)
      if (!lines) {
        lines = await highlightBlock(text, language)
        if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!)
        cache.set(key, lines)
      }
      code.children = finalNewline ? [...lines, { type: 'text', value: '\n' }] : lines
    }),
  )
  return tree
}

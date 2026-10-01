import { type HighlighterCore, type ThemedToken } from 'shiki/core'

/**
 * Shiki (VS Code's TextMate grammars) with the pure-JS regex engine — no WASM.
 * Grammars are code-split and loaded on first use of each language.
 */

export const CODE_THEMES = { light: 'kanagawa-lotus', dark: 'kanagawa-dragon' } as const

type Highlighter = HighlighterCore
export type HighlightedLine = ThemedToken[]

let highlighterPromise: Promise<Highlighter> | null = null
const cache = new Map<string, Promise<HighlightedLine[] | null>>()
const MAX_CACHE = 300

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
  jsonc: 'jsonc',
  text: 'plaintext',
  txt: 'plaintext',
  plain: 'plaintext',
}

async function getHighlighter() {
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

async function resolveLanguage(highlighter: Highlighter, language: string) {
  const { bundledLanguages } = await import('shiki/langs')
  const id = LANGUAGE_ALIASES[language] ?? language
  if (id === 'plaintext') return null
  const loader = bundledLanguages[id as keyof typeof bundledLanguages]
  if (!loader) return null
  if (!highlighter.getLoadedLanguages().includes(id)) {
    await highlighter.loadLanguage(loader)
  }
  return id
}

/** Tokenize code for both themes at once. Resolves null for unknown languages. */
export function highlightCode(code: string, language: string | null) {
  if (!language) return Promise.resolve(null)
  const key = `${language}\u0000${code}`
  const cached = cache.get(key)
  if (cached) return cached

  const result = (async () => {
    const highlighter = await getHighlighter()
    const lang = await resolveLanguage(highlighter, language.toLowerCase())
    if (!lang) return null
    return highlighter.codeToTokens(code, {
      lang,
      themes: CODE_THEMES,
      defaultColor: false,
    }).tokens
  })().catch(() => null)

  if (cache.size >= MAX_CACHE) cache.delete(cache.keys().next().value!)
  cache.set(key, result)
  return result
}

export function peekLanguageLabel(language: string | null) {
  if (!language) return 'text'
  return LANGUAGE_ALIASES[language] === 'shellscript' ? 'shell' : language
}

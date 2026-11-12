import type Mermaid from 'mermaid'

import { type DiagramLook } from '../typesets'

type ResolvedTheme = 'light' | 'dark'
type MermaidApi = typeof Mermaid

let mermaidPromise: Promise<MermaidApi> | null = null
let queue: Promise<unknown> = Promise.resolve()
let counter = 0
const cache = new Map<string, Promise<string>>()
/** Finished SVGs by the same key, so a diagram drawn before can appear without waiting. */
const drawn = new Map<string, string>()

const PALETTES: Record<ResolvedTheme, Record<string, string>> = {
  light: {
    background: '#fefdfb',
    primaryColor: '#f6f3ee',
    primaryTextColor: '#2a241e',
    primaryBorderColor: '#3b342c',
    secondaryColor: '#fbe9e4',
    secondaryBorderColor: '#d9472b',
    tertiaryColor: '#efebe4',
    tertiaryBorderColor: '#b8b0a4',
    lineColor: '#5d554b',
    textColor: '#2a241e',
    mainBkg: '#f6f3ee',
    clusterBkg: '#f1ede6',
    clusterBorder: '#cfc7bb',
    edgeLabelBackground: '#fefdfb',
    noteBkgColor: '#fbf3d0',
    noteBorderColor: '#cdb860',
    actorBkg: '#f6f3ee',
    actorBorder: '#3b342c',
    signalColor: '#3b342c',
    labelBoxBkgColor: '#f6f3ee',
  },
  dark: {
    background: '#151618',
    primaryColor: '#252629',
    primaryTextColor: '#eae9e6',
    primaryBorderColor: '#b8b9bb',
    secondaryColor: '#352422',
    secondaryBorderColor: '#f76e52',
    tertiaryColor: '#1d1e20',
    tertiaryBorderColor: '#545559',
    lineColor: '#a3a5a8',
    textColor: '#eae9e6',
    mainBkg: '#252629',
    clusterBkg: '#1d1e20',
    clusterBorder: '#3f4144',
    edgeLabelBackground: '#151618',
    noteBkgColor: '#3b3524',
    noteBorderColor: '#8c7c3c',
    actorBkg: '#252629',
    actorBorder: '#b8b9bb',
    signalColor: '#b8b9bb',
    labelBoxBkgColor: '#252629',
  },
}

function loadMermaid() {
  // Diagrams render in effects only. The SSR branch keeps Mermaid out of the server bundle.
  if (import.meta.env.SSR) throw new Error('Mermaid renders in the browser only.')
  mermaidPromise ??= import('mermaid').then((module) => module.default)
  return mermaidPromise
}

/** Mermaid keeps global state, so renders must run one at a time. */
function enqueue<T>(task: () => Promise<T>) {
  const run = queue.then(task, task)
  queue = run.catch(() => undefined)
  return run
}

/** The page color behind a diagram, for exports that need an opaque background. */
export const diagramBackground = (theme: ResolvedTheme) => PALETTES[theme].background

const cacheKey = (code: string, theme: ResolvedTheme, look: DiagramLook, htmlLabels: boolean) =>
  `${theme}|${look}|${htmlLabels}|${code}`

/** The SVG of a diagram that has already been drawn with these settings, if any. */
export const drawnMermaid = (code: string, theme: ResolvedTheme, look: DiagramLook) =>
  drawn.get(cacheKey(code, theme, look, true))

/**
 * Renders a diagram to an SVG string. `htmlLabels: false` draws labels as SVG text
 * instead of `foreignObject` HTML, which images and canvases can rasterize safely.
 */
export function renderMermaid(
  code: string,
  theme: ResolvedTheme,
  look: DiagramLook,
  { htmlLabels = true } = {},
) {
  const key = cacheKey(code, theme, look, htmlLabels)
  const cached = cache.get(key)
  if (cached) return cached

  const result = enqueue(async () => {
    const mermaid = await loadMermaid()
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'base',
      look: look === 'sketch' ? 'handDrawn' : 'classic',
      handDrawnSeed: 7,
      fontFamily: 'Hanken Grotesk Variable, ui-sans-serif, sans-serif',
      themeVariables: { ...PALETTES[theme], fontSize: '15px' },
      htmlLabels,
      // Mermaid's default minimum node width (120px) makes diagrams so wide that fitting them shrinks the labels.
      flowchart: { curve: 'basis', padding: 14, minNodeWidth: 64 },
      suppressErrorRendering: true,
    })
    const { svg } = await mermaid.render(`mermaid-${++counter}`, code)
    return svg
  })

  cache.set(key, result)
  result.then(
    (svg) => drawn.set(key, svg),
    () => cache.delete(key),
  )
  if (cache.size > 120) {
    const oldest = cache.keys().next().value!
    cache.delete(oldest)
    drawn.delete(oldest)
  }
  return result
}

import type Mermaid from 'mermaid'

import { type DiagramLook } from '../typesets'

type ResolvedTheme = 'light' | 'dark'
type MermaidApi = typeof Mermaid

let mermaidPromise: Promise<MermaidApi> | null = null
let queue: Promise<unknown> = Promise.resolve()
let counter = 0
const cache = new Map<string, Promise<string>>()

const PALETTES: Record<ResolvedTheme, Record<string, string>> = {
  light: {
    background: '#fdfcfa',
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
    edgeLabelBackground: '#fdfcfa',
    noteBkgColor: '#fbf3d0',
    noteBorderColor: '#cdb860',
    actorBkg: '#f6f3ee',
    actorBorder: '#3b342c',
    signalColor: '#3b342c',
    labelBoxBkgColor: '#f6f3ee',
  },
  dark: {
    background: '#1e1b18',
    primaryColor: '#2a2622',
    primaryTextColor: '#ebe6dd',
    primaryBorderColor: '#c8c0b3',
    secondaryColor: '#3a2622',
    secondaryBorderColor: '#ef7656',
    tertiaryColor: '#25221e',
    tertiaryBorderColor: '#5b544b',
    lineColor: '#b2aa9e',
    textColor: '#ebe6dd',
    mainBkg: '#2a2622',
    clusterBkg: '#24211d',
    clusterBorder: '#4a443c',
    edgeLabelBackground: '#1e1b18',
    noteBkgColor: '#3b3524',
    noteBorderColor: '#8c7c3c',
    actorBkg: '#2a2622',
    actorBorder: '#c8c0b3',
    signalColor: '#c8c0b3',
    labelBoxBkgColor: '#2a2622',
  },
}

function loadMermaid() {
  mermaidPromise ??= import('mermaid').then((module) => module.default)
  return mermaidPromise
}

/** Mermaid keeps global state, so renders must run one at a time. */
function enqueue<T>(task: () => Promise<T>) {
  const run = queue.then(task, task)
  queue = run.catch(() => undefined)
  return run
}

export function renderMermaid(code: string, theme: ResolvedTheme, look: DiagramLook) {
  const key = `${theme}|${look}|${code}`
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
      fontFamily: 'Instrument Sans Variable, ui-sans-serif, sans-serif',
      themeVariables: { ...PALETTES[theme], fontSize: '15px' },
      flowchart: { curve: 'basis', padding: 14 },
      suppressErrorRendering: true,
    })
    const { svg } = await mermaid.render(`mermaid-${++counter}`, code)
    return svg
  })

  cache.set(key, result)
  result.catch(() => cache.delete(key))
  if (cache.size > 120) cache.delete(cache.keys().next().value!)
  return result
}

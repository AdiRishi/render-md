import { articleHtml, cleanArticle } from '@/features/markdown/render/article-html'

import documentCss from '@/features/markdown/render/document.css?raw'

/**
 * Turn the on-screen preview into a standalone, dependency-free HTML file
 * that looks exactly like what you see: same typeset, same theme.
 */

const TOKENS = [
  'desk',
  'paper',
  'paper-2',
  'paper-3',
  'ink',
  'ink-2',
  'ink-3',
  'ink-4',
  'rule',
  'rule-strong',
  'proof',
  'proof-ink',
  'proof-soft',
  'marker',
  'shadow-ink',
  'alert-note',
  'alert-tip',
  'alert-important',
  'alert-warning',
  'alert-caution',
]

/**
 * A dark export freezes the dark tokens for print too, so its code keeps the
 * dark syntax colours on paper as well (document.css applies them on screen only).
 */
const DARK_CODE_IN_PRINT =
  '@media print{.dark .doc pre .token{color:color-mix(in oklab,var(--shiki-dark) 80%,var(--ink));font-style:var(--shiki-dark-font-style,inherit)}}'

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&display=swap'

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => `&#${char.charCodeAt(0)};`)
}

export function buildStandaloneHtml(article: HTMLElement, title: string) {
  const computed = getComputedStyle(document.documentElement)
  const isDark = document.documentElement.classList.contains('dark')
  const tokens = TOKENS.map(
    (name) => `--${name}:${computed.getPropertyValue(`--${name}`).trim()};`,
  ).join('')
  const clone = cleanArticle(article)

  return `<!doctype html>
<html lang="en"${isDark ? ' class="dark"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="RenderMD — https://www.render-md.com">
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS_HREF}">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@${import.meta.env.KATEX_VERSION}/dist/katex.min.css" crossorigin="anonymous">
<style>
:root{${tokens}--font-sans:'Hanken Grotesk',system-ui,sans-serif;--font-display:'Newsreader',Georgia,serif;--font-serif:'Newsreader',Georgia,serif;--font-mono:'Geist Mono',ui-monospace,monospace;color-scheme:${isDark ? 'dark' : 'light'}}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
body{margin:0;background:var(--paper);color:var(--ink)}
main{max-width:46rem;margin:0 auto;padding:clamp(1.5rem,6vw,5rem) 1.5rem 6rem}
${documentCss}
${isDark ? DARK_CODE_IN_PRINT : ''}
</style>
</head>
<body>
<main>
${clone.outerHTML}
</main>
</body>
</html>
`
}

/** Copy as rich text (pastes formatted into Docs, Gmail, Notion…) + markdown. */
export async function copyRichText(article: HTMLElement, markdown: string) {
  const html = articleHtml(article)
  if (typeof ClipboardItem === 'undefined') {
    await navigator.clipboard.writeText(markdown)
    return 'plain' as const
  }
  await navigator.clipboard.write([
    new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([markdown], { type: 'text/plain' }),
    }),
  ])
  return 'rich' as const
}

/**
 * Draw each guide's Open Graph image (public/og-<slug>.png, 1200 × 630) from
 * its content and build/og/card.html.
 *
 *   node build/og/render.ts          Every guide
 *   node build/og/render.ts <slug>   One guide
 */
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import { chromium } from 'playwright-core'
import { createServer, createServerModuleRunner } from 'vite'

import type * as Content from '../../src/features/guides/content/index.ts'
import type { Guide, GuideSlug } from '../../src/features/guides/content/types.ts'
import type * as TableModel from '../../src/features/guides/table/table-model.ts'

/** The right-hand side of a card: markdown on the ink sheet, and what it becomes on the paper one. */
type Art = { eyebrow: string; source: string; page: string }

// Guide content imports through the `@/` alias and from .tsx files, so Vite loads it.
const vite = await createServer({
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, ws: false },
  resolve: { alias: { '@': resolve('src') } },
})
const runner = createServerModuleRunner(vite.environments.ssr)
const { GUIDES } = await runner.import<typeof Content>('/src/features/guides/content/index.ts')
const { toMarkdown } = await runner.import<typeof TableModel>(
  '/src/features/guides/table/table-model.ts',
)
await runner.close()
await vite.close()

const escapeHtml = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function toolSource(guide: Guide) {
  if (guide.tool.kind === 'specimens') return guide.tool.entries[0].source
  if (guide.tool.kind === 'table-generator') return toMarkdown(guide.tool.initial)
  throw new Error(`${guide.slug} has no markdown in its tool`)
}

const galleryCount = (guide: Guide) =>
  guide.sections
    .flatMap((section) => section.blocks)
    .flatMap((block) => (block.kind === 'gallery' ? block.items : [])).length

const node = (x: number, label: string) =>
  `<rect x="${x}" y="22" width="70" height="36" rx="3" fill="var(--paper-2)" stroke="var(--ink-2)"/><text x="${x + 35}" y="44" text-anchor="middle">${label}</text>`
const arrow = (from: number, to: number) =>
  `<path d="M${from} 40H${to - 5}" stroke="var(--ink-2)" fill="none"/><path d="M${to} 40l-7-4v8z" fill="var(--ink-2)"/>`

const ART: Record<GuideSlug, Art> = {
  'github-readme-viewer': {
    eyebrow: 'Repositories · Files · Gists',
    source: [
      '# Tidepool',
      '',
      '> [!NOTE]',
      '> Requires Node 22 or later.',
      '',
      '- [x] Command-line interface',
    ].join('\n'),
    page: `<h2>Tidepool</h2>
      <div class="note"><b>NOTE</b>Requires Node 22 or later.</div>
      <div class="task"><span class="box on">✓</span>Command-line interface</div>`,
  },
  'mermaid-viewer': {
    eyebrow: `Live preview · ${galleryCount(GUIDES['mermaid-viewer'])} diagram types`,
    source: toolSource(GUIDES['mermaid-viewer']),
    page: `<svg viewBox="0 0 356 136">
      ${node(0, 'Idea')}${arrow(70, 92)}${node(92, 'Draft')}${arrow(162, 184)}
      <path d="M224 4l40 36-40 36-40-36z" fill="var(--paper-2)" stroke="var(--ink-2)"/>
      <text x="224" y="44" text-anchor="middle">Approved?</text>
      ${arrow(264, 286)}${node(286, 'Publish')}
      <text x="274" y="30" text-anchor="middle" fill="var(--ink-3)">Yes</text>
      <path d="M224 76V112H127V64" stroke="var(--ink-2)" fill="none"/><path d="M127 58l-4 7h8z" fill="var(--ink-2)"/>
      <text x="176" y="128" text-anchor="middle" fill="var(--ink-3)">No</text>
    </svg>`,
  },
  'markdown-to-pdf': {
    eyebrow: 'Page numbers · Title page · Contents',
    source: [
      '---',
      'title: Quarterly report',
      'subtitle: Q1 2026',
      'author: Jo Rivera',
      'date: 2026-03-14',
      '---',
    ].join('\n'),
    page: `<span class="tick"></span>
      <h2>Quarterly report</h2>
      <p class="lede">Q1 2026</p>
      <p class="byline">Jo Rivera · 14 March 2026</p>`,
  },
  'markdown-to-html': {
    eyebrow: 'Copy the markup · Download a page',
    source: [
      '## Release notes',
      '',
      'Version **2.4** adds',
      '*offline mode*.',
      '',
      '- Faster startup',
    ].join('\n'),
    page: `<div class="markup">${[
      '<h2>Release notes</h2>',
      '<p>Version <strong>2.4</strong> adds',
      '<em>offline mode</em>.</p>',
      '<ul>',
      '  <li>Faster startup</li>',
      '</ul>',
    ]
      .map((line) => escapeHtml(line).replace(/&lt;\/?[a-z0-9]+>/g, '<i>$&</i>'))
      .join('\n')}</div>`,
  },
  'markdown-table-generator': {
    eyebrow: 'Paste from Excel or CSV',
    source: toolSource(GUIDES['markdown-table-generator']),
    page: tablePage(GUIDES['markdown-table-generator']),
  },
}

function tablePage(guide: Guide) {
  if (guide.tool.kind !== 'table-generator') throw new Error(`${guide.slug} has no table`)
  const { rows, align } = guide.tool.initial
  const cells = (tag: 'th' | 'td', row: string[]) =>
    row
      .map((cell, column) => {
        const side = align[column] === 'none' ? 'left' : align[column]
        return `<${tag} style="text-align: ${side}">${escapeHtml(cell)}</${tag}>`
      })
      .join('')
  const [header, ...body] = rows
  return `<table><tr>${cells('th', header)}</tr>${body.map((row) => `<tr>${cells('td', row)}</tr>`).join('')}</table>`
}

const only = process.argv[2]
const guides = Object.values(GUIDES).filter((guide) => !only || guide.slug === only)
if (guides.length === 0) throw new Error(`Unknown guide: ${only}`)

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
  await page.goto(pathToFileURL(resolve('build/og/card.html')).href)
  for (const guide of guides) {
    const art = ART[guide.slug]
    await page.evaluate(
      async ({ text, html }) => {
        for (const [name, value] of Object.entries(text)) {
          document.querySelector(`[data-slot="${name}"]`)!.textContent = value
        }
        document.querySelector('[data-slot="page"]')!.innerHTML = html
        await document.fonts.ready
        // Shrink a long H1 until it clears the sheets on the right.
        const h1 = document.querySelector('h1')!
        let size = 112
        do h1.style.fontSize = `${size}px`
        while (h1.getBoundingClientRect().right > 624 && (size -= 4) > 40)
      },
      {
        text: {
          eyebrow: art.eyebrow,
          lead: guide.h1[0],
          emphasis: guide.h1[1],
          url: `render-md.com/${guide.slug}`,
          source: art.source,
        },
        html: art.page,
      },
    )
    const file = `public/og-${guide.slug}.png`
    await page.screenshot({ path: file })
    console.log(file)
  }
} finally {
  await browser.close()
}

/**
 * Export the print fixture to PDF through the app's real flow (Save as PDF
 * dialog, print sheet, readiness) and check the pages. Chromium's
 * `page.pdf()` uses the same print layout as the browser's Save as PDF.
 *
 *   node build/check-pdf.ts                 Serve the build with `vite preview` (run `pnpm build` first)
 *   node build/check-pdf.ts --url <origin>  Use a running server, such as `pnpm dev`
 *   node build/check-pdf.ts --out <dir>     Keep the PDFs (default: dist/pdf-check)
 */
import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { parseArgs } from 'node:util'

import { type Browser, chromium } from 'playwright-core'
import { getDocumentProxy } from 'unpdf'

import { type PdfSettings } from '../src/features/workspace/pdf/page-setup.ts'
import { createShareUrl } from '../src/lib/share-link.ts'

const { values: args } = parseArgs({
  options: { url: { type: 'string' }, out: { type: 'string', default: 'dist/pdf-check' } },
})

const FIXTURE = readFileSync(resolve('build/fixtures/print.md'), 'utf8')
const TITLE = 'Field notes on paper'
const HEADINGS = [
  TITLE,
  'Introduction',
  'A long listing',
  'A long table',
  'A wide table',
  'A diagram',
  'A tall image',
  'Before the break',
  'After the break',
]
/** PDF points per millimetre. */
const PT = 72 / 25.4
const FOLIO = /^(\d+) \/ (\d+)$/

type Line = { text: string; y: number }
type Page = { number: number; width: number; height: number; lines: Line[] }

type Scenario = {
  name: string
  theme: 'light' | 'dark'
  pdf: PdfSettings
  check: (pages: Page[], sheet: { diagram: string }) => void
}

const failures: string[] = []
function expect(scenario: string, condition: boolean, message: string) {
  if (!condition) failures.push(`${scenario}: ${message}`)
}

async function startServer() {
  if (args.url) return { origin: args.url, stop: () => undefined }
  const port = 4173
  // A process group of its own, so stopping it also stops vite and the workerd it starts.
  const server = spawn(
    'pnpm',
    ['exec', 'vite', 'preview', '--port', String(port), '--strictPort'],
    { stdio: ['ignore', 'pipe', 'inherit'], detached: true },
  )
  await new Promise<void>((ready, fail) => {
    server.stdout.on('data', (chunk: Buffer) => {
      if (chunk.toString().includes(`${port}`)) ready()
    })
    server.on('exit', (code) => fail(new Error(`vite preview exited with code ${code}`)))
  })
  return { origin: `http://localhost:${port}`, stop: () => process.kill(-server.pid!) }
}

/** Text lines per page, top to bottom, with the folio and header still in place. */
async function readPages(bytes: Uint8Array): Promise<Page[]> {
  const pdf = await getDocumentProxy(bytes)
  const pages: Page[] = []
  for (let number = 1; number <= pdf.numPages; number++) {
    const page = await pdf.getPage(number)
    const [, , width, height] = page.view
    const rows = new Map<number, string[]>()
    for (const item of (await page.getTextContent()).items) {
      if (!('str' in item) || !item.str.trim()) continue
      const y = Math.round(item.transform[5])
      rows.set(y, [...(rows.get(y) ?? []), item.str])
    }
    const lines = [...rows]
      .map(([y, parts]) => ({ y, text: parts.join(' ').replace(/\s+/g, ' ').trim() }))
      .sort((a, b) => b.y - a.y)
    pages.push({ number, width, height, lines })
  }
  return pages
}

const textOf = (page: Page) => page.lines.map((line) => line.text).join('\n')
/** Letter-spaced and monospaced text comes out of a PDF as loose words, so compare without spacing. */
const squash = (text = '') => text.replace(/\s+/g, '').toLowerCase()
const isContents = (page: Page) => page.lines.some((line) => squash(line.text) === '§contents')
const bodyLines = (page: Page, marginMm: number) =>
  page.lines.filter((line) => line.y > marginMm * PT && line.y < page.height - marginMm * PT)

function checkPaperSize(name: string, pages: Page[], width: number, height: number) {
  for (const page of pages) {
    const matches = Math.abs(page.width - width) < 1 && Math.abs(page.height - height) < 1
    expect(name, matches, `page ${page.number} is ${page.width} × ${page.height} pt`)
  }
}

function checkCommon(name: string, pages: Page[]) {
  const all = pages.map(textOf).join('\n')
  expect(name, all.includes('line001') && all.includes('line150'), 'the listing is clipped')
  expect(name, !/Rendered on your device|min read|Save as PDF/.test(all), 'app chrome printed')

  for (const page of pages) {
    const text = textOf(page)
    if (/Row \d{3}/.test(text)) {
      expect(
        name,
        squash(text).includes('regioncode'),
        `page ${page.number} has rows but no table header`,
      )
    }
  }

  const afterBreak = pages.find((page) => textOf(page).includes('After the break, this paragraph'))
  const topLine = afterBreak && bodyLines(afterBreak, 22)[0]?.text
  expect(
    name,
    squash(topLine) === squash('After the break'),
    `the page break page starts with "${topLine}"`,
  )
}

function checkNoStrandedHeadings(name: string, pages: Page[], marginMm: number) {
  for (const page of pages) {
    if (isContents(page)) continue
    const last = bodyLines(page, marginMm).at(-1)?.text
    expect(
      name,
      !HEADINGS.some((heading) => squash(heading) === squash(last)),
      `page ${page.number} ends with the heading "${last}"`,
    )
  }
}

const scenarios: Scenario[] = [
  {
    name: 'A4, light, every option',
    theme: 'light',
    pdf: {
      paper: 'a4',
      margins: 'normal',
      titlePage: true,
      contents: true,
      pageNumbers: true,
      runningHeader: true,
    },
    check(pages) {
      const name = this.name
      checkPaperSize(name, pages, 210 * PT, 297 * PT)
      checkCommon(name, pages)
      checkNoStrandedHeadings(name, pages, 22)

      const [cover, contents] = pages
      expect(name, textOf(cover).includes(TITLE), 'the title page has no title')
      expect(name, squash(textOf(cover)).includes('adalovelace'), 'the title page has no author')
      expect(name, !cover.lines.some((line) => FOLIO.test(line.text)), 'the title page has a folio')
      expect(name, isContents(contents), 'page 2 is not the contents')
      for (const page of pages.slice(1)) {
        const folio = page.lines.find((line) => FOLIO.test(line.text))?.text
        expect(
          name,
          folio === `${page.number} / ${pages.length}`,
          `page ${page.number} folio is ${folio}`,
        )
        expect(
          name,
          squash(page.lines[0]?.text) === squash(TITLE),
          `page ${page.number} header is "${page.lines[0]?.text}"`,
        )
      }
      expect(
        name,
        squash(bodyLines(pages[2], 22)[0]?.text) !== squash(TITLE),
        'the title is repeated on the first page of the document',
      )
    },
  },
  {
    name: 'Letter, dark, defaults',
    theme: 'dark',
    pdf: {
      paper: 'letter',
      margins: 'normal',
      titlePage: false,
      contents: false,
      pageNumbers: true,
      runningHeader: true,
    },
    check(pages, sheet) {
      const name = this.name
      checkPaperSize(name, pages, 612, 792)
      checkCommon(name, pages)
      checkNoStrandedHeadings(name, pages, 22)
      expect(
        name,
        squash(textOf(pages[0])).includes('adalovelace'),
        'the frontmatter card is missing',
      )
      // The light Mermaid palette's node fill; the dark one is #252629.
      expect(name, sheet.diagram.includes('#f6f3ee'), 'the diagram printed in its dark palette')
    },
  },
  {
    name: 'A4, no page numbers or header',
    theme: 'light',
    pdf: {
      paper: 'a4',
      margins: 'wide',
      titlePage: false,
      contents: false,
      pageNumbers: false,
      runningHeader: false,
    },
    check(pages) {
      const name = this.name
      checkPaperSize(name, pages, 210 * PT, 297 * PT)
      const folios = pages.flatMap((page) => page.lines).filter((line) => FOLIO.test(line.text))
      expect(name, folios.length === 0, 'pages have folios')
      const headers = pages.filter((page) => squash(page.lines[0]?.text) === squash(TITLE))
      expect(name, headers.length === 0, 'pages have a running header')
    },
  },
]

async function exportPdf(browser: Browser, origin: string, scenario: Scenario) {
  const context = await browser.newContext()
  if (scenario.theme === 'dark') {
    await context.addCookies([{ name: 'render-md-theme', value: 'dark', url: origin }])
  }
  await context.addInitScript((pdf) => {
    localStorage.setItem(
      'render-md:settings',
      JSON.stringify({ state: { viewMode: 'read', typeset: 'serif', pdf }, version: 1 }),
    )
  }, scenario.pdf)

  const page = await context.newPage()
  await page.goto(await createShareUrl(FIXTURE, origin))
  await page.locator('.doc h2', { hasText: 'After the break' }).first().waitFor()
  await page.evaluate(() => {
    window.print = () => {
      document.documentElement.dataset.printRequested = ''
    }
  })
  await page.keyboard.press('ControlOrMeta+p')
  await page.getByRole('button', { name: /Save PDF/ }).click()
  await page.locator('html[data-print-requested]').waitFor({ state: 'attached', timeout: 20_000 })

  const diagram = await page.locator('.print-sheet .diagram-canvas').innerHTML()
  const bytes = await page.pdf({ preferCSSPageSize: true })
  await context.close()
  return { bytes, diagram }
}

const server = await startServer()
const browser = await chromium.launch()
mkdirSync(args.out, { recursive: true })
try {
  for (const scenario of scenarios) {
    const { bytes, diagram } = await exportPdf(browser, server.origin, scenario)
    const file = join(args.out, `${scenario.name.replace(/\W+/g, '-').toLowerCase()}.pdf`)
    writeFileSync(file, bytes)
    const pages = await readPages(new Uint8Array(bytes))
    scenario.check(pages, { diagram })
    console.log(`${scenario.name}: ${pages.length} pages → ${file}`)
  }
} finally {
  await browser.close()
  server.stop()
}

if (failures.length) {
  console.error(failures.map((failure) => `✗ ${failure}`).join('\n'))
  process.exit(1)
}
console.log('✓ PDF export checks passed')

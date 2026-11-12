/** PDF page settings and the `@page` stylesheet they produce. */

export type Paper = 'a4' | 'letter'
export type Margins = 'narrow' | 'normal' | 'wide'

export type PdfSettings = {
  paper: Paper
  margins: Margins
  titlePage: boolean
  contents: boolean
  pageNumbers: boolean
  runningHeader: boolean
}

export const PAPERS: Record<Paper, { label: string; width: number; height: number }> = {
  a4: { label: 'A4', width: 210, height: 297 },
  letter: { label: 'Letter', width: 215.9, height: 279.4 },
}

/** Page margins in millimetres. The top and bottom hold the running header and folio. */
export const MARGINS: Record<Margins, { label: string; block: number; inline: number }> = {
  narrow: { label: 'Narrow', block: 15, inline: 13 },
  normal: { label: 'Normal', block: 22, inline: 20 },
  wide: { label: 'Wide', block: 28, inline: 30 },
}

/** Regions that use US Letter, from CLDR's paper-size data. Everywhere else uses A4. */
const LETTER_REGIONS = new Set([
  'BZ',
  'CA',
  'CL',
  'CO',
  'CR',
  'GT',
  'MX',
  'NI',
  'PA',
  'PH',
  'PR',
  'SV',
  'US',
  'VE',
])

export function defaultPaper(locale: string): Paper {
  try {
    const region = new Intl.Locale(locale).maximize().region
    return region && LETTER_REGIONS.has(region) ? 'letter' : 'a4'
  } catch {
    return 'a4'
  }
}

export function defaultPdfSettings(locale: string): PdfSettings {
  return {
    paper: defaultPaper(locale),
    margins: 'normal',
    titlePage: false,
    contents: false,
    pageNumbers: true,
    runningHeader: true,
  }
}

/** Page numbers and running headers need `@page` margin boxes (Chrome and Edge 131+). */
export const supportsMarginBoxes = () => typeof window !== 'undefined' && 'CSSMarginRule' in window

/** A CSS string literal. Newlines and other control characters become spaces. */
export function cssString(value: string) {
  const escaped = value
    .replace(/\p{Cc}+/gu, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
  return `"${escaped}"`
}

const MARGIN_TEXT =
  "font-family: 'Geist Mono Variable', ui-monospace, monospace; font-size: 7.5pt; letter-spacing: 0.08em; color: oklch(0.53 0.01 65);"

/**
 * The print stylesheet for one export: page size and margins, the running
 * header and folio in the page margins, and a blank first page margin when the
 * document opens with a title page. While it is mounted, only the print sheet
 * prints.
 */
export function pageStyle(settings: PdfSettings, title: string) {
  const paper = PAPERS[settings.paper]
  const margin = MARGINS[settings.margins]
  const header = settings.runningHeader
    ? `content: ${cssString(title.length > 90 ? `${title.slice(0, 89)}…` : title)}; text-transform: uppercase;`
    : 'content: "";'
  const folio = settings.pageNumbers
    ? 'content: counter(page) " / " counter(pages);'
    : 'content: "";'

  return `@media print {
  @page {
    size: ${paper.width}mm ${paper.height}mm;
    margin: ${margin.block}mm ${margin.inline}mm;
    @top-left { ${header} ${MARGIN_TEXT} vertical-align: bottom; padding-bottom: 5mm; }
    @bottom-center { ${folio} ${MARGIN_TEXT} vertical-align: top; padding-top: 5mm; }
  }
  ${settings.titlePage ? '@page :first { @top-left { content: ""; } @bottom-center { content: ""; } }' : ''}
  body > :not(.print-sheet) { display: none !important; }
  .print-sheet { --page-content-height: ${paper.height - 2 * margin.block}mm; }
}`
}

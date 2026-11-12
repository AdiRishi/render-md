import { type Root } from 'hast'
import { toText } from 'hast-util-to-text'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { type RenderResult } from '@/features/markdown/engine/pipeline'
import { DocumentView } from '@/features/markdown/render/DocumentView'
import { whenDocumentSettled } from '@/features/markdown/render/settled'
import { toast } from '@/ui/toast'

import { getDocumentTitle } from '../actions'
import { useSettingsStore } from '../state/settings-store'
import { type PrintJob, useUiStore } from '../state/ui-store'
import { coverFromFrontmatter } from './cover'
import { MARGINS, PAPERS, pageStyle } from './page-setup'
import { PRINT_ID_PREFIX, withPrintIds } from './print-hast'
import { PrintContents, contentsEntries } from './PrintContents'
import { PrintCover } from './PrintCover'

/**
 * A title page replaces the document's opening H1 when it repeats the title.
 * Its id moves to the title page, so links to it still land.
 */
function withoutOpeningTitle(hast: Root, title: string) {
  const first = hast.children.find((node) => node.type === 'element')
  if (first?.tagName !== 'h1' || toText(first).trim() !== title) return { body: hast, id: null }
  const id = typeof first.properties.id === 'string' ? first.properties.id : null
  return { body: { ...hast, children: hast.children.filter((node) => node !== first) }, id }
}

/**
 * Open the print dialog once the sheet has drawn, saying so if that takes a
 * moment. Never prints a document whose current text failed to render, or
 * hasn't rendered yet: the sheet would still hold the previous version.
 */
async function printWhenSettled(
  sheet: HTMLElement,
  signal: AbortSignal,
  isRendered: () => boolean,
) {
  let loading: string | null = null
  const slow = setTimeout(() => {
    loading = toast.add({ type: 'loading', title: 'Preparing your PDF…' })
  }, 300)
  const settled = await whenDocumentSettled(sheet)
  clearTimeout(slow)
  if (loading) toast.close(loading)
  if (signal.aborted) return
  if (!isRendered()) {
    toast.add({
      type: 'error',
      title: 'Couldn’t render this document',
      description: 'Fix the problem shown in the preview, then save as PDF again.',
    })
    useUiStore.getState().endPrint()
    return
  }
  if (!settled) {
    toast.add({
      title: 'Some images or diagrams hadn’t loaded',
      description: 'They may be missing from the PDF.',
    })
  }
  window.print()
}

/**
 * What a PDF prints: a copy of the document laid out for paper, with its own
 * page stylesheet, an optional title page and contents. Screens never see it;
 * it is laid out off-screen so its fonts, images and diagrams load before the
 * print dialog opens. For an export, it opens the dialog once all of that is
 * ready.
 */
export function PrintSheet({
  job,
  result,
  error,
  pending,
}: {
  job: PrintJob
  result: RenderResult | null
  error: string | null
  pending: boolean
}) {
  const { pdf, typeset, textSize, diagramLook } = useSettingsStore()
  const sheetRef = useRef<HTMLDivElement>(null)
  const title = result?.title ?? getDocumentTitle()

  // Read after the wait, so it reflects the render at that moment.
  const rendered = result !== null && !pending && !error
  const renderedRef = useRef(rendered)
  useLayoutEffect(() => {
    renderedRef.current = rendered
  })

  // Browsers name the saved PDF after the page title.
  useLayoutEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])

  useEffect(() => {
    const sheet = sheetRef.current
    if (job !== 'export' || !sheet) return
    const controller = new AbortController()
    void printWhenSettled(sheet, controller.signal, () => renderedRef.current)
    return () => controller.abort()
  }, [job])

  const paper = PAPERS[pdf.paper]
  const margin = MARGINS[pdf.margins]
  const contents = pdf.contents && result ? contentsEntries(result.headings) : []
  const cover = pdf.titlePage ? coverFromFrontmatter(result?.frontmatter ?? null, title) : null
  const opening = cover && result ? withoutOpeningTitle(result.hast, cover.title) : null

  return createPortal(
    <div
      ref={sheetRef}
      aria-busy={pending || !result}
      className="print-sheet pointer-events-none invisible fixed start-0 top-0 -z-10 h-0 overflow-hidden [print-color-adjust:exact] print:visible print:static print:z-auto print:h-auto print:w-auto! print:overflow-visible"
      style={{ width: `${paper.width - 2 * margin.inline}mm` }}
    >
      <style>{pageStyle(pdf, title)}</style>
      {cover ? (
        <PrintCover
          cover={cover}
          typeset={typeset}
          id={opening?.id ? PRINT_ID_PREFIX + opening.id : undefined}
        />
      ) : null}
      {contents.length >= 2 ? <PrintContents entries={contents} typeset={typeset} /> : null}
      {result ? (
        <DocumentView
          hast={withPrintIds(opening?.body ?? result.hast)}
          frontmatter={cover ? null : result.frontmatter}
          typeset={typeset}
          textSize={textSize}
          diagramLook={diagramLook}
          printing
        />
      ) : null}
    </div>,
    document.body,
  )
}

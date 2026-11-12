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
import { type PrintJob } from '../state/ui-store'
import { coverFromFrontmatter } from './cover'
import { MARGINS, PAPERS, pageStyle } from './page-setup'
import { withPrintIds } from './print-hast'
import { PrintContents, contentsEntries } from './PrintContents'
import { PrintCover } from './PrintCover'

/** Whether the document opens with the cover's title as its first block. */
function startsWithTitle(hast: Root, title: string) {
  const first = hast.children.find((node) => node.type === 'element')
  return first?.tagName === 'h1' && toText(first).trim() === title
}

/** Open the print dialog once the sheet has drawn, saying so if that takes a moment. */
async function printWhenSettled(sheet: HTMLElement, signal: AbortSignal) {
  let loading: string | null = null
  const slow = setTimeout(() => {
    loading = toast.add({ type: 'loading', title: 'Preparing your PDF…' })
  }, 300)
  const settled = await whenDocumentSettled(sheet)
  clearTimeout(slow)
  if (loading) toast.close(loading)
  if (signal.aborted) return
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
  pending,
}: {
  job: PrintJob
  result: RenderResult | null
  pending: boolean
}) {
  const { pdf, typeset, textSize, diagramLook } = useSettingsStore()
  const sheetRef = useRef<HTMLDivElement>(null)
  const title = result?.title ?? getDocumentTitle()

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
    void printWhenSettled(sheet, controller.signal)
    return () => controller.abort()
  }, [job])

  const paper = PAPERS[pdf.paper]
  const margin = MARGINS[pdf.margins]
  const contents = pdf.contents && result ? contentsEntries(result.headings) : []
  const cover = pdf.titlePage ? coverFromFrontmatter(result?.frontmatter ?? null, title) : null

  return createPortal(
    <div
      ref={sheetRef}
      aria-busy={pending || !result}
      className="print-sheet pointer-events-none invisible fixed start-0 top-0 -z-10 h-0 overflow-hidden [print-color-adjust:exact] print:visible print:static print:z-auto print:h-auto print:w-auto! print:overflow-visible"
      style={{ width: `${paper.width - 2 * margin.inline}mm` }}
    >
      <style>{pageStyle(pdf, title)}</style>
      {cover ? <PrintCover cover={cover} typeset={typeset} /> : null}
      {contents.length >= 2 ? <PrintContents entries={contents} typeset={typeset} /> : null}
      {result ? (
        <DocumentView
          hast={withPrintIds(result.hast)}
          frontmatter={cover ? null : result.frontmatter}
          typeset={typeset}
          textSize={textSize}
          diagramLook={diagramLook}
          printing
          className={
            cover && startsWithTitle(result.hast, cover.title)
              ? '[&>h1:first-child]:hidden'
              : undefined
          }
        />
      ) : null}
    </div>,
    document.body,
  )
}

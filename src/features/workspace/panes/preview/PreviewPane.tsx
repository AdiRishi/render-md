import { type MouseEvent, type RefObject } from 'react'

import { revealLine } from '@/features/editor/bridge'
import { type RenderResult } from '@/features/markdown/engine/pipeline'
import { DocumentView } from '@/features/markdown/render/DocumentView'
import { formatNumber } from '@/lib/format'
import { CropMarks } from '@/ui/CropMarks'

import { useDocumentStore } from '../../state/document-store'
import { MEASURES, useSettingsStore } from '../../state/settings-store'
import { previewArticle } from '../../state/ui-store'
import { EmptyState } from './EmptyState'
import { Outline } from './Outline'
import { ReadingProgress } from './ReadingProgress'
import { RenderError } from './RenderError'
import { SheetSkeleton } from './SheetSkeleton'

export function PreviewPane({
  result,
  error,
  scrollRef,
}: {
  result: RenderResult | null
  error?: string | null
  scrollRef: RefObject<HTMLDivElement | null>
}) {
  const markdown = useDocumentStore((state) => state.markdown)
  const baseUrl = useDocumentStore((state) => state.baseUrl)
  const toggleTask = useDocumentStore((state) => state.toggleTask)
  const { viewMode, typeset, textSize, measure, showOutline, diagramLook } = useSettingsStore()

  const isEmpty = markdown.trim() === ''
  const reading = viewMode === 'read'
  const headings = result?.headings ?? []
  const withOutline = reading && showOutline && headings.length >= 3

  // Double-click a block to jump the editor to its source line.
  const onDoubleClick = (event: MouseEvent) => {
    if (viewMode !== 'split') return
    const block = (event.target as HTMLElement).closest<HTMLElement>('[data-line]')
    const line = Number(block?.dataset.line)
    if (line) revealLine(line, { focus: false })
  }

  const source = (() => {
    try {
      return baseUrl ? new URL(baseUrl).hostname.replace(/^www\./, '') : null
    } catch {
      return null
    }
  })()

  return (
    <div
      ref={scrollRef}
      className="@container relative h-full scrollbar-quiet overflow-x-hidden overflow-y-auto desk-grid print:overflow-visible print:bg-none"
    >
      {reading ? <ReadingProgress scrollRef={scrollRef} /> : null}

      <div className="mx-auto flex w-full max-w-[90rem] justify-center gap-12 px-3 pt-8 pb-28 @md:px-10 @md:pt-12 print:p-0">
        {withOutline ? <Outline headings={headings} scrollRef={scrollRef} /> : null}

        <div className="w-full min-w-0" style={{ maxWidth: `calc(${MEASURES[measure]} + 10rem)` }}>
          <div className="mb-8 flex items-center justify-between gap-4 px-1 font-mono text-[10.5px] tracking-[0.1em] text-ink-3 uppercase print:hidden">
            <span className="flex items-center gap-2">
              <span className="text-proof">¶</span>
              {result && !isEmpty ? (
                <>
                  <span>{formatNumber(result.stats.words)} words</span>
                  <span className="text-ink-4">/</span>
                  <span>{result.stats.readingMinutes} min read</span>
                </>
              ) : (
                <span>Proof</span>
              )}
            </span>
            {source ? <span className="truncate tracking-normal normal-case">{source}</span> : null}
          </div>

          <div
            className="relative rounded-[3px] bg-paper px-5 py-9 shadow-paper @md:px-12 @md:py-14 @2xl:px-[4.5rem] @2xl:py-[4.5rem] print:rounded-none print:p-0 print:shadow-none"
            onDoubleClick={onDoubleClick}
          >
            <CropMarks offset={24} size={16} className="hidden @lg:block" />
            <div className="mx-auto" style={{ maxWidth: MEASURES[measure] }}>
              {error && !isEmpty ? <RenderError message={error} /> : null}
              {isEmpty ? (
                <EmptyState />
              ) : result ? (
                <DocumentView
                  ref={(element) => {
                    previewArticle.current = element
                  }}
                  hast={result.hast}
                  frontmatter={result.frontmatter}
                  typeset={typeset}
                  textSize={textSize}
                  onToggleTask={toggleTask}
                  diagramLook={diagramLook}
                />
              ) : error ? null : (
                <SheetSkeleton />
              )}
            </div>
          </div>

          <p className="mt-6 text-center font-mono text-[10px] tracking-[0.14em] text-ink-4 uppercase print:hidden">
            Rendered on your device · RenderMD
          </p>
        </div>

        {withOutline ? <div className="hidden w-52 shrink-0 2xl:block" aria-hidden /> : null}
      </div>
    </div>
  )
}

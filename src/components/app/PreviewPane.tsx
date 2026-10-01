import { ClipboardPaste, FolderOpen, Globe, Sparkles } from 'lucide-react'
import { type MouseEvent, type RefObject, useEffect, useState } from 'react'

import { DocumentView } from '@/components/document/DocumentView'
import { Button } from '@/components/ui/button'
import { documentActions } from '@/hooks/use-document-actions'
import { revealLine } from '@/lib/editor/bridge'
import { type HeadingEntry, type RenderResult } from '@/lib/markdown/pipeline'
import { cn, formatNumber } from '@/lib/utils'
import { useDocumentStore } from '@/stores/document-store'
import { MEASURES, useSettingsStore } from '@/stores/settings-store'
import { previewArticle, useUiStore } from '@/stores/ui-store'

/* -- Printer's crop marks at the corners of the sheet --------------------- */

function CropMarks() {
  const mark = 'pointer-events-none absolute hidden size-4 border-ink-4/70 @lg:block print:hidden'
  return (
    <>
      <span aria-hidden className={cn(mark, '-top-6 -left-6 border-r border-b')} />
      <span aria-hidden className={cn(mark, '-top-6 -right-6 border-b border-l')} />
      <span aria-hidden className={cn(mark, '-bottom-6 -left-6 border-t border-r')} />
      <span aria-hidden className={cn(mark, '-right-6 -bottom-6 border-t border-l')} />
    </>
  )
}

/* -- Outline (read mode) -------------------------------------------------- */

function Outline({
  headings,
  scrollRef,
}: {
  headings: HeadingEntry[]
  scrollRef: RefObject<HTMLDivElement | null>
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const minDepth = Math.min(...headings.map((heading) => heading.depth))

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    let frame = 0
    const update = () => {
      frame = 0
      const top = scroller.getBoundingClientRect().top + 96
      let current: string | null = headings[0]?.id ?? null
      for (const heading of headings) {
        const element = scroller.querySelector(`[id="${CSS.escape(heading.id)}"]`)
        if (element && element.getBoundingClientRect().top <= top) current = heading.id
      }
      setActiveId(current)
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [headings, scrollRef])

  return (
    <nav
      aria-label="Outline"
      className="sticky top-14 hidden max-h-[calc(100vh-10rem)] w-52 shrink-0 scrollbar-quiet self-start overflow-y-auto pe-2 xl:block print:hidden"
    >
      <p className="mb-3 label-caps text-ink-3">Contents</p>
      <ol className="space-y-px border-s border-rule">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  scrollRef.current
                    ?.querySelector(`[id="${CSS.escape(heading.id)}"]`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={cn(
                  '-ms-px block border-s py-1 text-[12.5px] leading-snug transition-colors',
                  active ? 'border-proof text-ink' : 'border-transparent text-ink-3 hover:text-ink',
                )}
                style={{ paddingInlineStart: `${0.75 + (heading.depth - minDepth) * 0.75}rem` }}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/* -- Empty & loading states ------------------------------------------------- */

function EmptyState() {
  const openDialog = useUiStore((state) => state.openDialog)
  return (
    <div className="flex flex-col items-start py-6">
      <p className="mb-5 label-caps text-proof">Nothing to render — yet</p>
      <h2 className="font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.015em] text-ink">
        A blank page,
        <br />
        <em className="text-ink-3">full of promise.</em>
      </h2>
      <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-2">
        Start typing in the editor, or bring something in. Files can also be dropped anywhere on
        this page.
      </p>
      <div className="mt-7 grid w-full max-w-md grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => void documentActions.pasteFromClipboard()}
        >
          <ClipboardPaste /> Paste
        </Button>
        <Button variant="outline" size="lg" onClick={() => void documentActions.openFile()}>
          <FolderOpen /> Open file
        </Button>
        <Button variant="outline" size="lg" onClick={() => openDialog('open-url')}>
          <Globe /> From a URL
        </Button>
        <Button variant="outline" size="lg" onClick={documentActions.loadSample}>
          <Sparkles /> Field guide
        </Button>
      </div>
    </div>
  )
}

function SheetSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-label="Rendering…">
      <div className="h-10 w-2/3 rounded bg-paper-3" />
      <div className="h-4 w-full rounded bg-paper-3/70" />
      <div className="h-4 w-11/12 rounded bg-paper-3/70" />
      <div className="h-4 w-4/5 rounded bg-paper-3/70" />
      <div className="mt-8 h-48 w-full rounded-lg bg-paper-3/60" />
    </div>
  )
}

/* -- Reading progress ------------------------------------------------------- */

function ProgressBar({ scrollRef }: { scrollRef: RefObject<HTMLDivElement | null> }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const update = () => {
      const max = scroller.scrollHeight - scroller.clientHeight
      setProgress(max > 0 ? scroller.scrollTop / max : 0)
    }
    update()
    scroller.addEventListener('scroll', update, { passive: true })
    return () => scroller.removeEventListener('scroll', update)
  }, [scrollRef])

  return (
    <div className="pointer-events-none sticky top-0 z-10 h-0.5 print:hidden" aria-hidden>
      <div
        className="h-full origin-left bg-proof transition-transform duration-75"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

/* -- The pane --------------------------------------------------------------- */

export function PreviewPane({
  result,
  scrollRef,
}: {
  result: RenderResult | null
  scrollRef: RefObject<HTMLDivElement | null>
}) {
  const markdown = useDocumentStore((state) => state.markdown)
  const baseUrl = useDocumentStore((state) => state.baseUrl)
  const toggleTask = useDocumentStore((state) => state.toggleTask)
  const { viewMode, typeset, textSize, measure, showOutline } = useSettingsStore()

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
      {reading ? <ProgressBar scrollRef={scrollRef} /> : null}

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
            <CropMarks />
            <div className="mx-auto" style={{ maxWidth: MEASURES[measure] }}>
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
                />
              ) : (
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

import { FileDown } from 'lucide-react'
import { useRef } from 'react'

import { type HeadingEntry } from '@/features/markdown/engine/pipeline'
import { TYPESETS } from '@/features/markdown/render/typesets'
import { modKey } from '@/lib/platform'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Kbd, KbdGroup } from '@/ui/kbd'
import { SegmentedControl } from '@/ui/segmented-control'
import { Switch } from '@/ui/switch'

import { documentActions } from '../actions'
import { MARGINS, PAPERS, type PdfSettings, supportsMarginBoxes } from '../pdf/page-setup'
import { contentsEntries } from '../pdf/PrintContents'
import { useSettingsStore } from '../state/settings-store'
import { useUiStore } from '../state/ui-store'

const PAPER_OPTIONS = (['a4', 'letter'] as const).map((value) => ({
  value,
  label: PAPERS[value].label,
}))
const MARGIN_OPTIONS = (['narrow', 'normal', 'wide'] as const).map((value) => ({
  value,
  label: MARGINS[value].label,
}))
const TYPESET_OPTIONS = TYPESETS.map(({ value, label, hint }) => ({ value, label, title: hint }))

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-7 items-center justify-between gap-4">
      <span className="text-[13px] text-ink-2">{label}</span>
      {children}
    </div>
  )
}

function SwitchRow({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  disabled?: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      className={cn(
        'flex min-h-7 items-center justify-between gap-4',
        disabled && 'cursor-not-allowed opacity-60',
      )}
    >
      <span className="flex flex-col">
        <span className="text-[13px] text-ink-2">{label}</span>
        {hint ? <span className="text-[11.5px] leading-snug text-ink-3">{hint}</span> : null}
      </span>
      <Switch checked={checked && !disabled} disabled={disabled} onCheckedChange={onChange} />
    </label>
  )
}

type SheetKind = 'cover' | 'contents' | 'body' | 'continued'

const BODY_LINES = [92, 100, 96, 100, 71, 0, 100, 94, 100, 88, 100, 58]

/** A miniature page: paper size, margins, running header and folio as set. */
function Sheet({
  kind,
  settings,
  folio,
  marginBoxes,
}: {
  kind: SheetKind
  settings: PdfSettings
  folio: number
  marginBoxes: boolean
}) {
  const paper = PAPERS[settings.paper]
  const margin = MARGINS[settings.margins]
  const block = (margin.block / paper.height) * 100
  const inline = (margin.inline / paper.width) * 100
  const plain = kind === 'cover' || !marginBoxes

  return (
    <div
      className="relative w-full rounded-[2px] bg-paper shadow-paper transition-[aspect-ratio] duration-300"
      style={{ aspectRatio: `${paper.width} / ${paper.height}` }}
    >
      {settings.runningHeader && !plain ? (
        <span
          className="absolute h-[2px] w-[38%] rounded-full bg-ink-4/70"
          style={{ top: `${block * 0.55}%`, insetInlineStart: `${inline}%` }}
        />
      ) : null}
      <div
        className="absolute flex flex-col gap-[3px] transition-[inset] duration-300"
        style={{ inset: `${block}% ${inline}%` }}
      >
        {kind === 'cover' ? (
          <>
            <span className="mt-[38%] h-[1.5px] w-3 bg-proof" />
            <span className="mt-1.5 h-[5px] w-[90%] rounded-[1px] bg-ink/80" />
            <span className="h-[5px] w-[60%] rounded-[1px] bg-ink/80" />
            <span className="mt-auto h-px w-full bg-rule-strong" />
          </>
        ) : kind === 'contents' ? (
          <>
            <span className="mb-1.5 h-[2px] w-[30%] rounded-full bg-ink-4" />
            {[70, 52, 58, 76, 48, 64].map((width, index) => (
              <span
                key={index}
                className={cn('h-[2px] rounded-full', index % 3 === 0 ? 'bg-ink/60' : 'bg-ink-4')}
                style={{ width: `${width}%`, marginInlineStart: index % 3 === 0 ? 0 : '12%' }}
              />
            ))}
          </>
        ) : (
          <>
            {kind === 'body' ? (
              <span className="mb-1 h-[5px] w-[70%] rounded-[1px] bg-ink/80" />
            ) : null}
            {BODY_LINES.map((width, index) =>
              width ? (
                <span
                  key={index}
                  className="h-[2px] rounded-full bg-ink-4/80"
                  style={{ width: `${width}%` }}
                />
              ) : (
                <span key={index} className="h-1" />
              ),
            )}
          </>
        )}
      </div>
      {settings.pageNumbers && !plain ? (
        <span
          className="absolute inset-x-0 text-center font-mono text-[6px] leading-none text-ink-3"
          style={{ bottom: `${block * 0.35}%` }}
        >
          {folio}
        </span>
      ) : null}
    </div>
  )
}

export function PdfDialog({ headings }: { headings: HeadingEntry[] }) {
  const open = useUiStore((state) => state.dialog === 'pdf')
  const closeDialog = useUiStore((state) => state.closeDialog)
  const pdf = useSettingsStore((state) => state.pdf)
  const typeset = useSettingsStore((state) => state.typeset)
  const set = useSettingsStore((state) => state.set)
  const saveRef = useRef<HTMLButtonElement>(null)
  const mod = modKey()

  const marginBoxes = supportsMarginBoxes()
  const canListContents = contentsEntries(headings).length >= 2
  const update = <K extends keyof PdfSettings>(key: K, value: PdfSettings[K]) =>
    set('pdf', { ...pdf, [key]: value })

  // The first two pages of the PDF.
  const sheets: SheetKind[] = []
  if (pdf.titlePage) sheets.push('cover')
  if (pdf.contents && canListContents) sheets.push('contents')
  sheets.push('body', 'continued')

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeDialog()}>
      <DialogContent initialFocus={saveRef} className="gap-0 overflow-hidden p-0 sm:max-w-[46rem]">
        <div className="grid sm:grid-cols-[15rem_1fr]">
          <div className="hidden flex-col items-center justify-center gap-5 border-e border-rule desk-grid px-6 py-8 sm:flex">
            <div className="grid w-full grid-cols-2 items-start gap-3">
              {sheets.slice(0, 2).map((kind, index) => (
                <Sheet
                  key={`${kind}-${index}`}
                  kind={kind}
                  settings={pdf}
                  folio={index + 1}
                  marginBoxes={marginBoxes}
                />
              ))}
            </div>
            <p className="label-caps text-ink-3">
              {PAPERS[pdf.paper].label} · {MARGINS[pdf.margins].label} margins
            </p>
          </div>

          <div className="flex flex-col gap-5 p-6">
            <DialogHeader>
              <p className="label-caps text-ink-3">Export</p>
              <DialogTitle className="font-display text-[1.9rem] leading-tight font-normal tracking-[-0.01em]">
                Save as PDF
              </DialogTitle>
              <DialogDescription className="text-ink-2">
                Typeset for paper and made on your device. The document never leaves your browser.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <Row label="Paper">
                <SegmentedControl
                  label="Paper"
                  value={pdf.paper}
                  onChange={(value) => update('paper', value)}
                  options={PAPER_OPTIONS}
                  className="w-48"
                />
              </Row>
              <Row label="Margins">
                <SegmentedControl
                  label="Margins"
                  value={pdf.margins}
                  onChange={(value) => update('margins', value)}
                  options={MARGIN_OPTIONS}
                  className="w-48"
                />
              </Row>
              <Row label="Typeset">
                <SegmentedControl
                  label="Typeset"
                  value={typeset}
                  onChange={(value) => set('typeset', value)}
                  options={TYPESET_OPTIONS}
                  className="w-48"
                />
              </Row>
            </div>

            <div className="space-y-3 border-t border-rule pt-4">
              <SwitchRow
                label="Title page"
                hint="Title, subtitle, author and date from the frontmatter"
                checked={pdf.titlePage}
                onChange={(value) => update('titlePage', value)}
              />
              <SwitchRow
                label="Contents"
                hint={canListContents ? 'Linked to each section' : 'Needs at least two headings'}
                checked={pdf.contents}
                disabled={!canListContents}
                onChange={(value) => update('contents', value)}
              />
              <SwitchRow
                label="Page numbers"
                checked={pdf.pageNumbers}
                disabled={!marginBoxes}
                onChange={(value) => update('pageNumbers', value)}
              />
              <SwitchRow
                label="Running header"
                hint={marginBoxes ? 'The document title atop each page' : undefined}
                checked={pdf.runningHeader}
                disabled={!marginBoxes}
                onChange={(value) => update('runningHeader', value)}
              />
              {marginBoxes ? null : (
                <p className="text-[11.5px] leading-snug text-ink-3">
                  Page numbers and headers need Chrome or Edge. Your browser’s print dialog can add
                  its own.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-rule pt-4 sm:flex-row sm:items-center">
              <p className="flex-1 text-[11.5px] leading-snug text-ink-3">
                Your browser’s print dialog opens next. Choose <em>Save as PDF</em>.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={closeDialog}>
                  Cancel
                </Button>
                <Button ref={saveRef} onClick={documentActions.printPdf}>
                  <FileDown />
                  Save PDF
                  <KbdGroup className="ms-1 opacity-70">
                    <Kbd>{mod}</Kbd>
                    <Kbd>P</Kbd>
                  </KbdGroup>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

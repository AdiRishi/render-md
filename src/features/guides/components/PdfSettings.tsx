import { ArrowRight } from 'lucide-react'

import { TYPESETS } from '@/features/markdown/render/typesets'
import { openInEditor } from '@/lib/share-link'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { CropMarks } from '@/ui/crop-marks'
import { Kbd } from '@/ui/kbd'

import { PDF_SAMPLE } from '../content/pdf-sample'

const CHOICES = [
  { label: 'Paper', options: ['A4', 'Letter'] },
  { label: 'Margins', options: ['Narrow', 'Normal', 'Wide'], selected: 'Normal' },
  { label: 'Typeset', options: TYPESETS.map((typeset) => typeset.label) },
]

const SWITCHES = [
  { label: 'Title page', hint: 'Title, subtitle, author and date from the frontmatter', on: true },
  { label: 'Contents', hint: 'Linked to each section', on: false },
  { label: 'Page numbers', on: true },
  { label: 'Running header', hint: 'The document title atop each page', on: true },
]

const BODY_LINES = [94, 100, 97, 100, 62, 0, 100, 91, 100, 96, 100, 84, 100, 48]

function TitlePage() {
  return (
    <div className="absolute start-0 top-0 flex aspect-[210/297] w-[62%] -rotate-3 flex-col rounded-[2px] bg-paper px-[7%] py-[9%] shadow-paper">
      <span className="mt-[52%] h-[1.5px] w-3 bg-proof" />
      <span className="mt-2 font-display text-[12px] leading-none tracking-[-0.01em] text-ink">
        Quarterly report
      </span>
      <span className="mt-1.5 font-display text-[8px] leading-none text-ink-3 italic">Q1 2026</span>
      <span className="mt-auto border-t border-rule-strong pt-1.5 font-mono text-[5px] leading-none tracking-[0.08em] text-ink-3 uppercase">
        Jo Rivera
      </span>
    </div>
  )
}

function BodyPage() {
  return (
    <div className="absolute end-0 bottom-0 flex aspect-[210/297] w-[62%] rotate-2 flex-col rounded-[2px] bg-paper px-[7%] pt-[5%] pb-[4.5%] shadow-float">
      <CropMarks offset={7} size={5} />
      <span className="font-mono text-[5px] leading-none tracking-[0.08em] text-ink-3 uppercase">
        Quarterly report
      </span>
      <span className="mt-[11%] mb-1.5 h-[5px] w-[58%] rounded-[1px] bg-ink/80" />
      <span className="flex flex-col gap-[3.5px]">
        {BODY_LINES.map((width, index) => (
          <span
            key={index}
            className={width ? 'h-[2px] rounded-full bg-ink-4/80' : 'h-1'}
            style={{ width: `${width}%` }}
          />
        ))}
      </span>
      <span className="mt-auto text-center font-mono text-[5px] leading-none tracking-[0.08em] text-ink-3">
        2 / 5
      </span>
    </div>
  )
}

/**
 * A read-only picture of the Save as PDF dialog: the pages it lays out beside
 * the settings it offers. The button opens a sample document to try it on.
 */
export function PdfSettings() {
  return (
    <figure className="@container m-0 overflow-hidden rounded-[3px] bg-paper shadow-[0_0_0_1px_var(--rule)]">
      <div className="grid @lg:grid-cols-[12rem_minmax(0,1fr)]">
        <div
          aria-hidden
          className="relative min-h-60 border-rule desk-grid @max-lg:border-b @lg:border-e"
        >
          <div className="absolute top-1/2 left-1/2 aspect-[10/11] w-44 -translate-1/2">
            <TitlePage />
            <BodyPage />
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 md:p-6">
          <figcaption>
            <span className="block label-caps text-ink-3">Export</span>
            <span className="mt-1 block font-display text-[1.75rem] leading-tight tracking-[-0.01em] text-ink">
              Save as PDF
            </span>
          </figcaption>

          <dl className="m-0 space-y-2.5">
            {CHOICES.map(({ label, options, selected = options[0] }) => (
              <div key={label} className="flex min-h-7 items-center justify-between gap-4">
                <dt className="text-[13px] text-ink-2">{label}</dt>
                <dd className="m-0 flex w-52 max-w-[70%] rounded-lg bg-desk-2 p-0.5 dark:bg-desk">
                  {options.map((option) => (
                    <span
                      key={option}
                      className={cn(
                        'flex h-6 min-w-0 flex-1 items-center justify-center rounded-md px-1 text-xs text-ink-3',
                        option === selected && 'bg-segment text-ink shadow-segment',
                      )}
                    >
                      {option}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>

          <dl className="m-0 space-y-2.5 border-t border-rule pt-4">
            {SWITCHES.map(({ label, hint, on }) => (
              <div key={label} className="flex min-h-7 items-center justify-between gap-4">
                <dt className="flex flex-col">
                  <span className="text-[13px] text-ink-2">{label}</span>
                  {hint ? (
                    <span className="text-[11.5px] leading-snug text-ink-3">{hint}</span>
                  ) : null}
                </dt>
                <dd className="m-0 shrink-0">
                  <span
                    aria-hidden
                    className={cn(
                      'flex h-[18px] w-8 items-center rounded-full px-px',
                      on ? 'justify-end bg-primary' : 'bg-input',
                    )}
                  >
                    <span className="size-4 rounded-full bg-background" />
                  </span>
                  <span className="sr-only">{on ? 'On' : 'Off'}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border-t border-rule pt-4 print:hidden">
            <Button onClick={() => void openInEditor(PDF_SAMPLE, { view: 'read', from: 'guide' })}>
              Open a sample in RenderMD <ArrowRight />
            </Button>
            <p className="flex items-center gap-1 text-[11.5px] text-ink-3">
              Then press <Kbd>⌘</Kbd>
              <Kbd>P</Kbd> or <Kbd>Ctrl</Kbd>
              <Kbd>P</Kbd>
            </p>
          </div>
        </div>
      </div>
    </figure>
  )
}

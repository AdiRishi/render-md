import { Breadcrumb } from '@/features/site/Breadcrumb'
import { cn } from '@/lib/utils'
import { CropMarks } from '@/ui/crop-marks'

import { type Guide, GUIDE_UPDATED } from '../content'
import { type GuideData } from '../data'
import { guideName } from '../seo'
import { GuideBlock } from './GuideBlock'

const updatedLabel = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

/**
 * Breadcrumb, the keyword-led H1 and the guide's tool as a sheet on the desk.
 * The tool sits beside the H1, except the table generator, which needs the
 * full width for its grid.
 */
export function Hero({ guide, data }: { guide: Guide; data: GuideData }) {
  const updated = GUIDE_UPDATED[guide.slug]
  const wide = guide.tool.kind === 'table-generator'

  return (
    <header className="border-b border-rule desk-grid">
      <div className="mx-auto max-w-6xl px-5 pt-6 pb-12 md:pt-14 md:pb-20">
        <Breadcrumb current={guideName(guide.slug)} />

        <div
          className={cn(
            'mt-8 grid gap-x-14 gap-y-10 md:mt-14',
            wide ? 'md:gap-y-14' : 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:items-center',
          )}
        >
          <div
            className={cn(
              wide && 'gap-x-14 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end',
            )}
          >
            <h1
              className={cn(
                'animate-rise font-display tracking-[-0.02em] text-ink [animation-delay:60ms]',
                wide
                  ? 'text-[clamp(2.75rem,7.4vw,5.25rem)]'
                  : 'text-[clamp(2.75rem,9vw,6rem)] lg:text-[clamp(3rem,5vw,3.875rem)]',
                'leading-[0.92]',
              )}
            >
              {guide.h1[0]} <br />
              <em className="text-ink-3">{guide.h1[1]}</em>
            </h1>
            <div>
              <p className="mt-6 max-w-[34rem] animate-rise text-lg leading-relaxed text-ink-2 [animation-delay:120ms] md:mt-8">
                {guide.lede}
              </p>
              <p className="mt-6 animate-rise font-mono text-[11px] tracking-[0.06em] text-ink-3 [animation-delay:180ms]">
                Updated <time dateTime={updated}>{updatedLabel(updated)}</time>
              </p>
            </div>
          </div>

          <div className="relative min-w-0 animate-rise rounded-[3px] shadow-paper [animation-delay:240ms]">
            <CropMarks offset={14} size={12} className="max-lg:hidden" />
            <GuideBlock block={guide.tool} data={data} />
          </div>
        </div>
      </div>
    </header>
  )
}

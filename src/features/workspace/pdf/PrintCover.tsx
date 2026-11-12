import { type Typeset } from '@/features/markdown/render/typesets'
import { cn } from '@/lib/utils'

import { type Cover } from './cover'
import { HEADING_FONT } from './fonts'

const TITLE_SIZE: Record<Typeset, string> = {
  sans: 'text-[34pt] leading-[1.05]',
  serif: 'text-[42pt] leading-[1.02]',
  mono: 'text-[26pt] leading-[1.15]',
}

/** The PDF's title page: a proof-red rule, the title, and a colophon line at the foot. */
export function PrintCover({ cover, typeset }: { cover: Cover; typeset: Typeset }) {
  const byline = cover.authors.join(' · ')
  return (
    <section
      className="flex break-after-page flex-col"
      style={{ height: 'calc(var(--page-content-height) - 2mm)' }}
    >
      <div className="mt-[30%]">
        <div className="mb-10 h-[1.5pt] w-14 bg-proof" />
        <h1 className={cn('text-balance text-ink', HEADING_FONT[typeset], TITLE_SIZE[typeset])}>
          {cover.title}
        </h1>
        {cover.subtitle ? (
          <p
            className={cn(
              'mt-6 max-w-[85%] text-[14pt] leading-snug text-pretty text-ink-2',
              typeset === 'serif' ? 'font-display italic' : 'font-sans',
            )}
          >
            {cover.subtitle}
          </p>
        ) : null}
      </div>
      {byline || cover.date ? (
        <div className="mt-auto flex items-baseline justify-between gap-8 border-t border-rule pt-3 label-caps text-ink-3">
          <span>{byline}</span>
          <span className="shrink-0">{cover.date}</span>
        </div>
      ) : null}
    </section>
  )
}

import { type HeadingEntry } from '@/features/markdown/engine/pipeline'
import { type Typeset } from '@/features/markdown/render/typesets'
import { cn } from '@/lib/utils'

import { HEADING_FONT } from './fonts'
import { PRINT_ID_PREFIX } from './print-hast'

/**
 * The headings a contents page lists: down to H3, leaving out a lone H1, which
 * is the document's title.
 */
export function contentsEntries(headings: HeadingEntry[]) {
  const titles = headings.filter((heading) => heading.depth === 1).length
  return headings.filter((heading) => heading.depth <= 3 && !(titles === 1 && heading.depth === 1))
}

/** A contents page. The entries link to their sections, so they work in the PDF. */
export function PrintContents({ entries, typeset }: { entries: HeadingEntry[]; typeset: Typeset }) {
  const top = Math.min(...entries.map((entry) => entry.depth))
  return (
    <nav aria-label="Contents" className="break-after-page">
      <p className="mb-10 flex items-center gap-2 label-caps text-ink-3">
        <span className="text-proof">§</span>
        Contents
      </p>
      <ol>
        {entries.map((entry) => (
          <li
            key={entry.id}
            style={{ paddingInlineStart: `${(entry.depth - top) * 1.5}em` }}
            className={cn(
              'break-inside-avoid',
              entry.depth === top
                ? cn('mt-4 text-[13pt] leading-snug text-ink first:mt-0', HEADING_FONT[typeset])
                : 'mt-1.5 font-sans text-[10.5pt] leading-snug text-ink-2',
            )}
          >
            <a href={`#${PRINT_ID_PREFIX}${entry.id}`} className="no-underline">
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

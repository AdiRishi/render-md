import { DocumentView } from '@/features/markdown/render/DocumentView'
import { Specimen } from '@/features/markdown/specimen/Specimen'

import { type CheatsheetSection } from '../content'
import { sectionNumber } from '../content'
import { type CheatsheetData } from '../data'
import { InlineMarkdown } from './InlineMarkdown'
import { SupportBadge } from './SupportBadge'

export function SyntaxSection({
  section,
  data,
}: {
  section: CheatsheetSection
  data: CheatsheetData
}) {
  const number = sectionNumber(section.id)
  const tips = data.tips[section.id]
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28">
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-xs text-ink-4 tabular-nums">
            §{String(number).padStart(2, '0')}
          </span>
          <h3
            id={`${section.id}-title`}
            className="font-display text-[2.35rem] leading-none tracking-[-0.01em] text-ink"
          >
            <a href={`#${section.id}`} className="outline-offset-4">
              {section.title}
            </a>
          </h3>
          <SupportBadge support={section.support} />
        </div>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-2">
          <InlineMarkdown text={section.summary} />
        </p>
      </header>

      <div className="flex flex-col gap-9">
        {section.entries.map((entry) => (
          <Specimen
            key={entry.source}
            entry={entry}
            hast={data.examples[entry.source]}
            origin="cheatsheet"
          />
        ))}
      </div>

      {tips ? (
        <aside className="mt-6 rounded-[3px] border border-rule px-5 py-4 md:px-6">
          <p className="mb-2 label-caps text-ink-3">Good to know</p>
          <DocumentView
            hast={tips}
            textSize="s"
            className="[&_li]:text-[14px] [&_li]:text-ink-2 [&_ul]:mb-0"
          />
        </aside>
      ) : null}
    </section>
  )
}

import { type CheatsheetChapter } from '../content'
import { type CheatsheetData } from '../data'
import { InlineMarkdown } from './InlineMarkdown'
import { SyntaxSection } from './SyntaxSection'

/** A chapter opener (numeral, H2, intro) followed by its syntax sections. */
export function Chapter({ chapter, data }: { chapter: CheatsheetChapter; data: CheatsheetData }) {
  return (
    <section id={chapter.id} aria-labelledby={`${chapter.id}-title`} className="scroll-mt-24">
      <header className="mb-14 grid gap-4 border-t-2 border-ink pt-6 md:grid-cols-[6rem_1fr]">
        <span className="font-display text-6xl leading-none text-proof italic">
          {chapter.numeral}.
        </span>
        <div>
          <h2
            id={`${chapter.id}-title`}
            className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.015em] text-ink"
          >
            {chapter.title}
          </h2>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">
            <InlineMarkdown text={chapter.intro} />
          </p>
        </div>
      </header>
      <div className="space-y-20">
        {chapter.sections.map((section) => (
          <SyntaxSection key={section.id} section={section} data={data} />
        ))}
      </div>
    </section>
  )
}

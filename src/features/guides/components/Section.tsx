import { type GuideSection } from '../content'
import { type GuideData } from '../data'
import { GalleryNav } from './GalleryNav'
import { GuideBlock } from './GuideBlock'

/**
 * A section: its number and H2 in a rail that stays in view on wide screens,
 * with the blocks beside it. A gallery's jump list joins the rail.
 */
export function Section({
  section,
  number,
  data,
}: {
  section: GuideSection
  number: number
  data: GuideData
}) {
  const galleryItems = section.blocks.flatMap((block) =>
    block.kind === 'gallery' ? block.items : [],
  )

  return (
    <section
      id={section.id}
      aria-labelledby={`${section.id}-title`}
      className="grid scroll-mt-20 gap-x-14 gap-y-8 border-t-2 border-ink pt-6 lg:grid-cols-[15.5rem_minmax(0,1fr)]"
    >
      <header className="lg:sticky lg:top-20 lg:self-start">
        <p className="font-mono text-xs text-ink-4 tabular-nums">
          §{String(number).padStart(2, '0')}
        </p>
        <h2
          id={`${section.id}-title`}
          className="mt-3 font-display text-[clamp(2.1rem,4.5vw,2.6rem)] leading-[1.02] tracking-[-0.015em] text-balance text-ink"
        >
          {section.title}
        </h2>
        {galleryItems.length > 0 ? <GalleryNav items={galleryItems} /> : null}
      </header>
      <div className="min-w-0 space-y-8">
        {section.blocks.map((block, index) => (
          <GuideBlock key={index} block={block} data={data} />
        ))}
      </div>
    </section>
  )
}

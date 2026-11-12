import { type RenderedFragments } from '@/features/markdown/engine/render-static'
import { DocumentView } from '@/features/markdown/render/DocumentView'
import { Specimen } from '@/features/markdown/specimen/Specimen'

import { type GalleryItem } from '../content'

/** Live examples, each under an H3 with its own anchor. */
export function Gallery({
  items,
  rendered,
}: {
  items: GalleryItem[]
  rendered: RenderedFragments
}) {
  return (
    <div className="space-y-14">
      {items.map((item) => (
        <section
          key={item.id}
          id={item.id}
          aria-labelledby={`${item.id}-title`}
          className="scroll-mt-20"
        >
          <h3
            id={`${item.id}-title`}
            className="font-display text-[2rem] leading-none tracking-[-0.01em] text-ink"
          >
            <a href={`#${item.id}`} className="outline-offset-4">
              {item.title}
            </a>
          </h3>
          <DocumentView
            hast={rendered[item.summary]}
            textSize="s"
            className="mt-3 mb-5 max-w-2xl [&_p]:text-[15px] [&_p]:text-ink-2"
          />
          <Specimen
            entry={{ source: item.source }}
            hast={rendered[item.source]}
            origin="guide"
            result={{ shows: 'page' }}
          />
        </section>
      ))}
    </div>
  )
}

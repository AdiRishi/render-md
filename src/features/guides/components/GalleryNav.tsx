import { type GalleryItem } from '../content'

/** A gallery's jump list: one link per example. */
export function GalleryNav({ items }: { items: GalleryItem[] }) {
  return (
    <nav aria-label="Examples in this section" className="mt-6 print:hidden">
      <ul className="flex flex-wrap gap-x-5 gap-y-2.5 lg:flex-col lg:border-s lg:border-rule lg:ps-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="label-caps text-ink-3 transition-colors hover:text-ink"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

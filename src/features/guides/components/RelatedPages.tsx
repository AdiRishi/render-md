import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { type ContentPage, CONTENT_PAGES } from '@/features/site/pages'

/** The other content pages, as a ruled list. */
export function RelatedPages({ current }: { current: ContentPage['to'] }) {
  return (
    <nav aria-labelledby="related-pages-title" className="print:hidden">
      <p id="related-pages-title" className="mb-4 label-caps text-ink-3">
        More guides
      </p>
      <ul className="grid gap-x-14 border-t border-rule sm:grid-cols-2">
        {CONTENT_PAGES.filter((page) => page.to !== current).map((page) => (
          <li key={page.to} className="border-b border-rule">
            <Link
              to={page.to}
              className="group flex items-center justify-between gap-4 py-4 font-display text-[1.6rem] leading-tight tracking-[-0.01em] text-ink"
            >
              {page.label}
              <ArrowRight className="size-4 shrink-0 text-ink-4 transition-[color,translate] group-hover:translate-x-1 group-hover:text-ink" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

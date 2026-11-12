import { CONTENT_PAGES } from './pages'

/**
 * The content pages as a quiet row of links for the workspace's status bar.
 * Plain anchors, because leaving the workspace must be a full page load: its
 * debounced writes to localStorage flush on pagehide.
 */
export function PageLinks({ className }: { className?: string }) {
  return (
    <nav aria-label="Guides" className={className}>
      {/* Links that don't fit wrap onto a second line, which the bar's height clips. */}
      <ul className="flex h-4 flex-wrap justify-center gap-x-2 overflow-hidden leading-4">
        {CONTENT_PAGES.map((page, index) => (
          <li key={page.to} className="flex gap-2">
            {index > 0 ? (
              <span aria-hidden className="text-ink-4">
                ·
              </span>
            ) : null}
            <a href={page.to} title={page.label} className="transition-colors hover:text-ink">
              {page.short}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import { Link } from '@tanstack/react-router'

/** "RenderMD / <current page>", above a content page's H1. */
export function Breadcrumb({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="animate-rise print:hidden">
      <ol className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-ink-3">
        <li>
          <Link to="/" className="hover:text-ink">
            RenderMD
          </Link>
        </li>
        <li aria-hidden className="text-ink-4">
          /
        </li>
        <li aria-current="page" className="text-ink-2">
          {current}
        </li>
      </ol>
    </nav>
  )
}

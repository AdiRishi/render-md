import { Link } from '@tanstack/react-router'

import { BrandMark } from '@/ui/brand'

import { CONTENT_PAGES } from './pages'

export function SiteFooter() {
  return (
    <footer className="border-t border-rule print:hidden">
      <div className="mx-auto max-w-6xl px-5 text-[13px] text-ink-3">
        <nav
          aria-label="Guides"
          className="flex flex-col gap-x-8 gap-y-3 border-b border-rule py-6 sm:flex-row sm:items-baseline"
        >
          <p className="shrink-0 label-caps">Guides</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {CONTENT_PAGES.map((page) => (
              <li key={page.to}>
                <Link
                  to={page.to}
                  className="text-ink-2 underline decoration-transparent underline-offset-4 transition-colors hover:text-ink hover:decoration-rule-strong"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-6">
          <span className="flex items-center gap-2">
            <BrandMark className="size-4" /> RenderMD
          </span>
          <span>Free, private, no ads. Everything renders in your browser.</span>
          <a
            href="https://github.com/AdiRishi/render-md"
            className="ms-auto underline decoration-rule-strong underline-offset-4 hover:text-ink"
          >
            Source on GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}

import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { BrandMark, Wordmark } from '@/components/app/Brand'
import { ThemeToggle } from '@/components/app/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-desk/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="RenderMD home">
          <BrandMark className="size-[26px]" />
          <Wordmark />
        </Link>
        <nav className="ms-auto flex items-center gap-1">
          <Link
            to="/cheatsheet"
            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-ink-3 transition-colors hover:text-ink data-[status=active]:text-ink"
          >
            Cheatsheet
          </Link>
          <ThemeToggle />
          <Link to="/" className={cn(buttonVariants({ variant: 'primary' }), 'ms-1')}>
            Open editor <ArrowRight />
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-8 text-[13px] text-ink-3">
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
    </footer>
  )
}

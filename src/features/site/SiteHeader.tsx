import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

import { ThemeToggle } from '@/features/theme/ThemeToggle'
import { cn } from '@/lib/utils'
import { BrandMark, Wordmark } from '@/ui/brand'
import { buttonVariants } from '@/ui/button'

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
            className="rounded-md px-3 py-1.5 text-[13px] font-medium text-ink-3 transition-colors hover:text-ink data-[status=active]:text-ink max-sm:hidden"
          >
            Cheatsheet
          </Link>
          <ThemeToggle />
          <Link to="/" className={cn(buttonVariants({ size: 'sm' }), 'ms-1')}>
            <span className="max-sm:hidden">Open editor</span>
            <span className="sm:hidden">Editor</span>
            <ArrowRight />
          </Link>
        </nav>
      </div>
    </header>
  )
}

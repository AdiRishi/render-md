import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

/** The ink slab at the end of the page that sends readers to the editor. */
export function ClosingCta() {
  return (
    <aside className="relative overflow-hidden rounded-[3px] bg-ink px-8 py-12 text-paper md:px-14 dark:bg-paper-2 dark:text-ink dark:shadow-[inset_0_0_0_1px_var(--rule)] print:hidden">
      <p className="max-w-lg font-display text-5xl leading-[1.02] tracking-tight">
        Write markdown and see it typeset as you go.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-10 items-center gap-2 rounded-md bg-paper px-4 text-sm font-medium text-ink transition-transform active:translate-y-px dark:bg-ink dark:text-paper"
      >
        Open the editor <ArrowRight className="size-4" />
      </Link>
    </aside>
  )
}

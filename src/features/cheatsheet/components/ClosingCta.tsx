import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

/** The ink slab at the end of the page that sends readers to the editor. */
export function ClosingCta() {
  return (
    <aside className="relative overflow-hidden rounded-2xl bg-ink px-8 py-12 text-paper md:px-14 print:hidden">
      <p className="label-caps text-proof">The editor</p>
      <p className="mt-4 max-w-lg font-display text-5xl leading-[1.02] tracking-tight">
        Write markdown and see it typeset as you go.
      </p>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-paper/70">
        Paste, drop or link a markdown file, or start from a blank page. It runs in your browser and
        it’s free, with no ads.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-paper px-4 text-sm font-medium text-ink transition-transform active:translate-y-px"
      >
        Open the editor <ArrowRight className="size-4" />
      </Link>
    </aside>
  )
}

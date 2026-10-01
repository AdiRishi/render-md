import { Link } from '@tanstack/react-router'
import { type Root } from 'hast'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button'

import { CHEATSHEET_UPDATED, EXAMPLE_COUNT, SECTIONS } from '../content'
import { HeroSpecimen } from './HeroSpecimen'
import { SearchBox } from './SearchBox'

const UPDATED_LABEL = new Date(`${CHEATSHEET_UPDATED}T12:00:00Z`).toLocaleDateString('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

function Breadcrumb() {
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
          Markdown cheat sheet
        </li>
      </ol>
    </nav>
  )
}

/** Breadcrumb, the keyword-led H1, search and the source→page specimen. */
export function Hero({ specimen }: { specimen: Root }) {
  return (
    <header className="relative overflow-hidden border-b border-rule desk-grid print:border-0 print:bg-none">
      <HeroSpecimen hast={specimen} />
      <div className="mx-auto max-w-6xl px-5 pt-10 pb-16 md:pt-14 md:pb-24 print:p-0">
        <Breadcrumb />

        <p className="mt-14 animate-rise label-caps text-proof [animation-delay:60ms] md:mt-20">
          The complete reference · {SECTIONS.length} topics · {EXAMPLE_COUNT} live examples
        </p>
        <h1 className="mt-5 max-w-3xl animate-rise font-display text-[clamp(3.4rem,10vw,8rem)] leading-[0.86] tracking-[-0.03em] text-ink [animation-delay:120ms]">
          Markdown <br />
          <em className="text-ink-3">cheat sheet</em>
        </h1>
        <p className="mt-8 max-w-[34rem] animate-rise text-lg leading-relaxed text-ink-2 [animation-delay:180ms]">
          Every markdown syntax — CommonMark, GitHub Flavored Markdown, math and diagrams — with
          examples you can edit and watch render. Nothing here is a mock-up: each one runs through
          the same renderer as the RenderMD editor.
        </p>
        <div className="mt-9 flex max-w-xl animate-rise flex-col gap-3 [animation-delay:240ms] sm:flex-row print:hidden">
          <SearchBox className="flex-1" />
          <Link to="/" className={cn(buttonVariants({ size: 'lg' }), 'shrink-0')}>
            Open the editor <ArrowRight />
          </Link>
        </div>
        <p className="mt-6 animate-rise font-mono text-[11px] tracking-[0.06em] text-ink-3 [animation-delay:300ms]">
          Updated <time dateTime={CHEATSHEET_UPDATED}>{UPDATED_LABEL}</time>
        </p>
      </div>
    </header>
  )
}

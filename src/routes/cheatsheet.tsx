import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type Root } from 'hast'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { CopyButton } from '@/components/document/CopyButton'
import { DocumentView } from '@/components/document/DocumentView'
import { SiteFooter, SiteHeader } from '@/components/site/SiteHeader'
import { buttonVariants } from '@/components/ui/button'
import { CHEATSHEET } from '@/content/cheatsheet'
import { getCheatsheetJsonLd, jsonLdScripts, seo, SITE_URL } from '@/lib/seo'
import { cn } from '@/lib/utils'

const HERO_SOURCE = `## Proof, not *promise*

- [x] Typeset in your browser
- [ ] Ads, trackers, sign-ups

> Write like nobody's rendering.`

/**
 * Every example runs through the real pipeline — on the server, so the page
 * ships rendered trees instead of the markdown engine itself.
 */
const renderCheatsheet = createServerFn().handler(async () => {
  const { renderMarkdown } = await import('@/lib/markdown/pipeline')
  const render = (source: string) => renderMarkdown(source, { stripPositions: true }).hast
  const data: CheatsheetData = {
    hero: render(HERO_SOURCE),
    examples: Object.fromEntries(
      CHEATSHEET.flatMap((section) => section.entries).map((entry) => [
        entry.source,
        render(entry.source),
      ]),
    ),
  }
  // HAST is plain JSON; a string keeps the server-function contract simple.
  return JSON.stringify(data)
})

type CheatsheetData = { hero: Root; examples: Record<string, Root> }

export const Route = createFileRoute('/cheatsheet')({
  loader: async () => JSON.parse(await renderCheatsheet()) as CheatsheetData,
  staleTime: Infinity,
  head: () => ({
    meta: seo({
      title: 'Markdown Cheatsheet — every syntax, rendered live | RenderMD',
      description:
        'A complete markdown reference with live, rendered examples: headings, emphasis, lists, task lists, links, images, code, tables, GitHub alerts, LaTeX math, Mermaid diagrams and footnotes.',
      url: `${SITE_URL}/cheatsheet`,
      image: `${SITE_URL}/og-cheatsheet.png`,
      imageAlt: 'The RenderMD markdown cheatsheet',
    }),
    links: [{ rel: 'canonical', href: `${SITE_URL}/cheatsheet` }],
    scripts: jsonLdScripts(getCheatsheetJsonLd()),
  }),
  component: CheatsheetPage,
})

function Specimen({ source, hast }: { source: string; hast: Root }) {
  return (
    <div className="grid overflow-hidden rounded-xl bg-paper shadow-paper md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="relative border-rule bg-paper-2 max-md:border-b md:border-e">
        <div className="flex h-9 items-center justify-between ps-4 pe-1.5">
          <span className="label-caps text-ink-3">Markdown</span>
          <CopyButton value={source} label="Copy markdown" />
        </div>
        <pre className="scrollbar-quiet overflow-x-auto px-4 pt-1 pb-5 font-mono text-[12.5px] leading-[1.75] whitespace-pre-wrap text-ink-2">
          {source}
        </pre>
      </div>
      <div className="min-w-0">
        <div className="flex h-9 items-center px-5">
          <span className="label-caps text-ink-3">Result</span>
        </div>
        <div className="px-5 pt-1 pb-6 md:px-7">
          <DocumentView hast={hast} textSize="s" />
        </div>
      </div>
    </div>
  )
}

/** The hero's specimen: the same text as source and as the set page. */
function HeroSpecimen({ hast }: { hast: Root }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-[max(1.25rem,calc(50%-36rem))] hidden w-[25rem] -translate-y-1/2 lg:block"
    >
      <pre className="ms-10 -rotate-2 animate-rise rounded-lg bg-ink px-5 py-4 font-mono text-[12px] leading-[1.75] whitespace-pre-wrap text-paper/80 shadow-float [animation-delay:200ms]">
        {HERO_SOURCE}
      </pre>
      <div className="relative me-4 -mt-6 rotate-[1.5deg] animate-rise rounded-[3px] bg-paper px-8 py-7 shadow-paper [animation-delay:320ms]">
        {(
          [
            '-top-4 -left-4 border-r border-b',
            '-top-4 -right-4 border-b border-l',
            '-bottom-4 -left-4 border-t border-r',
            '-right-4 -bottom-4 border-t border-l',
          ] as const
        ).map((position) => (
          <span key={position} className={`absolute size-3 border-ink-4 ${position}`} />
        ))}
        <DocumentView hast={hast} typeset="serif" textSize="s" />
      </div>
    </div>
  )
}

function useActiveSection() {
  const [active, setActive] = useState(CHEATSHEET[0].id)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-15% 0px -75% 0px' },
    )
    for (const section of CHEATSHEET) {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    }
    return () => observer.disconnect()
  }, [])
  return active
}

function CheatsheetPage() {
  const { hero, examples } = Route.useLoaderData()
  const active = useActiveSection()

  return (
    <div className="min-h-screen bg-desk">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-rule desk-grid">
        <HeroSpecimen hast={hero} />
        <div className="mx-auto max-w-6xl px-5 pt-20 pb-16 md:pt-28 md:pb-24">
          <p className="animate-rise label-caps text-proof">
            Reference · {CHEATSHEET.length} sections · Rendered live
          </p>
          <h1 className="mt-6 max-w-4xl animate-rise font-display text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.88] tracking-[-0.025em] text-ink [animation-delay:80ms]">
            Markdown,
            <br />
            <em className="text-ink-3">set in type.</em>
          </h1>
          <p className="mt-8 max-w-xl animate-rise text-lg leading-relaxed text-ink-2 [animation-delay:160ms]">
            Every piece of syntax RenderMD understands, with the exact output it produces. Nothing
            here is a mock-up — each example runs through the same renderer as the editor.
          </p>
          <div className="mt-9 flex animate-rise flex-wrap gap-2 [animation-delay:240ms]">
            <Link to="/" className={cn(buttonVariants({ variant: 'primary', size: 'lg' }))}>
              Try it in the editor <ArrowRight />
            </Link>
            <a href="#headings" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
              Start reading
            </a>
          </div>
        </div>
      </section>

      <div className="mx-auto flex max-w-6xl gap-14 px-5 py-16 md:py-20">
        <nav
          aria-label="Sections"
          className="sticky top-24 hidden w-48 shrink-0 self-start lg:block"
        >
          <ol className="space-y-0.5">
            {CHEATSHEET.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={cn(
                    'group flex items-baseline gap-3 rounded-md py-1.5 text-[13.5px] transition-colors',
                    active === section.id ? 'text-ink' : 'text-ink-3 hover:text-ink',
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-[10.5px] tabular-nums transition-colors',
                      active === section.id ? 'text-proof' : 'text-ink-4',
                    )}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main className="min-w-0 flex-1 space-y-20">
          {CHEATSHEET.map((section, index) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <header className="mb-6 flex items-baseline gap-4 border-b border-rule pb-4">
                <span className="font-mono text-xs text-proof tabular-nums">
                  §{String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="font-display text-4xl leading-none tracking-[-0.01em] text-ink">
                    {section.title}
                  </h2>
                  <p className="mt-2 text-[15px] text-ink-2">{section.summary}</p>
                </div>
              </header>
              <div className="space-y-4">
                {section.entries.map((entry) => (
                  <Specimen
                    key={entry.source}
                    source={entry.source}
                    hast={examples[entry.source]}
                  />
                ))}
              </div>
            </section>
          ))}

          <aside className="relative overflow-hidden rounded-2xl bg-ink px-8 py-12 text-paper md:px-14">
            <p className="label-caps text-proof">Now you know the marks</p>
            <p className="mt-4 max-w-lg font-display text-5xl leading-[0.95] tracking-tight">
              Go write something worth reading.
            </p>
            <Link
              to="/"
              className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-paper px-4 text-sm font-medium text-ink transition-transform active:translate-y-px"
            >
              Open the editor <ArrowRight className="size-4" />
            </Link>
          </aside>
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}

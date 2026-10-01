import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { type Root } from 'hast'
import { ArrowRight, ArrowUpRight, Printer, RotateCcw, Search } from 'lucide-react'
import { Fragment, type ReactNode, useEffect, useRef, useState } from 'react'

import { CopyButton } from '@/components/document/CopyButton'
import { DocumentView } from '@/components/document/DocumentView'
import { SiteFooter, SiteHeader } from '@/components/site/SiteHeader'
import { buttonVariants } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import { Tooltip } from '@/components/ui/tooltip'
import {
  CHAPTERS,
  CHEATSHEET_UPDATED,
  type CheatsheetEntry,
  type CheatsheetSection,
  FAQ,
  QUICK_REFERENCE,
  SECTIONS,
  SUPPORT_LABEL,
  type Support,
} from '@/content/cheatsheet'
import { stripHeadingIds } from '@/lib/markdown/hast'
import { CHEATSHEET_URL, getCheatsheetJsonLd, jsonLdScripts, seo, SITE_URL } from '@/lib/seo'
import { cn } from '@/lib/utils'

/* =============================================================================
   Data — every example, tip and answer is rendered by the real pipeline, on
   the server, so the page ships rendered HTML instead of the markdown engine.
   ============================================================================= */

const HERO_SOURCE = `## Proof, not *promise*

- [x] Typeset in your browser
- [ ] Ads, trackers, sign-ups

> Write like nobody's rendering.`

type CheatsheetData = {
  hero: Root
  examples: Record<string, Root>
  tips: Record<string, Root>
  faq: Root[]
}

const renderCheatsheet = createServerFn().handler(async () => {
  const { renderMarkdown } = await import('@/lib/markdown/pipeline')
  const render = (source: string) => renderMarkdown(source, { stripPositions: true }).hast
  const data: CheatsheetData = {
    hero: stripHeadingIds(render(HERO_SOURCE)),
    examples: Object.fromEntries(
      SECTIONS.flatMap((section) => section.entries).map((entry) => [
        entry.source,
        stripHeadingIds(render(entry.source)),
      ]),
    ),
    tips: Object.fromEntries(
      SECTIONS.filter((section) => section.tips?.length).map((section) => [
        section.id,
        render(section.tips!.map((tip) => `- ${tip}`).join('\n')),
      ]),
    ),
    faq: FAQ.map((item) => render(item.answer)),
  }
  // HAST is plain JSON; a string keeps the server-function contract simple.
  return JSON.stringify(data)
})

const EXAMPLE_COUNT = SECTIONS.reduce((total, section) => total + section.entries.length, 0)
const UPDATED_LABEL = new Date(`${CHEATSHEET_UPDATED}T12:00:00Z`).toLocaleDateString('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export const Route = createFileRoute('/cheatsheet')({
  loader: async () => JSON.parse(await renderCheatsheet()) as CheatsheetData,
  staleTime: Infinity,
  head: () => ({
    meta: [
      ...seo({
        title: 'Markdown Cheat Sheet — Complete Syntax Guide with Live Examples | RenderMD',
        description: `Every markdown syntax in one place: headings, lists, links, images, code, tables, task lists, footnotes, alerts, LaTeX math and Mermaid diagrams — ${EXAMPLE_COUNT} live, editable examples.`,
        url: CHEATSHEET_URL,
        image: `${SITE_URL}/og-cheatsheet.png`,
        imageAlt: 'The RenderMD markdown cheat sheet',
        type: 'article',
      }),
      { property: 'article:modified_time', content: CHEATSHEET_UPDATED },
    ],
    links: [{ rel: 'canonical', href: CHEATSHEET_URL }],
    scripts: jsonLdScripts(getCheatsheetJsonLd()),
  }),
  component: CheatsheetPage,
})

/* =============================================================================
   Small pieces
   ============================================================================= */

/** Just enough inline markdown for summaries: `code`, *em* and **strong**. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
          return (
            <code
              key={index}
              className="rounded-[4px] bg-paper-2 px-1 py-0.5 font-mono text-[0.86em] text-ink shadow-[inset_0_0_0_1px_var(--rule)]"
            >
              {part.slice(1, -1)}
            </code>
          )
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
          return <strong key={index}>{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
          return <em key={index}>{part.slice(1, -1)}</em>
        return <Fragment key={index}>{part}</Fragment>
      })}
    </>
  )
}

function SupportBadge({ support }: { support: Support }) {
  const info = SUPPORT_LABEL[support]
  return (
    <span
      title={info.description}
      className={cn(
        'inline-flex h-5 shrink-0 items-center rounded-full px-2 label-caps text-[9.5px]',
        support === 'commonmark' && 'text-ink-2 shadow-[inset_0_0_0_1px_var(--rule-strong)]',
        support === 'gfm' && 'bg-ink text-paper',
        support === 'github' && 'bg-proof text-proof-ink',
        support === 'extended' && 'bg-paper-3 text-ink-2',
      )}
    >
      {info.label}
    </span>
  )
}

function CropMarks() {
  const mark = 'pointer-events-none absolute size-3.5 border-ink-4/80 print:hidden'
  return (
    <>
      <span aria-hidden className={cn(mark, '-top-5 -left-5 border-r border-b')} />
      <span aria-hidden className={cn(mark, '-top-5 -right-5 border-b border-l')} />
      <span aria-hidden className={cn(mark, '-bottom-5 -left-5 border-t border-r')} />
      <span aria-hidden className={cn(mark, '-right-5 -bottom-5 border-t border-l')} />
    </>
  )
}

/* =============================================================================
   Search — jump to any section; press "/" anywhere.
   ============================================================================= */

function matchSections(query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  return SECTIONS.filter((section) =>
    [
      section.id,
      section.title,
      section.summary,
      ...section.entries.map((entry) => entry.label ?? ''),
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  ).slice(0, 7)
}

function SearchBox({ className, hotkey = false }: { className?: string; hotkey?: boolean }) {
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const results = matchSections(query)
  const listId = hotkey ? 'cheatsheet-search-sidebar' : 'cheatsheet-search-hero'

  useEffect(() => {
    if (!hotkey) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (event.key !== '/' || target.closest('input, textarea, [contenteditable]')) return
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hotkey])

  const go = (section: CheatsheetSection) => {
    setQuery('')
    inputRef.current?.blur()
    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `#${section.id}`)
  }

  return (
    <div className={cn('relative', className)}>
      <label className="flex h-10 items-center gap-2.5 rounded-lg bg-paper px-3 shadow-[inset_0_0_0_1px_var(--rule-strong)] transition-shadow focus-within:shadow-[inset_0_0_0_1.5px_var(--ink)]">
        <Search className="size-4 shrink-0 text-ink-3" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setHighlighted(0)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setHighlighted((index) => Math.min(index + 1, results.length - 1))
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              setHighlighted((index) => Math.max(index - 1, 0))
            } else if (event.key === 'Enter' && results[highlighted]) {
              go(results[highlighted])
            } else if (event.key === 'Escape') {
              setQuery('')
            }
          }}
          placeholder="Find syntax — table, footnote…"
          aria-label="Search the cheat sheet"
          aria-controls={listId}
          className="min-w-0 flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-4 [&::-webkit-search-cancel-button]:hidden"
        />
        {hotkey ? <Kbd className="text-ink-3">/</Kbd> : null}
      </label>
      {results.length > 0 ? (
        <ul
          id={listId}
          aria-label="Matching sections"
          className="absolute inset-x-0 top-12 z-30 overflow-hidden rounded-xl bg-paper p-1.5 shadow-float"
        >
          {results.map((section, index) => (
            <li key={section.id}>
              <button
                type="button"
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => go(section)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-start text-[13px]',
                  index === highlighted ? 'bg-desk-2 text-ink' : 'text-ink-2',
                )}
              >
                {section.title}
                <SupportBadge support={section.support} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/* =============================================================================
   Specimen — an editable example with its live rendering.
   ============================================================================= */

async function openInEditor(source: string) {
  const { createShareUrl } = await import('@/lib/share')
  window.location.assign(await createShareUrl(source, window.location.origin, { view: 'split' }))
}

function Specimen({ entry, hast }: { entry: CheatsheetEntry; hast: Root }) {
  const [source, setSource] = useState(entry.source)
  const [rendered, setRendered] = useState(hast)
  const edited = source !== entry.source

  // Edits re-render live through the same worker the editor uses.
  useEffect(() => {
    if (source === entry.source) return
    let active = true
    const timer = setTimeout(() => {
      void import('@/lib/markdown/client')
        .then(({ renderInBackground }) => renderInBackground(source))
        .then(
          (result) => active && setRendered(stripHeadingIds(result.hast)),
          () => undefined,
        )
    }, 120)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [source, entry.source])

  const iconButton =
    'inline-grid size-7 place-items-center rounded-md text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink'

  return (
    <figure className="group/specimen m-0 break-inside-avoid">
      {entry.label ? (
        <figcaption className="mb-2.5 flex items-center gap-2 label-caps text-ink-3">
          <span className="h-px w-3 bg-proof" aria-hidden />
          {entry.label}
        </figcaption>
      ) : null}
      <div className="grid overflow-hidden rounded-xl bg-paper shadow-paper md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] print:shadow-[0_0_0_1px_var(--rule)]">
        <div className="flex min-w-0 flex-col border-rule bg-paper-2 max-md:border-b md:border-e">
          <div className="flex h-9 items-center gap-2 ps-4 pe-1.5">
            <span className="label-caps text-ink-3">Markdown</span>
            {edited ? (
              <span className="rounded-full bg-proof-soft px-1.5 py-0.5 label-caps text-[9px] text-proof">
                Edited
              </span>
            ) : (
              <span className="label-caps text-[9px] text-ink-4 opacity-0 transition-opacity group-hover/specimen:opacity-100 print:hidden">
                · Click to edit
              </span>
            )}
            <span className="ms-auto flex items-center print:hidden">
              {edited ? (
                <Tooltip label="Reset example">
                  <button
                    type="button"
                    aria-label="Reset example"
                    className={iconButton}
                    onClick={() => {
                      setSource(entry.source)
                      setRendered(hast)
                    }}
                  >
                    <RotateCcw className="size-3.5" />
                  </button>
                </Tooltip>
              ) : null}
              <CopyButton value={source} label="Copy markdown" />
              <Tooltip label="Open in the editor">
                <button
                  type="button"
                  aria-label="Open in the editor"
                  className={iconButton}
                  onClick={() => void openInEditor(source)}
                >
                  <ArrowUpRight className="size-4" />
                </button>
              </Tooltip>
            </span>
          </div>
          <textarea
            value={source}
            onChange={(event) => setSource(event.target.value)}
            spellCheck={false}
            aria-label={`Markdown example${entry.label ? `: ${entry.label}` : ''}`}
            className="[field-sizing:content] min-h-16 w-full flex-1 resize-none bg-transparent px-4 pt-1 pb-5 font-mono text-[12.5px] leading-[1.75] text-ink-2 outline-none focus:text-ink"
          />
        </div>
        <div className="min-w-0">
          <div className="flex h-9 items-center px-5 md:px-7">
            <span className="label-caps text-ink-3">Result</span>
          </div>
          <div className="px-5 pt-1 pb-6 md:px-7">
            <DocumentView hast={rendered} textSize="s" />
          </div>
        </div>
      </div>
    </figure>
  )
}

/* =============================================================================
   Page sections
   ============================================================================= */

function HeroSpecimen({ hast }: { hast: Root }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-[max(1.25rem,calc(50%-36rem))] hidden w-[25rem] -translate-y-1/2 lg:block print:hidden"
    >
      <pre className="ms-10 -rotate-2 animate-rise rounded-lg bg-ink px-5 py-4 font-mono text-[12px] leading-[1.75] whitespace-pre-wrap text-paper/80 shadow-float [animation-delay:200ms]">
        {HERO_SOURCE}
      </pre>
      <div className="relative me-4 -mt-6 rotate-[1.5deg] animate-rise rounded-[3px] bg-paper px-8 py-7 shadow-paper [animation-delay:320ms]">
        <CropMarks />
        <DocumentView hast={hast} typeset="serif" textSize="s" />
      </div>
    </div>
  )
}

function QuickReference() {
  const half = Math.ceil(QUICK_REFERENCE.length / 2)
  const columns = [QUICK_REFERENCE.slice(0, half), QUICK_REFERENCE.slice(half)]

  return (
    <section id="quick-reference" aria-labelledby="quick-reference-title" className="scroll-mt-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps text-proof">At a glance</p>
          <h2
            id="quick-reference-title"
            className="mt-2 font-display text-[clamp(2.2rem,4.5vw,3.2rem)] leading-none tracking-[-0.015em] text-ink"
          >
            Markdown syntax, quick reference
          </h2>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className={cn(buttonVariants({ variant: 'outline' }), 'print:hidden')}
        >
          <Printer /> Print this cheat sheet
        </button>
      </div>

      <div className="relative rounded-[3px] bg-paper px-5 py-6 shadow-paper md:px-10 md:py-9 print:shadow-none">
        <CropMarks />
        <div className="grid gap-x-12 md:grid-cols-2">
          {columns.map((rows, column) => (
            <table key={column} className="w-full border-collapse text-start">
              {column === 0 ? <caption className="sr-only">Common markdown syntax</caption> : null}
              <thead className={cn(column === 1 && 'max-md:hidden')}>
                <tr>
                  <th
                    scope="col"
                    className="w-[38%] pb-3 text-start label-caps font-medium text-ink-3"
                  >
                    Element
                  </th>
                  <th scope="col" className="pb-3 text-start label-caps font-medium text-ink-3">
                    Markdown
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.element} className="group/row border-t border-rule">
                    <th
                      scope="row"
                      className="py-2.5 pe-3 text-start align-top text-[14px] font-medium text-ink"
                    >
                      <a
                        href={`#${row.id}`}
                        className="decoration-proof underline-offset-4 hover:text-proof hover:underline"
                      >
                        {row.element}
                      </a>
                    </th>
                    <td className="py-2 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <code className="font-mono text-[12.5px] leading-[1.9] whitespace-pre-wrap text-ink-2">
                          {row.syntax}
                        </code>
                        <CopyButton
                          value={row.syntax}
                          label={`Copy ${row.element} syntax`}
                          className="-my-0.5 opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100 print:hidden"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>

      <dl className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {(Object.keys(SUPPORT_LABEL) as Support[]).map((support) => (
          <div key={support} className="flex items-start gap-2.5">
            <dt className="pt-px">
              <SupportBadge support={support} />
            </dt>
            <dd className="m-0 text-[12.5px] leading-snug text-ink-3">
              {SUPPORT_LABEL[support].description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function SectionBlock({
  section,
  number,
  data,
}: {
  section: CheatsheetSection
  number: number
  data: CheatsheetData
}) {
  const tips = data.tips[section.id]
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28">
      <header className="mb-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-xs text-proof tabular-nums">
            §{String(number).padStart(2, '0')}
          </span>
          <h3
            id={`${section.id}-title`}
            className="font-display text-[2.35rem] leading-none tracking-[-0.01em] text-ink"
          >
            <a href={`#${section.id}`} className="outline-offset-4">
              {section.title}
            </a>
          </h3>
          <SupportBadge support={section.support} />
        </div>
        <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-ink-2">
          <Inline text={section.summary} />
        </p>
      </header>

      <div className="flex flex-col gap-9">
        {section.entries.map((entry) => (
          <Specimen key={entry.source} entry={entry} hast={data.examples[entry.source]} />
        ))}
      </div>

      {tips ? (
        <aside className="mt-6 rounded-xl border border-dashed border-rule-strong px-5 py-4 md:px-6">
          <p className="mb-2 label-caps text-ink-3">Good to know</p>
          <DocumentView
            hast={tips}
            textSize="s"
            className="[&_li]:text-[14.5px] [&_li]:text-ink-2 [&_ul]:mb-0"
          />
        </aside>
      ) : null}
    </section>
  )
}

function Faq({ answers }: { answers: Root[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24">
      <p className="label-caps text-proof">Questions</p>
      <h2
        id="faq-title"
        className="mt-2 mb-10 font-display text-[clamp(2.2rem,4.5vw,3.2rem)] leading-none tracking-[-0.015em] text-ink"
      >
        Frequently asked
      </h2>
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
        {FAQ.map((item, index) => (
          <div key={item.question} className="border-t border-rule pt-5">
            <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.01em] text-ink">
              {item.question}
            </h3>
            <DocumentView
              hast={answers[index]}
              textSize="s"
              className="mt-2 [&_p]:text-[15px] [&_p]:text-ink-2"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

/* =============================================================================
   Navigation
   ============================================================================= */

const NAV_IDS = ['quick-reference', ...SECTIONS.map((section) => section.id), 'faq']

function useActiveSection() {
  const [active, setActive] = useState<string>(NAV_IDS[0])
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let current = NAV_IDS[0]
      for (const id of NAV_IDS) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= 140) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return active
}

function NavLink({
  id,
  active,
  children,
  number,
}: {
  id: string
  active: boolean
  children: ReactNode
  number?: number
}) {
  return (
    <a
      href={`#${id}`}
      aria-current={active ? 'location' : undefined}
      className={cn(
        'flex items-baseline gap-3 rounded-md py-[5px] text-[13.5px] transition-colors',
        active ? 'text-ink' : 'text-ink-3 hover:text-ink',
      )}
    >
      <span
        className={cn(
          'w-5 shrink-0 font-mono text-[10.5px] tabular-nums transition-colors',
          active ? 'text-proof' : 'text-ink-4',
        )}
      >
        {number === undefined ? '·' : String(number).padStart(2, '0')}
      </span>
      {children}
    </a>
  )
}

function Sidebar({ active }: { active: string }) {
  let number = 0
  return (
    <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-56 shrink-0 scrollbar-quiet self-start overflow-y-auto px-1 pb-10 lg:block print:hidden">
      <SearchBox hotkey className="mb-6" />
      <nav aria-label="Cheat sheet sections">
        <NavLink id="quick-reference" active={active === 'quick-reference'}>
          Quick reference
        </NavLink>
        {CHAPTERS.map((chapter) => (
          <div key={chapter.id} className="mt-5">
            <p className="mb-1.5 label-caps text-ink-3">
              <span className="text-proof">{chapter.numeral}.</span> {chapter.title}
            </p>
            {chapter.sections.map((section) => (
              <NavLink
                key={section.id}
                id={section.id}
                active={active === section.id}
                number={++number}
              >
                {section.title}
              </NavLink>
            ))}
          </div>
        ))}
        <div className="mt-5">
          <NavLink id="faq" active={active === 'faq'}>
            Questions
          </NavLink>
        </div>
      </nav>
    </aside>
  )
}

/** Phones and tablets: a sticky, scrollable strip of sections. */
function MobileNav({ active }: { active: string }) {
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const list = listRef.current
    const link = list?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (!list || !link) return
    list.scrollTo({
      left: link.offsetLeft - list.clientWidth / 2 + link.clientWidth / 2,
      behavior: 'smooth',
    })
  }, [active])

  return (
    <nav
      aria-label="Cheat sheet sections"
      className="sticky top-14 z-30 border-b border-rule bg-desk/90 backdrop-blur-md lg:hidden print:hidden"
    >
      <div ref={listRef} className="flex [scrollbar-width:none] gap-1 overflow-x-auto px-4 py-2">
        {NAV_IDS.map((id) => {
          const label =
            id === 'quick-reference'
              ? 'Quick reference'
              : id === 'faq'
                ? 'Questions'
                : SECTIONS.find((section) => section.id === id)!.title
          return (
            <a
              key={id}
              data-id={id}
              href={`#${id}`}
              className={cn(
                'shrink-0 rounded-full px-3 py-1 text-[12.5px] whitespace-nowrap transition-colors',
                active === id ? 'bg-ink text-paper' : 'text-ink-2 hover:bg-desk-2',
              )}
            >
              {label}
            </a>
          )
        })}
      </div>
    </nav>
  )
}

/* =============================================================================
   The page
   ============================================================================= */

function CheatsheetPage() {
  const data = Route.useLoaderData()
  const active = useActiveSection()
  let number = 0

  return (
    <div className="min-h-screen bg-desk">
      <SiteHeader />
      <MobileNav active={active} />

      <header className="relative overflow-hidden border-b border-rule desk-grid print:border-0 print:bg-none">
        <HeroSpecimen hast={data.hero} />
        <div className="mx-auto max-w-6xl px-5 pt-10 pb-16 md:pt-14 md:pb-24 print:p-0">
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
            <Link
              to="/"
              className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'shrink-0')}
            >
              Open the editor <ArrowRight />
            </Link>
          </div>
          <p className="mt-6 animate-rise font-mono text-[11px] tracking-[0.06em] text-ink-3 [animation-delay:300ms]">
            Updated <time dateTime={CHEATSHEET_UPDATED}>{UPDATED_LABEL}</time>
          </p>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-14 px-5 py-16 md:py-24">
        <Sidebar active={active} />

        <main className="min-w-0 flex-1 space-y-28">
          <QuickReference />

          {CHAPTERS.map((chapter) => (
            <section
              key={chapter.id}
              id={chapter.id}
              aria-labelledby={`${chapter.id}-title`}
              className="scroll-mt-24"
            >
              <header className="mb-14 grid gap-4 border-t-2 border-ink pt-6 md:grid-cols-[6rem_1fr]">
                <span className="font-display text-6xl leading-none text-proof italic">
                  {chapter.numeral}.
                </span>
                <div>
                  <h2
                    id={`${chapter.id}-title`}
                    className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] tracking-[-0.015em] text-ink"
                  >
                    {chapter.title}
                  </h2>
                  <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-2">
                    <Inline text={chapter.intro} />
                  </p>
                </div>
              </header>
              <div className="space-y-20">
                {chapter.sections.map((section) => (
                  <SectionBlock key={section.id} section={section} number={++number} data={data} />
                ))}
              </div>
            </section>
          ))}

          <Faq answers={data.faq} />

          <aside className="relative overflow-hidden rounded-2xl bg-ink px-8 py-12 text-paper md:px-14 print:hidden">
            <p className="label-caps text-proof">Now you know the marks</p>
            <p className="mt-4 max-w-lg font-display text-5xl leading-[0.95] tracking-tight">
              Go write something worth reading.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-paper/70">
              Paste, drop or link any markdown file and RenderMD typesets it instantly — private,
              free, no ads.
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

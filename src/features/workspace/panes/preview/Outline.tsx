import { type RefObject, useEffect, useRef, useState } from 'react'

import { type HeadingEntry } from '@/features/markdown/engine/pipeline'
import { cn } from '@/lib/utils'

/** Outline (read mode) */
export function Outline({
  headings,
  scrollRef,
}: {
  headings: HeadingEntry[]
  scrollRef: RefObject<HTMLDivElement | null>
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)
  const minDepth = Math.min(...headings.map((heading) => heading.depth))

  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    let frame = 0
    const update = () => {
      frame = 0
      const top = scroller.getBoundingClientRect().top + 96
      let current: string | null = headings[0]?.id ?? null
      for (const heading of headings) {
        const element = scroller.querySelector(`[id="${CSS.escape(heading.id)}"]`)
        if (element && element.getBoundingClientRect().top <= top) current = heading.id
      }
      // The last sections may be too short to reach the line above, so the end of the page counts.
      const atEnd =
        scroller.scrollTop > 0 &&
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1
      if (atEnd) current = headings.at(-1)?.id ?? current
      setActiveId(current)
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [headings, scrollRef])

  // Keep the current section in view in a contents list taller than the outline.
  useEffect(() => {
    const nav = navRef.current
    const link = activeId && nav?.querySelector(`[href="#${CSS.escape(activeId)}"]`)
    if (!nav || !link) return
    const box = nav.getBoundingClientRect()
    const item = link.getBoundingClientRect()
    if (item.top < box.top) nav.scrollTop -= box.top - item.top
    else if (item.bottom > box.bottom) nav.scrollTop += item.bottom - box.bottom
  }, [activeId])

  return (
    // The height keeps it pinned at the end of the page: the scroller is 100vh - 5rem (top and
    // status bars), the outline sits 3rem below its top, and the row ends 7rem (pb-28) above its
    // bottom. Any taller and the sticky outline slides up under the top bar.
    <nav
      ref={navRef}
      aria-label="Outline"
      className="sticky top-12 hidden max-h-[calc(100vh-15rem)] w-52 shrink-0 scrollbar-quiet self-start overflow-y-auto pe-2 xl:block"
    >
      <p className="mb-3 label-caps text-ink-3">Contents</p>
      <ol className="space-y-px border-s border-rule">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={active ? 'location' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  scrollRef.current
                    ?.querySelector(`[id="${CSS.escape(heading.id)}"]`)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={cn(
                  '-ms-px block border-s py-1 text-[12.5px] leading-snug transition-colors',
                  active ? 'border-proof text-ink' : 'border-transparent text-ink-3 hover:text-ink',
                )}
                style={{ paddingInlineStart: `${0.75 + (heading.depth - minDepth) * 0.75}rem` }}
              >
                {heading.text}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

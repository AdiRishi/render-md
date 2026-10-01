import { type RefObject, useEffect, useState } from 'react'

import { type HeadingEntry } from '@/features/markdown/engine/pipeline'
import { cn } from '@/lib/cn'

/** Outline (read mode) */
export function Outline({
  headings,
  scrollRef,
}: {
  headings: HeadingEntry[]
  scrollRef: RefObject<HTMLDivElement | null>
}) {
  const [activeId, setActiveId] = useState<string | null>(null)
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

  return (
    <nav
      aria-label="Outline"
      className="sticky top-14 hidden max-h-[calc(100vh-10rem)] w-52 shrink-0 scrollbar-quiet self-start overflow-y-auto pe-2 xl:block print:hidden"
    >
      <p className="mb-3 label-caps text-ink-3">Contents</p>
      <ol className="space-y-px border-s border-rule">
        {headings.map((heading) => {
          const active = heading.id === activeId
          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
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

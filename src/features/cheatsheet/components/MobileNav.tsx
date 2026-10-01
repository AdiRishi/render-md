import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import { SECTIONS } from '../content'
import { NAV_IDS } from '../hooks/use-active-section'

export function MobileNav({ active }: { active: string }) {
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

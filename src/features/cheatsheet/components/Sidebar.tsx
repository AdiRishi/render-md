import { type ReactNode } from 'react'

import { cn } from '@/lib/cn'

import { CHAPTERS } from '../content'
import { sectionNumber } from '../content'
import { SearchBox } from './SearchBox'

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

export function Sidebar({ active }: { active: string }) {
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
                number={sectionNumber(section.id)}
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

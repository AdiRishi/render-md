import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'
import { Kbd } from '@/ui/kbd'

import { type CheatsheetSection } from '../content'
import { matchSections } from '../search'
import { SupportBadge } from './SupportBadge'

export function SearchBox({ className, hotkey = false }: { className?: string; hotkey?: boolean }) {
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
          className="absolute inset-x-0 top-12 z-30 overflow-hidden rounded-xl bg-popover p-1.5 shadow-float ring-1 ring-foreground/10"
        >
          {results.map((section, index) => (
            <li key={section.id}>
              <button
                type="button"
                onMouseEnter={() => setHighlighted(index)}
                onClick={() => go(section)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-md px-2.5 py-2 text-start text-[13px]',
                  index === highlighted ? 'bg-muted text-ink' : 'text-ink-2',
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

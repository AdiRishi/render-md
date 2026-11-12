import { cn } from 'cn'
import type * as React from 'react'

import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group'

/** A single-choice toggle group: one option is always selected. */
function SegmentedControl<T extends string>({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: React.ReactNode; title?: string }>
  className?: string
}) {
  return (
    <ToggleGroup
      aria-label={label}
      value={[value]}
      onValueChange={(next) => {
        const selected = options.find((option) => option.value === next[0])
        if (selected) onChange(selected.value)
      }}
      className={cn('w-36 gap-0 rounded-lg bg-desk-2 p-0.5 dark:bg-desk', className)}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          title={option.title}
          aria-label={option.title}
          className="h-6 min-w-0 flex-1 rounded-md px-2 text-xs text-ink-3 transition-all duration-150 hover:bg-transparent hover:text-ink aria-pressed:bg-segment aria-pressed:text-ink aria-pressed:shadow-segment"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export { SegmentedControl }

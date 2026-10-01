import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger

export function PopoverContent({
  className,
  align = 'end',
  side = 'bottom',
  children,
}: {
  className?: string
  align?: PopoverPrimitive.Positioner.Props['align']
  side?: PopoverPrimitive.Positioner.Props['side']
  children: ReactNode
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner align={align} side={side} sideOffset={6} className="z-50">
        <PopoverPrimitive.Popup
          className={cn(
            'w-80 origin-(--transform-origin) rounded-xl bg-paper p-4 text-ink shadow-float transition-[opacity,scale] duration-150 outline-none data-[ending-style]:scale-[0.97] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.97] data-[starting-style]:opacity-0',
            className,
          )}
        >
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

/** A compact segmented control (radio semantics). */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: ReactNode; title?: string }>
  label: string
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('flex rounded-lg bg-desk-2 p-0.5', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            title={option.title}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all duration-150',
              active
                ? 'bg-paper text-ink shadow-[0_1px_2px_rgb(var(--shadow-ink)/0.12),0_0_0_1px_rgb(var(--shadow-ink)/0.06)]'
                : 'text-ink-3 hover:text-ink',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

import { Popover as PopoverPrimitive } from '@base-ui/react/popover'
import { type ReactNode } from 'react'

import { cn } from '@/lib/cn'

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

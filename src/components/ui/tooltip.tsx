import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip'
import { type ReactElement, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipPrimitive.Provider

type TooltipProps = {
  label: ReactNode
  shortcut?: ReactNode
  side?: TooltipPrimitive.Positioner.Props['side']
  children: ReactElement<Record<string, unknown>>
  className?: string
}

/** A labelled trigger. The child element becomes the trigger via `render`. */
export function Tooltip({ label, shortcut, side = 'bottom', children, className }: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={6} className="z-[60]">
          <TooltipPrimitive.Popup
            className={cn(
              'flex origin-(--transform-origin) items-center gap-2 rounded-md bg-ink px-2 py-1 text-[11.5px] font-medium text-paper shadow-float transition-[opacity,scale] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0',
              className,
            )}
          >
            {label}
            {shortcut ? <span className="flex gap-0.5 opacity-80">{shortcut}</span> : null}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  )
}

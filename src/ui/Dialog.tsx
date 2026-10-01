import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import { type ReactNode } from 'react'

import { cn } from '@/lib/cn'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export function DialogContent({
  className,
  title,
  description,
  eyebrow,
  children,
}: {
  className?: string
  title: ReactNode
  description?: ReactNode
  eyebrow?: ReactNode
  children: ReactNode
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/25 backdrop-blur-[2px] transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:bg-black/50" />
      <DialogPrimitive.Popup
        className={cn(
          'fixed top-[14vh] left-1/2 z-50 w-[min(34rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl bg-paper p-6 text-ink shadow-float transition-[opacity,translate,scale] duration-200 ease-(--ease-out-quint) outline-none data-[ending-style]:translate-y-2 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:translate-y-2 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0',
          className,
        )}
      >
        {eyebrow ? <p className="mb-2 label-caps text-proof">{eyebrow}</p> : null}
        <DialogPrimitive.Title className="font-display text-[1.9rem] leading-tight tracking-[-0.01em]">
          {title}
        </DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="mt-1.5 text-sm leading-relaxed text-ink-2">
            {description}
          </DialogPrimitive.Description>
        ) : null}
        <div className="mt-5">{children}</div>
        <DialogPrimitive.Close
          aria-label="Close"
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-md text-ink-3 transition-colors hover:bg-desk-2 hover:text-ink"
        >
          <X className="size-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}

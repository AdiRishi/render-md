import { type ComponentProps } from 'react'

import { cn } from '@/lib/cn'

export function Kbd({ className, ...props }: ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] px-1 font-mono text-[10.5px] font-medium text-current opacity-70 shadow-[inset_0_0_0_1px_currentColor]',
        className,
      )}
      {...props}
    />
  )
}

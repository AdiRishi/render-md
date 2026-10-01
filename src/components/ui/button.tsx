import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-md text-[13px] font-medium whitespace-nowrap transition-[background-color,color,box-shadow,translate] duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-proof/60 active:translate-y-px disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper shadow-sm hover:bg-ink/88',
        proof: 'bg-proof text-proof-ink shadow-sm hover:bg-proof/90',
        outline:
          'bg-paper text-ink shadow-[inset_0_0_0_1px_var(--rule-strong)] hover:bg-paper-2 aria-expanded:bg-paper-2',
        ghost:
          'text-ink-2 hover:bg-desk-2 hover:text-ink aria-expanded:bg-desk-2 aria-expanded:text-ink',
        quiet: 'text-ink-3 hover:text-ink',
      },
      size: {
        sm: 'h-7 px-2.5 text-xs',
        md: 'h-8 px-3',
        lg: 'h-10 rounded-lg px-4 text-sm',
        icon: 'size-8',
        'icon-sm': "size-7 [&_svg:not([class*='size-'])]:size-3.5",
      },
    },
    defaultVariants: {
      variant: 'ghost',
      size: 'md',
    },
  },
)

export type ButtonProps = ButtonPrimitive.Props & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <ButtonPrimitive className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

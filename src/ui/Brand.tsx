import { cn } from '@/lib/cn'

/** The markdown mark, re-set: an ink sheet, a paper "M", a proof-red arrow. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 208 208" aria-hidden className={cn('size-6', className)}>
      <rect width="208" height="208" rx="48" fill="var(--ink)" />
      <path fill="var(--paper)" d="M50 138V99l20 25 20-25v39h20V70H90L70 95 50 70H30v68z" />
      <path fill="var(--proof)" d="M184 104h-20V70h-20v34h-20l30 35z" />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-baseline leading-none select-none', className)}>
      <span className="font-display text-[23px] tracking-[-0.01em] text-ink">Render</span>
      <span className="ms-[3px] -translate-y-[7px] font-mono text-[9.5px] font-semibold tracking-[0.16em] text-proof">
        MD
      </span>
    </span>
  )
}

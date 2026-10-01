import { type CSSProperties } from 'react'

import { cn } from '@/lib/cn'

const CORNERS: Array<{ position: CSSProperties; borders: string }> = [
  {
    position: { top: 'var(--crop-offset)', left: 'var(--crop-offset)' },
    borders: 'border-r border-b',
  },
  {
    position: { top: 'var(--crop-offset)', right: 'var(--crop-offset)' },
    borders: 'border-b border-l',
  },
  {
    position: { bottom: 'var(--crop-offset)', left: 'var(--crop-offset)' },
    borders: 'border-t border-r',
  },
  {
    position: { bottom: 'var(--crop-offset)', right: 'var(--crop-offset)' },
    borders: 'border-t border-l',
  },
]

/**
 * Printer's crop marks around the corners of the nearest positioned parent —
 * the signature detail of a "sheet" in this design system.
 */
export function CropMarks({
  offset = 20,
  size = 14,
  className,
}: {
  /** Distance outside the parent's edge, in px. */
  offset?: number
  size?: number
  /** Colour/visibility overrides, e.g. `border-proof` or `hidden md:block`. */
  className?: string
}) {
  return (
    <>
      {CORNERS.map(({ position, borders }) => (
        <span
          key={borders}
          aria-hidden
          className={cn(
            'pointer-events-none absolute border-ink-4/80 print:hidden',
            borders,
            className,
          )}
          style={
            {
              ...position,
              width: size,
              height: size,
              '--crop-offset': `${-offset}px`,
            } as CSSProperties
          }
        />
      ))}
    </>
  )
}

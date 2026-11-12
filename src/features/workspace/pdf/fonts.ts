import { type Typeset } from '@/features/markdown/render/typesets'

/** Heading type for the title page and contents, matching each typeset's headings. */
export const HEADING_FONT: Record<Typeset, string> = {
  sans: 'font-sans font-semibold tracking-[-0.022em]',
  serif: 'font-display font-normal tracking-[-0.012em]',
  mono: 'font-mono font-semibold tracking-[-0.01em]',
}

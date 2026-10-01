/** How a rendered document can be set. Applied as data attributes on `.doc`. */

export type Typeset = 'sans' | 'serif' | 'mono'
export type TextSize = 's' | 'm' | 'l'
export type DiagramLook = 'clean' | 'sketch'

export const TYPESETS: Array<{ value: Typeset; label: string; hint: string }> = [
  { value: 'sans', label: 'Modern', hint: 'Instrument Sans' },
  { value: 'serif', label: 'Editorial', hint: 'Newsreader & Instrument Serif' },
  { value: 'mono', label: 'Technical', hint: 'Geist Mono' },
]

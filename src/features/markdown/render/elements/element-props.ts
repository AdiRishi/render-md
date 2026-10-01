import { type Element } from 'hast'
import { type ComponentProps } from 'react'

/** Props an element component receives from hast-util-to-jsx-runtime. */
export type ElementProps<T extends keyof React.JSX.IntrinsicElements> = ComponentProps<T> & {
  node?: Element
}

/** The source line stamped on a block by the engine (`data-line`). */
export function sourceLineOf(props: object) {
  const value = (props as Record<string, unknown>)['data-line']
  return typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : undefined
}

/**
 * Scroll to an in-document fragment within the nearest `.doc`, instead of
 * changing the page URL (whose fragment may hold a share link).
 */
export function scrollToFragment(event: React.MouseEvent<HTMLAnchorElement>, fragment: string) {
  const root = event.currentTarget.closest('.doc')
  if (!root) return
  let id = fragment
  try {
    id = decodeURIComponent(fragment)
  } catch {
    // Use the raw fragment.
  }
  const target =
    root.querySelector(`[id="${CSS.escape(id)}"]`) ??
    root.querySelector(`[id="user-content-${CSS.escape(id)}"]`)
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

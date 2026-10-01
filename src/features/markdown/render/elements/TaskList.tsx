import { use } from 'react'

import { DocumentContext, ListItemLineContext } from '../context'
import { type ElementProps, sourceLineOf } from './element-props'

/** List items share their source line with any task checkbox inside them. */
export function ListItem({ node: _node, ...props }: ElementProps<'li'>) {
  return (
    <ListItemLineContext value={sourceLineOf(props) ?? null}>
      <li {...props} />
    </ListItemLineContext>
  )
}

/** Task checkboxes are live: ticking one edits the markdown source. */
export function TaskCheckbox({
  node: _node,
  type,
  checked,
  disabled: _disabled,
  ...props
}: ElementProps<'input'>) {
  const { onToggleTask } = use(DocumentContext)
  const line = use(ListItemLineContext)
  if (type !== 'checkbox') return null

  const interactive = Boolean(onToggleTask && line)
  return (
    <input
      {...props}
      type="checkbox"
      checked={Boolean(checked)}
      disabled={!interactive}
      aria-label={checked ? 'Mark as not done' : 'Mark as done'}
      onChange={() => line && onToggleTask?.(line)}
    />
  )
}

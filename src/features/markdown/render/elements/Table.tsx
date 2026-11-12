import { type Element } from 'hast'
import { visit } from 'unist-util-visit'

import { type ElementProps, sourceLineOf } from './element-props'

/** Tables up to this many rows stay on one printed page; longer ones break between rows. */
const SHORT_TABLE_ROWS = 12

function countRows(table: Element) {
  let rows = 0
  visit(table, 'element', (element) => {
    if (element.tagName === 'tr') rows++
  })
  return rows
}

/** Tables scroll horizontally inside their own frame. */
export function Table({ node, ...props }: ElementProps<'table'>) {
  const short = !node || countRows(node) <= SHORT_TABLE_ROWS
  return (
    <div className="table-scroll" data-line={sourceLineOf(props)} data-short={short || undefined}>
      <table {...props} />
    </div>
  )
}

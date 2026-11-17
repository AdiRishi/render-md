import { EditorSelection, type EditorState, type TransactionSpec } from '@codemirror/state'
import { ExternalChange } from '@uiw/react-codemirror'

/**
 * The transaction that turns the editor's document into `value` when it changes
 * outside the editor (a task ticked in the preview, an edit in another tab).
 * Only the text that differs is replaced, so the caret, selection and scroll
 * position elsewhere stay where they were. Returns null when nothing changed.
 */
export function replaceDocument(state: EditorState, value: string): TransactionSpec | null {
  const current = state.doc.toString()
  if (current === value) return null

  const shorter = Math.min(current.length, value.length)
  let start = 0
  while (start < shorter && current.charCodeAt(start) === value.charCodeAt(start)) start++
  let end = 0
  while (
    end < shorter - start &&
    current.charCodeAt(current.length - 1 - end) === value.charCodeAt(value.length - 1 - end)
  )
    end++

  const changes = state.changes({
    from: start,
    to: current.length - end,
    insert: value.slice(start, value.length - end),
  })
  // Map each end on its own. CodeMirror maps a range's two ends towards each other,
  // which turns a selection inside the replaced text inside out (from > to).
  const selection = EditorSelection.create(
    state.selection.ranges.map((range) =>
      EditorSelection.range(changes.mapPos(range.anchor), changes.mapPos(range.head)),
    ),
    state.selection.mainIndex,
  )
  return { changes, selection, annotations: ExternalChange.of(true) }
}

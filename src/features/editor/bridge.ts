import { EditorSelection } from '@codemirror/state'
import { EditorView } from '@codemirror/view'

/**
 * A single shared handle on the CodeMirror view, so toolbars, the command
 * palette and the preview can drive the editor without prop drilling.
 */
let currentView: EditorView | null = null
const listeners = new Set<(view: EditorView | null) => void>()

export function setEditorView(view: EditorView | null) {
  currentView = view
  for (const listener of listeners) listener(view)
}

export function getEditorView() {
  return currentView
}

export function onEditorView(listener: (view: EditorView | null) => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Put the caret at the start of a 1-based line and bring it into view. */
export function revealLine(line: number, { focus = true } = {}) {
  const view = currentView
  if (!view) return
  const target = view.state.doc.line(Math.min(Math.max(1, line), view.state.doc.lines))
  view.dispatch({
    selection: EditorSelection.cursor(target.from),
    effects: EditorView.scrollIntoView(target.from, { y: 'center' }),
  })
  if (focus) view.focus()
}

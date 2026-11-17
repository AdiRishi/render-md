import CodeMirror, {
  type BasicSetupOptions,
  type EditorView,
  type ViewUpdate,
} from '@uiw/react-codemirror'
import { useEffect, useRef, useState } from 'react'

import { setEditorView } from './bridge'
import { createEditorExtensions } from './extensions'
import { replaceDocument } from './replace-document'

const extensions = createEditorExtensions()

const basicSetup: BasicSetupOptions = {
  lineNumbers: true,
  foldGutter: false,
  highlightActiveLine: true,
  highlightActiveLineGutter: true,
  highlightSelectionMatches: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: false,
  indentOnInput: true,
  rectangularSelection: true,
  crosshairCursor: false,
  dropCursor: true,
  searchKeymap: true,
  tabSize: 2,
}

export type CursorPosition = { line: number; column: number; selected: number }

/**
 * CodeMirror 6 configured for markdown: highlighting, formatting shortcuts,
 * link-on-paste. Registers itself with the editor bridge so toolbars and
 * commands can drive it.
 */
export function MarkdownEditor({
  value,
  onChange,
  onCursorChange,
  placeholder = 'Start writing, paste markdown, or drop a file…',
}: {
  value: string
  onChange: (value: string) => void
  /** The caret position while the editor has focus, `null` when it loses it. */
  onCursorChange?: (cursor: CursorPosition | null) => void
  placeholder?: string
}) {
  // CodeMirror gets the first value only. Later outside changes go through replaceDocument:
  // the wrapper would replace the whole document, which moves the caret and scroll position
  // and can turn a selection inside out.
  const [initialValue] = useState(value)
  const viewRef = useRef<EditorView | null>(null)

  useEffect(() => {
    const view = viewRef.current
    const transaction = view && replaceDocument(view.state, value)
    if (transaction) view.dispatch(transaction)
  }, [value])

  const onUpdate = (update: ViewUpdate) => {
    if (!onCursorChange || (!update.selectionSet && !update.focusChanged)) return
    const range = update.state.selection.main
    const line = update.state.doc.lineAt(range.head)
    onCursorChange(
      update.view.hasFocus
        ? {
            line: line.number,
            column: range.head - line.from + 1,
            selected: Math.abs(range.to - range.from),
          }
        : null,
    )
  }

  return (
    <CodeMirror
      value={initialValue}
      onChange={onChange}
      onUpdate={onUpdate}
      onCreateEditor={(view) => {
        viewRef.current = view
        setEditorView(view)
      }}
      extensions={extensions}
      basicSetup={basicSetup}
      theme="none"
      placeholder={placeholder}
      className="h-full"
      height="100%"
    />
  )
}

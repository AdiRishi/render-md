import { type MutableRefObject, useCallback, useEffect, useRef } from 'react'
import CodeMirror, { type BasicSetupOptions } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView } from '@codemirror/view'

import { editorTheme } from '@/lib/editor-theme'

interface MarkdownPaneProps {
  value: string
  onChange: (value: string) => void
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void
  editorViewRef?: MutableRefObject<EditorView | null>
}

const basicSetup: BasicSetupOptions = {
  lineNumbers: true,
  highlightActiveLineGutter: true,
  highlightActiveLine: true,
  foldGutter: false,
  dropCursor: true,
  allowMultipleSelections: true,
  indentOnInput: true,
  bracketMatching: true,
  closeBrackets: true,
  autocompletion: false,
  rectangularSelection: true,
  crosshairCursor: false,
  highlightSelectionMatches: true,
  searchKeymap: true,
  tabSize: 2,
}

export function MarkdownPane({ value, onChange, onScroll, editorViewRef }: MarkdownPaneProps) {
  // Store the current view and scroll handler ref for cleanup
  const viewRef = useRef<EditorView | null>(null)
  const scrollHandlerRef = useRef<(() => void) | null>(null)

  // Called when CodeMirror editor is created and ready
  const handleCreateEditor = useCallback(
    (view: EditorView) => {
      viewRef.current = view

      // Expose the EditorView to parent for programmatic scrolling
      if (editorViewRef) {
        editorViewRef.current = view
      }

      // Set up scroll listener
      if (onScroll) {
        const scrollHandler = () => {
          const { scrollTop, scrollHeight, clientHeight } = view.scrollDOM
          onScroll(scrollTop, scrollHeight, clientHeight)
        }
        scrollHandlerRef.current = scrollHandler
        view.scrollDOM.addEventListener('scroll', scrollHandler, { passive: true })
      }
    },
    [editorViewRef, onScroll],
  )

  // Cleanup scroll listener on unmount
  useEffect(() => {
    return () => {
      if (viewRef.current && scrollHandlerRef.current) {
        viewRef.current.scrollDOM.removeEventListener('scroll', scrollHandlerRef.current)
      }
      if (editorViewRef) {
        editorViewRef.current = null
      }
    }
  }, [editorViewRef])

  return (
    <section className="flex flex-col bg-background relative h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background sticky top-0 z-10">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Markdown
        </span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={value}
          onChange={onChange}
          onCreateEditor={handleCreateEditor}
          theme={editorTheme}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
            EditorView.lineWrapping,
          ]}
          placeholder="Start writing your markdown here..."
          basicSetup={basicSetup}
          className="h-full"
        />
      </div>
    </section>
  )
}

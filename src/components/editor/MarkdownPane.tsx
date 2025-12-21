import CodeMirror, { type BasicSetupOptions } from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView } from '@codemirror/view'

import { editorTheme } from '@/lib/editor-theme'

interface MarkdownPaneProps {
  value: string
  onChange: (value: string) => void
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

export function MarkdownPane({ value, onChange }: MarkdownPaneProps) {
  return (
    <section className="flex flex-col bg-background relative group/editor h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background sticky top-0 z-10 h-[45px]">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Markdown
        </span>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <CodeMirror
          value={value}
          onChange={onChange}
          theme={editorTheme}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
            EditorView.lineWrapping,
          ]}
          placeholder="Start writing your markdown here..."
          basicSetup={basicSetup}
          className="h-full editor-scrollbar"
        />
      </div>
    </section>
  )
}

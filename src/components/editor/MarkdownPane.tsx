import CodeMirror from '@uiw/react-codemirror'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { EditorView } from '@codemirror/view'

import { editorTheme } from '@/lib/editor-theme'

interface MarkdownPaneProps {
  value: string
  onChange: (value: string) => void
}

const defaultContent = `# Welcome to MDViewer

Start typing to see the magic happen in real-time.

## Features

- Live split-screen preview
- **Markdown syntax highlighting**
- Clean, distraction-free interface
- Export to HTML, PDF, or Markdown

### Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> "Markdown is a lightweight markup language for creating formatted text using a plain-text editor."

You can also include [links](https://example.com), images, and tables easily. The preview updates instantly as you type in the editor pane on the left.
`

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
          basicSetup={{
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
          }}
          className="h-full editor-scrollbar"
        />
      </div>

      {/* Editor Status Badge (shown on hover) */}
      <div className="absolute bottom-4 right-6 bg-foreground/80 backdrop-blur text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover/editor:opacity-100 transition-opacity pointer-events-none">
        Markdown
      </div>
    </section>
  )
}

export { defaultContent }

import CodeMirror, { type BasicSetupOptions, type ViewUpdate } from '@uiw/react-codemirror'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Image,
  Italic,
  Link,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
  Sigma,
  SquareCode,
  Strikethrough,
  Table,
  Workflow,
} from 'lucide-react'
import { type ReactNode } from 'react'

import { Kbd } from '@/components/ui/kbd'
import { Tooltip } from '@/components/ui/tooltip'
import { setEditorView, getEditorView } from '@/lib/editor/bridge'
import { type FormatCommand, formatting } from '@/lib/editor/commands'
import { createEditorExtensions } from '@/lib/editor/extensions'
import { modKey } from '@/lib/utils'
import { useDocumentStore } from '@/stores/document-store'
import { useUiStore } from '@/stores/ui-store'

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

type Tool = { command: FormatCommand; label: string; icon: ReactNode; keys?: string[] }

const TOOL_GROUPS: Tool[][] = [
  [
    { command: 'h1', label: 'Heading 1', icon: <Heading1 />, keys: ['Mod', 'Alt', '1'] },
    { command: 'h2', label: 'Heading 2', icon: <Heading2 />, keys: ['Mod', 'Alt', '2'] },
    { command: 'h3', label: 'Heading 3', icon: <Heading3 />, keys: ['Mod', 'Alt', '3'] },
  ],
  [
    { command: 'bold', label: 'Bold', icon: <Bold />, keys: ['Mod', 'B'] },
    { command: 'italic', label: 'Italic', icon: <Italic />, keys: ['Mod', 'I'] },
    {
      command: 'strike',
      label: 'Strikethrough',
      icon: <Strikethrough />,
      keys: ['Mod', 'Shift', 'X'],
    },
    { command: 'code', label: 'Inline code', icon: <Code />, keys: ['Mod', 'E'] },
  ],
  [
    { command: 'link', label: 'Link — or paste a URL over selected text', icon: <Link /> },
    { command: 'image', label: 'Image', icon: <Image /> },
  ],
  [
    { command: 'bullet', label: 'Bulleted list', icon: <List />, keys: ['Mod', 'Shift', '8'] },
    {
      command: 'numbered',
      label: 'Numbered list',
      icon: <ListOrdered />,
      keys: ['Mod', 'Shift', '7'],
    },
    { command: 'task', label: 'Task list', icon: <ListChecks />, keys: ['Mod', 'Shift', '9'] },
    { command: 'quote', label: 'Quote', icon: <Quote /> },
  ],
  [
    { command: 'codeBlock', label: 'Code block', icon: <SquareCode /> },
    { command: 'table', label: 'Table', icon: <Table /> },
    { command: 'math', label: 'Math', icon: <Sigma /> },
    { command: 'diagram', label: 'Mermaid diagram', icon: <Workflow /> },
    { command: 'rule', label: 'Divider', icon: <Minus /> },
  ],
]

function Toolbar() {
  const mod = modKey()
  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="flex h-10 shrink-0 [scrollbar-width:none] items-center gap-0.5 overflow-x-auto border-b border-rule px-2.5"
    >
      {TOOL_GROUPS.map((group, index) => (
        <div key={index} className="flex items-center gap-0.5">
          {index > 0 ? <span className="mx-1.5 h-4 w-px bg-rule" aria-hidden /> : null}
          {group.map((tool) => (
            <Tooltip
              key={tool.command}
              label={tool.label}
              shortcut={tool.keys?.map((key) => (
                <Kbd key={key}>
                  {key === 'Mod'
                    ? mod
                    : key === 'Alt'
                      ? mod === '⌘'
                        ? '⌥'
                        : 'Alt'
                      : key === 'Shift'
                        ? '⇧'
                        : key}
                </Kbd>
              ))}
            >
              <button
                type="button"
                aria-label={tool.label}
                // Keep focus (and the selection) in the editor.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  const view = getEditorView()
                  if (view) formatting[tool.command](view)
                }}
                className="grid size-7 shrink-0 place-items-center rounded-md text-ink-3 transition-colors hover:bg-desk-2 hover:text-ink [&_svg]:size-[15px]"
              >
                {tool.icon}
              </button>
            </Tooltip>
          ))}
        </div>
      ))}
    </div>
  )
}

export function EditorPane() {
  const markdown = useDocumentStore((state) => state.markdown)
  // A fresh editor per loaded document: undo history must never cross files.
  const loadKey = useDocumentStore((state) => state.loadKey)
  const setMarkdown = useDocumentStore((state) => state.setMarkdown)
  const setCursor = useUiStore((state) => state.setCursor)

  const onUpdate = (update: ViewUpdate) => {
    if (!update.selectionSet && !update.focusChanged) return
    const { state } = update
    const range = state.selection.main
    const line = state.doc.lineAt(range.head)
    setCursor(
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
    <div className="flex h-full min-h-0 flex-col bg-paper">
      <Toolbar />
      <div className="min-h-0 flex-1">
        <CodeMirror
          key={loadKey}
          value={markdown}
          onChange={setMarkdown}
          onUpdate={onUpdate}
          onCreateEditor={(view) => setEditorView(view)}
          extensions={extensions}
          basicSetup={basicSetup}
          theme="none"
          placeholder="Start writing, paste markdown, or drop a file…"
          className="h-full"
          height="100%"
        />
      </div>
    </div>
  )
}

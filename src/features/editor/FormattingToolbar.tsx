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

import { modKey } from '@/lib/platform'
import { Kbd } from '@/ui/Kbd'
import { Tooltip } from '@/ui/Tooltip'

import { getEditorView } from './bridge'
import { type FormatCommand, formatting } from './commands'

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

/** Markdown formatting buttons that drive the active editor via the bridge. */
export function FormattingToolbar() {
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

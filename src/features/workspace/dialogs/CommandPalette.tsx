import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import {
  ArrowDownUp,
  BookOpen,
  ClipboardPaste,
  Code2,
  Columns2,
  Copy,
  FileDown,
  FilePlus2,
  FileText,
  FolderOpen,
  Globe,
  Hash,
  Laptop,
  Link2,
  ListTree,
  Moon,
  PenLine,
  Printer,
  Save,
  Search,
  Sparkles,
  Sun,
  Type,
  Workflow,
} from 'lucide-react'

import { getEditorView } from '@/features/editor/bridge'
import { type FormatCommand, formatting } from '@/features/editor/commands'
import { type HeadingEntry } from '@/features/markdown/engine/pipeline'
import { guessTitle } from '@/features/markdown/engine/source'
import { TYPESETS } from '@/features/markdown/render/typesets'
import { useTheme } from '@/features/theme/ThemeProvider'
import { formatRelativeTime } from '@/lib/format'
import { modKey } from '@/lib/platform'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/ui/Command'

import { documentActions } from '../actions'
import { useDocumentStore } from '../state/document-store'
import { useSettingsStore } from '../state/settings-store'
import { useUiStore } from '../state/ui-store'

const INSERTS: Array<{ command: FormatCommand; label: string }> = [
  { command: 'table', label: 'Insert table' },
  { command: 'codeBlock', label: 'Insert code block' },
  { command: 'math', label: 'Insert math block' },
  { command: 'diagram', label: 'Insert Mermaid diagram' },
  { command: 'alert', label: 'Insert callout' },
  { command: 'task', label: 'Toggle task list' },
  { command: 'rule', label: 'Insert divider' },
]

export function CommandPalette({ headings }: { headings: HeadingEntry[] }) {
  const open = useUiStore((state) => state.dialog === 'palette')
  const openDialog = useUiStore((state) => state.openDialog)
  const closeDialog = useUiStore((state) => state.closeDialog)
  const recents = useDocumentStore((state) => state.recents)
  const restoreRecent = useDocumentStore((state) => state.restoreRecent)
  const settings = useSettingsStore()
  const { setPreference } = useTheme()
  const mod = modKey()

  const run = (action: () => unknown) => () => {
    closeDialog()
    // Let the dialog close before actions that open pickers or other dialogs.
    requestAnimationFrame(() => void action())
  }

  const jumpTo = (heading: HeadingEntry) => {
    if (settings.viewMode === 'write') settings.set('viewMode', 'split')
    requestAnimationFrame(() => {
      document
        .querySelector(`.doc [id="${CSS.escape(heading.id)}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && closeDialog()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/20 backdrop-blur-[2px] transition-opacity duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:bg-black/50" />
        <DialogPrimitive.Popup className="fixed top-[12vh] left-1/2 z-50 w-[min(38rem,calc(100vw-1.5rem))] -translate-x-1/2 overflow-hidden rounded-2xl bg-paper shadow-float transition-[opacity,scale] duration-150 outline-none data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0">
          <DialogPrimitive.Title className="sr-only">Command palette</DialogPrimitive.Title>
          <Command loop className="flex max-h-[min(34rem,70vh)] flex-col">
            <div className="flex items-center gap-3 border-b border-rule px-4">
              <Search className="size-4 shrink-0 text-ink-3" />
              <CommandInput autoFocus placeholder="Type a command or search…" />
              <kbd className="font-mono text-[10.5px] text-ink-4">ESC</kbd>
            </div>
            <CommandList>
              <CommandEmpty>Nothing matches that.</CommandEmpty>

              <CommandGroup heading="Document">
                <CommandItem
                  icon={<FolderOpen />}
                  hint={`${mod} O`}
                  onSelect={run(documentActions.openFile)}
                >
                  Open file…
                </CommandItem>
                <CommandItem
                  icon={<Globe />}
                  keywords={['github', 'gist', 'web', 'link']}
                  onSelect={run(() => openDialog('open-url'))}
                >
                  Open from URL…
                </CommandItem>
                <CommandItem
                  icon={<ClipboardPaste />}
                  onSelect={run(documentActions.pasteFromClipboard)}
                >
                  Paste from clipboard
                </CommandItem>
                <CommandItem
                  icon={<FilePlus2 />}
                  keywords={['new', 'clear', 'empty']}
                  onSelect={run(documentActions.newDocument)}
                >
                  Blank page
                </CommandItem>
                <CommandItem
                  icon={<Sparkles />}
                  keywords={['sample', 'demo', 'example']}
                  onSelect={run(documentActions.loadSample)}
                >
                  Load the field guide
                </CommandItem>
                <CommandItem icon={<Link2 />} onSelect={run(() => openDialog('share'))}>
                  Share link…
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Export">
                <CommandItem
                  icon={<Copy />}
                  keywords={['rich', 'html', 'docs', 'gmail']}
                  onSelect={run(documentActions.copyRichText)}
                >
                  Copy formatted text
                </CommandItem>
                <CommandItem icon={<Code2 />} onSelect={run(documentActions.copyMarkdown)}>
                  Copy markdown
                </CommandItem>
                <CommandItem icon={<Save />} hint={`${mod} S`} onSelect={run(documentActions.save)}>
                  Save markdown file
                </CommandItem>
                <CommandItem icon={<FileDown />} onSelect={run(documentActions.downloadHtml)}>
                  Download as web page (.html)
                </CommandItem>
                <CommandItem
                  icon={<Printer />}
                  keywords={['pdf']}
                  hint={`${mod} P`}
                  onSelect={run(documentActions.print)}
                >
                  Print or save as PDF
                </CommandItem>
              </CommandGroup>

              {headings.length > 0 ? (
                <CommandGroup heading="Jump to">
                  {headings.map((heading) => (
                    <CommandItem
                      key={heading.id}
                      icon={<Hash />}
                      keywords={['heading', 'section']}
                      onSelect={run(() => jumpTo(heading))}
                    >
                      <span style={{ paddingInlineStart: `${(heading.depth - 1) * 0.75}rem` }}>
                        {heading.text}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              <CommandGroup heading="View">
                <CommandItem
                  icon={<PenLine />}
                  onSelect={run(() => settings.set('viewMode', 'write'))}
                >
                  Write mode
                </CommandItem>
                <CommandItem
                  icon={<Columns2 />}
                  onSelect={run(() => settings.set('viewMode', 'split'))}
                >
                  Split mode
                </CommandItem>
                <CommandItem
                  icon={<BookOpen />}
                  keywords={['preview', 'reader']}
                  onSelect={run(() => settings.set('viewMode', 'read'))}
                >
                  Read mode
                </CommandItem>
                <CommandItem
                  icon={<ListTree />}
                  keywords={['toc', 'contents']}
                  onSelect={run(() => settings.set('showOutline', !settings.showOutline))}
                >
                  {settings.showOutline ? 'Hide' : 'Show'} outline when reading
                </CommandItem>
                <CommandItem
                  icon={<ArrowDownUp />}
                  onSelect={run(() => settings.set('syncScroll', !settings.syncScroll))}
                >
                  Turn scroll sync {settings.syncScroll ? 'off' : 'on'}
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Typeset">
                {TYPESETS.map((typeset) => (
                  <CommandItem
                    key={typeset.value}
                    icon={<Type />}
                    keywords={['font', typeset.hint]}
                    hint={settings.typeset === typeset.value ? 'current' : undefined}
                    onSelect={run(() => settings.set('typeset', typeset.value))}
                  >
                    {typeset.label} <span className="text-ink-3">— {typeset.hint}</span>
                  </CommandItem>
                ))}
                <CommandItem
                  icon={<Workflow />}
                  keywords={['mermaid', 'hand drawn', 'sketch']}
                  onSelect={run(() =>
                    settings.set(
                      'diagramLook',
                      settings.diagramLook === 'clean' ? 'sketch' : 'clean',
                    ),
                  )}
                >
                  Diagrams: use {settings.diagramLook === 'clean' ? 'sketch' : 'clean'} look
                </CommandItem>
              </CommandGroup>

              <CommandGroup heading="Appearance">
                <CommandItem
                  icon={<Sun />}
                  keywords={['theme']}
                  onSelect={run(() => setPreference('light'))}
                >
                  Light theme
                </CommandItem>
                <CommandItem
                  icon={<Moon />}
                  keywords={['theme']}
                  onSelect={run(() => setPreference('dark'))}
                >
                  Dark theme
                </CommandItem>
                <CommandItem
                  icon={<Laptop />}
                  keywords={['theme', 'auto']}
                  onSelect={run(() => setPreference('system'))}
                >
                  Match system theme
                </CommandItem>
              </CommandGroup>

              {settings.viewMode !== 'read' ? (
                <CommandGroup heading="Insert">
                  {INSERTS.map((insert) => (
                    <CommandItem
                      key={insert.command}
                      icon={<PenLine />}
                      onSelect={run(() => {
                        const view = getEditorView()
                        if (view) formatting[insert.command](view)
                      })}
                    >
                      {insert.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {recents.length > 0 ? (
                <CommandGroup heading="Recent">
                  {recents.map((recent) => (
                    <CommandItem
                      key={recent.id}
                      icon={<FileText />}
                      hint={formatRelativeTime(recent.updatedAt)}
                      onSelect={run(() => restoreRecent(recent.id))}
                    >
                      {recent.name ?? guessTitle(recent.markdown) ?? 'Untitled'}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

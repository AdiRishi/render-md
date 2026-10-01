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
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/ui/command'

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
    <CommandDialog
      open={open}
      onOpenChange={(next) => !next && closeDialog()}
      title="Command palette"
      description="Search for a command to run, a heading to jump to or a recent document."
      className="top-[12vh] sm:max-w-xl"
    >
      <Command
        loop
        className="**:[[cmdk-group-heading]]:pt-3 **:[[cmdk-group-heading]]:label-caps **:[[cmdk-group-heading]]:text-ink-3"
      >
        <CommandInput autoFocus placeholder="Type a command or search…" />
        <CommandList className="max-h-[min(28rem,60vh)]">
          <CommandEmpty>Nothing matches that.</CommandEmpty>

          <CommandGroup heading="Document">
            <CommandItem onSelect={run(documentActions.openFile)}>
              <FolderOpen />
              Open file…
              <CommandShortcut>{`${mod} O`}</CommandShortcut>
            </CommandItem>
            <CommandItem
              keywords={['github', 'gist', 'web', 'link']}
              onSelect={run(() => openDialog('open-url'))}
            >
              <Globe />
              Open from URL…
            </CommandItem>
            <CommandItem onSelect={run(documentActions.pasteFromClipboard)}>
              <ClipboardPaste />
              Paste from clipboard
            </CommandItem>
            <CommandItem
              keywords={['new', 'clear', 'empty']}
              onSelect={run(documentActions.newDocument)}
            >
              <FilePlus2 />
              Blank page
            </CommandItem>
            <CommandItem
              keywords={['sample', 'demo', 'example']}
              onSelect={run(documentActions.loadSample)}
            >
              <Sparkles />
              Load the field guide
            </CommandItem>
            <CommandItem onSelect={run(() => openDialog('share'))}>
              <Link2 />
              Share link…
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Export">
            <CommandItem
              keywords={['rich', 'html', 'docs', 'gmail']}
              onSelect={run(documentActions.copyRichText)}
            >
              <Copy />
              Copy formatted text
            </CommandItem>
            <CommandItem onSelect={run(documentActions.copyMarkdown)}>
              <Code2 />
              Copy markdown
            </CommandItem>
            <CommandItem onSelect={run(documentActions.save)}>
              <Save />
              Save markdown file
              <CommandShortcut>{`${mod} S`}</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={run(documentActions.downloadHtml)}>
              <FileDown />
              Download as web page (.html)
            </CommandItem>
            <CommandItem keywords={['pdf']} onSelect={run(documentActions.print)}>
              <Printer />
              Print or save as PDF
              <CommandShortcut>{`${mod} P`}</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          {headings.length > 0 ? (
            <CommandGroup heading="Jump to">
              {headings.map((heading) => (
                <CommandItem
                  key={heading.id}
                  keywords={['heading', 'section']}
                  onSelect={run(() => jumpTo(heading))}
                >
                  <Hash />
                  <span style={{ paddingInlineStart: `${(heading.depth - 1) * 0.75}rem` }}>
                    {heading.text}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          <CommandGroup heading="View">
            <CommandItem onSelect={run(() => settings.set('viewMode', 'write'))}>
              <PenLine />
              Write mode
            </CommandItem>
            <CommandItem onSelect={run(() => settings.set('viewMode', 'split'))}>
              <Columns2 />
              Split mode
            </CommandItem>
            <CommandItem
              keywords={['preview', 'reader']}
              onSelect={run(() => settings.set('viewMode', 'read'))}
            >
              <BookOpen />
              Read mode
            </CommandItem>
            <CommandItem
              keywords={['toc', 'contents']}
              onSelect={run(() => settings.set('showOutline', !settings.showOutline))}
            >
              <ListTree />
              {settings.showOutline ? 'Hide' : 'Show'} outline when reading
            </CommandItem>
            <CommandItem onSelect={run(() => settings.set('syncScroll', !settings.syncScroll))}>
              <ArrowDownUp />
              Turn scroll sync {settings.syncScroll ? 'off' : 'on'}
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Typeset">
            {TYPESETS.map((typeset) => (
              <CommandItem
                key={typeset.value}
                keywords={['font', typeset.hint]}
                onSelect={run(() => settings.set('typeset', typeset.value))}
              >
                <Type />
                {typeset.label} <span className="text-ink-3">— {typeset.hint}</span>
                {settings.typeset === typeset.value ? (
                  <CommandShortcut>'current'</CommandShortcut>
                ) : null}
              </CommandItem>
            ))}
            <CommandItem
              keywords={['mermaid', 'hand drawn', 'sketch']}
              onSelect={run(() =>
                settings.set('diagramLook', settings.diagramLook === 'clean' ? 'sketch' : 'clean'),
              )}
            >
              <Workflow />
              Diagrams: use {settings.diagramLook === 'clean' ? 'sketch' : 'clean'} look
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Appearance">
            <CommandItem keywords={['theme']} onSelect={run(() => setPreference('light'))}>
              <Sun />
              Light theme
            </CommandItem>
            <CommandItem keywords={['theme']} onSelect={run(() => setPreference('dark'))}>
              <Moon />
              Dark theme
            </CommandItem>
            <CommandItem keywords={['theme', 'auto']} onSelect={run(() => setPreference('system'))}>
              <Laptop />
              Match system theme
            </CommandItem>
          </CommandGroup>

          {settings.viewMode !== 'read' ? (
            <CommandGroup heading="Insert">
              {INSERTS.map((insert) => (
                <CommandItem
                  key={insert.command}
                  onSelect={run(() => {
                    const view = getEditorView()
                    if (view) formatting[insert.command](view)
                  })}
                >
                  <PenLine />
                  {insert.label}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}

          {recents.length > 0 ? (
            <CommandGroup heading="Recent">
              {recents.map((recent) => (
                <CommandItem key={recent.id} onSelect={run(() => restoreRecent(recent.id))}>
                  <FileText />
                  {recent.name ?? guessTitle(recent.markdown) ?? 'Untitled'}
                  <CommandShortcut>{formatRelativeTime(recent.updatedAt)}</CommandShortcut>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}

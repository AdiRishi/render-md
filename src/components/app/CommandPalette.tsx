import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Command } from 'cmdk'
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
import { type ReactNode } from 'react'

import { useTheme } from '@/components/theme-provider'
import { documentActions } from '@/hooks/use-document-actions'
import { getEditorView } from '@/lib/editor/bridge'
import { type FormatCommand, formatting } from '@/lib/editor/commands'
import { type HeadingEntry } from '@/lib/markdown/pipeline'
import { guessTitle } from '@/lib/markdown/source'
import { formatRelativeTime, modKey } from '@/lib/utils'
import { useDocumentStore } from '@/stores/document-store'
import { TYPESETS, useSettingsStore } from '@/stores/settings-store'
import { useUiStore } from '@/stores/ui-store'

function Item({
  icon,
  children,
  hint,
  onSelect,
  keywords,
}: {
  icon: ReactNode
  children: ReactNode
  hint?: ReactNode
  onSelect: () => void
  keywords?: string[]
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      keywords={keywords}
      className="flex h-9 cursor-default items-center gap-3 rounded-lg px-2.5 text-[13.5px] text-ink-2 select-none data-[selected=true]:bg-desk-2 data-[selected=true]:text-ink [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-ink-3"
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {hint ? <span className="font-mono text-[11px] text-ink-3">{hint}</span> : null}
    </Command.Item>
  )
}

function Group({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <Command.Group
      heading={heading}
      className="px-1.5 pb-1 [&_[cmdk-group-heading]]:px-2.5 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:label-caps [&_[cmdk-group-heading]]:text-ink-3"
    >
      {children}
    </Command.Group>
  )
}

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
              <Command.Input
                autoFocus
                placeholder="Type a command or search…"
                className="h-13 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-4"
              />
              <kbd className="font-mono text-[10.5px] text-ink-4">ESC</kbd>
            </div>
            <Command.List className="min-h-0 flex-1 scrollbar-quiet overflow-y-auto py-1">
              <Command.Empty className="px-4 py-10 text-center text-sm text-ink-3">
                Nothing matches that.
              </Command.Empty>

              <Group heading="Document">
                <Item
                  icon={<FolderOpen />}
                  hint={`${mod} O`}
                  onSelect={run(documentActions.openFile)}
                >
                  Open file…
                </Item>
                <Item
                  icon={<Globe />}
                  keywords={['github', 'gist', 'web', 'link']}
                  onSelect={run(() => openDialog('open-url'))}
                >
                  Open from URL…
                </Item>
                <Item icon={<ClipboardPaste />} onSelect={run(documentActions.pasteFromClipboard)}>
                  Paste from clipboard
                </Item>
                <Item
                  icon={<FilePlus2 />}
                  keywords={['new', 'clear', 'empty']}
                  onSelect={run(documentActions.newDocument)}
                >
                  Blank page
                </Item>
                <Item
                  icon={<Sparkles />}
                  keywords={['sample', 'demo', 'example']}
                  onSelect={run(documentActions.loadSample)}
                >
                  Load the field guide
                </Item>
                <Item icon={<Link2 />} onSelect={run(() => openDialog('share'))}>
                  Share link…
                </Item>
              </Group>

              <Group heading="Export">
                <Item
                  icon={<Copy />}
                  keywords={['rich', 'html', 'docs', 'gmail']}
                  onSelect={run(documentActions.copyRichText)}
                >
                  Copy formatted text
                </Item>
                <Item icon={<Code2 />} onSelect={run(documentActions.copyMarkdown)}>
                  Copy markdown
                </Item>
                <Item icon={<Save />} hint={`${mod} S`} onSelect={run(documentActions.save)}>
                  Save markdown file
                </Item>
                <Item icon={<FileDown />} onSelect={run(documentActions.downloadHtml)}>
                  Download as web page (.html)
                </Item>
                <Item
                  icon={<Printer />}
                  keywords={['pdf']}
                  hint={`${mod} P`}
                  onSelect={run(documentActions.print)}
                >
                  Print or save as PDF
                </Item>
              </Group>

              {headings.length > 0 ? (
                <Group heading="Jump to">
                  {headings.map((heading) => (
                    <Item
                      key={heading.id}
                      icon={<Hash />}
                      keywords={['heading', 'section']}
                      onSelect={run(() => jumpTo(heading))}
                    >
                      <span style={{ paddingInlineStart: `${(heading.depth - 1) * 0.75}rem` }}>
                        {heading.text}
                      </span>
                    </Item>
                  ))}
                </Group>
              ) : null}

              <Group heading="View">
                <Item icon={<PenLine />} onSelect={run(() => settings.set('viewMode', 'write'))}>
                  Write mode
                </Item>
                <Item icon={<Columns2 />} onSelect={run(() => settings.set('viewMode', 'split'))}>
                  Split mode
                </Item>
                <Item
                  icon={<BookOpen />}
                  keywords={['preview', 'reader']}
                  onSelect={run(() => settings.set('viewMode', 'read'))}
                >
                  Read mode
                </Item>
                <Item
                  icon={<ListTree />}
                  keywords={['toc', 'contents']}
                  onSelect={run(() => settings.set('showOutline', !settings.showOutline))}
                >
                  {settings.showOutline ? 'Hide' : 'Show'} outline when reading
                </Item>
                <Item
                  icon={<ArrowDownUp />}
                  onSelect={run(() => settings.set('syncScroll', !settings.syncScroll))}
                >
                  Turn scroll sync {settings.syncScroll ? 'off' : 'on'}
                </Item>
              </Group>

              <Group heading="Typeset">
                {TYPESETS.map((typeset) => (
                  <Item
                    key={typeset.value}
                    icon={<Type />}
                    keywords={['font', typeset.hint]}
                    hint={settings.typeset === typeset.value ? 'current' : undefined}
                    onSelect={run(() => settings.set('typeset', typeset.value))}
                  >
                    {typeset.label} <span className="text-ink-3">— {typeset.hint}</span>
                  </Item>
                ))}
                <Item
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
                </Item>
              </Group>

              <Group heading="Appearance">
                <Item
                  icon={<Sun />}
                  keywords={['theme']}
                  onSelect={run(() => setPreference('light'))}
                >
                  Light theme
                </Item>
                <Item
                  icon={<Moon />}
                  keywords={['theme']}
                  onSelect={run(() => setPreference('dark'))}
                >
                  Dark theme
                </Item>
                <Item
                  icon={<Laptop />}
                  keywords={['theme', 'auto']}
                  onSelect={run(() => setPreference('system'))}
                >
                  Match system theme
                </Item>
              </Group>

              {settings.viewMode !== 'read' ? (
                <Group heading="Insert">
                  {INSERTS.map((insert) => (
                    <Item
                      key={insert.command}
                      icon={<PenLine />}
                      onSelect={run(() => {
                        const view = getEditorView()
                        if (view) formatting[insert.command](view)
                      })}
                    >
                      {insert.label}
                    </Item>
                  ))}
                </Group>
              ) : null}

              {recents.length > 0 ? (
                <Group heading="Recent">
                  {recents.map((recent) => (
                    <Item
                      key={recent.id}
                      icon={<FileText />}
                      hint={formatRelativeTime(recent.updatedAt)}
                      onSelect={run(() => restoreRecent(recent.id))}
                    >
                      {recent.name ?? guessTitle(recent.markdown) ?? 'Untitled'}
                    </Item>
                  ))}
                </Group>
              ) : null}
            </Command.List>
          </Command>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

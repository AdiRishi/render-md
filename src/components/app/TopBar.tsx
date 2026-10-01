import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  ClipboardPaste,
  Clock,
  Code2,
  Columns2,
  Copy,
  Download,
  FileDown,
  FilePlus2,
  FileText,
  FolderOpen,
  Globe,
  Link2,
  MoreHorizontal,
  PenLine,
  Printer,
  Search,
  Sparkles,
  Trash2,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Kbd } from '@/components/ui/kbd'
import {
  Menu,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  MenuSubmenu,
  MenuSubmenuTrigger,
  MenuTrigger,
} from '@/components/ui/menu'
import { Tooltip } from '@/components/ui/tooltip'
import { documentActions } from '@/hooks/use-document-actions'
import { guessTitle } from '@/lib/markdown/source'
import { cn, formatRelativeTime, modKey } from '@/lib/utils'
import { type DocumentSource, useDocumentStore } from '@/stores/document-store'
import { type ViewMode, useSettingsStore } from '@/stores/settings-store'
import { useUiStore } from '@/stores/ui-store'

import { BrandMark, Wordmark } from './Brand'
import { ReaderSettings } from './ReaderSettings'
import { ThemeToggle } from './ThemeToggle'

const VIEW_MODES: Array<{ value: ViewMode; label: string; icon: typeof PenLine; mobile: boolean }> =
  [
    { value: 'write', label: 'Write', icon: PenLine, mobile: true },
    { value: 'split', label: 'Split', icon: Columns2, mobile: false },
    { value: 'read', label: 'Read', icon: BookOpen, mobile: true },
  ]

const SOURCE_LABEL: Record<DocumentSource, string> = {
  sample: 'Field guide',
  local: 'Draft',
  file: 'File',
  url: 'Web',
  shared: 'Shared',
}

export function ViewSwitch() {
  const viewMode = useSettingsStore((state) => state.viewMode)
  const setSetting = useSettingsStore((state) => state.set)

  return (
    <div role="radiogroup" aria-label="View" className="flex rounded-lg bg-desk-2 p-0.5">
      {VIEW_MODES.map(({ value, label, icon: Icon, mobile }) => {
        const active = viewMode === value
        // On phones there's no split view; it falls back to Write.
        const mobileActive = value === 'write' && viewMode === 'split'
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setSetting('viewMode', value)}
            className={cn(
              'flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-medium transition-all duration-150 max-md:px-3',
              !mobile && 'max-md:hidden',
              active
                ? 'bg-paper text-ink shadow-[0_1px_2px_rgb(var(--shadow-ink)/0.14),0_0_0_1px_rgb(var(--shadow-ink)/0.06)]'
                : 'text-ink-3 hover:text-ink',
              mobileActive &&
                'max-md:bg-paper max-md:text-ink max-md:shadow-[0_1px_2px_rgb(var(--shadow-ink)/0.14),0_0_0_1px_rgb(var(--shadow-ink)/0.06)]',
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

function DocumentTitle() {
  const markdown = useDocumentStore((state) => state.markdown)
  const name = useDocumentStore((state) => state.name)
  const source = useDocumentStore((state) => state.source)
  const title = name ?? guessTitle(markdown) ?? 'Untitled'

  return (
    <div className="flex min-w-0 items-center gap-2.5 max-lg:hidden">
      <span className="h-4 w-px rotate-[18deg] bg-rule-strong" aria-hidden />
      <span className="truncate text-[13px] font-medium text-ink-2" title={title}>
        {title}
      </span>
      <span className="shrink-0 rounded-[4px] px-1.5 py-0.5 label-caps text-[9.5px] text-ink-3 shadow-[inset_0_0_0_1px_var(--rule-strong)]">
        {SOURCE_LABEL[source]}
      </span>
    </div>
  )
}

function RecentItems() {
  const recents = useDocumentStore((state) => state.recents)
  const restoreRecent = useDocumentStore((state) => state.restoreRecent)
  const clearRecents = useDocumentStore((state) => state.clearRecents)

  if (recents.length === 0) {
    return <p className="px-2 py-3 text-[12.5px] text-ink-3">Documents you replace show up here.</p>
  }

  return (
    <>
      {recents.map((recent) => (
        <MenuItem
          key={recent.id}
          onClick={() => restoreRecent(recent.id)}
          className="h-auto py-1.5"
        >
          <FileText />
          <span className="flex min-w-0 flex-col">
            <span className="truncate">
              {recent.name ?? guessTitle(recent.markdown) ?? 'Untitled'}
            </span>
            <span className="text-[11px] text-ink-3">{formatRelativeTime(recent.updatedAt)}</span>
          </span>
        </MenuItem>
      ))}
      <MenuSeparator />
      <MenuItem onClick={clearRecents}>
        <Trash2 />
        Clear history
      </MenuItem>
    </>
  )
}

function OpenMenuItems() {
  const openDialog = useUiStore((state) => state.openDialog)
  const mod = modKey()
  return (
    <>
      <MenuItem onClick={() => void documentActions.openFile()} hint={`${mod} O`}>
        <FolderOpen />
        Open file…
      </MenuItem>
      <MenuItem onClick={() => openDialog('open-url')}>
        <Globe />
        Open from URL…
      </MenuItem>
      <MenuItem onClick={() => void documentActions.pasteFromClipboard()}>
        <ClipboardPaste />
        Paste from clipboard
      </MenuItem>
      <MenuSeparator />
      <MenuItem onClick={documentActions.newDocument}>
        <FilePlus2 />
        Blank page
      </MenuItem>
      <MenuItem onClick={documentActions.loadSample}>
        <Sparkles />
        Field guide
      </MenuItem>
      <MenuSeparator />
      <MenuSubmenu>
        <MenuSubmenuTrigger>
          <Clock />
          Recent
        </MenuSubmenuTrigger>
        <MenuContent side="left" align="start" sideOffset={4} className="w-64">
          <RecentItems />
        </MenuContent>
      </MenuSubmenu>
    </>
  )
}

function ExportMenuItems() {
  const mod = modKey()
  return (
    <>
      <MenuGroup>
        <MenuLabel>Copy</MenuLabel>
        <MenuItem onClick={() => void documentActions.copyRichText()}>
          <Copy />
          Formatted text
        </MenuItem>
        <MenuItem onClick={() => void documentActions.copyMarkdown()}>
          <Code2 />
          Markdown
        </MenuItem>
      </MenuGroup>
      <MenuSeparator />
      <MenuGroup>
        <MenuLabel>Download</MenuLabel>
        <MenuItem onClick={() => void documentActions.save()} hint={`${mod} S`}>
          <FileDown />
          Markdown (.md)
        </MenuItem>
        <MenuItem onClick={documentActions.downloadHtml}>
          <FileText />
          Web page (.html)
        </MenuItem>
        <MenuItem onClick={documentActions.print} hint={`${mod} P`}>
          <Printer />
          Print or save as PDF
        </MenuItem>
      </MenuGroup>
    </>
  )
}

export function TopBar() {
  const openDialog = useUiStore((state) => state.openDialog)
  const mod = modKey()

  return (
    <header className="relative z-20 flex h-13 shrink-0 items-center gap-3 border-b border-rule bg-desk px-3 md:px-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2.5 rounded-md outline-offset-4"
          aria-label="RenderMD home"
        >
          <BrandMark className="size-[26px]" />
          <Wordmark className="max-sm:hidden" />
        </Link>
        <DocumentTitle />
      </div>

      <ViewSwitch />

      <div className="flex flex-1 items-center justify-end gap-1">
        <div className="flex items-center gap-1 max-md:hidden">
          <Menu>
            <MenuTrigger render={<Button className="gap-1.5 px-2.5" />}>
              <FolderOpen />
              <span className="max-xl:hidden">Open</span>
            </MenuTrigger>
            <MenuContent align="end">
              <OpenMenuItems />
            </MenuContent>
          </Menu>

          <Menu>
            <MenuTrigger render={<Button className="gap-1.5 px-2.5" />}>
              <Download />
              <span className="max-xl:hidden">Export</span>
            </MenuTrigger>
            <MenuContent align="end">
              <ExportMenuItems />
            </MenuContent>
          </Menu>
        </div>

        <ReaderSettings />
        <ThemeToggle />

        <Menu>
          <MenuTrigger render={<Button size="icon" aria-label="More" className="md:hidden" />}>
            <MoreHorizontal />
          </MenuTrigger>
          <MenuContent align="end" className="w-64">
            <OpenMenuItems />
            <MenuSeparator />
            <ExportMenuItems />
          </MenuContent>
        </Menu>

        <Tooltip
          label="Command palette"
          shortcut={
            <>
              <Kbd>{mod}</Kbd>
              <Kbd>K</Kbd>
            </>
          }
        >
          <Button
            size="icon"
            aria-label="Command palette"
            onClick={() => openDialog('palette')}
            className="max-sm:hidden"
          >
            <Search />
          </Button>
        </Tooltip>

        <Button
          variant="primary"
          size="md"
          className="ms-1.5 gap-1.5 max-sm:px-2.5"
          onClick={() => openDialog('share')}
        >
          <Link2 />
          <span className="max-sm:hidden">Share</span>
        </Button>
      </div>
    </header>
  )
}

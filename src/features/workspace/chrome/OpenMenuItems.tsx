import {
  ClipboardPaste,
  Clock,
  FilePlus2,
  FileText,
  FolderOpen,
  Globe,
  Sparkles,
  Trash2,
} from 'lucide-react'

import { guessTitle } from '@/features/markdown/engine/source'
import { formatRelativeTime } from '@/lib/format'
import { modKey } from '@/lib/platform'
import { MenuContent, MenuItem, MenuSeparator, MenuSubmenu, MenuSubmenuTrigger } from '@/ui/Menu'

import { documentActions } from '../actions'
import { useDocumentStore } from '../state/document-store'
import { useUiStore } from '../state/ui-store'

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

export function OpenMenuItems() {
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

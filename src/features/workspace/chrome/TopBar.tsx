import { Link } from '@tanstack/react-router'
import { Download, FolderOpen, Link2, MoreHorizontal, Search } from 'lucide-react'

import { ThemeToggle } from '@/features/theme/ThemeToggle'
import { modKey } from '@/lib/platform'
import { BrandMark, Wordmark } from '@/ui/Brand'
import { Button } from '@/ui/Button'
import { Kbd } from '@/ui/Kbd'
import { Menu, MenuContent, MenuSeparator, MenuTrigger } from '@/ui/Menu'
import { Tooltip } from '@/ui/Tooltip'

import { useUiStore } from '../state/ui-store'
import { DocumentTitle } from './DocumentTitle'
import { ExportMenuItems } from './ExportMenuItems'
import { OpenMenuItems } from './OpenMenuItems'
import { ReaderSettings } from './ReaderSettings'
import { ViewSwitch } from './ViewSwitch'

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

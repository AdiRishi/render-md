import { Code2, Copy, FileDown, FileText, Printer } from 'lucide-react'

import { modKey } from '@/lib/platform'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from '@/ui/dropdown-menu'

import { documentActions } from '../actions'

export function ExportMenuItems() {
  const mod = modKey()
  return (
    <>
      <DropdownMenuGroup>
        <DropdownMenuLabel className="label-caps text-ink-3">Copy</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => void documentActions.copyRichText()}>
          <Copy />
          Formatted text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => void documentActions.copyMarkdown()}>
          <Code2 />
          Markdown
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuLabel className="label-caps text-ink-3">Download</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => void documentActions.save()}>
          <FileDown />
          Markdown (.md)
          <DropdownMenuShortcut>{`${mod} S`}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={documentActions.downloadHtml}>
          <FileText />
          Web page (.html)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={documentActions.print}>
          <Printer />
          Print or save as PDF
          <DropdownMenuShortcut>{`${mod} P`}</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </>
  )
}

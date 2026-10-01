import { Code2, Copy, FileDown, FileText, Printer } from 'lucide-react'

import { modKey } from '@/lib/platform'
import { MenuGroup, MenuItem, MenuLabel, MenuSeparator } from '@/ui/Menu'

import { documentActions } from '../actions'

export function ExportMenuItems() {
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

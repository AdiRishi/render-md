import { ClipboardPaste, FolderOpen, Globe, Sparkles } from 'lucide-react'

import { Button } from '@/ui/Button'

import { documentActions } from '../../actions'
import { useUiStore } from '../../state/ui-store'

/** Empty & loading states */
export function EmptyState() {
  const openDialog = useUiStore((state) => state.openDialog)
  return (
    <div className="flex flex-col items-start py-6">
      <p className="mb-5 label-caps text-proof">Nothing to render — yet</p>
      <h2 className="font-display text-[clamp(2.4rem,5vw,3.4rem)] leading-[0.95] tracking-[-0.015em] text-ink">
        A blank page,
        <br />
        <em className="text-ink-3">full of promise.</em>
      </h2>
      <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-ink-2">
        Start typing in the editor, or bring something in. Files can also be dropped anywhere on
        this page.
      </p>
      <div className="mt-7 grid w-full max-w-md grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="lg"
          onClick={() => void documentActions.pasteFromClipboard()}
        >
          <ClipboardPaste /> Paste
        </Button>
        <Button variant="outline" size="lg" onClick={() => void documentActions.openFile()}>
          <FolderOpen /> Open file
        </Button>
        <Button variant="outline" size="lg" onClick={() => openDialog('open-url')}>
          <Globe /> From a URL
        </Button>
        <Button variant="outline" size="lg" onClick={documentActions.loadSample}>
          <Sparkles /> Field guide
        </Button>
      </div>
    </div>
  )
}

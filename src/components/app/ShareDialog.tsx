import { Check, Copy, LockKeyhole, Share } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { createShareUrl } from '@/lib/share'
import { formatBytes } from '@/lib/utils'
import { useDocumentStore } from '@/stores/document-store'
import { useUiStore } from '@/stores/ui-store'

const LONG_URL = 32_000

export function ShareDialog() {
  const open = useUiStore((state) => state.dialog === 'share')
  const closeDialog = useUiStore((state) => state.closeDialog)
  const markdown = useDocumentStore((state) => state.markdown)
  const [share, setShare] = useState<{ markdown: string; url: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!open) return
    let active = true
    void createShareUrl(markdown, window.location.origin).then((url) => {
      if (active) setShare({ markdown, url })
    })
    return () => {
      active = false
    }
  }, [open, markdown])

  // Only show a link that matches the current text.
  const url = share?.markdown === markdown ? share.url : null

  const originalSize = new TextEncoder().encode(markdown).length
  const linkSize = url?.length ?? 0
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  async function copy() {
    if (!url) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeDialog()}>
      <DialogContent
        eyebrow="Share"
        title="A link that is the document"
        description="Your markdown is compressed into the link itself. It opens in reading mode for whoever you send it to."
      >
        <div className="flex gap-2">
          <input
            readOnly
            value={url ?? 'Compressing…'}
            onFocus={(event) => event.currentTarget.select()}
            aria-label="Share link"
            className="h-10 min-w-0 flex-1 truncate rounded-lg bg-paper-2 px-3 font-mono text-[12px] text-ink-2 shadow-[inset_0_0_0_1px_var(--rule-strong)] outline-none"
          />
          <Button variant="primary" size="lg" onClick={() => void copy()} disabled={!url}>
            {copied ? <Check /> : <Copy />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-ink-3">
          <span>
            {formatBytes(originalSize)} → {formatBytes(linkSize)} link
          </span>
          {canNativeShare && url ? (
            <button
              type="button"
              className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-desk-2 hover:text-ink"
              onClick={() =>
                void navigator
                  .share({ url, title: 'A document on RenderMD' })
                  .catch(() => undefined)
              }
            >
              <Share className="size-3" /> Share via…
            </button>
          ) : null}
        </div>

        {linkSize > LONG_URL ? (
          <p className="mt-3 rounded-lg bg-[color-mix(in_oklch,var(--alert-warning)_12%,var(--paper))] px-3 py-2 text-xs leading-relaxed text-ink-2">
            This is a long link. Browsers handle it fine, but some chat apps truncate very long URLs
            — consider exporting a file instead.
          </p>
        ) : null}

        <p className="mt-5 flex gap-2.5 border-t border-rule pt-4 text-xs leading-relaxed text-ink-3">
          <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-ink-2" />
          <span>
            The document lives after the <code className="font-mono text-ink-2">#</code> in the URL,
            which browsers never send to a server. No upload, no account, no tracking of contents.
          </span>
        </p>
      </DialogContent>
    </Dialog>
  )
}

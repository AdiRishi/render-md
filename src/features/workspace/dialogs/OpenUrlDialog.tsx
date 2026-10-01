import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog'
import { Input } from '@/ui/input'

import { documentActions } from '../actions'
import { useUiStore } from '../state/ui-store'

const EXAMPLES = [
  'github.com/facebook/react',
  'github.com/tailwindlabs/tailwindcss',
  'github.com/remarkjs/remark/blob/main/readme.md',
]

export function OpenUrlDialog() {
  const open = useUiStore((state) => state.dialog === 'open-url')
  const closeDialog = useUiStore((state) => state.closeDialog)
  const [value, setValue] = useState('')
  const [pending, setPending] = useState(false)

  async function submit(url: string) {
    if (!url.trim() || pending) return
    setPending(true)
    const loaded = await documentActions.openUrl(url)
    setPending(false)
    if (loaded) {
      setValue('')
      closeDialog()
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeDialog()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <p className="label-caps text-proof">Open from the web</p>
          <DialogTitle className="font-display text-[1.9rem] leading-tight font-normal tracking-[-0.01em]">
            Render any markdown URL
          </DialogTitle>
          <DialogDescription>
            Paste a link to a raw file, a GitHub repository, file or gist. Relative images and links
            keep working.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void submit(value)
          }}
          className="flex gap-2"
        >
          <Input
            autoFocus
            type="text"
            inputMode="url"
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://github.com/owner/repo"
            aria-label="Markdown URL"
            className="h-10 min-w-0 flex-1 font-mono text-[13px]"
          />
          <Button type="submit" size="lg" disabled={!value.trim() || pending}>
            {pending ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
            Open
          </Button>
        </form>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="me-1 text-xs text-ink-3">Try</span>
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setValue(example)
                void submit(example)
              }}
              className="rounded-full px-2.5 py-1 font-mono text-[11px] text-ink-2 shadow-[inset_0_0_0_1px_var(--rule-strong)] transition-colors hover:bg-desk-2 hover:text-ink"
            >
              {example}
            </button>
          ))}
        </div>
        <p className="border-t border-rule pt-4 text-xs leading-relaxed text-ink-3">
          Tip: link straight to a rendered page with{' '}
          <code className="rounded bg-paper-2 px-1 py-0.5 font-mono text-[11px] text-ink-2">
            render-md.com/?url=…
          </code>
        </p>
      </DialogContent>
    </Dialog>
  )
}

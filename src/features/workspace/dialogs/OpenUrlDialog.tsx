import { ArrowRight, LoaderCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/ui/Button'
import { Dialog, DialogContent } from '@/ui/Dialog'

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
      <DialogContent
        eyebrow="Open from the web"
        title="Render any markdown URL"
        description="Paste a link to a raw file, a GitHub repository, file or gist. Relative images and links keep working."
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void submit(value)
          }}
          className="flex gap-2"
        >
          <input
            autoFocus
            type="text"
            inputMode="url"
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://github.com/owner/repo"
            aria-label="Markdown URL"
            className="h-10 min-w-0 flex-1 rounded-lg bg-paper-2 px-3 font-mono text-[13px] text-ink shadow-[inset_0_0_0_1px_var(--rule-strong)] outline-none placeholder:text-ink-4 focus:shadow-[inset_0_0_0_1.5px_var(--ink)]"
          />
          <Button type="submit" variant="primary" size="lg" disabled={!value.trim() || pending}>
            {pending ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
            Open
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
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
        <p className="mt-5 border-t border-rule pt-4 text-xs leading-relaxed text-ink-3">
          Tip: link straight to a rendered page with{' '}
          <code className="rounded bg-paper-2 px-1 py-0.5 font-mono text-[11px] text-ink-2">
            render-md.com/?url=…
          </code>
        </p>
      </DialogContent>
    </Dialog>
  )
}

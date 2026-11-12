import { ArrowRight } from 'lucide-react'
import { useId, useState } from 'react'

import { parseRemoteInput } from '@/lib/remote-url'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/ui/input-group'

/**
 * Paste a link and open it in the workspace. The workspace does the fetching;
 * this form only checks that the link is one it can read.
 */
export function OpenUrlForm({ examples }: { examples: string[] }) {
  const id = useId()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function open(input: string) {
    try {
      parseRemoteInput(input)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
      return
    }
    window.location.assign(`/?url=${encodeURIComponent(input.trim())}`)
  }

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        open(value)
      }}
      className="rounded-[3px] bg-paper px-5 py-6 shadow-[0_0_0_1px_var(--rule)] md:px-8 md:py-8"
    >
      <label htmlFor={id} className="label-caps text-ink-3">
        Link to a repository, file or gist
      </label>
      <InputGroup className="mt-3 h-11">
        <InputGroupInput
          id={id}
          type="text"
          inputMode="url"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={value}
          onChange={(event) => {
            setValue(event.target.value)
            setError(null)
          }}
          placeholder="github.com/owner/repo"
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-error`}
          className="h-full ps-3.5 font-mono md:text-[13px]"
        />
        <InputGroupAddon align="inline-end" className="pe-1">
          <InputGroupButton type="submit" variant="default" size="sm" className="h-9 px-3">
            Open <ArrowRight />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <p
        id={`${id}-error`}
        role="alert"
        className="mt-2 text-[13px] text-[color:var(--alert-caution)] empty:hidden"
      >
        {error}
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <span className="me-1 text-xs text-ink-3">Try</span>
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => {
              setValue(example)
              open(example)
            }}
            className="max-w-full truncate rounded-full px-2.5 py-1 font-mono text-[11px] text-ink-2 shadow-[inset_0_0_0_1px_var(--rule-strong)] transition-colors hover:bg-desk-2 hover:text-ink"
          >
            {example}
          </button>
        ))}
      </div>
    </form>
  )
}

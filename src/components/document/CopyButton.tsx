import { Check, Copy } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

export function CopyButton({
  value,
  label = 'Copy',
  className,
}: {
  value: string | (() => string)
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(timer)
  }, [copied])

  return (
    <button
      type="button"
      aria-label={copied ? 'Copied' : label}
      title={copied ? 'Copied' : label}
      onClick={async () => {
        await navigator.clipboard.writeText(typeof value === 'function' ? value() : value)
        setCopied(true)
      }}
      className={cn(
        'inline-grid size-7 place-items-center rounded-md text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink',
        className,
      )}
    >
      {copied ? <Check className="size-3.5 text-proof" /> : <Copy className="size-3.5" />}
    </button>
  )
}

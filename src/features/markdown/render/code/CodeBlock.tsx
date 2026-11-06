import { type ReactNode } from 'react'

import { CopyButton } from '@/ui/copy-button'

import { languageLabel } from '../../engine/highlight'

type CodeBlockProps = {
  code: string
  language: string | null
  meta: string | null
  line?: number
  /** The `<code>` element, already split into lines and highlighted by the engine. */
  children: ReactNode
}

function parseTitle(meta: string | null) {
  if (!meta) return null
  const match = /(?:title|filename)=(?:"([^"]+)"|'([^']+)'|(\S+))/.exec(meta)
  return match ? (match[1] ?? match[2] ?? match[3]) : null
}

export function CodeBlock({ code, language, meta, line, children }: CodeBlockProps) {
  const title = parseTitle(meta)
  const lineNumbers = meta?.includes('showLineNumbers') || meta?.includes('lineNumbers')

  return (
    <figure className="code-block" data-line={line}>
      <figcaption className="code-block-header">
        <span>{languageLabel(language)}</span>
        {title ? <span className="code-block-title">{title}</span> : null}
        <span className="code-block-actions ms-auto">
          <CopyButton value={code} label="Copy code" />
        </span>
      </figcaption>
      <pre data-line-numbers={lineNumbers || undefined}>{children}</pre>
    </figure>
  )
}

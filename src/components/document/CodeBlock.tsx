import { type CSSProperties, Fragment, useEffect, useState } from 'react'

import { type HighlightedLine, highlightCode, peekLanguageLabel } from '@/lib/highlighter'
import { cn } from '@/lib/utils'

import { CopyButton } from './CopyButton'

type CodeBlockProps = {
  code: string
  language: string | null
  meta: string | null
  line?: number
}

function parseTitle(meta: string | null) {
  if (!meta) return null
  const match = /(?:title|filename)=(?:"([^"]+)"|'([^']+)'|(\S+))/.exec(meta)
  return match ? (match[1] ?? match[2] ?? match[3]) : null
}

function diffClass(language: string | null, text: string) {
  if (language !== 'diff') return undefined
  if (text.startsWith('+') && !text.startsWith('+++')) return 'diff-add'
  if (text.startsWith('-') && !text.startsWith('---')) return 'diff-remove'
  return undefined
}

export function CodeBlock({ code, language, meta, line }: CodeBlockProps) {
  const [highlighted, setHighlighted] = useState<{
    key: string
    lines: HighlightedLine[] | null
  } | null>(null)
  const key = `${language}\u0000${code}`

  useEffect(() => {
    let active = true
    void highlightCode(code, language).then((lines) => {
      if (active) setHighlighted({ key, lines })
    })
    return () => {
      active = false
    }
  }, [code, language, key])

  const tokens = highlighted?.key === key ? highlighted.lines : null
  const plainLines = code.split('\n')
  const title = parseTitle(meta)
  const lineNumbers = meta?.includes('showLineNumbers') || meta?.includes('lineNumbers')

  return (
    <figure className="code-block" data-line={line}>
      <figcaption className="code-block-header">
        <span>{peekLanguageLabel(language)}</span>
        {title ? <span className="code-block-title">{title}</span> : null}
        <span className="code-block-actions ms-auto">
          <CopyButton value={code} label="Copy code" />
        </span>
      </figcaption>
      <pre data-line-numbers={lineNumbers || undefined}>
        <code>
          {plainLines.map((text, index) => (
            // The newline sits between line spans so `pre` breaks lines itself.
            <Fragment key={index}>
              <span className={cn('line', diffClass(language, text))}>
                {tokens?.[index]
                  ? tokens[index].map((token, tokenIndex) => (
                      <span
                        key={tokenIndex}
                        className="token"
                        style={token.htmlStyle as CSSProperties}
                      >
                        {token.content}
                      </span>
                    ))
                  : text}
              </span>
              {index < plainLines.length - 1 ? '\n' : null}
            </Fragment>
          ))}
        </code>
      </pre>
    </figure>
  )
}

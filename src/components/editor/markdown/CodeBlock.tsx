import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import oneDark from 'react-syntax-highlighter/dist/esm/styles/prism/one-dark'
import { type ComponentPropsWithoutRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

type CodeBlockProps = ComponentPropsWithoutRef<'code'>

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  // Extract language from className (e.g., "language-javascript" -> "javascript")
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : null

  // Get the code content as a string
  const code = String(children).replace(/\n$/, '')

  // Check if this is inline code (no language specified and single line)
  const isInline = !match && !String(children).includes('\n')

  // Inline code - render as styled span
  if (isInline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-sm text-foreground"
        {...props}
      >
        {children}
      </code>
    )
  }

  const onCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // TODO: Mermaid diagram support could be implemented here
  // if (language === 'mermaid') { ... }

  // Regular code blocks - use syntax highlighter
  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-border/50">
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={onCopy}
          variant="ghost"
          size="icon-xs"
          className="text-zinc-400 hover:text-white hover:bg-zinc-700/50"
          aria-label="Copy code"
          title="Copy code"
        >
          {copied ? <Check className="text-emerald-400" /> : <Copy />}
        </Button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language || 'text'}
        PreTag="div"
        className="m-0! rounded-none! text-sm! leading-relaxed! p-4!"
        showLineNumbers={code.split('\n').length > 3}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

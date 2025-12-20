import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { type ComponentPropsWithoutRef } from 'react'

type CodeBlockProps = ComponentPropsWithoutRef<'code'>

export function CodeBlock({ children, className, ...props }: CodeBlockProps) {
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

  // TODO: Mermaid diagram support could be implemented here
  // if (language === 'mermaid') { ... }

  // Regular code blocks - use syntax highlighter
  return (
    <SyntaxHighlighter
      style={oneDark}
      language={language || 'text'}
      PreTag="div"
      className="my-4! rounded-lg! text-sm!"
      showLineNumbers={code.split('\n').length > 3}
      customStyle={{
        margin: 0,
        padding: '1rem',
        fontSize: '0.875rem',
        lineHeight: '1.5',
      }}
    >
      {code}
    </SyntaxHighlighter>
  )
}

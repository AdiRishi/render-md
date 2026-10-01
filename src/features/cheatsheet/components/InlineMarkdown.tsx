import { Fragment } from 'react'

/** Just enough inline markdown for summaries: `code`, *em* and **strong**. */
export function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2)
          return (
            <code
              key={index}
              className="rounded-[4px] bg-paper-2 px-1 py-0.5 font-mono text-[0.86em] text-ink shadow-[inset_0_0_0_1px_var(--rule)]"
            >
              {part.slice(1, -1)}
            </code>
          )
        if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
          return <strong key={index}>{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
          return <em key={index}>{part.slice(1, -1)}</em>
        return <Fragment key={index}>{part}</Fragment>
      })}
    </>
  )
}

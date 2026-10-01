import { type Element } from 'hast'
import { toText } from 'hast-util-to-text'

import { CodeBlock } from '../code/CodeBlock'
import { Diagram } from '../diagram/Diagram'
import { type ElementProps, sourceLineOf } from './element-props'

const MERMAID = new Set(['mermaid', 'mmd'])

/** `<pre><code>`: Mermaid fences become diagrams, everything else is highlighted. */
export function CodeFence({ node, children, ...props }: ElementProps<'pre'>) {
  const code = node?.children.find(
    (child): child is Element => child.type === 'element' && child.tagName === 'code',
  )
  if (!code) return <pre {...props}>{children}</pre>

  const classes = Array.isArray(code.properties.className) ? code.properties.className : []
  const languageClass = classes.find(
    (value): value is string => typeof value === 'string' && value.startsWith('language-'),
  )
  const language = languageClass ? languageClass.slice('language-'.length).toLowerCase() : null
  const text = toText(code, { whitespace: 'pre' }).replace(/\n$/, '')
  const line = sourceLineOf(props)

  if (language && MERMAID.has(language)) return <Diagram code={text} line={line} />

  const meta = typeof code.properties.dataMeta === 'string' ? code.properties.dataMeta : null
  return <CodeBlock code={text} language={language} meta={meta} line={line} />
}

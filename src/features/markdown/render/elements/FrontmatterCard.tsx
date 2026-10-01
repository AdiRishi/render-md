import { Fragment } from 'react'

import { type Frontmatter } from '../../engine/types'

function formatValue(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (Array.isArray(value)) return value.map(formatValue).join(', ')
  if (value && typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/** YAML frontmatter, shown as a metadata card above the document. */
export function FrontmatterCard({ data }: { data: Frontmatter }) {
  const entries = Object.entries(data)
  if (entries.length === 0) return null
  return (
    <aside className="frontmatter" aria-label="Document metadata">
      <dl>
        {entries.map(([key, value]) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>{formatValue(value)}</dd>
          </Fragment>
        ))}
      </dl>
    </aside>
  )
}

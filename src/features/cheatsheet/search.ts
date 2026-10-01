import { SECTIONS } from './content'

/** Sections whose title, summary or example labels match the query (max 7). */
export function matchSections(query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) return []
  return SECTIONS.filter((section) =>
    [
      section.id,
      section.title,
      section.summary,
      ...section.entries.map((entry) => entry.label ?? ''),
    ]
      .join(' ')
      .toLowerCase()
      .includes(needle),
  ).slice(0, 7)
}

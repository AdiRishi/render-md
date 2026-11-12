import { type Frontmatter } from '@/features/markdown/engine/pipeline'

/** What a PDF title page shows, read from common frontmatter keys. */
export type Cover = {
  title: string
  subtitle: string | null
  authors: string[]
  date: string | null
}

function text(value: unknown) {
  if (typeof value === 'number') return String(value)
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function personName(value: unknown) {
  if (value && typeof value === 'object' && 'name' in value) return text(value.name)
  return text(value)
}

function people(value: unknown) {
  const list = Array.isArray(value) ? value : [value]
  return list.map(personName).filter((name) => name !== null)
}

/** ISO dates read as a long date in the reader's locale; anything else is shown as written. */
function formatDate(value: unknown, locale?: string) {
  const raw = text(value)
  if (!raw) return null
  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T ])/.exec(raw)
  if (!iso) return raw
  const date = new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])))
  if (Number.isNaN(date.getTime())) return raw
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date)
}

export function coverFromFrontmatter(
  frontmatter: Frontmatter | null,
  fallbackTitle: string,
  locale?: string,
): Cover {
  const data = frontmatter ?? {}
  return {
    title: text(data.title) ?? fallbackTitle,
    subtitle: text(data.subtitle) ?? text(data.description),
    authors: people(data.authors ?? data.author),
    date: formatDate(data.date, locale),
  }
}

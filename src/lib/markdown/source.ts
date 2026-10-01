/** Fast, render-free helpers that work on raw markdown source. */

const TASK_PATTERN = /^(\s*(?:[-*+]|\d+[.)])\s+\[)([ xX])(\])/

/** Flip the GFM task checkbox on a 1-based source line. Returns null if none. */
export function toggleTaskAtLine(markdown: string, line: number) {
  const lines = markdown.split('\n')
  const index = line - 1
  const target = lines[index]
  if (target === undefined) return null

  const match = TASK_PATTERN.exec(target)
  if (!match) return null

  const next = match[2] === ' ' ? 'x' : ' '
  lines[index] = target.replace(TASK_PATTERN, `$1${next}$3`)
  return lines.join('\n')
}

/** A cheap title guess for lists (recent documents) without a full render. */
export function guessTitle(markdown: string) {
  const frontmatterTitle = /^---\n[\s\S]*?^title:\s*["']?(.+?)["']?\s*$[\s\S]*?^---/m.exec(markdown)
  if (frontmatterTitle) return frontmatterTitle[1].trim()

  const heading = /^#{1,2}\s+(.+?)\s*#*\s*$/m.exec(markdown)
  if (heading) return stripInline(heading[1])

  const firstLine = markdown
    .split('\n')
    .map((value) => value.trim())
    .find((value) => value && value !== '---')
  return firstLine ? stripInline(firstLine).slice(0, 80) : null
}

function stripInline(value: string) {
  return value
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

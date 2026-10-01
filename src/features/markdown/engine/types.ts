/** Shapes produced by the markdown engine. */

/** A heading in the rendered outline. */
export type HeadingEntry = {
  id: string
  depth: number
  text: string
  line: number | null
}

/** Parsed YAML frontmatter (plain JSON data). */
export type Frontmatter = Record<string, unknown>

declare module 'vfile' {
  interface DataMap {
    headings: HeadingEntry[]
    frontmatter: Frontmatter | null
  }
}

/**
 * The table generator's model: a header row, body rows and an alignment per
 * column, with conversions to and from markdown and pasted spreadsheet text.
 */

export type Align = 'none' | 'left' | 'center' | 'right'

/** `rows[0]` is the header. Every row has one cell per entry in `align`. */
export type Table = { rows: string[][]; align: Align[] }

export type CellPosition = { row: number; column: number }

const escapeCell = (value: string) => value.replace(/\|/g, '\\|').replace(/\r?\n/g, '<br>')

const dashes = (count: number) => '-'.repeat(Math.max(count, 1))

function delimiter(align: Align, width: number) {
  switch (align) {
    case 'left':
      return `:${dashes(width - 1)}`
    case 'center':
      return `:${dashes(width - 2)}:`
    case 'right':
      return `${dashes(width - 1)}:`
    case 'none':
      return dashes(width)
  }
}

function pad(value: string, width: number, align: Align) {
  const space = width - value.length
  if (align === 'right') return ' '.repeat(space) + value
  if (align === 'center') {
    const before = Math.floor(space / 2)
    return ' '.repeat(before) + value + ' '.repeat(space - before)
  }
  return value + ' '.repeat(space)
}

const tableRow = (cells: string[]) => `| ${cells.join(' | ')} |`

/** The table as GitHub Flavored Markdown, padded so its columns line up. */
export function toMarkdown(table: Table) {
  const rows = table.rows.map((row) => row.map(escapeCell))
  const widths = table.align.map((_, column) =>
    Math.max(3, ...rows.map((row) => row[column].length)),
  )
  const [header, ...body] = rows
  return [
    tableRow(header.map((cell, column) => pad(cell, widths[column], table.align[column]))),
    tableRow(table.align.map((align, column) => delimiter(align, widths[column]))),
    ...body.map((row) =>
      tableRow(row.map((cell, column) => pad(cell, widths[column], table.align[column]))),
    ),
  ].join('\n')
}

/** Split a markdown table row on its unescaped pipes. */
function splitRow(line: string) {
  const trimmed = line
    .trim()
    .replace(/^\|/, '')
    .replace(/(?<!\\)\|$/, '')
  return trimmed.split(/(?<!\\)\|/).map((cell) =>
    cell
      .trim()
      .replace(/\\\|/g, '|')
      .replace(/<br\s*\/?>/gi, '\n'),
  )
}

function alignOf(cell: string): Align | null {
  const match = /^(:?)-+(:?)$/.exec(cell.trim())
  if (!match) return null
  if (match[1] && match[2]) return 'center'
  if (match[1]) return 'left'
  if (match[2]) return 'right'
  return 'none'
}

/** Read a markdown table, or return null if the text isn't one. */
export function parseMarkdownTable(text: string): Table | null {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2 || !lines[0].includes('|')) return null
  const align = splitRow(lines[1]).map(alignOf)
  if (!align.every((value) => value !== null)) return null
  const rows = [lines[0], ...lines.slice(2)].map(splitRow)
  return normalize({ rows, align })
}

/**
 * Tab if the text has a tab outside a quoted field, else comma. A quote opens
 * a field only at the start of a cell, as in `parseDelimited`.
 */
function separatorOf(source: string) {
  let quoted = false
  let cellStart = true
  for (let index = 0; index < source.length; index++) {
    const char = source[index]
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') index++
      else if (char === '"') quoted = false
    } else if (char === '\t') return '\t'
    else if (char === '"' && cellStart) quoted = true
    cellStart = !quoted && (char === ',' || char === '\n')
  }
  return ','
}

/** Rows of spreadsheet cells (tab-separated) or CSV, with quoted fields. */
export function parseDelimited(text: string): string[][] {
  const source = text.replace(/\r\n?/g, '\n').replace(/\n$/, '')
  const separator = separatorOf(source)
  const rows: string[][] = [[]]
  let cell = ''
  let quoted = false
  for (let index = 0; index < source.length; index++) {
    const char = source[index]
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        cell += '"'
        index++
      } else if (char === '"') quoted = false
      else cell += char
    } else if (char === '"' && cell === '') quoted = true
    else if (char === separator) {
      rows[rows.length - 1].push(cell)
      cell = ''
    } else if (char === '\n') {
      rows[rows.length - 1].push(cell)
      rows.push([])
      cell = ''
    } else cell += char
  }
  rows[rows.length - 1].push(cell)
  return rows
}

/** Pad every row to the widest one, and fit `align` to the column count. */
function normalize(table: Table): Table {
  const columns = Math.max(1, table.align.length, ...table.rows.map((row) => row.length))
  return {
    rows: table.rows.map((row) =>
      Array.from({ length: columns }, (_, column) => row[column] ?? ''),
    ),
    align: Array.from({ length: columns }, (_, column) => table.align[column] ?? 'none'),
  }
}

/**
 * Apply pasted text at a cell. A markdown table replaces the whole table;
 * spreadsheet or CSV cells are written from `at` onwards, growing the table to
 * fit. Returns null for text on a single line with no tabs, which the cell
 * should take as typed text, commas and all.
 */
export function paste(table: Table, at: CellPosition, text: string): Table | null {
  const markdown = parseMarkdownTable(text)
  if (markdown) return markdown
  if (!/[\t\n]/.test(text.replace(/\r?\n$/, ''))) return null
  const cells = parseDelimited(text)
  const rows = table.rows.map((row) => [...row])
  cells.forEach((pastedRow, rowOffset) => {
    const row = (rows[at.row + rowOffset] ??= [])
    pastedRow.forEach((value, columnOffset) => {
      row[at.column + columnOffset] = value
    })
  })
  return normalize({ rows, align: table.align })
}

export const setCell = (table: Table, at: CellPosition, value: string): Table => ({
  ...table,
  rows: table.rows.map((row, index) =>
    index === at.row ? row.map((cell, column) => (column === at.column ? value : cell)) : row,
  ),
})

export const setAlign = (table: Table, column: number, align: Align): Table => ({
  ...table,
  align: table.align.map((value, index) => (index === column ? align : value)),
})

/** Empty every cell, keeping the table's size and alignment. */
export const clearCells = (table: Table): Table => ({
  ...table,
  rows: table.rows.map((row) => row.map(() => '')),
})

/** Insert an empty body row at `index` (1 or later; row 0 is the header). */
export const insertRow = (table: Table, index: number): Table => ({
  ...table,
  rows: table.rows.toSpliced(
    Math.max(1, index),
    0,
    table.align.map(() => ''),
  ),
})

export const removeRow = (table: Table, index: number): Table =>
  index === 0 || table.rows.length <= 2 ? table : { ...table, rows: table.rows.toSpliced(index, 1) }

export const insertColumn = (table: Table, index: number): Table => ({
  rows: table.rows.map((row) => row.toSpliced(index, 0, '')),
  align: table.align.toSpliced(index, 0, 'none'),
})

export const removeColumn = (table: Table, index: number): Table =>
  table.align.length <= 1
    ? table
    : {
        rows: table.rows.map((row) => row.toSpliced(index, 1)),
        align: table.align.toSpliced(index, 1),
      }

import { toHtml } from 'hast-util-to-html'
import { describe, expect, it } from 'vitest'

import { renderMarkdown } from '@/features/markdown/engine/pipeline'

import {
  clearCells,
  parseDelimited,
  parseMarkdownTable,
  paste,
  type Table,
  toMarkdown,
} from './table-model'

const plans: Table = {
  rows: [
    ['Plan', 'Seats', 'Price'],
    ['Free', '1', '$0'],
    ['Team', '10', '$120'],
  ],
  align: ['left', 'center', 'right'],
}

describe('toMarkdown', () => {
  it('writes an aligned table with each column’s alignment', () => {
    expect(toMarkdown(plans)).toBe(
      [
        '| Plan | Seats | Price |',
        '| :--- | :---: | ----: |',
        '| Free |   1   |    $0 |',
        '| Team |  10   |  $120 |',
      ].join('\n'),
    )
  })

  it('escapes pipes and turns line breaks into <br> so a cell stays one cell', () => {
    const markdown = toMarkdown({
      rows: [['Syntax'], ['a | b'], ['one\ntwo']],
      align: ['none'],
    })
    expect(markdown).toContain('a \\| b')
    expect(markdown).toContain('one<br>two')
    const html = toHtml(renderMarkdown(markdown).hast)
    expect(html.match(/<td/g)).toHaveLength(2)
    expect(html).toContain('a | b')
  })
})

describe('parseMarkdownTable', () => {
  it('reads a table back, alignment included', () => {
    expect(parseMarkdownTable(toMarkdown(plans))).toEqual(plans)
  })

  it('reads tables written without outer pipes or padding', () => {
    expect(parseMarkdownTable('a|b\n--|:-:\n1|2')).toEqual({
      rows: [
        ['a', 'b'],
        ['1', '2'],
      ],
      align: ['none', 'center'],
    })
  })

  it('rejects text that isn’t a table', () => {
    expect(parseMarkdownTable('Just a sentence | with a pipe')).toBeNull()
    expect(parseMarkdownTable('| a | b |\n| not | dashes |')).toBeNull()
  })
})

describe('parseDelimited', () => {
  it('reads tab-separated cells copied from a spreadsheet', () => {
    expect(parseDelimited('Name\tRole\r\nAda\tEngineer\r\n')).toEqual([
      ['Name', 'Role'],
      ['Ada', 'Engineer'],
    ])
  })

  it('keeps quotes inside tab-separated cells as text', () => {
    expect(parseDelimited('5" bolt\t6" bolt')).toEqual([['5" bolt', '6" bolt']])
  })

  it('reads CSV whose quoted values contain tabs', () => {
    expect(parseDelimited('a,b\n"x\ty","z"')).toEqual([
      ['a', 'b'],
      ['x\ty', 'z'],
    ])
  })

  it('reads CSV with quoted commas, quotes and line breaks', () => {
    expect(parseDelimited('city,note\n"Paris, FR","said ""hi""\nthen left"')).toEqual([
      ['city', 'note'],
      ['Paris, FR', 'said "hi"\nthen left'],
    ])
  })
})

describe('paste', () => {
  const empty: Table = {
    rows: [
      ['', ''],
      ['', ''],
    ],
    align: ['none', 'none'],
  }

  it('grows the table from the cell it was pasted into', () => {
    expect(paste(empty, { row: 1, column: 1 }, 'x\ty\tz\n1\t2\t3')).toEqual({
      rows: [
        ['', '', '', ''],
        ['', 'x', 'y', 'z'],
        ['', '1', '2', '3'],
      ],
      align: ['none', 'none', 'none', 'none'],
    })
  })

  it('replaces the table when a markdown table is pasted', () => {
    expect(paste(empty, { row: 1, column: 0 }, toMarkdown(plans))).toEqual(plans)
  })

  it('leaves single-line text to the cell, commas and all', () => {
    expect(paste(empty, { row: 0, column: 0 }, 'Hello, world')).toBeNull()
    expect(paste(empty, { row: 0, column: 0 }, 'Hello\n')).toBeNull()
  })
})

describe('clearCells', () => {
  it('empties the cells and keeps the size and alignment', () => {
    expect(clearCells(plans)).toEqual({
      rows: [
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
      ],
      align: ['left', 'center', 'right'],
    })
  })
})

import { lines } from '@/lib/markdown-authoring'

import { type Guide } from './types'

export const markdownTableGenerator: Guide = {
  slug: 'markdown-table-generator',
  h1: ['Markdown table', 'generator'],
  lede: 'Fill in the grid, or paste rows from a spreadsheet, and copy the markdown table it makes. Columns line up in the output, so it reads well as plain text too.',
  metaTitle: 'Markdown Table Generator: Paste from Excel or CSV | RenderMD',
  metaDescription:
    'Make a markdown table in a grid, or paste rows from Excel, Google Sheets or a CSV. Set each column’s alignment and copy the aligned markdown. Free, in your browser.',
  ogImageAlt: 'The RenderMD markdown table generator',
  tool: {
    kind: 'table-generator',
    initial: {
      rows: [
        ['Plan', 'Seats', 'Price'],
        ['Free', '1', '$0'],
        ['Team', '10', '$120'],
      ],
      align: ['left', 'center', 'right'],
    },
  },
  sections: [
    {
      id: 'paste',
      title: 'Paste from a spreadsheet or CSV',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'Copy cells in Excel, Google Sheets or Numbers and paste them into any cell of the grid. The grid grows to fit, starting from the cell you pasted into. Comma-separated text works the same way, including quoted values that contain commas.',
            '',
            'To edit a table you already have, paste its markdown into the grid. The first row becomes the header and the alignment row sets each column’s alignment.',
          ),
        },
      ],
    },
    {
      id: 'alignment',
      title: 'Column alignment',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'Each column has its own alignment, written as colons in the line under the header.',
            '',
            '| Line | Aligns the column |',
            '| :--- | :--- |',
            '| `:---` | Left |',
            '| `:---:` | Centre |',
            '| `---:` | Right |',
            '| `---` | Left, the default |',
            '',
            'Right-align columns of numbers so their digits line up.',
          ),
        },
      ],
    },
    {
      id: 'special-characters',
      title: 'Pipes and line breaks in cells',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'A `|` in a cell would end the cell, so the generator writes it as `\\|`. Markdown tables have no multi-line cells; a line break you paste into a cell becomes `<br>`, which GitHub and RenderMD show as a new line.',
            '',
            'Cells can hold inline markdown: **bold**, `code`, links and images. Lists, headings and code blocks don’t fit in a cell.',
          ),
        },
      ],
    },
    {
      id: 'syntax',
      title: 'Writing tables by hand',
      blocks: [
        {
          kind: 'prose',
          markdown:
            'The [cheat sheet’s tables section](/cheatsheet#tables) has the full syntax with editable examples. The short version: separate cells with `|`, and put a line of dashes under the header row. The columns don’t need to line up for the table to render.',
        },
      ],
    },
  ],
  faq: [
    {
      question: 'How do I convert Excel to a markdown table?',
      answer:
        'Select the cells in Excel, copy them, click a cell in the grid above and paste. Then copy the markdown from the output.',
    },
    {
      question: 'Can a markdown table have no header row?',
      answer:
        'No. GitHub Flavored Markdown needs a header row and the line under it. Leave the header cells empty if you don’t want visible headings.',
    },
    {
      question: 'Can I merge cells?',
      answer:
        'Markdown tables have no merged cells. For that, write an HTML `<table>` with `colspan` or `rowspan`; GitHub and RenderMD both render it.',
    },
    {
      question: 'Is the table data sent anywhere?',
      answer: 'No. The generator runs in your browser, and nothing you type or paste is uploaded.',
    },
  ],
  cta: 'Write the rest of the document around your table.',
}

export type CheatsheetEntry = {
  source: string
  note?: string
}

export type CheatsheetSection = {
  id: string
  title: string
  summary: string
  entries: CheatsheetEntry[]
}

export const CHEATSHEET: CheatsheetSection[] = [
  {
    id: 'headings',
    title: 'Headings',
    summary: 'One to six hashes, then a space. Every heading gets a linkable anchor.',
    entries: [{ source: '# Heading one\n## Heading two\n### Heading three\n#### Heading four' }],
  },
  {
    id: 'emphasis',
    title: 'Emphasis',
    summary: 'Wrap text in asterisks or underscores. Tildes strike it through.',
    entries: [
      {
        source:
          '**Bold**, *italic* and ***both***.\n\n~~Struck through~~, `inline code` and <mark>highlighted</mark>.\n\nH<sub>2</sub>O and E = mc<sup>2</sup> via HTML.',
      },
    ],
  },
  {
    id: 'lists',
    title: 'Lists',
    summary: 'Dashes, asterisks or numbers. Indent two spaces to nest.',
    entries: [
      { source: '- Bread\n- Coffee\n  - Light roast\n  - Dark roast\n- Oranges' },
      { source: '1. Preheat the oven\n2. Mix the batter\n3. Bake for 25 minutes' },
    ],
  },
  {
    id: 'tasks',
    title: 'Task lists',
    summary: 'GitHub-style checkboxes. In the editor, you can tick them right in the preview.',
    entries: [{ source: '- [x] Write the draft\n- [x] Add a diagram\n- [ ] Share the link' }],
  },
  {
    id: 'links',
    title: 'Links',
    summary: 'Inline links, links with titles, bare URLs and references.',
    entries: [
      {
        source:
          '[RenderMD](https://www.render-md.com) is free.\n\nBare URLs link themselves: https://commonmark.org\n\nReference style: [the spec][gfm].\n\n[gfm]: https://github.github.com/gfm/',
      },
    ],
  },
  {
    id: 'images',
    title: 'Images',
    summary: 'Like a link, with a leading exclamation mark. Alt text matters.',
    entries: [
      {
        source:
          '![Milky Way over a desert](https://imagedelivery.net/dUGyBDwDArlYQF97CccBHg/94528f14-4913-4f02-c6dd-6f5734a98400/public)',
      },
    ],
  },
  {
    id: 'code',
    title: 'Code blocks',
    summary: 'Fence with three backticks and name the language. Add a title in the fence meta.',
    entries: [
      {
        source:
          '```ts title="greet.ts"\nexport function greet(name: string) {\n  return `Hello, ${name}!`\n}\n```',
      },
      { source: '```diff\n- const theme = "default"\n+ const theme = "editorial"\n```' },
    ],
  },
  {
    id: 'quotes',
    title: 'Blockquotes',
    summary: 'Start a line with a greater-than sign. Nest with more.',
    entries: [
      {
        source: '> Simplicity is prerequisite for reliability.\n>\n> — Edsger W. Dijkstra',
      },
    ],
  },
  {
    id: 'alerts',
    title: 'Alerts',
    summary: 'GitHub alert syntax: NOTE, TIP, IMPORTANT, WARNING and CAUTION.',
    entries: [
      { source: '> [!NOTE]\n> Useful information worth a glance.' },
      { source: '> [!TIP]\n> A better way to do something.' },
      { source: '> [!WARNING]\n> Needs attention to avoid problems.' },
    ],
  },
  {
    id: 'tables',
    title: 'Tables',
    summary: 'Pipes for columns, a dashed row for the header. Colons align.',
    entries: [
      {
        source:
          '| Planet | Moons | Day length |\n| :--- | :---: | ---: |\n| Mercury | 0 | 4,222 h |\n| Earth | 1 | 24 h |\n| Mars | 2 | 24.7 h |',
      },
    ],
  },
  {
    id: 'math',
    title: 'Math',
    summary: 'LaTeX between dollar signs, rendered by KaTeX.',
    entries: [
      { source: 'Inline: $a^2 + b^2 = c^2$' },
      { source: '$$\n\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}\n$$' },
    ],
  },
  {
    id: 'diagrams',
    title: 'Diagrams',
    summary: 'Mermaid flowcharts, sequences, timelines and more — in a mermaid fence.',
    entries: [
      {
        source:
          '```mermaid\nsequenceDiagram\n  You->>RenderMD: Paste markdown\n  RenderMD-->>You: Typeset page\n  You->>Friend: Share link\n```',
      },
    ],
  },
  {
    id: 'footnotes',
    title: 'Footnotes',
    summary: 'A caret reference in the text, the note anywhere below.',
    entries: [
      { source: 'Markdown was created in 2004.[^1]\n\n[^1]: By John Gruber, with Aaron Swartz.' },
    ],
  },
  {
    id: 'html',
    title: 'HTML & extras',
    summary: 'Safe HTML is allowed, as on GitHub. Emoji shortcodes work too.',
    entries: [
      {
        source:
          '<details>\n<summary>Show the answer</summary>\n\nForty-two. :sparkles:\n\n</details>\n\nPress <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy.',
      },
    ],
  },
  {
    id: 'rules',
    title: 'Dividers',
    summary: 'Three dashes, asterisks or underscores on their own line.',
    entries: [{ source: 'Above the break.\n\n---\n\nBelow the break.' }],
  },
]

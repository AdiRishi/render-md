/**
 * The markdown cheat sheet. Every `source` here is rendered by the real
 * pipeline (on the server), and `tips` / FAQ answers are markdown too.
 */

/** Where a piece of syntax works. */
export type Support = 'commonmark' | 'gfm' | 'github' | 'extended'

export const SUPPORT_LABEL: Record<Support, { label: string; description: string }> = {
  commonmark: {
    label: 'CommonMark',
    description: 'Core markdown — works almost everywhere markdown is rendered.',
  },
  gfm: {
    label: 'GFM',
    description:
      'GitHub Flavored Markdown — supported by GitHub, GitLab, Reddit, VS Code and most modern tools.',
  },
  github: {
    label: 'GitHub',
    description: 'A GitHub extension, also supported by RenderMD and a growing number of tools.',
  },
  extended: {
    label: 'Extended',
    description:
      'Widely supported extension (GitHub, GitLab, Obsidian, RenderMD…) but not part of a spec.',
  },
}

export type CheatsheetEntry = {
  /** Optional caption for this variant, e.g. "Alignment". */
  label?: string
  source: string
}

export type CheatsheetSection = {
  id: string
  title: string
  support: Support
  /** One or two sentences of plain explanation (shown under the heading). */
  summary: string
  entries: CheatsheetEntry[]
  /** Markdown bullets: gotchas and good-to-knows. */
  tips?: string[]
}

export type CheatsheetChapter = {
  id: string
  numeral: string
  title: string
  intro: string
  sections: CheatsheetSection[]
}

export const CHEATSHEET_UPDATED = '2026-10-01'

const lines = (...value: string[]) => value.join('\n')
const fence = '```'

export const CHAPTERS: CheatsheetChapter[] = [
  {
    id: 'basics',
    numeral: 'I',
    title: 'The basics',
    intro:
      'Everything in this chapter is CommonMark, the standard behind almost every markdown renderer. Learn these and you can write markdown anywhere.',
    sections: [
      {
        id: 'headings',
        title: 'Headings',
        support: 'commonmark',
        summary:
          'Start a line with one to six `#` characters and a space. One `#` is the page title; use `##` and below for sections.',
        entries: [
          {
            source: lines(
              '# Heading 1',
              '## Heading 2',
              '### Heading 3',
              '#### Heading 4',
              '##### Heading 5',
              '###### Heading 6',
            ),
          },
          {
            label: 'Alternative syntax',
            source: lines('Heading 1', '=========', '', 'Heading 2', '---------'),
          },
        ],
        tips: [
          'Always put a space after the hashes: `#Heading` is just text in most renderers.',
          'Leave a blank line before and after a heading for maximum compatibility.',
          'Every heading gets an anchor you can link to: `[Jump](#headings)` scrolls to a heading called “Headings”.',
        ],
      },
      {
        id: 'paragraphs',
        title: 'Paragraphs & line breaks',
        support: 'commonmark',
        summary:
          'Separate paragraphs with a blank line. A single newline is treated as a space — end a line with a backslash (or two spaces) to force a line break.',
        entries: [
          {
            source: lines(
              'This is the first paragraph.',
              'This line joins the one above.',
              '',
              'This is a second paragraph.',
            ),
          },
          {
            label: 'Hard line breaks',
            source: lines(
              'Roses are red,\\',
              'violets are blue,\\',
              'markdown is simple',
              'and so are you.',
            ),
          },
        ],
        tips: [
          'Prefer the trailing backslash `\\` over two trailing spaces — spaces are invisible and editors often strip them.',
          'Don’t indent paragraphs: four leading spaces turn a line into a code block.',
        ],
      },
      {
        id: 'emphasis',
        title: 'Bold & italic',
        support: 'commonmark',
        summary:
          'Wrap text in one asterisk for italic, two for bold, and three for both. Underscores work too.',
        entries: [
          {
            source: lines(
              '*Italic* or _italic_',
              '',
              '**Bold** or __bold__',
              '',
              '***Bold and italic***',
              '',
              'A **bold _and italic_** mix.',
            ),
          },
        ],
        tips: [
          'Use asterisks inside words: `un*frigging*believable` works, while underscores inside words are ignored so `snake_case_names` stay intact.',
          'There’s no underline in markdown — use `<ins>underline</ins>` if you really need it.',
        ],
      },
      {
        id: 'blockquotes',
        title: 'Blockquotes',
        support: 'commonmark',
        summary:
          'Start a line with `>` to quote it. Quotes can span paragraphs, nest, and contain any other markdown.',
        entries: [
          {
            source: lines(
              '> Simplicity is prerequisite for reliability.',
              '>',
              '> — Edsger W. Dijkstra',
            ),
          },
          {
            label: 'Nested, with formatting',
            source: lines(
              '> **Note:** quotes can hold other blocks.',
              '>',
              '> - Lists',
              '> - and *emphasis*',
              '>',
              '>> Even another quote.',
            ),
          },
        ],
      },
      {
        id: 'lists',
        title: 'Lists',
        support: 'commonmark',
        summary:
          'Use `-`, `*` or `+` for bullets and numbers followed by `.` for ordered lists. Indent items to nest them under the previous one.',
        entries: [
          {
            label: 'Unordered',
            source: lines('- Coffee', '- Tea', '  - Green', '  - Black', '- Water'),
          },
          {
            label: 'Ordered',
            source: lines('1. Preheat the oven', '2. Mix the batter', '3. Bake for 25 minutes'),
          },
          {
            label: 'Starting number',
            source: lines('7. Lists can start at any number', '8. and keep counting from there'),
          },
          {
            label: 'Paragraphs inside items',
            source: lines(
              '1. First step',
              '',
              '   Indent follow-up paragraphs to match the text',
              '   so they stay inside the item.',
              '',
              '2. Second step',
            ),
          },
        ],
        tips: [
          'The actual numbers don’t matter after the first: `1.` `1.` `1.` renders as 1, 2, 3 — handy for reordering.',
          'Nested items must line up with the *text* of their parent, not the bullet: two spaces after `-`, three after `1.`.',
          'Pick one bullet character per list; switching characters starts a new list.',
        ],
      },
      {
        id: 'code',
        title: 'Code',
        support: 'commonmark',
        summary:
          'Use single backticks for `inline code` and triple-backtick “fences” for blocks. Name the language after the opening fence to get syntax highlighting.',
        entries: [
          { label: 'Inline', source: 'Run `npm install` and open `index.html`.' },
          {
            label: 'Fenced, with a language',
            source: lines(
              `${fence}js`,
              'function greet(name) {',
              '  return `Hello, ${name}!`',
              '}',
              fence,
            ),
          },
          {
            label: 'With a file title',
            source: lines(
              `${fence}ts title="greet.ts"`,
              'export const greet = (name: string) => `Hello, ${name}!`',
              fence,
            ),
          },
          {
            label: 'Diffs',
            source: lines(
              `${fence}diff`,
              '- const theme = "default"',
              '+ const theme = "editorial"',
              fence,
            ),
          },
        ],
        tips: [
          'To show a backtick inside inline code, wrap it in double backticks: ``` `` a ` b `` ```.',
          'To show a code fence inside a code block, use four backticks for the outer fence.',
          'Common language names: `js`, `ts`, `tsx`, `python`, `bash`, `json`, `yaml`, `sql`, `rust`, `go`, `html`, `css`, `diff`.',
          'Four spaces of indentation also make a code block, but fences are clearer and support highlighting.',
        ],
      },
      {
        id: 'links',
        title: 'Links',
        support: 'commonmark',
        summary:
          'Put the link text in square brackets and the URL in parentheses. Add an optional title in quotes, or use reference-style links to keep paragraphs readable.',
        entries: [
          {
            label: 'Inline',
            source: '[RenderMD](https://www.render-md.com "Render any markdown") is free.',
          },
          {
            label: 'Reference style',
            source: lines(
              'Read the [CommonMark spec][spec] and the [GFM spec][gfm].',
              '',
              '[spec]: https://spec.commonmark.org',
              '[gfm]: https://github.github.com/gfm/',
            ),
          },
          {
            label: 'Autolinks',
            source: lines(
              '<https://www.render-md.com>',
              '',
              'Bare URLs work in GFM: https://commonmark.org',
              '',
              'So do emails: hello@example.com',
            ),
          },
          { label: 'Section links', source: 'Jump back to [Headings](#headings).' },
        ],
        tips: [
          'Spaces in URLs break links — encode them as `%20`, or wrap the URL in angle brackets: `[a](<my file.md>)`.',
          'Reference definitions can live anywhere in the document and never render.',
        ],
      },
      {
        id: 'images',
        title: 'Images',
        support: 'commonmark',
        summary:
          'Images are links with a leading `!`. The text in brackets becomes the alt text — describe the image for people who can’t see it.',
        entries: [
          {
            source:
              '![Milky Way over a desert](https://imagedelivery.net/dUGyBDwDArlYQF97CccBHg/94528f14-4913-4f02-c6dd-6f5734a98400/public "Under the stars")',
          },
          {
            label: 'Linked images & badges',
            source:
              '[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT) [![Made with markdown](https://img.shields.io/badge/made%20with-markdown-black.svg)](https://commonmark.org)',
          },
        ],
        tips: [
          'Markdown has no syntax for size — use HTML: `<img src="logo.png" width="120" alt="Logo">`.',
          'Center an image with `<p align="center"><img src="…"></p>`, as many READMEs do.',
        ],
      },
      {
        id: 'horizontal-rules',
        title: 'Horizontal rules',
        support: 'commonmark',
        summary:
          'Three or more dashes, asterisks or underscores on a line of their own make a thematic break.',
        entries: [{ source: lines('Above the break.', '', '---', '', 'Below the break.') }],
        tips: [
          'Leave a blank line above `---`: directly under a line of text it turns that text into a heading instead.',
        ],
      },
      {
        id: 'escaping',
        title: 'Escaping characters',
        support: 'commonmark',
        summary: 'Put a backslash before any markdown character to show it literally.',
        entries: [
          {
            source: lines(
              '\\*Not italic\\* and \\# not a heading.',
              '',
              '1986\\. A great year — not a list.',
              '',
              'Use \\`backticks\\` without code.',
            ),
          },
        ],
        tips: [
          'Characters you can escape: `\\` `` ` `` `*` `_` `{}` `[]` `()` `#` `+` `-` `.` `!` `|`',
        ],
      },
    ],
  },
  {
    id: 'gfm',
    numeral: 'II',
    title: 'GitHub Flavored Markdown',
    intro:
      'GFM adds tables, task lists, strikethrough, autolinks and footnotes to CommonMark. It’s supported by GitHub, GitLab, VS Code, Obsidian, Reddit and RenderMD.',
    sections: [
      {
        id: 'tables',
        title: 'Tables',
        support: 'gfm',
        summary:
          'Separate columns with pipes and put a row of dashes under the header. Colons in that row align the column left, center or right.',
        entries: [
          {
            source: lines(
              '| Planet  | Moons | Day length |',
              '| :------ | :---: | ---------: |',
              '| Mercury |   0   |    4,222 h |',
              '| Earth   |   1   |       24 h |',
              '| Mars    |   2   |     24.7 h |',
            ),
          },
          {
            label: 'Formatting inside cells',
            source: lines(
              '| Syntax | Result |',
              '| --- | --- |',
              '| `**bold**` | **bold** |',
              '| `a \\| b` | a \\| b |',
              '| Line<br>break | via `<br>` |',
            ),
          },
        ],
        tips: [
          'The pipes don’t need to line up — but aligned tables are easier to read in source. RenderMD’s Table button inserts a starter.',
          'Escape a literal pipe inside a cell with `\\|`.',
          'Cells can only hold inline content. Use `<br>` for line breaks; lists and code blocks aren’t allowed.',
        ],
      },
      {
        id: 'task-lists',
        title: 'Task lists',
        support: 'gfm',
        summary: 'Add `[ ]` or `[x]` after a list bullet to make a checklist.',
        entries: [
          {
            source: lines(
              '- [x] Write the draft',
              '- [x] Add a diagram',
              '- [ ] Share the link',
              '  - [ ] Nested tasks work too',
            ),
          },
        ],
        tips: [
          'In the RenderMD editor you can tick the boxes right in the preview — the markdown updates itself.',
        ],
      },
      {
        id: 'strikethrough',
        title: 'Strikethrough',
        support: 'gfm',
        summary: 'Wrap text in double tildes to strike it through.',
        entries: [{ source: 'The meeting is ~~Tuesday~~ Wednesday.' }],
      },
      {
        id: 'footnotes',
        title: 'Footnotes',
        support: 'gfm',
        summary:
          'Add a reference like `[^1]` in the text and define it anywhere below. Footnotes are numbered automatically and collected at the end.',
        entries: [
          {
            source: lines(
              'Markdown was created in 2004.[^origin] It was standardised as CommonMark in 2014.[^spec]',
              '',
              '[^origin]: By John Gruber, with Aaron Swartz.',
              '[^spec]: See https://commonmark.org.',
            ),
          },
        ],
        tips: ['Labels can be words: `[^note]`. They’re renumbered in order of appearance.'],
      },
      {
        id: 'alerts',
        title: 'Alerts',
        support: 'github',
        summary:
          'A blockquote that starts with `[!NOTE]`, `[!TIP]`, `[!IMPORTANT]`, `[!WARNING]` or `[!CAUTION]` becomes a callout.',
        entries: [
          { source: lines('> [!NOTE]', '> Useful information worth a glance.') },
          { source: lines('> [!TIP]', '> A better way to do something.') },
          { source: lines('> [!IMPORTANT]', '> Key information users need to know.') },
          { source: lines('> [!WARNING]', '> Urgent info that needs immediate attention.') },
          { source: lines('> [!CAUTION]', '> Advises about risks or negative outcomes.') },
        ],
        tips: ['The marker must be on the first line of the quote, on its own.'],
      },
    ],
  },
  {
    id: 'beyond',
    numeral: 'III',
    title: 'Beyond the spec',
    intro:
      'Math, diagrams, emoji and HTML aren’t part of any markdown standard, but they’re supported by GitHub, GitLab, Obsidian and RenderMD — and they make documents far more expressive.',
    sections: [
      {
        id: 'math',
        title: 'Math',
        support: 'extended',
        summary:
          'Write LaTeX between single dollar signs for inline math and double dollar signs for display equations. RenderMD typesets it with KaTeX.',
        entries: [
          {
            label: 'Inline',
            source: 'Pythagoras: $a^2 + b^2 = c^2$, and Euler: $e^{i\\pi} + 1 = 0$.',
          },
          {
            label: 'Display',
            source: lines('$$', '\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}', '$$'),
          },
          {
            label: 'Multi-line',
            source: lines(
              '$$',
              '\\begin{aligned}',
              '\\nabla \\cdot \\mathbf{E} &= \\frac{\\rho}{\\varepsilon_0} \\\\',
              '\\nabla \\cdot \\mathbf{B} &= 0',
              '\\end{aligned}',
              '$$',
            ),
          },
          {
            label: 'Math code block',
            source: lines(
              `${fence}math`,
              'f(x) = \\int_{-\\infty}^{\\infty} \\hat f(\\xi)\\, e^{2 \\pi i \\xi x} \\,d\\xi',
              fence,
            ),
          },
        ],
        tips: [
          'Write a literal dollar sign as `\\$`.',
          'Browse every supported command in the [KaTeX documentation](https://katex.org/docs/supported.html).',
        ],
      },
      {
        id: 'diagrams',
        title: 'Diagrams',
        support: 'extended',
        summary:
          'A code block with the language `mermaid` becomes a diagram: flowcharts, sequence diagrams, Gantt charts, class and state diagrams, pie charts, timelines and more.',
        entries: [
          {
            label: 'Flowchart',
            source: lines(
              `${fence}mermaid`,
              'flowchart LR',
              '  Write --> Render{Looks good?}',
              '  Render -->|Yes| Share',
              '  Render -->|No| Write',
              fence,
            ),
          },
          {
            label: 'Sequence diagram',
            source: lines(
              `${fence}mermaid`,
              'sequenceDiagram',
              '  You->>RenderMD: Paste markdown',
              '  RenderMD-->>You: Typeset page',
              '  You->>Friend: Share link',
              fence,
            ),
          },
          {
            label: 'Pie chart',
            source: lines(
              `${fence}mermaid`,
              'pie title Time spent writing docs',
              '  "Writing" : 45',
              '  "Formatting" : 15',
              '  "Fighting the editor" : 40',
              fence,
            ),
          },
        ],
        tips: [
          'Every diagram type and option is documented at [mermaid.js.org](https://mermaid.js.org/intro/).',
          'In RenderMD, switch Diagrams to *Sketch* in the reading settings for a hand-drawn look.',
        ],
      },
      {
        id: 'emoji',
        title: 'Emoji',
        support: 'extended',
        summary: 'Type an emoji shortcode between colons, or paste the emoji itself.',
        entries: [{ source: 'Ship it :rocket: — great work :tada: :sparkles: :white_check_mark:' }],
        tips: ['Shortcodes follow GitHub’s names, the same ones used in GitHub issues and Slack.'],
      },
      {
        id: 'html',
        title: 'HTML',
        support: 'extended',
        summary:
          'Most renderers allow a safe subset of HTML for things markdown can’t do. Leave a blank line between HTML and markdown so the markdown inside is still parsed.',
        entries: [
          {
            label: 'Collapsible sections',
            source: lines(
              '<details>',
              '<summary>Show the answer</summary>',
              '',
              'Forty-two. Markdown **still works** in here.',
              '',
              '</details>',
            ),
          },
          {
            label: 'Keyboard keys',
            source:
              'Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy, <kbd>⌘</kbd> + <kbd>K</kbd> for commands.',
          },
          {
            label: 'Sub, superscript & highlight',
            source: 'H<sub>2</sub>O, E = mc<sup>2</sup>, and a <mark>highlighted</mark> phrase.',
          },
        ],
        tips: [
          'Scripts, styles, event handlers and iframes are removed for safety — on GitHub and in RenderMD alike.',
          '`<mark>` highlights work in RenderMD but are stripped on GitHub.',
        ],
      },
      {
        id: 'comments',
        title: 'Comments',
        support: 'commonmark',
        summary:
          'HTML comments are hidden from the rendered page — perfect for notes to yourself or other authors.',
        entries: [
          {
            source: lines(
              'Visible text.',
              '',
              '<!-- TODO: add screenshots before publishing -->',
              '',
              'More visible text.',
            ),
          },
        ],
      },
      {
        id: 'frontmatter',
        title: 'Frontmatter',
        support: 'extended',
        summary:
          'A YAML block between `---` lines at the very top of a file holds metadata such as a title, date or tags. Static site generators like Jekyll, Hugo and Astro read it.',
        entries: [
          {
            source: lines(
              '---',
              'title: Release notes',
              'date: 2026-10-01',
              'tags: [changelog, v2]',
              '---',
              '',
              '# What’s new',
            ),
          },
        ],
        tips: [
          'It must be the very first thing in the file. RenderMD shows it as a metadata card and uses `title` as the document name.',
        ],
      },
    ],
  },
]

export const SECTIONS = CHAPTERS.flatMap((chapter) => chapter.sections)

/** A dense one-screen reference — the bit people come back for. */
export const QUICK_REFERENCE: Array<{ element: string; syntax: string; id: string }> = [
  { element: 'Heading', syntax: '# H1  ## H2  ### H3', id: 'headings' },
  { element: 'Bold', syntax: '**bold text**', id: 'emphasis' },
  { element: 'Italic', syntax: '*italic text*', id: 'emphasis' },
  { element: 'Strikethrough', syntax: '~~struck text~~', id: 'strikethrough' },
  { element: 'Blockquote', syntax: '> quoted text', id: 'blockquotes' },
  { element: 'Ordered list', syntax: '1. First item', id: 'lists' },
  { element: 'Unordered list', syntax: '- First item', id: 'lists' },
  { element: 'Task list', syntax: '- [x] Done', id: 'task-lists' },
  { element: 'Inline code', syntax: '`code`', id: 'code' },
  { element: 'Code block', syntax: '```js … ```', id: 'code' },
  { element: 'Link', syntax: '[title](https://example.com)', id: 'links' },
  { element: 'Image', syntax: '![alt text](image.png)', id: 'images' },
  { element: 'Table', syntax: '| A | B |\n|---|---|', id: 'tables' },
  { element: 'Footnote', syntax: 'Text[^1]  [^1]: Note', id: 'footnotes' },
  { element: 'Horizontal rule', syntax: '---', id: 'horizontal-rules' },
  { element: 'Line break', syntax: 'end a line with \\', id: 'paragraphs' },
  { element: 'Alert', syntax: '> [!NOTE]', id: 'alerts' },
  { element: 'Math', syntax: '$E = mc^2$', id: 'math' },
  { element: 'Diagram', syntax: '```mermaid', id: 'diagrams' },
  { element: 'Emoji', syntax: ':rocket:', id: 'emoji' },
  { element: 'Escape', syntax: '\\*not italic\\*', id: 'escaping' },
  { element: 'Comment', syntax: '<!-- hidden -->', id: 'comments' },
]

export const FAQ: Array<{ question: string; answer: string }> = [
  {
    question: 'What is markdown?',
    answer:
      'Markdown is a lightweight way to format plain text. You write `**bold**` or `# Heading` and a renderer turns it into formatted text. It was created by John Gruber in 2004 and is now used everywhere from GitHub READMEs to notes apps, chat tools and documentation sites.',
  },
  {
    question: 'What’s the difference between CommonMark and GitHub Flavored Markdown?',
    answer:
      '**CommonMark** is the formal specification of core markdown — headings, emphasis, lists, links, images, code and quotes. **GitHub Flavored Markdown (GFM)** is a superset that adds tables, task lists, strikethrough, autolinks and footnotes. Anything written in CommonMark also works in GFM.',
  },
  {
    question: 'How do I add a line break without starting a new paragraph?',
    answer:
      'End the line with a backslash (`\\`) or two spaces. A blank line starts a new paragraph, and a single newline on its own is treated as a space.',
  },
  {
    question: 'How do I make a table in markdown?',
    answer:
      'Separate columns with `|` and add a line of dashes under the header row: `| Name | Role |` then `| --- | --- |`. Put colons in the dash row to align columns: `:---` left, `:---:` center, `---:` right.',
  },
  {
    question: 'How do I write math equations in markdown?',
    answer:
      'Use LaTeX between dollar signs: `$E = mc^2$` for inline math and `$$ … $$` on their own lines for display equations. GitHub, GitLab, Obsidian and RenderMD all support this syntax.',
  },
  {
    question: 'Can I use HTML in markdown?',
    answer:
      'Yes — most renderers allow a safe subset of HTML for things markdown can’t express, like `<details>` for collapsible sections, `<kbd>` for keys and `<img width="…">` for sized images. Scripts and event handlers are always removed.',
  },
  {
    question: 'How can I preview a markdown file?',
    answer:
      'Paste or drop it into [RenderMD](https://www.render-md.com) — it renders instantly in your browser, including tables, math and diagrams, without uploading the file anywhere. You can also open a URL or a GitHub repository directly.',
  },
]

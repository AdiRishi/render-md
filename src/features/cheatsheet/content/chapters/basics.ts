import { fence, lines } from '../authoring'
import { type CheatsheetChapter } from '../types'

export const basics: CheatsheetChapter = {
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
}

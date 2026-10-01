import { lines } from '../authoring'
import { type CheatsheetChapter } from '../types'

export const gfm: CheatsheetChapter = {
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
}

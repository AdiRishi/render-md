import { fence, lines } from '../authoring'
import { type CheatsheetChapter } from '../types'

export const beyond: CheatsheetChapter = {
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
}

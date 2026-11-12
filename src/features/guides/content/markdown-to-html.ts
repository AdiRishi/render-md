import { fence, lines } from '@/lib/markdown-authoring'

import { type Guide } from './types'

export const markdownToHtml: Guide = {
  slug: 'markdown-to-html',
  h1: ['Markdown', 'to HTML'],
  lede: 'Type markdown and get the HTML it becomes. Copy the markup for your own page, or download a styled web page that opens anywhere.',
  metaTitle: 'Markdown to HTML Converter: Copy the Markup or a Web Page | RenderMD',
  metaDescription:
    'Convert markdown to HTML in your browser. Copy clean markup with highlighted code, tables and math, or download a standalone web page with the styles included. Free, nothing uploaded.',
  ogImageAlt: 'Markdown beside the HTML it becomes, in RenderMD',
  tool: {
    kind: 'specimens',
    shows: 'html',
    entries: [
      {
        source: lines(
          '## Release notes',
          '',
          'Version **2.4** adds *offline mode* and fixes [two bugs](https://example.com/changelog).',
          '',
          '- Faster startup',
          '- Smaller downloads',
        ),
      },
    ],
  },
  sections: [
    {
      id: 'three-ways',
      title: 'Three ways to get HTML',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'Open your file in [RenderMD](https://www.render-md.com/?new), then use the **Export** menu.',
            '',
            '| Choose | You get | Use it for |',
            '| :--- | :--- | :--- |',
            '| **Copy → HTML** | The document’s markup, on your clipboard | Pasting into a template, a CMS or your own page |',
            '| **Download → Web page (.html)** | One file with the typeset and theme styles inside it | Sending or hosting a page that looks like the preview |',
            '| **Copy → Formatted text** | Formatted text, with markdown as a fallback | Pasting into Google Docs, Word, Gmail or Notion |',
            '',
            'The downloaded page loads its fonts from Google Fonts and the math styles from jsDelivr. Everything else is in the file.',
          ),
        },
      ],
    },
    {
      id: 'examples',
      title: 'How markdown maps to HTML',
      blocks: [
        {
          kind: 'prose',
          markdown:
            'Edit an example to see the markup change. Each one shows what goes inside the `<article>`. RenderMD follows CommonMark and GitHub Flavored Markdown, so the HTML matches what other standard converters produce for the same text.',
        },
        {
          kind: 'specimens',
          shows: 'html',
          entries: [
            {
              label: 'Emphasis and links',
              source:
                'Read the **[migration guide](https://example.com/migrate)** before you _upgrade_.',
            },
            {
              label: 'Lists and task lists',
              source: lines('1. Install', '2. Configure', '', '- [x] Tests pass', '- [ ] Docs'),
            },
            {
              label: 'Tables',
              source: lines(
                '| Plan | Price |',
                '| :--- | ---: |',
                '| Free | $0 |',
                '| Team | $12 |',
              ),
            },
            {
              label: 'Blockquotes and code',
              source: lines('> Ship small changes often.', '', 'Run `pnpm test` before you push.'),
            },
          ],
        },
      ],
    },
    {
      id: 'markup',
      title: 'What the markup contains',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            '- **One `<article class="doc">` element** wraps the document. Headings carry `id`s, so links to `#sections` work.',
            '- **Code blocks** are split into `<span class="token">` elements, coloured by the `--shiki-light` and `--shiki-dark` CSS variables. Give `.token` a `color` that reads one of them, or use the downloaded page, which does it for you.',
            '- **Math** is KaTeX markup. It needs [KaTeX’s stylesheet](https://katex.org/docs/browser) on your page.',
            '- **Mermaid diagrams** are inline `<svg>` elements, so they need nothing else.',
            '- **Task list checkboxes** are disabled `<input>`s.',
            '- **Links** are absolute, so they work wherever you paste the markup. Links to other sites carry `target="_blank"` and `rel="noopener noreferrer"`.',
            '',
            'Scripts, inline event handlers and other unsafe HTML in the markdown are removed before rendering, using GitHub’s sanitizing rules.',
          ),
        },
      ],
    },
    {
      id: 'by-hand',
      title: 'Styling the copied HTML',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'The markup has no styles of its own. A few rules make it readable on a plain page:',
            '',
            `${fence}css`,
            '.doc { max-width: 42rem; margin: 0 auto; line-height: 1.6; }',
            '.doc pre { overflow-x: auto; padding: 1rem; }',
            '.doc pre .token { color: var(--shiki-light); }',
            '.doc table { border-collapse: collapse; }',
            '.doc :is(th, td) { border: 1px solid #ddd; padding: 0.4rem 0.6rem; }',
            fence,
          ),
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is the HTML safe to put on my site?',
      answer:
        'Yes. RenderMD removes scripts, `style` attributes, event handlers and other unsafe HTML from the markdown before it renders, using the same rules as GitHub.',
    },
    {
      question: 'Can I convert HTML back to markdown?',
      answer: 'No. RenderMD converts markdown to HTML only.',
    },
    {
      question: 'Does the converter support GitHub Flavored Markdown?',
      answer:
        'Yes: tables, task lists, strikethrough, autolinks, footnotes and alerts, plus LaTeX math and Mermaid diagrams. The [cheat sheet](/cheatsheet) shows each one.',
    },
    {
      question: 'Is my markdown uploaded?',
      answer:
        'No. The conversion runs in your browser, and RenderMD’s servers never receive your document.',
    },
  ],
  cta: 'Open a markdown file and copy its HTML.',
}

import { fence, lines } from '@/lib/markdown-authoring'

import { type Guide } from './types'

export const markdownToPdf: Guide = {
  slug: 'markdown-to-pdf',
  h1: ['Markdown', 'to PDF'],
  lede: 'Turn a markdown file into a PDF with page numbers, a title page and a linked contents page. The PDF is made in your browser, so the file never leaves your device.',
  metaTitle: 'Markdown to PDF: Convert MD Files in Your Browser | RenderMD',
  metaDescription:
    'Convert markdown to PDF with A4 or Letter paper, page numbers, a title page from your frontmatter and a linked contents page. Tables, code, math and Mermaid diagrams included. Free, nothing uploaded.',
  ogImageAlt: 'A markdown document laid out as PDF pages in RenderMD',
  tool: { kind: 'pdf-settings' },
  sections: [
    {
      id: 'how-to',
      title: 'Convert a markdown file to PDF',
      blocks: [
        {
          kind: 'steps',
          steps: [
            {
              title: 'Open the file',
              markdown:
                'Drop a `.md` file onto [RenderMD](https://www.render-md.com/?new), open it from the menu, paste its text, or open it from a GitHub link.',
            },
            {
              title: 'Open Save as PDF',
              markdown:
                'Press <kbd>⌘</kbd> <kbd>P</kbd> on a Mac or <kbd>Ctrl</kbd> <kbd>P</kbd> on Windows and Linux, or choose **Export → PDF document**.',
            },
            {
              title: 'Set up the pages',
              markdown:
                'Choose the paper, margins and typeset, and turn on the title page, contents, page numbers and running header you want. The preview beside the settings updates as you go, and RenderMD remembers your choices.',
            },
            {
              title: 'Save',
              markdown:
                'Select **Save PDF**. Your browser’s print dialog opens with the pages laid out; choose *Save as PDF* as the destination. The file is named after the document’s title.',
            },
          ],
        },
      ],
    },
    {
      id: 'settings',
      title: 'Page setup',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            '| Setting | Choices |',
            '| :--- | :--- |',
            '| Paper | A4 or Letter. The default follows your browser’s language and region. |',
            '| Margins | Narrow, Normal or Wide. |',
            '| Typeset | Modern (Hanken Grotesk), Editorial (Newsreader) or Technical (Geist Mono). |',
            '| Title page | The title, subtitle, author and date from the frontmatter. |',
            '| Contents | A page listing the headings, each one a link to its page. Needs at least two headings. |',
            '| Page numbers | A folio at the foot of each page. |',
            '| Running header | The document’s title at the top of each page. |',
            '',
            'Page numbers and the running header need Chrome or Edge. In other browsers, the print dialog can add its own.',
          ),
        },
      ],
    },
    {
      id: 'title-page',
      title: 'A title page from frontmatter',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'Put the details at the top of the file between `---` lines. RenderMD reads `title`, `subtitle` (or `description`), `author` (or a list of `authors`) and `date`. A date written as `2026-03-14` is printed in full.',
            '',
            `${fence}yaml`,
            '---',
            'title: Quarterly report',
            'subtitle: Q1 2026',
            'author: Jo Rivera',
            'date: 2026-03-14',
            '---',
            fence,
            '',
            'Without a title in the frontmatter, the title page uses the document’s first heading.',
          ),
        },
      ],
    },
    {
      id: 'page-breaks',
      title: 'Page breaks',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'To start a new page, put this comment on a line of its own. It doesn’t show anywhere else.',
            '',
            `${fence}markdown`,
            '<!-- pagebreak -->',
            fence,
            '',
            '`<!-- page-break -->` and `<!-- newpage -->` work too, and so does the `<div style="page-break-after: always"></div>` that Typora, Obsidian and other editors write.',
            '',
            'RenderMD also breaks pages for you. A heading always stays with the text after it. Code blocks up to 25 lines and tables up to 12 rows stay on one page; longer ones continue onto the next, and a table repeats its header row on each page.',
          ),
        },
      ],
    },
    {
      id: 'what-prints',
      title: 'What the PDF keeps',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            '- **Syntax highlighting** for code in 200+ languages.',
            '- **Math** typeset with KaTeX.',
            '- **Mermaid diagrams**, as vector graphics that stay sharp when you zoom.',
            '- **Links**, which stay clickable. Contents entries and links within the document go to the right page.',
            '- **Images**, sized to fit the page.',
            '',
            'The PDF is always printed on white, even when you read in the dark theme, and diagrams switch to their light colours.',
          ),
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is my file uploaded to convert it?',
      answer:
        'No. RenderMD lays out the pages in your browser and your browser saves the PDF. RenderMD’s servers never receive the document.',
    },
    {
      question: 'Why are there no page numbers in my PDF?',
      answer:
        'Page numbers and the running header use a print feature that Chrome and Edge support and other browsers don’t yet. In Safari or Firefox, turn on headers and footers in the print dialog instead.',
    },
    {
      question: 'Can I convert markdown to PDF without opening the editor?',
      answer:
        'Yes. Switch to the Read view, which shows only the page, and press <kbd>⌘</kbd> <kbd>P</kbd> or <kbd>Ctrl</kbd> <kbd>P</kbd>. You don’t have to edit the file first.',
    },
    {
      question: 'Can I export to Word or HTML instead?',
      answer:
        'For Word, Google Docs or email, use **Copy → Formatted text** and paste. For a web page, use **Download → Web page (.html)**, which keeps the typeset and theme in one file. The [markdown to HTML guide](/markdown-to-html) covers both.',
    },
  ],
  cta: 'Open a markdown file and save it as a PDF.',
}

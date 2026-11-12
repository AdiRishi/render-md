import { fence, lines } from '@/lib/markdown-authoring'

import { type Guide } from './types'

const mermaid = (...code: string[]) => lines(`${fence}mermaid`, ...code, fence)

export const mermaidViewer: Guide = {
  slug: 'mermaid-viewer',
  h1: ['Mermaid', 'viewer'],
  lede: 'Write Mermaid and see the diagram as you type. Edit the example, or open a markdown file that has diagrams in it.',
  metaTitle: 'Mermaid Viewer and Live Editor: Preview Diagrams Online | RenderMD',
  metaDescription:
    'Preview Mermaid diagrams as you type: flowcharts, sequence, class, state, ER, Gantt, pie, mindmap and timeline. Expand, zoom, download as PNG or copy as an image. Free, in your browser.',
  ogImageAlt: 'A Mermaid flowchart drawn in RenderMD',
  tool: {
    kind: 'specimens',
    shows: 'page',
    entries: [
      {
        source: mermaid(
          'flowchart LR',
          '  Idea --> Draft --> Review{Approved?}',
          '  Review -->|Yes| Publish',
          '  Review -->|No| Draft',
        ),
      },
    ],
  },
  sections: [
    {
      id: 'diagram-types',
      title: 'Diagram types',
      blocks: [
        {
          kind: 'prose',
          markdown:
            'Each example below is live. Change the code and the diagram redraws. The [Mermaid documentation](https://mermaid.js.org/intro/) lists every option for each type.',
        },
        {
          kind: 'gallery',
          items: [
            {
              id: 'flowchart',
              title: 'Flowchart',
              summary:
                'Boxes joined by arrows. `LR` lays it out left to right; `TD` goes top down. Curly braces make a decision.',
              source: mermaid(
                'flowchart TD',
                '  Start([Order placed]) --> Paid{Paid?}',
                '  Paid -->|Yes| Ship[Ship order]',
                '  Paid -->|No| Remind[Send reminder]',
                '  Remind --> Paid',
              ),
            },
            {
              id: 'sequence-diagram',
              title: 'Sequence diagram',
              summary:
                'Messages between participants, in order. `->>` is a call; `-->>` is a reply.',
              source: mermaid(
                'sequenceDiagram',
                '  Browser->>API: POST /login',
                '  API->>Database: Find user',
                '  Database-->>API: User',
                '  API-->>Browser: Session cookie',
              ),
            },
            {
              id: 'class-diagram',
              title: 'Class diagram',
              summary: 'Classes with their fields and methods, and how they relate.',
              source: mermaid(
                'classDiagram',
                '  class Order {',
                '    +String id',
                '    +total() Money',
                '  }',
                '  class LineItem {',
                '    +int quantity',
                '  }',
                '  Order "1" --> "*" LineItem',
              ),
            },
            {
              id: 'state-diagram',
              title: 'State diagram',
              summary: 'The states something moves through. `[*]` marks the start and the end.',
              source: mermaid(
                'stateDiagram-v2',
                '  [*] --> Draft',
                '  Draft --> Review: submit',
                '  Review --> Draft: request changes',
                '  Review --> Published: approve',
                '  Published --> [*]',
              ),
            },
            {
              id: 'er-diagram',
              title: 'Entity relationship diagram',
              summary:
                'Tables and the relationships between them. `||--o{` reads as one to zero-or-more.',
              source: mermaid(
                'erDiagram',
                '  CUSTOMER ||--o{ ORDER : places',
                '  ORDER ||--|{ LINE_ITEM : contains',
                '  PRODUCT ||--o{ LINE_ITEM : "appears in"',
              ),
            },
            {
              id: 'gantt-chart',
              title: 'Gantt chart',
              summary: 'Tasks on a timeline. `after` starts a task when another one ends.',
              source: mermaid(
                'gantt',
                '  dateFormat YYYY-MM-DD',
                '  axisFormat %b %e',
                '  tickInterval 1week',
                '  section Build',
                '    Design :design, 2026-01-05, 10d',
                '    Develop :dev, after design, 20d',
                '  section Launch',
                '    Beta :after dev, 7d',
              ),
            },
            {
              id: 'pie-chart',
              title: 'Pie chart',
              summary: 'Parts of a whole. Each slice is a label and a number.',
              source: mermaid(
                'pie title Where the week went',
                '  "Meetings" : 12',
                '  "Building" : 21',
                '  "Reviews" : 7',
              ),
            },
            {
              id: 'mindmap',
              title: 'Mindmap',
              summary: 'Ideas branching from a root. Indentation sets the level.',
              source: mermaid(
                'mindmap',
                '  root((Launch))',
                '    Docs',
                '      Guide',
                '      API reference',
                '    Marketing',
                '      Blog post',
              ),
            },
            {
              id: 'timeline',
              title: 'Timeline',
              summary: 'Events grouped by period.',
              source: mermaid(
                'timeline',
                '  title Release history',
                '  2024 : 1.0 : First release',
                '  2025 : 2.0 : Plugins',
                '  2026 : 3.0 : Offline mode',
              ),
            },
          ],
        },
      ],
    },
    {
      id: 'reading-diagrams',
      title: 'Expand, download and copy',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'Hover over a diagram for its controls.',
            '',
            '- **Expand** opens the diagram full screen. Drag to pan, scroll or pinch to zoom.',
            '- **Download** saves it as a PNG at twice its size, on the page’s background.',
            '- **Copy** puts the image on your clipboard, ready to paste into a doc, a slide or a chat.',
            '',
            'In RenderMD’s reading settings, switch Diagrams to *Sketch* for a hand-drawn look. Diagrams follow the light or dark theme, and always print in the light palette.',
          ),
        },
      ],
    },
    {
      id: 'in-markdown',
      title: 'Mermaid in a markdown file',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'In a markdown file, put the diagram in a code block whose language is `mermaid`. GitHub, GitLab and RenderMD all draw these blocks as diagrams, so the same file works in each.',
            '',
            mermaid('flowchart LR', '  A --> B'),
            '',
            'The [cheat sheet’s diagrams section](/cheatsheet#diagrams) covers this next to the rest of markdown’s syntax. To work on a whole document, [open the editor](/?new) and write the markdown and diagrams together.',
          ),
        },
      ],
    },
  ],
  faq: [
    {
      question: 'Is this the official Mermaid Live Editor?',
      answer:
        'No. The official editor is at [mermaid.live](https://mermaid.live). RenderMD draws diagrams with the same Mermaid library, inside markdown documents, so you can write the text around a diagram as well.',
    },
    {
      question: 'Why does my diagram show an error?',
      answer:
        'Mermaid stops at the first line it can’t parse and RenderMD shows its message instead of the diagram. Check the first line names a diagram type, like `flowchart LR` or `sequenceDiagram`, and that labels with spaces or brackets are in quotes.',
    },
    {
      question: 'Can I export a diagram as SVG?',
      answer:
        'Not directly. Download saves a PNG and Copy puts an image on your clipboard. To keep diagrams as vector graphics, save the whole document with **Export → PDF document**.',
    },
    {
      question: 'Do my diagrams leave my computer?',
      answer:
        'No. Mermaid runs in your browser, and documents are stored in your browser’s local storage. RenderMD’s servers never receive them.',
    },
  ],
  cta: 'Write the document around your diagrams.',
}

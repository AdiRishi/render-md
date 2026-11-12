import { fence, lines } from '@/lib/markdown-authoring'

import { type Guide } from './types'

export const githubReadmeViewer: Guide = {
  slug: 'github-readme-viewer',
  h1: ['GitHub README', 'viewer'],
  lede: 'Paste a link to a GitHub repository, file or gist and read its markdown as a typeset page. Nothing to install, and no GitHub account needed.',
  metaTitle: 'GitHub README Viewer: Preview Any README Online | RenderMD',
  metaDescription:
    'Paste a GitHub repository, file or gist link and read the README as a typeset page, with alerts, task lists, Mermaid diagrams, math and images from the repository. Free, no sign-up.',
  ogImageAlt: 'A GitHub README opened in RenderMD',
  tool: {
    kind: 'open-url',
    examples: [
      'github.com/facebook/react',
      'github.com/microsoft/vscode/blob/main/CONTRIBUTING.md',
      'github.com/mermaid-js/mermaid',
    ],
  },
  sections: [
    {
      id: 'urls',
      title: 'Links you can open',
      blocks: [
        {
          kind: 'prose',
          markdown:
            'Copy the address from your browser’s address bar. RenderMD rewrites GitHub, Gist and GitLab page links to the raw file behind them, so you don’t have to find the raw URL yourself.',
        },
        {
          kind: 'url-forms',
          rows: [
            { paste: 'github.com/owner/repo', opens: 'The README on the default branch' },
            {
              paste: 'github.com/owner/repo/tree/branch/docs',
              opens: 'The README in that folder, on that branch',
            },
            {
              paste: 'github.com/owner/repo/blob/main/docs/guide.md',
              opens: 'That file, from that branch, tag or commit',
            },
            { paste: 'gist.github.com/user/id', opens: 'The gist’s markdown' },
            {
              paste: 'gitlab.com/group/project/-/blob/main/README.md',
              opens: 'That file on GitLab',
            },
            {
              paste: 'raw.githubusercontent.com/owner/repo/main/README.md',
              opens: 'Any other markdown URL, as it is',
            },
          ],
        },
        {
          kind: 'prose',
          markdown:
            'For a repository, RenderMD tries `README.md`, then `readme.md`, `Readme.md`, `README.markdown` and `README`. Files up to 5 MB open. Only public repositories work, because RenderMD reads files without signing in to GitHub.',
        },
      ],
    },
    {
      id: 'link',
      title: 'Link to a rendered README',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            'Put the repository after `?url=` and the link opens the README in RenderMD. It loads the latest version each time, so you can share it once and leave it.',
            '',
            `${fence}text`,
            'https://www.render-md.com/?url=github.com/owner/repo',
            fence,
            '',
            'Links inside the README that point to other markdown files open in RenderMD too, so you can follow a project’s docs from page to page.',
          ),
        },
      ],
    },
    {
      id: 'github-markdown',
      title: 'What renders as on GitHub',
      blocks: [
        {
          kind: 'prose',
          markdown:
            'RenderMD supports GitHub Flavored Markdown and the extensions READMEs use most. Relative image paths load from the repository. Edit an example to see how it renders.',
        },
        {
          kind: 'specimens',
          shows: 'page',
          entries: [
            {
              label: 'Alerts',
              source: lines(
                '> [!NOTE]',
                '> Requires Node 22 or later.',
                '',
                '> [!WARNING]',
                '> This removes the build cache.',
              ),
            },
            {
              label: 'Task lists',
              source: lines(
                '## Roadmap',
                '',
                '- [x] Command-line interface',
                '- [x] Config file',
                '- [ ] Plugin API',
              ),
            },
            {
              label: 'Tables',
              source: lines(
                '| Option | Default | Description |',
                '| :--- | :---: | :--- |',
                '| `--watch` | `false` | Rebuild on change |',
                '| `--port` | `3000` | Dev server port |',
              ),
            },
            {
              label: 'Mermaid diagrams',
              source: lines(
                `${fence}mermaid`,
                'flowchart LR',
                '  Source --> Build --> Test --> Release',
                fence,
              ),
            },
            {
              label: 'Math',
              source: 'The error falls as $O(1/\\sqrt{n})$ with sample size $n$.',
            },
            {
              label: 'Collapsed sections',
              source: lines(
                '<details>',
                '<summary>Build from source</summary>',
                '',
                `${fence}sh`,
                'pnpm install',
                'pnpm build',
                fence,
                '',
                '</details>',
              ),
            },
          ],
        },
      ],
    },
    {
      id: 'differences',
      title: 'What’s different from GitHub',
      blocks: [
        {
          kind: 'prose',
          markdown: lines(
            '- **Private repositories don’t open.** RenderMD has no access to your GitHub account.',
            '- **Issue and user references stay as text.** `#123` and `@name` aren’t turned into links.',
            '- **Raw HTML is filtered the same way.** Tags GitHub allows, like `<details>`, `<kbd>` and `<img width>`, work. Scripts, styles and event handlers are removed.',
            '- **You choose the look.** Pick a typeset, switch between light and dark, and read with an outline of the headings beside the page.',
          ),
        },
      ],
    },
  ],
  faq: [
    {
      question: 'How do I preview a README before pushing it?',
      answer:
        'Open [RenderMD](https://www.render-md.com/?new) and paste the file, or drop it onto the page. The editor and the preview sit side by side, so you can fix it as you read. Nothing is uploaded.',
    },
    {
      question: 'Can I open a README from a private repository?',
      answer:
        'Not by link. RenderMD fetches files without signing in, so GitHub refuses private ones. Open the file from your computer instead, or paste its contents.',
    },
    {
      question: 'Why does an image in the README not show?',
      answer:
        'Relative image paths load from the repository you opened. An image fails when its path is wrong in the README itself, or when it’s stored with Git LFS, whose files aren’t served as raw content.',
    },
    {
      question: 'Does RenderMD keep a copy of the README?',
      answer:
        'Only in your browser. The document is saved to your browser’s local storage so it’s there next time, and RenderMD’s servers never receive it.',
    },
  ],
  cta: 'Read any markdown file as a typeset page.',
}

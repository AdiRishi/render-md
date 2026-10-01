/** Common questions, answered in markdown (also published as FAQPage JSON-LD). */
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

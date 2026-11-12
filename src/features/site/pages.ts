/**
 * The site's content pages: the cheat sheet and the guides. The workspace's
 * status bar, the footer and each guide's related links all read this list,
 * so a page added here is linked from everywhere at once.
 */
export const CONTENT_PAGES = [
  { to: '/cheatsheet', label: 'Markdown cheat sheet', short: 'Cheat sheet' },
  { to: '/mermaid-viewer', label: 'Mermaid viewer', short: 'Mermaid' },
  { to: '/markdown-to-pdf', label: 'Markdown to PDF', short: 'PDF' },
  { to: '/markdown-to-html', label: 'Markdown to HTML', short: 'HTML' },
  { to: '/markdown-table-generator', label: 'Markdown table generator', short: 'Tables' },
] as const satisfies ReadonlyArray<{ to: `/${string}`; label: string; short: string }>

export type ContentPage = (typeof CONTENT_PAGES)[number]

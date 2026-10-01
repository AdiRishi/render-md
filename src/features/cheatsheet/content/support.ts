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

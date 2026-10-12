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
      'GitHub Flavored Markdown — supported by GitHub, GitLab, Reddit, VS Code and many other tools.',
  },
  github: {
    label: 'GitHub',
    description: 'A GitHub extension, also supported by RenderMD and some other tools.',
  },
  extended: {
    label: 'Extended',
    description:
      'Not part of any spec, but supported by GitHub, GitLab, Obsidian, RenderMD and others.',
  },
}

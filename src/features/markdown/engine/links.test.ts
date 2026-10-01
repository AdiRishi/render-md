import { describe, expect, it } from 'vitest'

import { isMarkdownUrl } from './links'

describe('isMarkdownUrl', () => {
  it('recognises links to markdown files', () => {
    expect(isMarkdownUrl('https://raw.githubusercontent.com/o/r/HEAD/CONTRIBUTING.md')).toBe(true)
    expect(isMarkdownUrl('https://example.com/page.html')).toBe(false)
    expect(isMarkdownUrl('/relative.md')).toBe(false)
  })
})

import { describe, expect, it } from 'vitest'

import { guessTitle, toggleTaskAtLine } from './source'

describe('toggleTaskAtLine', () => {
  const doc = '# Tasks\n\n- [ ] one\n- [x] two\n  * [X] nested\n1. [ ] numbered\n- not a task'

  it('toggles checkboxes on the given line', () => {
    expect(toggleTaskAtLine(doc, 3)).toContain('- [x] one')
    expect(toggleTaskAtLine(doc, 4)).toContain('- [ ] two')
    expect(toggleTaskAtLine(doc, 5)).toContain('  * [ ] nested')
    expect(toggleTaskAtLine(doc, 6)).toContain('1. [x] numbered')
  })

  it('returns null when the line has no task', () => {
    expect(toggleTaskAtLine(doc, 1)).toBeNull()
    expect(toggleTaskAtLine(doc, 7)).toBeNull()
    expect(toggleTaskAtLine(doc, 99)).toBeNull()
  })
})

describe('guessTitle', () => {
  it('prefers frontmatter, then headings, then the first line', () => {
    expect(guessTitle('---\ntitle: "From YAML"\n---\n# Heading')).toBe('From YAML')
    expect(guessTitle('intro\n\n## The **Real** [Title](x)')).toBe('The Real Title')
    expect(guessTitle('Just some *text* here')).toBe('Just some text here')
    expect(guessTitle('   \n\n')).toBeNull()
    // A later `---` block is not frontmatter.
    expect(guessTitle('Intro\n\n---\ntitle: Wrong\n\n---')).toBe('Intro')
  })
})

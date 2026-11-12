import { describe, expect, it } from 'vitest'

import { coverFromFrontmatter } from './cover'

describe('coverFromFrontmatter', () => {
  it('reads title, subtitle, author and date', () => {
    expect(
      coverFromFrontmatter(
        { title: 'Field notes', subtitle: 'Spring', author: 'Ada Lovelace', date: '2026-03-09' },
        'Fallback',
        'en-US',
      ),
    ).toEqual({
      title: 'Field notes',
      subtitle: 'Spring',
      authors: ['Ada Lovelace'],
      date: 'March 9, 2026',
    })
  })

  it('accepts authors as a list of names or of objects with a name', () => {
    const cover = coverFromFrontmatter(
      { authors: ['Ada', { name: 'Grace', email: 'g@example.com' }, 42, { role: 'x' }] },
      'Doc',
    )
    expect(cover.authors).toEqual(['Ada', 'Grace', '42'])
  })

  it('falls back to the document title and description, and keeps free-form dates', () => {
    const cover = coverFromFrontmatter(
      { title: { nested: true }, description: 'About it', date: 'Spring 2026' },
      'Doc title',
    )
    expect(cover).toEqual({
      title: 'Doc title',
      subtitle: 'About it',
      authors: [],
      date: 'Spring 2026',
    })
  })

  it('reads a timestamp as its calendar date', () => {
    expect(coverFromFrontmatter({ date: '2026-03-09T23:30:00.000Z' }, 'Doc', 'en-GB').date).toBe(
      '9 March 2026',
    )
  })
})

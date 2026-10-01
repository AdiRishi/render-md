import { describe, expect, it } from 'vitest'

import { formatBytes, formatRelativeTime, toFileSlug } from './format'

describe('format', () => {
  it('formats byte sizes', () => {
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(2048)).toBe('2.0 KB')
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.00 MB')
  })

  it('formats relative times', () => {
    const now = Date.UTC(2026, 9, 1)
    expect(formatRelativeTime(now - 10_000, now)).toBe('just now')
    expect(formatRelativeTime(now - 3 * 3_600_000, now)).toMatch(/3 hours ago/)
  })

  it('slugs file names', () => {
    expect(toFileSlug('Café Notes: Q3 — Draft!')).toBe('cafe-notes-q3-draft')
    expect(toFileSlug('***')).toBe('document')
  })
})

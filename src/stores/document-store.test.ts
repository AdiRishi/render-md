import { describe, expect, it } from 'vitest'

import { type DocumentRecord, SAMPLE_MARKDOWN, archiveDocument } from './document-store'

const doc = (overrides: Partial<DocumentRecord>): DocumentRecord => ({
  id: 'a',
  markdown: '# A',
  name: null,
  baseUrl: null,
  source: 'local',
  updatedAt: 1,
  ...overrides,
})

describe('archiveDocument', () => {
  it('puts the current document first', () => {
    const recents = archiveDocument([doc({ id: 'old', markdown: '# Old' })], doc({}))
    expect(recents.map((entry) => entry.id)).toEqual(['a', 'old'])
  })

  it('skips the untouched sample and empty pages', () => {
    expect(archiveDocument([], doc({ source: 'sample', markdown: SAMPLE_MARKDOWN }))).toEqual([])
    expect(archiveDocument([], doc({ markdown: '   ' }))).toEqual([])
  })

  it('dedupes by id and by content, and caps the shelf', () => {
    const existing = Array.from({ length: 10 }, (_, index) =>
      doc({ id: `d${index}`, markdown: `# ${index}` }),
    )
    const recents = archiveDocument(existing, doc({ id: 'new', markdown: '# 3' }))
    expect(recents[0].id).toBe('new')
    expect(recents.some((entry) => entry.id === 'd3')).toBe(false)
    expect(recents.length).toBe(8)
  })
})

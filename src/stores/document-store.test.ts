import { describe, expect, it } from 'vitest'

import {
  type DocumentRecord,
  SAMPLE_MARKDOWN,
  archiveDocument,
  mergeRecents,
} from './document-store'

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

describe('mergeRecents', () => {
  it('folds another tab’s documents in without duplicating or including the current one', () => {
    const ours = [doc({ id: 'x', markdown: '# X', updatedAt: 5 })]
    const theirs = [
      doc({ id: 'cur', markdown: '# Current', updatedAt: 9 }),
      doc({ id: 'y', markdown: '# Y', updatedAt: 7 }),
      doc({ id: 'x', markdown: '# X', updatedAt: 5 }),
    ]
    expect(mergeRecents(ours, theirs, 'cur').map((entry) => entry.id)).toEqual(['y', 'x'])
  })
})

describe('archiveDocument size', () => {
  it('archives large documents too (never silently dropped)', () => {
    const big = doc({ id: 'big', markdown: 'x'.repeat(600_000) })
    expect(archiveDocument([], big)[0].id).toBe('big')
  })
})

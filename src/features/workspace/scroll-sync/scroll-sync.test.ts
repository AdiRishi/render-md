import { describe, expect, it } from 'vitest'

import { type Anchor, lineToOffset, offsetToLine } from './scroll-sync'

const anchors: Anchor[] = [
  { line: 1, top: 0 },
  { line: 5, top: 100 },
  { line: 10, top: 600 },
]

describe('scroll sync mapping', () => {
  it('interpolates between anchors', () => {
    expect(lineToOffset(anchors, 1, 20, 1000)).toBe(0)
    expect(lineToOffset(anchors, 3, 20, 1000)).toBe(50)
    expect(lineToOffset(anchors, 7.5, 20, 1000)).toBe(350)
  })

  it('extrapolates past the last anchor to the end of the document', () => {
    expect(lineToOffset(anchors, 21, 20, 1000)).toBe(1000)
  })

  it('round-trips offsets and lines', () => {
    for (const line of [1, 2.5, 6, 9.75, 15]) {
      const offset = lineToOffset(anchors, line, 20, 1000)
      expect(offsetToLine(anchors, offset, 20, 1000)).toBeCloseTo(line, 6)
    }
  })
})

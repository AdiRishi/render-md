import { describe, expect, it } from 'vitest'

import {
  createShareUrl,
  decodeShareFragment,
  encodeShareFragment,
  readSharePayload,
  readShareView,
} from './share'

describe('share links', () => {
  it('round-trips markdown through a compressed fragment', async () => {
    const markdown =
      '# Hello\n\nUnicode survives: café, 日本語, 🎉\n\n' + 'Repetition compresses. '.repeat(200)
    const payload = await encodeShareFragment(markdown)
    expect(payload).toMatch(/^[A-Za-z0-9_-]+$/)
    expect(payload.length).toBeLessThan(markdown.length / 4)
    await expect(decodeShareFragment(payload)).resolves.toBe(markdown)
  })

  it('builds a fragment URL that never reaches the server', async () => {
    const url = await createShareUrl('# Hi', 'https://www.render-md.com')
    expect(url.startsWith('https://www.render-md.com/#md=')).toBe(true)
    expect(new URL(url).search).toBe('')
    const payload = readSharePayload(new URL(url).hash)
    expect(payload).not.toBeNull()
    await expect(decodeShareFragment(payload!)).resolves.toBe('# Hi')
  })

  it('carries an optional view', async () => {
    const url = new URL(await createShareUrl('# Hi', 'https://x.dev', { view: 'split' }))
    expect(readShareView(url.hash)).toBe('split')
    await expect(decodeShareFragment(readSharePayload(url.hash)!)).resolves.toBe('# Hi')
    expect(readShareView('#md=abc')).toBe('read')
  })

  it('ignores unrelated fragments', () => {
    expect(readSharePayload('#section-2')).toBeNull()
    expect(readSharePayload('')).toBeNull()
  })

  it('rejects damaged payloads', async () => {
    const payload = await encodeShareFragment('# A complete document with some length to it')
    await expect(decodeShareFragment(payload.slice(0, 10))).rejects.toThrow(/damaged/)
  })
})

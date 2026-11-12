import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchRemoteMarkdown, parseRemoteInput } from './remote'

describe('parseRemoteInput', () => {
  it('turns a GitHub repository into README candidates', () => {
    const target = parseRemoteInput('github.com/facebook/react')
    expect(target.candidates[0]).toBe(
      'https://raw.githubusercontent.com/facebook/react/HEAD/README.md',
    )
    expect(target.candidates.length).toBeGreaterThan(1)
    expect(target.name).toBe('react · README.md')
  })

  it('rewrites GitHub blob and tree URLs to raw', () => {
    expect(parseRemoteInput('https://github.com/o/r/blob/main/docs/guide.md').candidates).toEqual([
      'https://raw.githubusercontent.com/o/r/main/docs/guide.md',
    ])
    expect(parseRemoteInput('https://github.com/o/r/tree/v2/packages/core').candidates[0]).toBe(
      'https://raw.githubusercontent.com/o/r/v2/packages/core/README.md',
    )
  })

  it('treats raw, edit and blame pages as single files', () => {
    for (const kind of ['raw', 'edit', 'blame']) {
      expect(parseRemoteInput(`https://github.com/o/r/${kind}/main/docs/a.md`).candidates).toEqual([
        'https://raw.githubusercontent.com/o/r/main/docs/a.md',
      ])
    }
    expect(parseRemoteInput('https://example.com/100%zz.md').name).toBe('100%zz.md')
  })

  it('handles gists and GitLab', () => {
    expect(parseRemoteInput('https://gist.github.com/alice/abc123').candidates).toEqual([
      'https://gist.githubusercontent.com/alice/abc123/raw',
    ])
    expect(parseRemoteInput('https://gitlab.com/g/p/-/blob/main/README.md').candidates).toEqual([
      'https://gitlab.com/g/p/-/raw/main/README.md',
    ])
  })

  it('passes other URLs through and validates input', () => {
    expect(parseRemoteInput('https://example.com/notes/today.md')).toEqual({
      candidates: ['https://example.com/notes/today.md'],
      name: 'today.md',
    })
    expect(() => parseRemoteInput('')).toThrow(/Enter a URL/)
    expect(() => parseRemoteInput('ftp://example.com/a.md')).toThrow(/http/)
  })
})

describe('fetchRemoteMarkdown', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('falls through README candidates until one exists', async () => {
    const fetchMock = vi.fn<(url: string) => Promise<Response>>(async (url) =>
      url.endsWith('/readme.md')
        ? new Response('# Found', { status: 200, headers: { 'content-type': 'text/plain' } })
        : new Response('nope', { status: 404, statusText: 'Not Found' }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const result = await fetchRemoteMarkdown('github.com/o/r')
    expect(result.markdown).toBe('# Found')
    expect(result.url).toBe('https://raw.githubusercontent.com/o/r/HEAD/readme.md')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('refuses HTML pages', async () => {
    vi.stubGlobal(
      'fetch',
      async () =>
        new Response('<!doctype html><html></html>', { headers: { 'content-type': 'text/html' } }),
    )
    await expect(fetchRemoteMarkdown('https://example.com/page')).rejects.toThrow(/web page/)
  })
})

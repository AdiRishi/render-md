import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchRemoteMarkdown } from './remote'

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

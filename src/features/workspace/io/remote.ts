/** Load markdown from the web, through the raw URLs `parseRemoteInput` resolves. */
import { parseRemoteInput } from '@/lib/remote-url'

export type RemoteDocument = {
  markdown: string
  url: string
  name: string
}

const MAX_BYTES = 5 * 1024 * 1024

async function readLimited(response: Response) {
  const length = Number(response.headers.get('content-length') ?? 0)
  if (length > MAX_BYTES) throw new Error('That file is larger than 5 MB.')
  const text = await response.text()
  if (text.length > MAX_BYTES) throw new Error('That file is larger than 5 MB.')
  return text
}

function looksLikeHtmlPage(text: string, contentType: string | null) {
  return contentType?.includes('text/html') && /^\s*<!doctype html|^\s*<html/i.test(text)
}

export async function fetchRemoteMarkdown(input: string, signal?: AbortSignal) {
  const target = parseRemoteInput(input)
  let lastError: Error | null = null

  for (const candidate of target.candidates) {
    try {
      const response = await fetch(candidate, {
        signal: signal ?? AbortSignal.timeout(15_000),
        headers: { Accept: 'text/markdown, text/plain;q=0.9, */*;q=0.5' },
      })
      if (!response.ok) {
        lastError = new Error(`The server answered ${response.status} ${response.statusText}.`)
        continue
      }
      const markdown = await readLimited(response)
      if (looksLikeHtmlPage(markdown, response.headers.get('content-type'))) {
        throw new Error('That URL returned a web page, not a markdown file.')
      }
      return {
        markdown,
        url: response.url || candidate,
        name: target.name,
      } satisfies RemoteDocument
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') throw error
      lastError =
        error instanceof TypeError
          ? new Error('Couldn’t reach that URL. The host may not allow cross-origin requests.')
          : (error as Error)
    }
  }

  throw lastError ?? new Error('Couldn’t load that URL.')
}

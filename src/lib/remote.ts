/**
 * Load markdown from the web. Understands GitHub, Gist and GitLab page URLs
 * and rewrites them to their raw equivalents.
 */

export type RemoteTarget = {
  /** URLs to try in order (e.g. README.md, then readme.md). */
  candidates: string[]
  /** A human name for the document, e.g. "README.md". */
  name: string
}

export type RemoteDocument = {
  markdown: string
  url: string
  name: string
}

const MAX_BYTES = 5 * 1024 * 1024
const README_NAMES = ['README.md', 'readme.md', 'Readme.md', 'README.markdown', 'README']

function fileName(pathname: string) {
  const last = pathname.split('/').findLast(Boolean)
  return last ? decodeURIComponent(last) : 'document.md'
}

export function parseRemoteInput(input: string): RemoteTarget {
  const trimmed = input.trim()
  if (!trimmed) throw new Error('Enter a URL to load.')

  const withScheme = /^[a-z][a-z\d+\-.]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  let url: URL
  try {
    url = new URL(withScheme)
  } catch {
    throw new Error('That doesn’t look like a valid URL.')
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('Only http(s) URLs can be loaded.')
  }

  const host = url.hostname.replace(/^www\./, '')
  const parts = url.pathname.split('/').filter(Boolean)

  if (host === 'github.com' && parts.length >= 2) {
    const [owner, repo, kind, ref, ...path] = parts
    const raw = `https://raw.githubusercontent.com/${owner}/${repo}`

    if (kind === 'blob' && ref && path.length > 0) {
      return { candidates: [`${raw}/${ref}/${path.join('/')}`], name: fileName(url.pathname) }
    }
    const base = kind === 'tree' && ref ? `${raw}/${[ref, ...path].join('/')}` : `${raw}/HEAD`
    return {
      candidates: README_NAMES.map((readme) => `${base}/${readme}`),
      name: `${repo} · README.md`,
    }
  }

  if (host === 'gist.github.com' && parts.length >= 2) {
    const [user, id] = parts
    return {
      candidates: [`https://gist.githubusercontent.com/${user}/${id}/raw`],
      name: `gist ${id.slice(0, 7)}`,
    }
  }

  if (host === 'gitlab.com' && parts.includes('-')) {
    const dash = parts.indexOf('-')
    if (parts[dash + 1] === 'blob') {
      const rewritten = [...parts]
      rewritten[dash + 1] = 'raw'
      return { candidates: [`${url.origin}/${rewritten.join('/')}`], name: fileName(url.pathname) }
    }
  }

  return { candidates: [url.href], name: fileName(url.pathname) }
}

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

/** Is this an http(s) link to another markdown file we could open in place? */
export function isMarkdownUrl(href: string) {
  try {
    const url = new URL(href)
    return /^https?:$/.test(url.protocol) && /\.(md|markdown|mdx)$/i.test(url.pathname)
  } catch {
    return false
  }
}

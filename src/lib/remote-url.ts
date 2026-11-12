/**
 * Where a markdown URL really lives. GitHub, Gist and GitLab page URLs are
 * rewritten to their raw equivalents; anything else is fetched as given.
 */

export type RemoteTarget = {
  /** URLs to try in order (e.g. README.md, then readme.md). */
  candidates: string[]
  /** A human name for the document, e.g. "README.md". */
  name: string
}

const README_NAMES = ['README.md', 'readme.md', 'Readme.md', 'README.markdown', 'README']

function fileName(pathname: string) {
  const last = pathname.split('/').findLast(Boolean)
  if (!last) return 'document.md'
  try {
    return decodeURIComponent(last)
  } catch {
    return last
  }
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

    // blob, raw, edit and blame pages all point at a single file.
    if (['blob', 'raw', 'edit', 'blame'].includes(kind) && ref && path.length > 0) {
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

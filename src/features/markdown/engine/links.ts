/** Is this an http(s) link to another markdown file we could open in place? */
export function isMarkdownUrl(href: string) {
  try {
    const url = new URL(href)
    return /^https?:$/.test(url.protocol) && /\.(md|markdown|mdx)$/i.test(url.pathname)
  } catch {
    return false
  }
}

/**
 * The rendered document as portable HTML: the on-screen article without the
 * app's interactive chrome, with links that work outside RenderMD. Shared by
 * the HTML export, rich-text copy and Copy HTML.
 */

/** Clone the article and strip interactive chrome (buttons, anchors…). */
export function cleanArticle(article: HTMLElement) {
  const clone = article.cloneNode(true) as HTMLElement
  clone
    .querySelectorAll('button, .heading-anchor, .code-block-actions, .diagram-actions')
    .forEach((node) => node.remove())
  clone
    .querySelectorAll('input[type="checkbox"]')
    .forEach((node) => node.setAttribute('disabled', ''))
  clone.querySelectorAll('[data-line]').forEach((node) => node.removeAttribute('data-line'))
  clone.querySelectorAll('pre[tabindex]').forEach((node) => node.removeAttribute('tabindex'))
  // Links must work outside the app: unwrap "open in RenderMD" links and make
  // every other non-fragment link absolute.
  clone.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
    const href = anchor.getAttribute('href') ?? ''
    if (href.startsWith('#')) return
    try {
      const url = new URL(href, window.location.href)
      const original = url.origin === window.location.origin ? url.searchParams.get('url') : null
      anchor.setAttribute('href', original ?? url.href)
    } catch {
      // Leave unparsable links alone.
    }
  })
  return clone
}

/** The cleaned article's markup, as copied by Copy HTML. */
export const articleHtml = (article: HTMLElement) => cleanArticle(article).outerHTML

import { isMarkdownUrl } from '../../engine/links'
import { type ElementProps, scrollToFragment } from './element-props'

/** In-document anchors scroll the document; links to .md files open in RenderMD. */
export function Link({ node: _node, href = '', children, ...props }: ElementProps<'a'>) {
  if (href.startsWith('#')) {
    return (
      <a href={href} onClick={(event) => scrollToFragment(event, href.slice(1))} {...props}>
        {children}
      </a>
    )
  }

  const isExternal = /^https?:\/\//i.test(href)
  const opensInRenderMd = isMarkdownUrl(href)

  return (
    <a
      href={opensInRenderMd ? `/?url=${encodeURIComponent(href)}` : href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      title={opensInRenderMd ? 'Open in RenderMD' : props.title}
      {...props}
    >
      {children}
    </a>
  )
}

import { type ElementProps, scrollToFragment } from './element-props'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/** Headings get a hanging `§` anchor that appears on hover. */
export function createHeading(Tag: HeadingTag) {
  return function Heading({ node: _node, id, children, ...props }: ElementProps<HeadingTag>) {
    return (
      <Tag id={id} {...props}>
        {id ? (
          <a
            className="heading-anchor"
            href={`#${id}`}
            aria-label="Link to this section"
            onClick={(event) => scrollToFragment(event, id)}
          >
            §
          </a>
        ) : null}
        {children}
      </Tag>
    )
  }
}

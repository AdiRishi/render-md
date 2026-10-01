import { type ElementProps } from './element-props'

/** Lazy, async-decoded images that never leak a referrer. */
export function Image({ node: _node, alt = '', ...props }: ElementProps<'img'>) {
  return <img alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" {...props} />
}

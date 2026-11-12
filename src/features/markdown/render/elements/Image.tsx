import { use } from 'react'

import { DocumentContext } from '../context'
import { type ElementProps } from './element-props'

/** Lazy, async-decoded images that never leak a referrer. Print loads them all up front. */
export function Image({ node: _node, alt = '', ...props }: ElementProps<'img'>) {
  const { printing } = use(DocumentContext)
  return (
    <img
      alt={alt}
      loading={printing ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      {...props}
    />
  )
}

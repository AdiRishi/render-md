import { type Root } from 'hast'
import { toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { type Ref, useMemo } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'

import { cn } from '@/lib/utils'

import { type Frontmatter } from '../engine/types'
import { DocumentContext, type DocumentContextValue } from './context'
import { elementComponents } from './elements'
import { FrontmatterCard } from './elements/FrontmatterCard'
import { type TextSize, type Typeset } from './typesets'

export type DocumentViewProps = {
  hast: Root
  frontmatter?: Frontmatter | null
  typeset?: Typeset
  textSize?: TextSize
  className?: string
  ref?: Ref<HTMLElement>
} & DocumentContextValue

/**
 * A rendered markdown document: the engine's sanitized HAST turned into React,
 * typeset by `./document.css`.
 */
export function DocumentView({
  hast,
  frontmatter,
  typeset = 'sans',
  textSize = 'm',
  className,
  ref,
  onToggleTask,
  diagramLook,
}: DocumentViewProps) {
  const content = useMemo(
    () =>
      toJsxRuntime(hast, {
        Fragment,
        jsx,
        jsxs,
        components: elementComponents,
        passNode: true,
        ignoreInvalidStyle: true,
      }),
    [hast],
  )

  return (
    <DocumentContext value={{ onToggleTask, diagramLook }}>
      <article
        ref={ref}
        className={cn('doc', className)}
        data-typeset={typeset}
        data-text-size={textSize}
      >
        {frontmatter ? <FrontmatterCard data={frontmatter} /> : null}
        {content}
      </article>
    </DocumentContext>
  )
}

import * as React from 'react'
import { forwardRef } from 'react'
import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { type VariantProps, cva } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/* -----------------------------------------------------------------------------
 * Text Variants (shadcn typography styles with balanced spacing)
 * -------------------------------------------------------------------------- */

const textVariants = cva('', {
  defaultVariants: { variant: 'p' },
  variants: {
    variant: {
      a: 'text-primary font-medium underline underline-offset-4',
      blockquote: 'my-4 border-l-2 border-muted-foreground/30 pl-4 italic text-muted-foreground',
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight mt-8 mb-4 first:mt-0',
      h2: 'scroll-m-20 text-3xl font-semibold tracking-tight mt-8 mb-3 first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight mt-6 mb-2 first:mt-0',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight mt-5 mb-2 first:mt-0',
      h5: 'scroll-m-20 text-lg font-semibold tracking-tight mt-4 mb-1 first:mt-0',
      p: 'leading-7 my-3 first:mt-0 last:mb-0',
      small: 'text-sm font-medium leading-none',
      ul: 'my-3 ml-6 list-disc [&>li]:mt-1 first:mt-0 last:mb-0',
      ol: 'my-3 ml-6 list-decimal [&>li]:mt-1 first:mt-0 last:mb-0',
      li: '',
      code: 'bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm',
      lead: 'text-muted-foreground text-xl',
      large: 'text-lg font-semibold',
      muted: 'text-muted-foreground text-sm',
    },
  },
})

type TextVariant = NonNullable<VariantProps<typeof textVariants>['variant']>

/* -----------------------------------------------------------------------------
 * Variant to HTML element mapping
 * -------------------------------------------------------------------------- */

const variantToTag: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
  a: 'a',
  blockquote: 'blockquote',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  p: 'p',
  small: 'small',
  code: 'code',
  ul: 'ul',
  ol: 'ol',
  li: 'li',
  lead: 'p',
  large: 'div',
  muted: 'p',
}

/* -----------------------------------------------------------------------------
 * Text Component (unified typography component)
 * -------------------------------------------------------------------------- */

interface AnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof textVariants> {
  variant: 'a'
}

interface BaseProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  variant?: Exclude<TextVariant, 'a'>
}

type TextProps = (AnchorProps | BaseProps) & {
  render?: useRender.ComponentProps<keyof React.JSX.IntrinsicElements>['render']
}

function Text({ variant = 'p', render, className, ...props }: TextProps) {
  const tag = variantToTag[variant]

  return useRender({
    defaultTagName: tag,
    props: mergeProps<typeof tag>(
      { className: cn(textVariants({ variant, className })) },
      props as Record<string, unknown>,
    ),
    render,
    state: { slot: 'text', variant },
  })
}

/* -----------------------------------------------------------------------------
 * Factory for ReactMarkdown components
 * -------------------------------------------------------------------------- */

function createTextComponent<TElement extends keyof React.JSX.IntrinsicElements>(
  variant: TextVariant,
  element: TElement,
) {
  const Component = forwardRef<React.ComponentRef<TElement>, React.ComponentProps<TElement>>(
    ({ className, ...props }, ref) => {
      const El = element as React.ElementType
      return <El ref={ref} className={cn(textVariants({ variant }), className)} {...props} />
    },
  )
  Component.displayName = `Text.${variant}`
  return Component
}

/* -----------------------------------------------------------------------------
 * Pre-built components object for ReactMarkdown
 * -------------------------------------------------------------------------- */

const typographyComponents = {
  h1: createTextComponent('h1', 'h1'),
  h2: createTextComponent('h2', 'h2'),
  h3: createTextComponent('h3', 'h3'),
  h4: createTextComponent('h4', 'h4'),
  h5: createTextComponent('h5', 'h5'),
  p: createTextComponent('p', 'p'),
  blockquote: createTextComponent('blockquote', 'blockquote'),
  ul: createTextComponent('ul', 'ul'),
  ol: createTextComponent('ol', 'ol'),
  li: createTextComponent('li', 'li'),
} as const

/* -----------------------------------------------------------------------------
 * Exports
 * -------------------------------------------------------------------------- */

export { Text, textVariants, typographyComponents }
export type { TextVariant, TextProps }

/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// Disabled because node?.position is needed - TypeScript types `node` as possibly undefined
// but eslint thinks it's always defined. We need the optional chain for safety.

import { type Components } from 'react-markdown'
import { CodeBlock } from './CodeBlock'
import { cn } from '@/lib/utils'
import { textVariants } from '@/components/ui/text'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

/**
 * Comprehensive markdown components using shadcn/ui primitives.
 * All block-level elements include data-source-line for scroll sync.
 *
 * Standard markdown elements:
 *   a, blockquote, br, code, em, h1-h6, hr, img, li, ol, p, pre, strong, ul
 *
 * With remark-gfm:
 *   del, input, table, tbody, td, th, thead, tr
 */
export const markdownComponents: Components = {
  /* ---------------------------------------------------------------------------
   * Typography with data-source-line for scroll sync
   * h1, h2, h3, h4, h5, h6, p, blockquote, ul, ol, li
   * ------------------------------------------------------------------------- */
  h1: ({ node, className, ...props }) => (
    <h1
      data-source-line={node?.position?.start.line}
      className={cn(textVariants({ variant: 'h1' }), className)}
      {...props}
    />
  ),
  h2: ({ node, className, ...props }) => (
    <h2
      data-source-line={node?.position?.start.line}
      className={cn(textVariants({ variant: 'h2' }), className)}
      {...props}
    />
  ),
  h3: ({ node, className, ...props }) => (
    <h3
      data-source-line={node?.position?.start.line}
      className={cn(textVariants({ variant: 'h3' }), className)}
      {...props}
    />
  ),
  h4: ({ node, className, ...props }) => (
    <h4
      data-source-line={node?.position?.start.line}
      className={cn(textVariants({ variant: 'h4' }), className)}
      {...props}
    />
  ),
  h5: ({ node, className, ...props }) => (
    <h5
      data-source-line={node?.position?.start.line}
      className={cn(textVariants({ variant: 'h5' }), className)}
      {...props}
    />
  ),
  h6: ({ node, className, ...props }) => (
    <h6
      data-source-line={node?.position?.start.line}
      className={cn(
        'scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-1 first:mt-0',
        className,
      )}
      {...props}
    />
  ),
  p: ({ node, className, ...props }) => (
    <p
      data-source-line={node?.position?.start.line}
      className={cn(textVariants({ variant: 'p' }), className)}
      {...props}
    />
  ),
  blockquote: ({ node, className, ...props }) => (
    <blockquote
      data-source-line={node?.position?.start.line}
      className={cn(textVariants({ variant: 'blockquote' }), className)}
      {...props}
    />
  ),
  ul: ({ node, className, ...props }) => (
    <ul
      data-source-line={node?.position?.start.line}
      className={cn(textVariants({ variant: 'ul' }), className)}
      {...props}
    />
  ),
  ol: ({ node, className, ...props }) => (
    <ol
      data-source-line={node?.position?.start.line}
      className={cn(textVariants({ variant: 'ol' }), className)}
      {...props}
    />
  ),

  /* ---------------------------------------------------------------------------
   * Code
   * ------------------------------------------------------------------------- */
  code: CodeBlock,
  pre: ({ node, children, className, ...props }) => (
    <pre
      data-source-line={node?.position?.start.line}
      className={cn('overflow-x-auto', className)}
      {...props}
    >
      {children}
    </pre>
  ),

  /* ---------------------------------------------------------------------------
   * Links
   * ------------------------------------------------------------------------- */
  a: ({ node, href, className, children, ...props }) => {
    const isExternal = href?.startsWith('http')
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={cn(textVariants({ variant: 'a' }), className)}
        {...props}
      >
        {children}
      </a>
    )
  },

  /* ---------------------------------------------------------------------------
   * Images
   * ------------------------------------------------------------------------- */
  img: ({ node, src, alt, className, ...props }) => (
    <img
      data-source-line={node?.position?.start.line}
      src={src}
      alt={alt || ''}
      loading="lazy"
      className={cn('rounded-lg max-w-full h-auto my-4', className)}
      {...props}
    />
  ),

  /* ---------------------------------------------------------------------------
   * Inline formatting
   * ------------------------------------------------------------------------- */
  strong: ({ node, className, ...props }) => (
    <strong className={cn('font-semibold', className)} {...props} />
  ),
  em: ({ node, className, ...props }) => <em className={cn('italic', className)} {...props} />,
  del: ({ node, className, ...props }) => (
    <del className={cn('line-through text-muted-foreground', className)} {...props} />
  ),

  /* ---------------------------------------------------------------------------
   * Horizontal rule
   * ------------------------------------------------------------------------- */
  hr: ({ node, className, ...props }) => (
    <hr
      data-source-line={node?.position?.start.line}
      className={cn('bg-border my-5 h-px border-0', className)}
      {...props}
    />
  ),

  /* ---------------------------------------------------------------------------
   * Line break
   * ------------------------------------------------------------------------- */
  br: ({ node, ...props }) => <br {...props} />,

  /* ---------------------------------------------------------------------------
   * Tables (using shadcn table components)
   * ------------------------------------------------------------------------- */
  table: ({ node, className, ...props }) => (
    <div data-source-line={node?.position?.start.line} className="my-6">
      <Table className={className} {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <TableHeader {...props} />,
  tbody: ({ node, ...props }) => <TableBody {...props} />,
  tr: ({ node, ...props }) => <TableRow {...props} />,
  th: ({ node, className, ...props }) => (
    <TableHead
      className={cn('[[align=center]]:text-center [[align=right]]:text-right', className)}
      {...props}
    />
  ),
  td: ({ node, className, ...props }) => (
    <TableCell
      className={cn('[[align=center]]:text-center [[align=right]]:text-right', className)}
      {...props}
    />
  ),

  /* ---------------------------------------------------------------------------
   * Inputs (checkboxes for GFM task lists, Input for others)
   * ------------------------------------------------------------------------- */
  input: ({ node, type, checked, className, ...props }) => {
    if (type === 'checkbox') {
      // Return null here - checkbox is rendered by the li component to avoid duplication
      return null
    }
    return <Input type={type} className={className} {...props} />
  },

  /* ---------------------------------------------------------------------------
   * List items (special handling for task list items)
   * ------------------------------------------------------------------------- */
  li: ({ node, children, className, ...props }) => {
    // Check if this is a task list item (contains a checkbox as first child)

    const checkboxNode = node?.children?.find(
      (child: unknown) =>
        child &&
        typeof child === 'object' &&
        'tagName' in child &&
        (child as { tagName: string }).tagName === 'input',
    ) as { properties?: { checked?: boolean } } | undefined

    const isTaskItem = !!checkboxNode
    const isChecked = checkboxNode?.properties?.checked ?? false

    if (isTaskItem) {
      return (
        <li
          data-source-line={node?.position?.start.line}
          className={cn('flex items-baseline gap-2 list-none', className)}
          {...props}
        >
          <Checkbox checked={isChecked} disabled className="mt-0.5 shrink-0" />
          {children}
        </li>
      )
    }

    return (
      <li data-source-line={node?.position?.start.line} className={className} {...props}>
        {children}
      </li>
    )
  },
}

import { type Components } from 'react-markdown'
import { CodeBlock } from './CodeBlock'
import { cn } from '@/lib/utils'
import { textVariants, typographyComponents } from '@/components/ui/text'
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
 *
 * Standard markdown elements:
 *   a, blockquote, br, code, em, h1-h6, hr, img, li, ol, p, pre, strong, ul
 *
 * With remark-gfm:
 *   del, input, table, tbody, td, th, thead, tr
 */
export const markdownComponents: Components = {
  /* ---------------------------------------------------------------------------
   * Typography (from text.tsx)
   * h1, h2, h3, h4, h5, p, blockquote, ul, ol, li
   * ------------------------------------------------------------------------- */
  ...typographyComponents,

  /* ---------------------------------------------------------------------------
   * Headings (h6 not in typographyComponents, add manually)
   * ------------------------------------------------------------------------- */
  h6: ({ node, className, ...props }) => (
    <h6
      className={cn(
        'scroll-m-20 text-base font-semibold tracking-tight mt-4 mb-1 first:mt-0',
        className,
      )}
      {...props}
    />
  ),

  /* ---------------------------------------------------------------------------
   * Code
   * ------------------------------------------------------------------------- */
  code: CodeBlock,
  pre: ({ node, children, className, ...props }) => (
    <pre className={cn('overflow-x-auto', className)} {...props}>
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
    <hr className={cn('bg-border my-5 h-px border-0', className)} {...props} />
  ),

  /* ---------------------------------------------------------------------------
   * Line break
   * ------------------------------------------------------------------------- */
  br: ({ node, ...props }) => <br {...props} />,

  /* ---------------------------------------------------------------------------
   * Tables (using shadcn table components)
   * ------------------------------------------------------------------------- */
  table: ({ node, className, ...props }) => (
    <div className="my-6">
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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
        <li className={cn('flex items-baseline gap-2 list-none', className)} {...props}>
          <Checkbox checked={isChecked} disabled className="mt-0.5 shrink-0" />
          {children}
        </li>
      )
    }

    return (
      <li className={className} {...props}>
        {children}
      </li>
    )
  },
}

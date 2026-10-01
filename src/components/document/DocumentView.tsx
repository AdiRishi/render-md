import { type Element, type Root } from 'hast'
import { type Components, toJsxRuntime } from 'hast-util-to-jsx-runtime'
import { toText } from 'hast-util-to-text'
import { CircleAlert, Info, Lightbulb, MessageSquareWarning, OctagonAlert } from 'lucide-react'
import { type ComponentProps, type MouseEvent, type ReactNode, type Ref, use, useMemo } from 'react'
import { Fragment, jsx, jsxs } from 'react/jsx-runtime'

import { type Frontmatter } from '@/lib/markdown/pipeline'
import { isMarkdownUrl } from '@/lib/remote'
import { cn } from '@/lib/utils'
import { type TextSize, type Typeset } from '@/stores/settings-store'

import { CodeBlock } from './CodeBlock'
import { DocumentContext, type DocumentContextValue, ListItemLineContext } from './context'
import { Diagram } from './Diagram'

type WithNode<T extends keyof React.JSX.IntrinsicElements> = ComponentProps<T> & {
  node?: Element
}

const lineOf = (props: Record<string, unknown>) => {
  const value = props['data-line']
  return typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : undefined
}

/* -- Links: in-document anchors scroll the preview, .md links open in RenderMD */

function scrollToFragment(event: MouseEvent<HTMLAnchorElement>, fragment: string) {
  const root = event.currentTarget.closest('.doc')
  if (!root) return
  const id = decodeURIComponent(fragment)
  const target =
    root.querySelector(`[id="${CSS.escape(id)}"]`) ??
    root.querySelector(`[id="user-content-${CSS.escape(id)}"]`)
  if (!target) return
  event.preventDefault()
  target.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function Link({ node: _node, href = '', children, ...props }: WithNode<'a'>) {
  if (href.startsWith('#')) {
    return (
      <a href={href} onClick={(event) => scrollToFragment(event, href.slice(1))} {...props}>
        {children}
      </a>
    )
  }

  const isExternal = /^https?:\/\//i.test(href)
  const resolvedHref = isMarkdownUrl(href) ? `/?url=${encodeURIComponent(href)}` : href

  return (
    <a
      href={resolvedHref}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      title={isMarkdownUrl(href) ? 'Open in RenderMD' : props.title}
      {...props}
    >
      {children}
    </a>
  )
}

/* -- Headings get a hanging anchor --------------------------------------- */

function createHeading(Tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  return function Heading({ node: _node, id, children, ...props }: WithNode<typeof Tag>) {
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

/* -- Code: Shiki blocks, Mermaid diagrams ---------------------------------- */

function Pre({ node, children, ...props }: WithNode<'pre'>) {
  const code = node?.children.find(
    (child): child is Element => child.type === 'element' && child.tagName === 'code',
  )
  if (!code) return <pre {...props}>{children}</pre>

  const classes = Array.isArray(code.properties.className) ? code.properties.className : []
  const languageClass = classes.find(
    (value): value is string => typeof value === 'string' && value.startsWith('language-'),
  )
  const language = languageClass ? languageClass.slice('language-'.length).toLowerCase() : null
  const text = toText(code, { whitespace: 'pre' }).replace(/\n$/, '')
  const line = lineOf(props)

  if (language === 'mermaid' || language === 'mmd') {
    return <Diagram code={text} line={line} />
  }

  const meta = typeof code.properties.dataMeta === 'string' ? code.properties.dataMeta : null
  return <CodeBlock code={text} language={language} meta={meta} line={line} />
}

/* -- Tables scroll horizontally inside their own frame --------------------- */

function Table({ node: _node, ...props }: WithNode<'table'>) {
  return (
    <div className="table-scroll" data-line={props['data-line' as keyof typeof props] as number}>
      <table {...props} />
    </div>
  )
}

/* -- Task lists are live: ticking a box edits the markdown ------------------ */

function ListItem({ node: _node, ...props }: WithNode<'li'>) {
  return (
    <ListItemLineContext value={lineOf(props) ?? null}>
      <li {...props} />
    </ListItemLineContext>
  )
}

function Input({ node: _node, type, checked, disabled: _disabled, ...props }: WithNode<'input'>) {
  const { onToggleTask } = use(DocumentContext)
  const line = use(ListItemLineContext)
  if (type !== 'checkbox') return null

  const interactive = Boolean(onToggleTask && line)
  return (
    <input
      {...props}
      type="checkbox"
      checked={Boolean(checked)}
      disabled={!interactive}
      aria-label={checked ? 'Mark as not done' : 'Mark as done'}
      onChange={() => line && onToggleTask?.(line)}
    />
  )
}

/* -- GitHub alerts ------------------------------------------------------- */

const ALERTS: Record<string, { label: string; icon: ReactNode }> = {
  note: { label: 'Note', icon: <Info /> },
  tip: { label: 'Tip', icon: <Lightbulb /> },
  important: { label: 'Important', icon: <MessageSquareWarning /> },
  warning: { label: 'Warning', icon: <CircleAlert /> },
  caution: { label: 'Caution', icon: <OctagonAlert /> },
}

function Div({ node: _node, children, ...props }: WithNode<'div'>) {
  const type = (props as Record<string, unknown>)['data-alert']
  const alert = typeof type === 'string' ? ALERTS[type] : undefined
  if (!alert) return <div {...props}>{children}</div>

  return (
    <div {...props} role="note">
      <p className="markdown-alert-title">
        {alert.icon}
        {alert.label}
      </p>
      {children}
    </div>
  )
}

function Image({ node: _node, alt = '', ...props }: WithNode<'img'>) {
  return <img alt={alt} loading="lazy" decoding="async" referrerPolicy="no-referrer" {...props} />
}

const components: Partial<Components> = {
  a: Link,
  h1: createHeading('h1'),
  h2: createHeading('h2'),
  h3: createHeading('h3'),
  h4: createHeading('h4'),
  h5: createHeading('h5'),
  h6: createHeading('h6'),
  pre: Pre,
  table: Table,
  li: ListItem,
  input: Input,
  div: Div,
  img: Image,
}

/* -- Frontmatter ---------------------------------------------------------- */

function formatValue(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (Array.isArray(value)) return value.map(formatValue).join(', ')
  if (value && typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

function FrontmatterCard({ data }: { data: Frontmatter }) {
  const entries = Object.entries(data)
  if (entries.length === 0) return null
  return (
    <aside className="frontmatter" aria-label="Document metadata">
      <dl>
        {entries.map(([key, value]) => (
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>{formatValue(value)}</dd>
          </Fragment>
        ))}
      </dl>
    </aside>
  )
}

/* -- The document --------------------------------------------------------- */

export type DocumentViewProps = {
  hast: Root
  frontmatter?: Frontmatter | null
  typeset?: Typeset
  textSize?: TextSize
  className?: string
  ref?: Ref<HTMLElement>
} & DocumentContextValue

export function DocumentView({
  hast,
  frontmatter,
  typeset = 'sans',
  textSize = 'm',
  className,
  ref,
  onToggleTask,
}: DocumentViewProps) {
  const content = useMemo(
    () =>
      toJsxRuntime(hast, {
        Fragment,
        jsx,
        jsxs,
        components,
        passNode: true,
        ignoreInvalidStyle: true,
      }),
    [hast],
  )

  return (
    <DocumentContext value={{ onToggleTask }}>
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

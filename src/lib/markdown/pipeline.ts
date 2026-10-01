import { type Root } from 'hast'
import { toText } from 'hast-util-to-text'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { type Processor, unified } from 'unified'
import { VFile } from 'vfile'

import {
  type Frontmatter,
  type HeadingEntry,
  rehypeAlerts,
  rehypeBaseUrl,
  rehypeCollectHeadings,
  rehypeMath,
  rehypeSourceLines,
  rehypeStripPositions,
  remarkCodeMeta,
  remarkExtractFrontmatter,
} from './plugins'
import { sanitizeSchema } from './sanitize-schema'
import { type DocumentStats, getDocumentStats } from './stats'

export type { DocumentStats, Frontmatter, HeadingEntry }

export type RenderOptions = {
  /** Base URL that relative links and images resolve against. */
  baseUrl?: string | null
  /** Strip positional data (cheaper to transfer between threads). */
  stripPositions?: boolean
}

export type RenderResult = {
  hast: Root
  headings: HeadingEntry[]
  frontmatter: Frontmatter | null
  title: string | null
  stats: DocumentStats
}

type AnyProcessor = Processor<any, any, any, any, any>

const processorCache = new Map<string, AnyProcessor>()

function getProcessor({ baseUrl = null, stripPositions = false }: RenderOptions): AnyProcessor {
  const key = `${baseUrl ?? ''}|${stripPositions}`
  const cached = processorCache.get(key)
  if (cached) return cached

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkExtractFrontmatter)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkGemoji)
    .use(remarkCodeMeta)
    .use(remarkRehype, { allowDangerousHtml: true, clobberPrefix: '' })
    .use(rehypeRaw)
    .use(rehypeSourceLines)
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeMath)
    .use(rehypeAlerts)
    .use(rehypeSlug)
    .use(rehypeBaseUrl, baseUrl)
    .use(rehypeCollectHeadings)

  if (stripPositions) processor.use(rehypeStripPositions)

  processor.freeze()
  processorCache.set(key, processor)
  return processor
}

function getTitle(frontmatter: Frontmatter | null, headings: HeadingEntry[]) {
  const fromFrontmatter = frontmatter?.title
  if (typeof fromFrontmatter === 'string' && fromFrontmatter.trim()) {
    return fromFrontmatter.trim()
  }
  return headings.find((heading) => heading.depth === 1)?.text || headings[0]?.text || null
}

/** Markdown → sanitized HAST plus outline, frontmatter and stats. Synchronous. */
export function renderMarkdown(markdown: string, options: RenderOptions = {}): RenderResult {
  const processor = getProcessor(options)
  const file = new VFile({ value: markdown })
  const hast = processor.runSync(processor.parse(file), file) as Root

  const headings = file.data.headings ?? []
  const frontmatter = file.data.frontmatter ?? null

  return {
    hast,
    headings,
    frontmatter,
    title: getTitle(frontmatter, headings),
    stats: getDocumentStats(markdown, toText(hast)),
  }
}

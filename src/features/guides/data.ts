/**
 * A guide's rendered content. Every markdown string in the guide runs through
 * the real pipeline on the server, so crawlers get rendered HTML and the
 * browser never downloads the markdown engine to show the page.
 */
import { createServerFn } from '@tanstack/react-start'

import { type RenderedFragments } from '@/features/markdown/engine/render-static'

import { GUIDES, type GuideSlug } from './content'
import { guideSources } from './content/sources'

export type GuideData = {
  rendered: RenderedFragments
  /** The HTML each `shows: 'html'` example renders to, by source. */
  markup: Record<string, string>
}

const isGuideSlug = (value: unknown): value is GuideSlug =>
  typeof value === 'string' && Object.hasOwn(GUIDES, value)

function htmlSources(slug: GuideSlug) {
  const guide = GUIDES[slug]
  return [guide.tool, ...guide.sections.flatMap((section) => section.blocks)].flatMap((block) =>
    block.kind === 'specimens' && block.shows === 'html'
      ? block.entries.map((entry) => entry.source)
      : [],
  )
}

const renderGuide = createServerFn()
  .validator((slug: unknown) => {
    if (!isGuideSlug(slug)) throw new Error('Unknown guide')
    return slug
  })
  .handler(async ({ data: slug }) => {
    const [{ renderStatic }, { toHtml }] = await Promise.all([
      import('@/features/markdown/engine/render-static'),
      import('hast-util-to-html'),
    ])
    const rendered = await renderStatic(guideSources(GUIDES[slug]))
    const data: GuideData = {
      rendered,
      markup: Object.fromEntries(
        htmlSources(slug).map((source) => [source, toHtml(rendered[source])]),
      ),
    }
    // HAST is plain JSON; a string keeps the server-function contract simple.
    return JSON.stringify(data)
  })

/** Route loader: rendered on the server, parsed on whichever side asked. */
export async function loadGuide(slug: GuideSlug) {
  return JSON.parse(await renderGuide({ data: slug })) as GuideData
}

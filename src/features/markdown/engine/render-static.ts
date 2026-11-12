import { type Root } from 'hast'

import { stripHeadingIds } from './hast'
import { highlightCodeBlocks } from './highlight'
import { renderMarkdown } from './pipeline'

/** Rendered markdown fragments, keyed by their source. */
export type RenderedFragments = Record<string, Root>

/**
 * Render the markdown fragments a content page shows, for its server loader:
 * highlighted, without source positions, and without heading ids (which would
 * collide with the page's own). Repeated sources render once.
 */
export async function renderStatic(sources: readonly string[]): Promise<RenderedFragments> {
  const unique = [...new Set(sources)]
  const trees = await Promise.all(
    unique.map((source) =>
      highlightCodeBlocks(renderMarkdown(source, { stripPositions: true }).hast),
    ),
  )
  return Object.fromEntries(unique.map((source, index) => [source, stripHeadingIds(trees[index])]))
}

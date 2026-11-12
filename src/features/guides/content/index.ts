/**
 * The guides: task pages built from typed content. Every markdown string in a
 * guide is rendered by the real pipeline on the server.
 */
import { markdownTableGenerator } from './markdown-table-generator'
import { markdownToHtml } from './markdown-to-html'
import { markdownToPdf } from './markdown-to-pdf'
import { mermaidViewer } from './mermaid-viewer'
import { type Guide, type GuideSlug } from './types'

export type * from './types'
export { GUIDE_UPDATED } from './updated'

export const GUIDES: Record<GuideSlug, Guide> = {
  'mermaid-viewer': mermaidViewer,
  'markdown-to-pdf': markdownToPdf,
  'markdown-to-html': markdownToHtml,
  'markdown-table-generator': markdownTableGenerator,
}

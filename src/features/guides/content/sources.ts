import { toMarkdown } from '../table/table-model'
import { type Guide, type GuideBlock } from './types'

function blockSources(block: GuideBlock): string[] {
  switch (block.kind) {
    case 'prose':
      return [block.markdown]
    case 'specimens':
      return block.entries.map((entry) => entry.source)
    case 'gallery':
      return block.items.flatMap((item) => [item.summary, item.source])
    case 'steps':
      return block.steps.map((step) => step.markdown)
    case 'table-generator':
      return [toMarkdown(block.initial)]
    case 'open-url':
    case 'url-forms':
    case 'pdf-settings':
      return []
    default: {
      const unknown: never = block
      return unknown
    }
  }
}

/** Every markdown string a guide shows, which its loader renders on the server. */
export const guideSources = (guide: Guide) => [
  ...blockSources(guide.tool),
  ...guide.sections.flatMap((section) => section.blocks.flatMap(blockSources)),
  ...guide.faq.map((item) => item.answer),
]

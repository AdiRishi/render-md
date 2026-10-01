import { type Options as SanitizeSchema } from 'rehype-sanitize'
import { defaultSchema } from 'rehype-sanitize'

/**
 * GitHub's sanitization rules, widened slightly for things READMEs and notes
 * commonly use (`<mark>`, `<figure>`, `<u>`…) and for the attributes our own
 * pipeline adds before sanitizing (`data-line`, code meta, math classes).
 */
export const sanitizeSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames ?? []),
    'mark',
    'u',
    'small',
    'abbr',
    'cite',
    'figure',
    'figcaption',
    'caption',
    'colgroup',
    'col',
    'video',
  ],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] ?? []), 'dataLine'],
    code: [['className', /^language-./, 'math-inline', 'math-display'], 'dataMeta'],
    video: ['src', 'poster', 'controls', 'loop', 'muted', 'playsInline', 'width', 'height'],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ['http', 'https', 'data'],
  },
}

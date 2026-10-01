export type DocumentStats = {
  words: number
  characters: number
  lines: number
  readingMinutes: number
}

const WORDS_PER_MINUTE = 230

let segmenter: Intl.Segmenter | null = null

/** Locale-aware word count — handles CJK and other scripts without spaces. */
export function countWords(text: string) {
  segmenter ??= new Intl.Segmenter(undefined, { granularity: 'word' })
  let count = 0
  for (const segment of segmenter.segment(text)) {
    if (segment.isWordLike) count++
  }
  return count
}

export function getDocumentStats(markdown: string, renderedText: string): DocumentStats {
  const words = countWords(renderedText)
  return {
    words,
    characters: markdown.length,
    lines: markdown === '' ? 0 : markdown.split('\n').length,
    readingMinutes: words === 0 ? 0 : Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
  }
}

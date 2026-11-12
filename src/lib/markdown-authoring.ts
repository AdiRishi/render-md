/** Small helpers for writing markdown examples inside TypeScript. */

/** Join lines with newlines — keeps multi-line examples readable in source. */
export const lines = (...value: string[]) => value.join('\n')

/** A code fence, without fighting template-literal escaping. */
export const fence = '```'

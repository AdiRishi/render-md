/**
 * Line-accurate scroll sync. Block elements in the preview carry the source
 * line they came from (`data-line`); we interpolate between those anchors so
 * the two panes stay aligned even around tall images, diagrams and tables.
 */

export type Anchor = { line: number; top: number }

export function collectAnchors(container: HTMLElement): Anchor[] {
  const containerTop = container.getBoundingClientRect().top - container.scrollTop
  const anchors: Anchor[] = [{ line: 1, top: 0 }]
  let lastLine = 1
  let lastTop = 0

  for (const element of container.querySelectorAll<HTMLElement>('[data-line]')) {
    const line = Number(element.dataset.line)
    if (!Number.isFinite(line) || line <= lastLine) continue
    const top = element.getBoundingClientRect().top - containerTop
    if (top < lastTop) continue
    anchors.push({ line, top })
    lastLine = line
    lastTop = top
  }
  return anchors
}

/** Fractional source line → pixel offset in the preview. */
export function lineToOffset(
  anchors: Anchor[],
  line: number,
  totalLines: number,
  scrollHeight: number,
) {
  if (anchors.length === 0) return 0
  let index = 0
  while (index < anchors.length - 1 && anchors[index + 1].line <= line) index++

  const start = anchors[index]
  const end = anchors[index + 1] ?? { line: totalLines + 1, top: scrollHeight }
  const span = end.line - start.line
  const progress = span > 0 ? (line - start.line) / span : 0
  return start.top + (end.top - start.top) * Math.min(1, Math.max(0, progress))
}

/** Pixel offset in the preview → fractional source line. */
export function offsetToLine(
  anchors: Anchor[],
  offset: number,
  totalLines: number,
  scrollHeight: number,
) {
  if (anchors.length === 0) return 1
  let index = 0
  while (index < anchors.length - 1 && anchors[index + 1].top <= offset) index++

  const start = anchors[index]
  const end = anchors[index + 1] ?? { line: totalLines + 1, top: scrollHeight }
  const span = end.top - start.top
  const progress = span > 0 ? (offset - start.top) / span : 0
  return start.line + (end.line - start.line) * Math.min(1, Math.max(0, progress))
}

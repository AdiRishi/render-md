import { EditorSelection, type SelectionRange } from '@codemirror/state'
import { type EditorView, type KeyBinding } from '@codemirror/view'

/**
 * Markdown formatting commands. Each toggles: applying bold to bold text
 * removes it, so toolbar buttons and shortcuts feel reversible.
 */

export function toggleWrap(view: EditorView, marker: string, placeholder = 'text') {
  const { state } = view
  const changes = state.changeByRange((range) => {
    const before = state.sliceDoc(range.from - marker.length, range.from)
    const after = state.sliceDoc(range.to, range.to + marker.length)

    // Already wrapped → unwrap.
    if (before === marker && after === marker) {
      return {
        changes: [
          { from: range.from - marker.length, to: range.from },
          { from: range.to, to: range.to + marker.length },
        ],
        range: EditorSelection.range(range.from - marker.length, range.to - marker.length),
      }
    }

    const selected = state.sliceDoc(range.from, range.to)
    if (
      selected.startsWith(marker) &&
      selected.endsWith(marker) &&
      selected.length >= marker.length * 2
    ) {
      const inner = selected.slice(marker.length, -marker.length)
      return {
        changes: { from: range.from, to: range.to, insert: inner },
        range: EditorSelection.range(range.from, range.from + inner.length),
      }
    }

    const text = selected || placeholder
    return {
      changes: { from: range.from, to: range.to, insert: `${marker}${text}${marker}` },
      range: EditorSelection.range(
        range.from + marker.length,
        range.from + marker.length + text.length,
      ),
    }
  })
  view.dispatch(state.update(changes, { scrollIntoView: true, userEvent: 'input.format' }))
  view.focus()
  return true
}

export function insertLink(view: EditorView, { image = false } = {}) {
  const { state } = view
  const changes = state.changeByRange((range: SelectionRange) => {
    const selected = state.sliceDoc(range.from, range.to)
    const isUrl = /^https?:\/\/\S+$/.test(selected)
    const label = isUrl
      ? image
        ? 'alt text'
        : 'link text'
      : selected || (image ? 'alt text' : 'link text')
    const url = isUrl ? selected : 'https://'
    const prefix = image ? '!' : ''
    const insert = `${prefix}[${label}](${url})`
    // Select whichever part the user still needs to fill in.
    const selectFrom =
      isUrl || !selected
        ? range.from + prefix.length + 1
        : range.from + prefix.length + label.length + 3
    const selectTo = isUrl || !selected ? selectFrom + label.length : selectFrom + url.length
    return {
      changes: { from: range.from, to: range.to, insert },
      range: EditorSelection.range(selectFrom, selectTo),
    }
  })
  view.dispatch(state.update(changes, { scrollIntoView: true, userEvent: 'input.format' }))
  view.focus()
  return true
}

const LINE_PREFIX = /^(\s*)(#{1,6}\s+|>\s?|[-*+]\s+\[[ xX]\]\s+|[-*+]\s+|\d+[.)]\s+)?/

/** Set (or clear, if already set) a block prefix on every selected line. */
export function toggleLinePrefix(view: EditorView, prefix: string) {
  const { state } = view
  const lines = new Set<number>()
  for (const range of state.selection.ranges) {
    const first = state.doc.lineAt(range.from).number
    const last = state.doc.lineAt(range.to).number
    for (let line = first; line <= last; line++) lines.add(line)
  }

  const numbered = prefix === '1. '
  let counter = 1
  const allHavePrefix = [...lines].every((number) => {
    const text = state.doc.line(number).text
    const current = LINE_PREFIX.exec(text)?.[2] ?? ''
    return numbered ? /^\d+[.)]\s+$/.test(current) : current === prefix
  })

  const changes = [...lines].map((number) => {
    const line = state.doc.line(number)
    const match = LINE_PREFIX.exec(line.text)
    const indent = match?.[1] ?? ''
    const existing = match?.[2] ?? ''
    const insert = allHavePrefix ? '' : numbered ? `${counter++}. ` : prefix
    return {
      from: line.from + indent.length,
      to: line.from + indent.length + existing.length,
      insert,
    }
  })

  view.dispatch({ changes, scrollIntoView: true, userEvent: 'input.format' })
  view.focus()
  return true
}

/** Insert a block (table, fence, rule…) on its own lines, padded with blank lines. */
export function insertBlock(view: EditorView, block: string, selectText?: string) {
  const { state } = view
  const { from, to } = state.selection.main
  const line = state.doc.lineAt(from)
  const atLineStart = from === line.from
  const before =
    from === 0
      ? ''
      : atLineStart
        ? line.number > 1 && state.doc.line(line.number - 1).text.trim()
          ? '\n'
          : ''
        : '\n\n'
  const insert = `${before}${block}\n`
  const selectionStart = selectText ? insert.indexOf(selectText) : -1
  view.dispatch({
    changes: { from, to, insert },
    selection:
      selectionStart >= 0
        ? EditorSelection.range(from + selectionStart, from + selectionStart + selectText!.length)
        : EditorSelection.cursor(from + insert.length),
    scrollIntoView: true,
    userEvent: 'input.format',
  })
  view.focus()
  return true
}

export const formatting = {
  bold: (view: EditorView) => toggleWrap(view, '**', 'bold text'),
  italic: (view: EditorView) => toggleWrap(view, '*', 'italic text'),
  strike: (view: EditorView) => toggleWrap(view, '~~', 'struck text'),
  code: (view: EditorView) => toggleWrap(view, '`', 'code'),
  link: (view: EditorView) => insertLink(view),
  image: (view: EditorView) => insertLink(view, { image: true }),
  h1: (view: EditorView) => toggleLinePrefix(view, '# '),
  h2: (view: EditorView) => toggleLinePrefix(view, '## '),
  h3: (view: EditorView) => toggleLinePrefix(view, '### '),
  quote: (view: EditorView) => toggleLinePrefix(view, '> '),
  bullet: (view: EditorView) => toggleLinePrefix(view, '- '),
  numbered: (view: EditorView) => toggleLinePrefix(view, '1. '),
  task: (view: EditorView) => toggleLinePrefix(view, '- [ ] '),
  codeBlock: (view: EditorView) => insertBlock(view, '```ts\ncode\n```', 'code'),
  table: (view: EditorView) =>
    insertBlock(view, '| Column | Column |\n| :--- | :--- |\n| Cell | Cell |', 'Column'),
  math: (view: EditorView) => insertBlock(view, '$$\nE = mc^2\n$$', 'E = mc^2'),
  diagram: (view: EditorView) =>
    insertBlock(
      view,
      '```mermaid\nflowchart LR\n  A[Start] --> B[Finish]\n```',
      'A[Start] --> B[Finish]',
    ),
  rule: (view: EditorView) => insertBlock(view, '---'),
  alert: (view: EditorView) =>
    insertBlock(view, '> [!NOTE]\n> Something worth knowing.', 'Something worth knowing.'),
} satisfies Record<string, (view: EditorView) => boolean>

export type FormatCommand = keyof typeof formatting

export const formattingKeymap: KeyBinding[] = [
  { key: 'Mod-b', run: formatting.bold },
  { key: 'Mod-i', run: formatting.italic },
  { key: 'Mod-Shift-x', run: formatting.strike },
  { key: 'Mod-e', run: formatting.code },
  { key: 'Mod-Alt-1', run: formatting.h1 },
  { key: 'Mod-Alt-2', run: formatting.h2 },
  { key: 'Mod-Alt-3', run: formatting.h3 },
  { key: 'Mod-Shift-7', run: formatting.numbered },
  { key: 'Mod-Shift-8', run: formatting.bullet },
  { key: 'Mod-Shift-9', run: formatting.task },
]

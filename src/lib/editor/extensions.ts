import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { languages } from '@codemirror/language-data'
import { EditorSelection, type Extension } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { tags as t } from '@lezer/highlight'

import { formattingKeymap } from './commands'

/**
 * The editor is themed entirely from CSS variables, so light/dark switches
 * with the page and never needs a reconfigure.
 */
const theme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '14px',
    color: 'var(--ink)',
    backgroundColor: 'transparent',
  },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': {
    fontFamily: 'var(--font-mono)',
    lineHeight: '1.75',
    overflow: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor: 'var(--rule-strong) transparent',
  },
  '.cm-content': {
    padding: '28px 0 40vh',
    caretColor: 'var(--proof)',
    maxWidth: '78ch',
  },
  '.cm-line': { padding: '0 28px 0 6px' },
  '.cm-cursor, .cm-dropCursor': { borderLeft: '2px solid var(--proof)' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
    { backgroundColor: 'var(--proof-soft) !important' },
  '.cm-selectionMatch': { backgroundColor: 'color-mix(in oklch, var(--marker) 55%, transparent)' },
  '.cm-activeLine': { backgroundColor: 'color-mix(in oklch, var(--paper-3) 45%, transparent)' },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    color: 'var(--ink-4)',
    border: 'none',
    paddingLeft: '10px',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    fontSize: '11px',
    minWidth: '32px',
    padding: '0 10px 0 0',
    fontVariantNumeric: 'tabular-nums',
  },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--ink-2)' },
  '.cm-placeholder': { color: 'var(--ink-4)', fontStyle: 'italic' },
  '.cm-matchingBracket': {
    backgroundColor: 'transparent',
    outline: '1px solid var(--rule-strong)',
    borderRadius: '2px',
  },
  '.cm-searchMatch': {
    backgroundColor: 'color-mix(in oklch, var(--marker) 70%, transparent)',
    outline: '1px solid color-mix(in oklch, var(--marker) 100%, var(--ink) 20%)',
  },
  '.cm-searchMatch.cm-searchMatch-selected': { backgroundColor: 'var(--marker)' },
  '.cm-panels': {
    backgroundColor: 'var(--paper-2)',
    color: 'var(--ink)',
    fontFamily: 'var(--font-sans)',
    fontSize: '13px',
  },
  '.cm-panels.cm-panels-top': { borderBottom: '1px solid var(--rule)' },
  '.cm-panels.cm-panels-bottom': { borderTop: '1px solid var(--rule)' },
  '.cm-panel.cm-search': { padding: '8px 12px' },
  '.cm-panel.cm-search input, .cm-panel.cm-search button': {
    fontFamily: 'inherit',
    fontSize: '12px',
    borderRadius: '6px',
  },
  '.cm-textfield': {
    backgroundColor: 'var(--paper)',
    border: '1px solid var(--rule-strong)',
    padding: '3px 8px',
  },
  '.cm-button': {
    backgroundImage: 'none',
    backgroundColor: 'var(--paper)',
    border: '1px solid var(--rule-strong)',
    padding: '3px 10px',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--paper)',
    border: '1px solid var(--rule)',
    borderRadius: '8px',
  },
})

/** Recessive markup, confident content — in the spirit of iA Writer. */
const highlight = HighlightStyle.define([
  { tag: t.heading1, color: 'var(--ink)', fontWeight: '700', fontSize: '1.18em' },
  { tag: t.heading2, color: 'var(--ink)', fontWeight: '700', fontSize: '1.08em' },
  { tag: [t.heading3, t.heading4, t.heading5, t.heading6], color: 'var(--ink)', fontWeight: '700' },
  { tag: t.processingInstruction, color: 'var(--ink-4)' },
  { tag: t.strong, fontWeight: '700', color: 'var(--ink)' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through', color: 'var(--ink-3)' },
  { tag: t.link, color: 'var(--proof)' },
  {
    tag: t.url,
    color: 'var(--ink-3)',
    textDecoration: 'underline',
    textDecorationColor: 'var(--rule-strong)',
  },
  {
    tag: t.monospace,
    color: 'var(--ink-2)',
    backgroundColor: 'color-mix(in oklch, var(--paper-3) 70%, transparent)',
    borderRadius: '3px',
  },
  { tag: t.quote, color: 'var(--ink-2)', fontStyle: 'italic' },
  { tag: t.list, color: 'var(--proof)' },
  { tag: [t.contentSeparator, t.meta], color: 'var(--ink-4)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--ink-3)', fontStyle: 'italic' },
  {
    tag: [t.keyword, t.controlKeyword, t.moduleKeyword, t.operatorKeyword],
    color: 'oklch(0.55 0.15 300)',
  },
  { tag: [t.string, t.special(t.string), t.regexp], color: 'oklch(0.55 0.12 150)' },
  { tag: [t.number, t.bool, t.null, t.atom], color: 'oklch(0.6 0.15 50)' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: 'oklch(0.52 0.13 250)' },
  { tag: [t.typeName, t.className, t.namespace], color: 'oklch(0.58 0.12 75)' },
  { tag: [t.tagName, t.angleBracket], color: 'oklch(0.58 0.17 30)' },
  { tag: [t.attributeName, t.propertyName], color: 'oklch(0.55 0.1 210)' },
  { tag: t.invalid, color: 'var(--alert-caution)' },
])

/** Paste a URL over a selection → turn the selection into a link. */
const pasteLinks = EditorView.domEventHandlers({
  paste(event, view) {
    const text = event.clipboardData?.getData('text/plain')?.trim()
    if (!text || !/^https?:\/\/\S+$/.test(text)) return false
    const { state } = view
    if (state.selection.ranges.every((range) => range.empty)) return false

    event.preventDefault()
    view.dispatch(
      state.changeByRange((range) => {
        if (range.empty) return { range }
        const label = state.sliceDoc(range.from, range.to)
        const insert = `[${label}](${text})`
        return {
          changes: { from: range.from, to: range.to, insert },
          range: EditorSelection.cursor(range.from + insert.length),
        }
      }),
      { userEvent: 'input.paste' },
    )
    return true
  },
})

export function createEditorExtensions(): Extension[] {
  return [
    markdown({ base: markdownLanguage, codeLanguages: languages, addKeymap: true }),
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({
      spellcheck: 'true',
      autocorrect: 'on',
      'aria-label': 'Markdown source',
    }),
    keymap.of(formattingKeymap),
    pasteLinks,
    theme,
    syntaxHighlighting(highlight),
  ]
}

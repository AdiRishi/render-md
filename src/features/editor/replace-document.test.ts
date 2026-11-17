import { EditorSelection, EditorState } from '@codemirror/state'
import { describe, expect, it } from 'vitest'

import { replaceDocument } from './replace-document'

const apply = (doc: string, selection: EditorSelection, value: string) => {
  const state = EditorState.create({ doc, selection })
  const transaction = replaceDocument(state, value)
  return transaction ? state.update(transaction).state : state
}

describe('replaceDocument', () => {
  it('keeps a selection the change does not touch', () => {
    const doc = 'First word here.\n\n- [ ] task\n'
    const state = apply(doc, EditorSelection.single(6, 10), doc.replace('[ ]', '[x]'))
    expect(state.doc.toString()).toBe('First word here.\n\n- [x] task\n')
    expect(state.sliceDoc(state.selection.main.from, state.selection.main.to)).toBe('word')
  })

  it('keeps the caret in place when text is added after it', () => {
    const state = apply('# Notes\n\nBody', EditorSelection.single(3), '# Notes\n\nBody\nMore')
    expect(state.selection.main.head).toBe(3)
  })

  it('never leaves a selection inside out when the selected text is replaced', () => {
    const state = apply('aaa bbb ccc', EditorSelection.single(5, 6), 'aaa XYZW ccc')
    const { from, to } = state.selection.main
    expect(state.doc.toString()).toBe('aaa XYZW ccc')
    expect(from).toBeLessThanOrEqual(to)
    // Typing over the selection must not take the rest of the document with it.
    const typed = state.update(state.replaceSelection('!')).state
    expect(typed.doc.toString()).toContain('aaa')
    expect(typed.doc.toString()).toContain('ccc')
  })

  it('does nothing when the value already matches', () => {
    const state = EditorState.create({ doc: 'same' })
    expect(replaceDocument(state, 'same')).toBeNull()
  })
})

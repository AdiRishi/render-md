import { ensureSyntaxTree } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { describe, expect, it } from 'vitest'

import { createEditorExtensions } from './extensions'

/** Every syntax node the editor parses out of a document, as [name, source text]. */
function parse(doc: string) {
  const state = EditorState.create({ doc, extensions: createEditorExtensions() })
  const nodes: Array<[string, string]> = []
  ensureSyntaxTree(state, doc.length, 5000)!.iterate({
    enter: (node) => void nodes.push([node.name, doc.slice(node.from, node.to)]),
  })
  return nodes
}

const named = (nodes: Array<[string, string]>, name: string) =>
  nodes.filter((node) => node[0] === name).map((node) => node[1])

describe('editor frontmatter', () => {
  it('reads a fenced opening block as metadata, not as a heading', () => {
    const nodes = parse('---\ntitle: Notes\ntags: [a, b]\n---\n\n# Heading\n')
    expect(named(nodes, 'Frontmatter')).toEqual(['---\ntitle: Notes\ntags: [a, b]\n---'])
    expect(named(nodes, 'SetextHeading2')).toEqual([])
    expect(named(nodes, 'ATXHeading1')).toEqual(['# Heading'])
  })

  it('keeps highlighting the document after an opening divider with no closing fence', () => {
    const nodes = parse('---\n\n# Heading\n\n- item\n\n```js\nconst a = 1\n```\n')
    expect(named(nodes, 'Frontmatter')).toEqual([])
    expect(named(nodes, 'HorizontalRule')).toEqual(['---'])
    expect(named(nodes, 'ATXHeading1')).toEqual(['# Heading'])
    expect(named(nodes, 'BulletList')).toEqual(['- item'])
    expect(named(nodes, 'FencedCode')).toEqual(['```js\nconst a = 1\n```'])
  })

  it('leaves a divider further down the document alone', () => {
    const nodes = parse('# Heading\n\n---\n\ntext\n\n---\n')
    expect(named(nodes, 'Frontmatter')).toEqual([])
    expect(named(nodes, 'HorizontalRule')).toEqual(['---', '---'])
  })
})

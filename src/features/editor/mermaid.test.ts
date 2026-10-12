import { StringStream } from '@codemirror/language'
import { describe, expect, it } from 'vitest'

import { mermaidParser } from './mermaid'

/** Tokenize a diagram into [text, style] pairs, skipping whitespace. */
function tokenize(source: string) {
  const state = mermaidParser.startState!(2)
  const tokens: Array<[string, string]> = []
  for (const line of source.split('\n')) {
    const stream = new StringStream(line, 2, 2)
    while (!stream.eol()) {
      const style = mermaidParser.token(stream, state)
      if (stream.pos === stream.start) throw new Error(`stuck at ${stream.pos} in ${line}`)
      if (style) tokens.push([stream.current(), style])
      stream.start = stream.pos
    }
  }
  return tokens
}

describe('mermaid tokenizer', () => {
  it('highlights flowcharts', () => {
    expect(tokenize('flowchart TD\n  A[Start] -->|yes| B((Done))')).toEqual([
      ['flowchart', 'keyword'],
      ['TD', 'atom'],
      ['A', 'variableName'],
      ['[', 'bracket'],
      ['Start', 'string'],
      [']', 'bracket'],
      ['-->', 'arrow'],
      ['|yes|', 'string'],
      ['B', 'variableName'],
      ['((', 'bracket'],
      ['Done', 'string'],
      ['))', 'bracket'],
    ])
  })

  it('highlights sequence messages', () => {
    expect(tokenize('sequenceDiagram\n  Alice->>Bob: Hi there')).toEqual([
      ['sequenceDiagram', 'keyword'],
      ['Alice', 'variableName'],
      ['->>', 'arrow'],
      ['Bob', 'variableName'],
      [': Hi there', 'string'],
    ])
  })

  it('recognises arrows across diagram types', () => {
    const arrows = [
      '-->',
      '---',
      '-.->',
      '==>',
      '-->>',
      '-)',
      '<|--',
      '*--',
      '..>',
      '||--o{',
      '}|..|{',
    ]
    const found = arrows.map((arrow) => tokenize(`graph\nA ${arrow} B`)[2])
    expect(found).toEqual(arrows.map((arrow) => [arrow, 'arrow']))
  })

  it('highlights comments, directives and style lines', () => {
    expect(
      tokenize('%%{init: {"theme": "dark"}}%%\n%% note\nclassDef hot fill:#f96,stroke-width:2px'),
    ).toEqual([
      ['%%{init: {"theme": "dark"}}%%', 'meta'],
      ['%% note', 'comment'],
      ['classDef', 'keyword'],
      ['hot', 'variableName'],
      ['fill', 'propertyName'],
      [':', 'punctuation'],
      ['#f96', 'number'],
      [',', 'punctuation'],
      ['stroke-width', 'propertyName'],
      [':', 'punctuation'],
      ['2px', 'number'],
    ])
  })

  it('keeps pie values numeric and titles as text', () => {
    expect(tokenize('pie title Pets\n  "Dogs" : 386')).toEqual([
      ['pie', 'keyword'],
      ['title', 'keyword'],
      [' Pets', 'string'],
      ['"Dogs"', 'string'],
      [':', 'punctuation'],
      ['386', 'number'],
    ])
  })
})

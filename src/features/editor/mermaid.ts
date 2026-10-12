import { type StreamParser, StreamLanguage } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'

/**
 * Highlighting for ```mermaid fences in the editor. `@codemirror/language-data`
 * has no Mermaid grammar, so this is a small line tokenizer covering what every
 * diagram type shares: diagram keywords, arrows, node labels, edge labels,
 * messages after `:`, comments, directives and style lines.
 */

const DIAGRAM_TYPES = new Set(
  [
    'graph',
    'flowchart',
    'flowchart-elk',
    'sequenceDiagram',
    'classDiagram',
    'classDiagram-v2',
    'stateDiagram',
    'stateDiagram-v2',
    'erDiagram',
    'journey',
    'gantt',
    'pie',
    'quadrantChart',
    'requirementDiagram',
    'gitGraph',
    'mindmap',
    'timeline',
    'zenuml',
    'sankey-beta',
    'xychart-beta',
    'block-beta',
    'packet-beta',
    'architecture-beta',
    'kanban',
    'radar-beta',
    'treemap-beta',
    'C4Context',
    'C4Container',
    'C4Component',
    'C4Dynamic',
    'C4Deployment',
  ].map((word) => word.toLowerCase()),
)

const KEYWORDS = new Set([
  'subgraph',
  'end',
  'direction',
  'participant',
  'actor',
  'as',
  'loop',
  'alt',
  'else',
  'opt',
  'par',
  'and',
  'critical',
  'break',
  'rect',
  'box',
  'note',
  'over',
  'left',
  'right',
  'of',
  'activate',
  'deactivate',
  'autonumber',
  'create',
  'destroy',
  'class',
  'state',
  'namespace',
  'click',
  'call',
  'href',
  'commit',
  'branch',
  'checkout',
  'merge',
  'cherry-pick',
  'dateformat',
  'axisformat',
  'tickinterval',
  'excludes',
  'includes',
  'todaymarker',
  'weekday',
  'showdata',
  'x-axis',
  'y-axis',
  'quadrant-1',
  'quadrant-2',
  'quadrant-3',
  'quadrant-4',
])

/** Keywords whose remainder of the line is free text. */
const TEXT_KEYWORDS = new Set(['title', 'section', 'acctitle', 'accdescr'])

/** Keywords that start a `property:value` style line. */
const STYLE_KEYWORDS = new Set(['classdef', 'style', 'linkstyle'])

const DIRECTIONS = new Set(['TB', 'TD', 'BT', 'RL', 'LR'])

const CLOSERS: Record<string, string> = { '[': ']', '(': ')', '{': '}', '>': ']' }

// Links across diagram types: --> --- -.-> ==> ->> -->> -x --o <|-- *-- o-- ..> ||--o{ ~~~
const ARROW =
  /^(?:<\|?|[*o}|]{1,2}(?=[-.=]))?(?:-+\.+-*|-{2,}|={2,}|\.{2,}|~{3,}|-(?=[>x)]))(?:>>|[>x)]|\|>|[o*|{]{1,2}|[ox](?!\w))?/

interface MermaidState {
  /** The diagram type has been seen (the first word of the diagram). */
  started: boolean
  /** Closing character of the node label being read, if any. */
  labelEnd: string | null
  /** Inside a `classDef`/`style`/`linkStyle` line. */
  styleLine: boolean
  /** The previous token was a node id, so a bracket opens a label. */
  afterId: boolean
}

const parser: StreamParser<MermaidState> = {
  name: 'mermaid',

  startState: () => ({ started: false, labelEnd: null, styleLine: false, afterId: false }),

  token(stream, state) {
    if (stream.sol()) {
      state.styleLine = false
      state.afterId = false
      state.labelEnd = null
    }

    if (state.labelEnd) {
      const end = state.labelEnd
      while (!stream.eol() && !end.includes(stream.peek()!)) {
        if (stream.next() !== '"') continue
        if (stream.skipTo('"')) stream.next()
        else stream.skipToEnd()
      }
      if (stream.current()) return 'string'
      state.labelEnd = null
      stream.match(/^[\])}/\\]+/)
      return 'bracket'
    }

    if (stream.eatSpace()) return null

    if (stream.match('%%{')) {
      if (!stream.skipTo('}%%')) stream.skipToEnd()
      else stream.match('}%%')
      return 'meta'
    }
    if (stream.match('%%')) {
      stream.skipToEnd()
      return 'comment'
    }

    if (stream.match(/^"[^"]*"?/)) {
      state.afterId = false
      return 'string'
    }

    if (state.styleLine) {
      if (stream.match(/^[\w-]+(?=:)/)) return 'propertyName'
      if (stream.match(/^#[\da-fA-F]{3,8}\b/)) return 'number'
      if (stream.match(/^-?\d+(?:\.\d+)?(?:px|em|%)?/)) return 'number'
    }

    if (stream.match(ARROW)) {
      state.afterId = false
      return 'arrow'
    }

    // Edge labels: -->|label| and A -- label --> B is left plain.
    if (stream.match(/^\|[^|\n]*\|/)) return 'string'

    if (stream.match(':::')) {
      stream.match(/^[\w-]+/)
      return 'className'
    }

    if (state.afterId && stream.match(/^(?:\(\(\(|\(\(|\(\[|\[\[|\[\(|\[\/|\[\\|\{\{|[[({>])/)) {
      const opener = stream.current()
      state.labelEnd = opener === '[/' || opener === '[\\' ? '/\\]' : CLOSERS[opener.at(-1)!]
      state.afterId = false
      return 'bracket'
    }

    if (stream.peek() === ':' && !state.styleLine) {
      stream.next()
      // `"Dogs" : 386` keeps its number; messages and descriptions are text.
      if (stream.match(/^\s*-?\d+(?:\.\d+)?\s*$/, false)) return 'punctuation'
      stream.eatSpace()
      if (stream.eol()) return 'punctuation'
      stream.skipToEnd()
      return 'string'
    }

    if (stream.match(/^-?\d+(?:\.\d+)?(?![\w-])/)) return 'number'

    const word = stream.match(/^\w+(?:-\w+)*/) as RegExpMatchArray | null
    if (word) {
      const text = word[0]
      const lower = text.toLowerCase()
      if (!state.started) {
        state.started = true
        if (DIAGRAM_TYPES.has(lower)) return 'keyword'
      }
      if (DIRECTIONS.has(text)) return 'atom'
      if (TEXT_KEYWORDS.has(lower)) {
        state.labelEnd = '\n'
        return 'keyword'
      }
      if (STYLE_KEYWORDS.has(lower)) {
        state.styleLine = true
        return 'keyword'
      }
      if (KEYWORDS.has(lower) && !stream.match(/^[[({>]/, false)) return 'keyword'
      if (lower === 'true' || lower === 'false') return 'bool'
      state.afterId = true
      return 'variableName'
    }

    stream.next()
    state.afterId = false
    return /[[\](){}]/.test(stream.current()) ? 'bracket' : 'punctuation'
  },

  languageData: { commentTokens: { line: '%%' } },

  tokenTable: { arrow: t.special(t.operator) },
}

export const mermaidLanguage = StreamLanguage.define(parser)
export { parser as mermaidParser }

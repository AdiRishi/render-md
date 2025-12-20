import { createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'

/**
 * Custom CodeMirror theme for the Markdown editor
 * Matches the design system colors and uses Geist Mono font
 */
export const editorTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#ffffff',
    foreground: '#1e293b', // slate-800
    caret: '#137fec', // primary blue
    selection: '#137fec26', // primary with opacity
    selectionMatch: '#137fec1a',
    lineHighlight: 'transparent', // no line highlight for clean look
    gutterBackground: '#f8fafc', // slate-50 - matches design exactly
    gutterForeground: '#cbd5e1', // slate-300 - matches design exactly
    gutterActiveForeground: '#94a3b8', // slate-400
    gutterBorder: '#f1f5f9', // slate-100 - subtle border like design
    fontFamily:
      "'Geist Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  styles: [
    // Markdown headings - primary blue and bold
    { tag: t.heading1, color: '#137fec', fontWeight: 'bold' },
    { tag: t.heading2, color: '#137fec', fontWeight: 'bold' },
    { tag: t.heading3, color: '#137fec', fontWeight: 'bold' },
    { tag: t.heading4, color: '#137fec', fontWeight: 'bold' },
    { tag: t.heading5, color: '#137fec', fontWeight: 'bold' },
    { tag: t.heading6, color: '#137fec', fontWeight: 'bold' },

    // Emphasis
    { tag: t.strong, color: '#137fec', fontWeight: 'bold' },
    { tag: t.emphasis, fontStyle: 'italic' },

    // Links
    { tag: t.link, color: '#137fec', textDecoration: 'underline' },
    { tag: t.url, color: '#64748b' }, // slate-500

    // Code
    { tag: t.monospace, color: '#7c3aed' }, // violet-600
    { tag: t.processingInstruction, color: '#94a3b8' }, // slate-400 (for ``` markers)

    // Lists and quotes
    { tag: t.quote, color: '#64748b', fontStyle: 'italic' },
    { tag: t.list, color: '#475569' }, // slate-600

    // Comments
    { tag: t.comment, color: '#94a3b8' }, // slate-400

    // Default code highlighting (for fenced code blocks)
    { tag: t.keyword, color: '#7c3aed' }, // violet-600
    { tag: t.function(t.variableName), color: '#2563eb' }, // blue-600
    { tag: t.variableName, color: '#0891b2' }, // cyan-600
    { tag: t.string, color: '#16a34a' }, // green-600
    { tag: t.number, color: '#ea580c' }, // orange-600
    { tag: t.bool, color: '#7c3aed' }, // violet-600
    { tag: t.null, color: '#7c3aed' }, // violet-600
    { tag: t.operator, color: '#475569' }, // slate-600
    { tag: t.className, color: '#ca8a04' }, // yellow-600
    { tag: t.definition(t.typeName), color: '#ca8a04' },
    { tag: t.typeName, color: '#ca8a04' },
    { tag: t.angleBracket, color: '#64748b' },
    { tag: t.tagName, color: '#dc2626' }, // red-600
    { tag: t.attributeName, color: '#7c3aed' }, // violet-600
    { tag: t.propertyName, color: '#0891b2' }, // cyan-600
  ],
})

/**
 * Dark theme variant for future use
 */
export const editorThemeDark = createTheme({
  theme: 'dark',
  settings: {
    background: '#0f172a', // slate-900
    foreground: '#e2e8f0', // slate-200
    caret: '#60a5fa', // blue-400
    selection: '#60a5fa33',
    selectionMatch: '#60a5fa1a',
    lineHighlight: '#1e293b', // slate-800
    gutterBackground: '#0f172a',
    gutterForeground: '#475569', // slate-600
    gutterActiveForeground: '#94a3b8', // slate-400
    gutterBorder: '#1e293b',
    fontFamily:
      "'Geist Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  styles: [
    // Markdown headings
    { tag: t.heading1, color: '#60a5fa', fontWeight: 'bold' },
    { tag: t.heading2, color: '#60a5fa', fontWeight: 'bold' },
    { tag: t.heading3, color: '#60a5fa', fontWeight: 'bold' },
    { tag: t.heading4, color: '#60a5fa', fontWeight: 'bold' },
    { tag: t.heading5, color: '#60a5fa', fontWeight: 'bold' },
    { tag: t.heading6, color: '#60a5fa', fontWeight: 'bold' },

    // Emphasis
    { tag: t.strong, color: '#60a5fa', fontWeight: 'bold' },
    { tag: t.emphasis, fontStyle: 'italic' },

    // Links
    { tag: t.link, color: '#60a5fa', textDecoration: 'underline' },
    { tag: t.url, color: '#94a3b8' },

    // Code
    { tag: t.monospace, color: '#a78bfa' }, // violet-400
    { tag: t.processingInstruction, color: '#64748b' },

    // Lists and quotes
    { tag: t.quote, color: '#94a3b8', fontStyle: 'italic' },
    { tag: t.list, color: '#cbd5e1' },

    // Comments
    { tag: t.comment, color: '#64748b' },

    // Default code highlighting
    { tag: t.keyword, color: '#a78bfa' },
    { tag: t.function(t.variableName), color: '#60a5fa' },
    { tag: t.variableName, color: '#22d3ee' }, // cyan-400
    { tag: t.string, color: '#4ade80' }, // green-400
    { tag: t.number, color: '#fb923c' }, // orange-400
    { tag: t.bool, color: '#a78bfa' },
    { tag: t.null, color: '#a78bfa' },
    { tag: t.operator, color: '#cbd5e1' },
    { tag: t.className, color: '#facc15' }, // yellow-400
    { tag: t.definition(t.typeName), color: '#facc15' },
    { tag: t.typeName, color: '#facc15' },
    { tag: t.angleBracket, color: '#94a3b8' },
    { tag: t.tagName, color: '#f87171' }, // red-400
    { tag: t.attributeName, color: '#a78bfa' },
    { tag: t.propertyName, color: '#22d3ee' },
  ],
})

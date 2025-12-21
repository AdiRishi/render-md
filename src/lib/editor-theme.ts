import { type CreateThemeOptions, createTheme } from '@uiw/codemirror-themes'
import { tags as t } from '@lezer/highlight'

/**
 * Custom CodeMirror theme for the Markdown editor
 * Pulls all colors from Tailwind CSS variables (see src/global-styles/tailwind.css)
 */
const editorThemeBase: Omit<CreateThemeOptions, 'theme'> = {
  settings: {
    background: 'var(--editor-bg)',
    foreground: 'var(--editor-fg)',
    caret: 'var(--editor-caret)',
    selection: 'var(--editor-selection)',
    selectionMatch: 'var(--editor-selection-match)',
    lineHighlight: 'var(--editor-line-highlight)',
    gutterBackground: 'var(--editor-gutter-bg)',
    gutterForeground: 'var(--editor-gutter-fg)',
    gutterActiveForeground: 'var(--editor-gutter-active-fg)',
    gutterBorder: 'var(--editor-gutter-border)',
    fontFamily:
      "'Geist Mono Variable', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
  styles: [
    // Markdown headings
    { tag: t.heading1, color: 'var(--editor-syntax-heading)', fontWeight: 'bold' },
    { tag: t.heading2, color: 'var(--editor-syntax-heading)', fontWeight: 'bold' },
    { tag: t.heading3, color: 'var(--editor-syntax-heading)', fontWeight: 'bold' },
    { tag: t.heading4, color: 'var(--editor-syntax-heading)', fontWeight: 'bold' },
    { tag: t.heading5, color: 'var(--editor-syntax-heading)', fontWeight: 'bold' },
    { tag: t.heading6, color: 'var(--editor-syntax-heading)', fontWeight: 'bold' },

    // Emphasis
    { tag: t.strong, color: 'var(--editor-syntax-heading)', fontWeight: 'bold' },
    { tag: t.emphasis, fontStyle: 'italic' },

    // Links
    { tag: t.link, color: 'var(--editor-syntax-link)', textDecoration: 'underline' },
    { tag: t.url, color: 'var(--editor-syntax-url)' },

    // Code
    { tag: t.monospace, color: 'var(--editor-syntax-code)' },
    { tag: t.processingInstruction, color: 'var(--editor-syntax-fence)' }, // ``` markers

    // Lists and quotes
    { tag: t.quote, color: 'var(--editor-syntax-quote)', fontStyle: 'italic' },
    { tag: t.list, color: 'var(--editor-syntax-list)' },

    // Comments
    { tag: t.comment, color: 'var(--editor-syntax-comment)' },

    // Default code highlighting (for fenced code blocks)
    { tag: t.keyword, color: 'var(--editor-syntax-keyword)' },
    { tag: t.function(t.variableName), color: 'var(--editor-syntax-function)' },
    { tag: t.variableName, color: 'var(--editor-syntax-variable)' },
    { tag: t.string, color: 'var(--editor-syntax-string)' },
    { tag: t.number, color: 'var(--editor-syntax-number)' },
    { tag: t.bool, color: 'var(--editor-syntax-keyword)' },
    { tag: t.null, color: 'var(--editor-syntax-keyword)' },
    { tag: t.operator, color: 'var(--editor-syntax-operator)' },
    { tag: t.className, color: 'var(--editor-syntax-type)' },
    { tag: t.definition(t.typeName), color: 'var(--editor-syntax-type)' },
    { tag: t.typeName, color: 'var(--editor-syntax-type)' },
    { tag: t.angleBracket, color: 'var(--editor-syntax-angle)' },
    { tag: t.tagName, color: 'var(--editor-syntax-tag)' },
    { tag: t.attributeName, color: 'var(--editor-syntax-attribute)' },
    { tag: t.propertyName, color: 'var(--editor-syntax-property)' },
  ],
}

export const editorTheme = createTheme({
  theme: 'light',
  ...editorThemeBase,
})

export const editorThemeDark = createTheme({
  theme: 'dark',
  ...editorThemeBase,
})

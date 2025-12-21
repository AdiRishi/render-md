# CLAUDE.md

This file provides guidance to AI agents when working with code in this repository.

## Project Overview

RenderMD is a real-time markdown editor with live preview, built with TanStack Start (React 19 meta-framework), TypeScript, and Tailwind CSS 4. It supports GitHub Flavored Markdown, LaTeX math (KaTeX), and syntax highlighting for 150+ languages.

## Commands

```bash
pnpm dev          # Start dev server on port 3000
pnpm build        # Build for production
pnpm test         # Run tests with Vitest
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
pnpm check        # Run all checks (format, lint, typecheck)
pnpm deploy       # Deploy to Cloudflare Workers
```

Add shadcn/ui components: `npx shadcn@latest add <component-name>`

## Architecture

### Component Hierarchy

```
index.tsx → EditorLayout
              ├── EditorHeader (view mode toggle: split/editor/preview)
              ├── MarkdownPane (CodeMirror 6 editor)
              └── PreviewPane (ReactMarkdown output, memoized)
                    └── markdown-components.tsx (custom element renderers)
                          └── CodeBlock.tsx (syntax highlighting)
```

### Key Directories

- `src/components/editor/` - Core editor components
- `src/components/ui/` - shadcn/ui component library
- `src/lib/editor-theme.ts` - CodeMirror custom theme (light + dark variants)
- `src/global-styles/` - Tailwind CSS and CodeMirror styles
- `src/routes/` - TanStack Router file-based routing

### Project Structure

```
render-md/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── editor/           # Editor components
│   │   │   ├── EditorHeader.tsx      # View mode toggle, actions
│   │   │   ├── EditorLayout.tsx      # Main layout orchestrator
│   │   │   ├── MarkdownPane.tsx      # CodeMirror editor
│   │   │   ├── PreviewPane.tsx       # Rendered markdown
│   │   │   └── markdown/
│   │   │       ├── CodeBlock.tsx     # Syntax-highlighted code
│   │   │       ├── default-content.ts
│   │   │       └── markdown-components.tsx
│   │   ├── ui/               # shadcn/ui components
│   │   └── ErrorBoundary.tsx
│   ├── global-styles/
│   │   ├── editor.css        # CodeMirror custom styles
│   │   └── tailwind.css      # Tailwind config & theme
│   ├── lib/
│   │   ├── editor-theme.ts   # CodeMirror theme
│   │   └── utils.ts          # Utility functions
│   ├── routes/
│   │   ├── __root.tsx        # Root layout
│   │   └── index.tsx         # Home page
│   └── router.tsx            # TanStack Router config
├── components.json           # shadcn/ui config
├── package.json
├── tsconfig.json
├── vite.config.ts
└── nitro.config.ts           # Nitro server config
```

### Markdown Rendering Pipeline

1. **Input**: CodeMirror editor in MarkdownPane
2. **Processing**: react-markdown with remark-gfm (GFM), remark-math + rehype-katex (LaTeX)
3. **Output**: Custom React components defined in `markdown-components.tsx`
4. **Performance**: Uses `useDeferredValue` for deferred preview updates

## Code Conventions

- **Styling**: Tailwind CSS with `cn()` utility (clsx + tailwind-merge) from `src/lib/utils.ts`
- **Component Variants**: Class Variance Authority (CVA) pattern, see `src/components/ui/text.tsx`
- **Path Aliases**: `@/*` maps to `./src/*`
- **Formatting**: No semicolons, single quotes, trailing commas (Prettier config)
- **Design System**: Slate palette with primary blue `#137fec`, Geist font family

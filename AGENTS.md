# AGENTS.md

Guidance for AI agents working in this repository. (`CLAUDE.md` and `GEMINI.md` are symlinks to this file.)

## Project overview

RenderMD is a private, ad-free markdown renderer and editor: paste, drop, open or link any markdown file and read it beautifully typeset. Everything renders in the browser — documents are stored in `localStorage`, and share links carry the document inside the URL fragment (never sent to a server).

Built with TanStack Start (React 19), Tailwind CSS 4, CodeMirror 6, a unified/remark/rehype pipeline running in a Web Worker, Shiki, KaTeX and Mermaid. Deployed to Cloudflare Workers via Nitro.

## Commands

```bash
pnpm dev          # Dev server on :3000 (Nitro runs on Node in dev)
pnpm build        # Production build → .output/ (Cloudflare module worker)
pnpm test         # Vitest
pnpm check        # oxfmt --check + oxlint --type-aware + tsc (TypeScript 7) — what CI runs
pnpm fix          # Format and auto-fix lint issues
pnpm deploy       # Deploy .output/ with wrangler
```

## Toolchain

- **TypeScript 7** (native `tsc`). typescript-eslint doesn't support TS 7, so linting is **Oxlint** with type-aware rules (`oxlint-tsgolint`) — config in `.oxlintrc.json`.
- **Oxfmt** formats everything (config in `.oxfmtrc.json`): no semicolons, single quotes, trailing commas, 100 columns, sorted imports and Tailwind classes. CSS indentation follows `.editorconfig` (4 spaces).
- **React Compiler** is enabled via `@rolldown/plugin-babel` + `reactCompilerPreset()` — don't add `useMemo`/`useCallback` for performance alone.
- **Vite 8** (Rolldown), **Vitest 5**.

## Architecture

```
routes/index.tsx → Workspace (client-only; SSR shows WorkspaceSkeleton)
  ├── TopBar            brand, document title, Write/Split/Read switch, Open/Export menus,
  │                     ReaderSettings (typeset popover), ThemeToggle, Share
  ├── EditorPane        CodeMirror 6 + formatting toolbar
  ├── Divider           draggable split (ratio persisted in settings)
  ├── <Activity>        React 19 Activity hides the preview in Write mode
  │    └── PreviewPane  the "sheet" on the desk: folio, crop marks, Outline, DocumentView
  ├── StatusBar         words/chars/lines, cursor, scroll-sync toggle
  └── CommandPalette (cmdk), ShareDialog, OpenUrlDialog, DropOverlay
routes/cheatsheet.tsx → examples rendered by the real pipeline in a server function
```

### Markdown pipeline (`src/lib/markdown/`)

- `pipeline.ts` — `renderMarkdown(markdown, { baseUrl })` → `{ hast, headings, frontmatter, title, stats }`. Synchronous; runs in the worker, in tests, and on the server.
  `remark-parse → frontmatter → gfm → math → gemoji → code meta → remark-rehype → rehype-raw → source lines → rehype-sanitize (GitHub schema) → KaTeX → GitHub alerts → slug → base URL → heading outline`
- `plugins.ts` — the custom unified plugins. Block elements get `data-line` (source line) for scroll sync, double-click-to-locate and live task toggles.
- `sanitize-schema.ts` — GitHub's schema, widened slightly. Anything our plugins add _before_ sanitize must be allow-listed here.
- `render.worker.ts` / `client.ts` — the worker and its promise-based client (falls back to the main thread). `hooks/use-rendered-markdown.ts` coalesces requests so only the latest text is rendered.
- `components/document/DocumentView.tsx` — HAST → React via `hast-util-to-jsx-runtime`, with components for code (`CodeBlock`, Shiki), Mermaid (`Diagram`), alerts, headings, links and task checkboxes.

### State (`src/stores/`, Zustand)

- `document-store.ts` — current document (`markdown`, `name`, `baseUrl`, `source`) and the _recents_ shelf. Replacing a document always archives the previous one, so actions can offer Undo. Persisted with debounced writes (`lib/storage.ts`).
- `settings-store.ts` — view mode, typeset, measure, text size, diagram look, scroll sync, split ratio.
- `ui-store.ts` — open dialog, drag state, cursor position; `previewArticle` holds the rendered `<article>` for export/copy.

All document-level actions (open, save, share, export…) live in `hooks/use-document-actions.ts` as `documentActions`; the top bar, palette and shortcuts all call these.

### Styling

- `src/styles/app.css` — Tailwind 4 entry and design tokens. Fonts, shadows and easing live in a plain `@theme` block (emitted as CSS variables because CodeMirror's theme and `document.css` read them); colors live in `@theme inline`.
- `src/styles/document.css` — the rendered document's typography as plain semantic CSS scoped to `.doc`. Three typesets via `data-typeset`: `sans` (Modern), `serif` (Editorial), `mono` (Technical). The same file is inlined into **Export → HTML**, so keep it free of Tailwind utilities.
- `src/lib/editor/extensions.ts` — CodeMirror theme and highlight style, driven entirely by CSS variables.
- `cn()` from `src/lib/utils.ts` merges classes; variants use CVA (`components/ui/button.tsx`).

## Design system — "Paper & Proof"

- The **desk** (warm grey with a faint dot grid) is where you work; **paper** is what you make; **proof red** (`--proof`) marks intent — the color of a proofreader's pencil. Use it sparingly: active states, the caret, the brand arrow.
- Ink scale: `ink` → `ink-2` → `ink-3` → `ink-4`. Rules: `rule`, `rule-strong`.
- Type: **Instrument Serif** (display), **Instrument Sans** (UI, Modern typeset), **Newsreader** (Editorial body), **Geist Mono** (code, labels). Small mono uppercase labels use the `label-caps` utility.
- Printer's details: crop marks around sheets, a `¶` folio line, `§` heading anchors, `⁂` for horizontal rules.
- Light and dark themes are both first-class; theme preference is `light | dark | system`, resolved pre-paint by an inline script (`lib/theme.ts`) and switched with a View Transition.

## Conventions

- Path alias `@/*` → `./src/*`.
- Prefer base-ui primitives (`@base-ui/react`) wrapped in `src/components/ui/`.
- Keep the markdown pipeline pure and synchronous; add tests in `src/lib/markdown/pipeline.test.ts` for any syntax change.
- New user-facing actions go in `documentActions` and should be reachable from the command palette.

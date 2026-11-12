# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

RenderMD is a private, ad-free markdown renderer and editor: paste, drop, open or link any markdown file and read it beautifully typeset. Everything renders in the browser — documents are stored in `localStorage`, and share links carry the document inside the URL fragment (never sent to a server).

Built with TanStack Start (React 19), Tailwind CSS 4, CodeMirror 6, a unified/remark/rehype pipeline running in a Web Worker, Shiki, KaTeX and Mermaid. Deployed to Cloudflare Workers with `@cloudflare/vite-plugin` (config in `wrangler.jsonc`).

## Commands

```bash
pnpm dev          # Dev server on :3000 (SSR runs in workerd, as in production)
pnpm build        # Production build → dist/ (client assets + Worker), plus the sitemap
pnpm test         # Vitest
pnpm check        # oxfmt --check + oxlint --type-aware + tsc (TypeScript 7) — what CI runs
pnpm fix          # Format and auto-fix lint issues
pnpm deploy       # Deploy dist/ with wrangler
node build/check-render-worker.ts  # After a build: the worker renders without a DOM
node build/check-pdf.ts            # After a build: export the print fixture to PDF and check the pages
                                   # (--url http://localhost:3000 runs it against `pnpm dev`)
```

## Toolchain

- **TypeScript 7** (native `tsc`). typescript-eslint doesn't support TS 7, so linting is **Oxlint** with type-aware rules (`oxlint-tsgolint`) — config in `.oxlintrc.json`.
- **Oxfmt** formats everything (config in `.oxfmtrc.json`): no semicolons, single quotes, trailing commas, 100 columns, sorted imports and Tailwind classes. CSS indentation follows `.editorconfig` (4 spaces).
- **React Compiler** is enabled via `@rolldown/plugin-babel` + `reactCompilerPreset()` — don't add `useMemo`/`useCallback` for performance alone.
- **Vite 8** (Rolldown), **Vitest 5**.

## Architecture

The code is organized **by feature**, on top of two shared layers. Each folder
answers one question; if you're unsure where something goes, the layer rules
below decide it.

```
src/
├── routes/        Thin TanStack file routes: path, loader, <head>, which page to render.
├── features/      Everything users can see or do, grouped by feature.
│   ├── workspace/   The app at "/": layout, panes, chrome, dialogs, state, document I/O.
│   ├── cheatsheet/  The /cheatsheet reference page (an SEO page — see below).
│   ├── guides/      The task pages (/mermaid-viewer, /markdown-to-pdf, … — SEO pages, see below).
│   ├── markdown/    The rendering engine and the React document renderer.
│   ├── editor/      CodeMirror 6: editor component, toolbar, commands, theme.
│   ├── theme/       Light/dark/system: provider, toggle, pre-paint boot script.
│   └── site/        Site chrome shared by content pages: header, footer, breadcrumb, FAQ, the list of content pages, 404, analytics.
├── ui/            shadcn/ui components (button, dropdown-menu, dialog, …) + our own primitives. No app state.
├── lib/           Framework-free helpers (utils → cn, format, platform, download, seo, share-link).
├── styles/        Global CSS: Tailwind entry (app.css) and color tokens (tokens.css).
└── router.tsx
build/             Build-time tooling (render-worker smoke test, PDF check and its fixture, OG images) — never shipped.
```

### Layers and dependency rules

Imports only point **down** this list. The rules are enforced by
`no-restricted-imports` overrides in `.oxlintrc.json`, so `pnpm check` fails if
a boundary is crossed.

| Layer                                                      | May import                                                                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `routes/`                                                  | anything below                                                                                                  |
| product features: `workspace`, `cheatsheet`, `guides`      | foundation features, `ui`, `lib` — not each other                                                               |
| foundation features: `markdown`, `editor`, `theme`, `site` | each other, `ui`, `lib` — never product features                                                                |
| `features/markdown/engine/`                                | `lib` and npm packages only — **no React**, no other features (it runs in a worker, on the server and in tests) |
| `ui/`                                                      | `lib` — never features                                                                                          |
| `lib/`                                                     | npm packages only — no React, no features, no UI                                                                |

### Feature anatomy

Features use the same sub-folder names when they need them:

| Folder        | Holds                                                                                                                                     |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `components/` | React components private to the feature                                                                                                   |
| `hooks/`      | `use-*` hooks                                                                                                                             |
| `state/`      | Zustand stores and their persistence                                                                                                      |
| `io/`         | Talking to the outside world: files, network, clipboard, export                                                                           |
| `content/`    | Static content written as data                                                                                                            |
| (root)        | The feature's entry components (e.g. `Workspace.tsx`, `CheatsheetPage.tsx`) and cross-cutting modules (`actions.ts`, `data.ts`, `seo.ts`) |

Inside a feature, import siblings with relative paths (`./`, `../`). Across
features or layers, use the `@/` alias. Tests sit next to the code they cover
(`*.test.ts`).

### `features/markdown` — the rendering engine

```
markdown/
├── engine/      Pure markdown → HAST. Runs in the worker, on the server and in tests.
│   ├── pipeline.ts          renderMarkdown(): the synchronous unified pipeline, cached per base URL
│   ├── highlight.ts         highlightCodeBlocks(): Shiki tokens for fenced code, an async pass over the result
│   ├── plugins/             one remark/rehype plugin per file (alerts, math, frontmatter, …)
│   ├── sanitize-schema.ts   GitHub's sanitize rules, widened slightly
│   └── source.ts, links.ts, stats.ts, hast.ts, types.ts
├── worker/      Off-main-thread rendering: render.worker.ts, client.ts, use-rendered-markdown.ts
└── render/      HAST → React
    ├── DocumentView.tsx     the document (<article class="doc">)
    ├── elements/            one component per HTML element we customize (Link, Heading, TaskList, …)
    ├── code/                code blocks (language label, title, copy, line numbers)
    ├── diagram/             Mermaid diagrams + pan/zoom viewer
    ├── document.css         the document's typography (also inlined into HTML exports)
    └── typesets.ts, context.ts
```

Pipeline order: `remark-parse → frontmatter → gfm → math → text math → gemoji → code meta →
remark-rehype → rehype-raw → page breaks → source lines → rehype-sanitize → KaTeX → alerts →
slug → fragment links → base URL → heading outline`, then `highlightCodeBlocks`,
which every caller (worker, main-thread fallback, cheat sheet server function)
awaits because grammars load on demand. Anything a plugin adds _before_
sanitizing must be allow-listed in `sanitize-schema.ts`. Block elements
carry `data-line` (their source line) for scroll sync, double-click-to-locate
and live task toggles.

### `features/workspace` — the app

```
workspace/
├── Workspace.tsx          layout: top bar, editor | divider | preview, status bar, dialogs
├── actions.ts             documentActions — every document-level action (open, save, share, export…)
├── chrome/                TopBar, ViewSwitch, DocumentTitle, Open/Export menu items, ReaderSettings, StatusBar
├── panes/                 EditorPane, SplitDivider, preview/ (PreviewPane, Outline, EmptyState, …)
├── scroll-sync/           line-accurate editor ↔ preview sync (pure math + hook)
├── dialogs/               CommandPalette, ShareDialog, OpenUrlDialog, PdfDialog, DropOverlay
├── hooks/                 hotkeys, file drop, incoming documents (share links, ?url=, OS file opens)
├── io/                    file-system, remote (URLs/GitHub), export (HTML, rich text)
├── pdf/                   Save as PDF: page setup, print job, the print sheet (title page, contents)
└── state/                 document-store (current doc + recents, cross-tab merge),
                           settings-store, ui-store, debounced-storage, sample.md
```

Top bar, palette and shortcuts all call `documentActions`; new user-facing
actions go there and should be reachable from the command palette. Replacing a
document always archives the previous one to _recents_, so actions can offer
Undo. The editor remounts per loaded document (`loadKey`), so undo history never
crosses documents.

**Save as PDF** uses the browser's own print engine; nothing is uploaded.
`documentActions.printPdf` starts a print job, and `pdf/PrintSheet` portals a
second copy of the document into `<body>`, laid out off-screen, with the page
stylesheet from `pdf/page-setup.ts` (`@page` size, margins, running header and
folio in margin boxes) and an optional title page and contents. It waits for
`whenDocumentSettled` (render current, diagrams drawn, fonts and images loaded),
then calls `window.print()`. While it is mounted, only the sheet prints.
Printing from the browser's menu mounts it too, on `beforeprint`. Print is
always light: the dark tokens and dark Shiki colours apply only on screen, and
the sheet draws Mermaid in the light palette. (A dark HTML export adds the dark
Shiki colours back for print, since it freezes the dark tokens.) Ids and fragment links in the sheet
carry a `print-` prefix so PDF links land on the printed copy.

### Styling

- `styles/app.css` — the Tailwind 4 entry. Fonts, shadows and easing live in a plain `@theme` block (emitted as CSS variables, because the CodeMirror theme and the document stylesheet read them); colors are mapped in `@theme inline`.
- `styles/tokens.css` — the light and dark palettes. The dark one applies only on screen; PDFs are always light.
- `features/markdown/render/document.css` — the rendered document as plain semantic CSS scoped to `.doc`, with three typesets via `data-typeset`. It's inlined into **Export → HTML**, so keep it free of Tailwind utilities.
- `cn()` (`lib/utils.ts`, re-exporting the [`cn`](https://www.npmjs.com/package/cn) package) merges classes; variants use CVA (see `ui/button.tsx`).

### UI components — shadcn/ui

`src/ui/` is a [shadcn/ui](https://ui.shadcn.com) setup (`components.json`: the `base-vega` style on [Base UI](https://base-ui.com), RTL-ready logical classes, Lucide icons).

- Add or update components with the CLI — `pnpm dlx shadcn@latest add <name>` (add `--overwrite` to pull upstream changes) — then `pnpm fix` to apply our formatting.
- Keep generated components close to stock. The look comes from the tokens: `styles/tokens.css` maps shadcn's semantic variables (`--background`, `--popover`, `--primary`, `--muted`, `--ring`, …) onto the Paper & Proof palette, so restyle there rather than editing component classes. Per-use tweaks go in `className` at the call site.
- Deliberate deviations are commented in the file (e.g. `toast.tsx`'s `Toaster` takes a `className` to position its viewport).
- Our own primitives that shadcn doesn't ship (`brand`, `crop-marks`, `copy-button`) live alongside them with the same naming.

## Design system — "Paper & Proof"

- The **desk** (warm grey with a faint dot grid) is where you work; **paper** is what you make; **proof red** (`--proof`) marks intent — the color of a proofreader's pencil. Use it sparingly: active states, the caret, the brand arrow.
- Ink scale: `ink` → `ink-2` → `ink-3` → `ink-4`. Rules: `rule`, `rule-strong`.
- Type: **Newsreader** (display headings, at its optical display size, and the Editorial body), **Hanken Grotesk** (UI, Modern typeset), **Geist Mono** (code, labels). Small mono uppercase labels use the `label-caps` utility.
- Printer's details: crop marks around sheets, a `¶` folio line, `§` heading anchors, `⁂` for horizontal rules.
- The dark theme is **graphite**, not a dark version of the warm desk: neutral greys with a trace of blue (`.dark` in `tokens.css`), so proof red and the document's own colors are the only hue. The dark Mermaid palette (`diagram/mermaid.ts`) holds hex copies of those tokens — change them together.
- Light and dark themes are both first-class; theme preference is `light | dark | system`, resolved pre-paint by an inline script (`features/theme/theme.ts`) and switched with a View Transition.

## Conventions

- **File names:** feature components are `PascalCase.tsx`; hooks are `use-kebab-case.ts`; every other module is `kebab-case.ts`. Each file has one main export named after the file (`Outline.tsx` → `Outline`); small private helpers, or a tightly related pair (`BrandMark`/`Wordmark`), can live alongside it. `ui/` follows shadcn's convention instead: kebab-case files exporting a family of parts (`dropdown-menu.tsx` → `DropdownMenu`, `DropdownMenuItem`, …).
- **Modules start with a doc comment** saying what they're for when it isn't obvious from the name.
- **Path alias:** `@/*` → `./src/*`, used across features and layers; relative imports within a feature.
- **No barrel files**, except where a folder is a single unit of data (`cheatsheet/content/index.ts`) or a registry (`markdown/render/elements/index.ts`). Barrels hide dependencies and defeat lazy loading.
- **Heavy dependencies load lazily:** Shiki, Mermaid and the markdown pipeline are dynamic imports; keep them out of the initial bundle.
- Keep the markdown engine pure, and `renderMarkdown` synchronous (highlighting is the one async pass); add tests in `features/markdown/engine/pipeline.test.ts` for any syntax change.

## The cheat sheet (`/cheatsheet`) — an SEO page

It is one of the site's biggest traffic sources, so treat changes to it with care:

- Content lives in `features/cheatsheet/content/`: one file per chapter (sections → examples and tips), plus the quick reference and FAQ. Everything is markdown and is rendered by the real pipeline **on the server** in a `createServerFn` (`data.ts`), so the HTML that crawlers receive is fully rendered and the browser never downloads the pipeline.
- `content/content.test.ts` asserts every example renders as its section claims — run `pnpm test` after editing content.
- Keep the H1 containing "Markdown cheat sheet", one H2 per chapter / quick reference / FAQ, and H3 per section. Section ids are public anchors (`/cheatsheet#tables`) — don't rename them.
- Structured data (`TechArticle` with `dateModified`, `BreadcrumbList`, `FAQPage`) is generated from the same content in `features/cheatsheet/seo.ts`. Bump `CHEATSHEET_UPDATED` when the content changes meaningfully.
- Examples are editable in place and re-render through the worker; "Open in editor" uses a share link with `view=split`.

## Guides (`/mermaid-viewer`, `/markdown-to-pdf`, `/markdown-to-html`, `/markdown-table-generator`) — SEO pages

Each guide is a task page built around one tool. Treat them like the cheat sheet:

- Content lives in `features/guides/content/`: one file per guide, typed in `types.ts`. A guide is a hero `tool` plus sections of blocks (`prose`, `specimens`, `gallery`, `steps`, `pdf-settings`, `table-generator`). `components/GuideBlock.tsx` draws every block kind in one exhaustive `switch`; a new kind is added to the union, to `content/sources.ts` and to that switch.
- Every markdown string in a guide is rendered by the real pipeline **on the server** (`data.ts`), keyed by its source: look it up with `data.rendered[source]`. `content/content.test.ts` checks the content renders and that the claims it makes still hold — run `pnpm test` after editing content.
- Keep one H1 (the guide's `h1`), one H2 per section and for the FAQ, and H3 for gallery items and steps. Section ids and gallery item ids are public anchors (`/mermaid-viewer#gantt-chart`) — don't rename them.
- `features/site/pages.ts` lists the content pages. The workspace's status bar, the footer and each guide's related links read it, so a new guide is linked from everywhere once it is added there, to `GUIDES` and as a route.
- Structured data (`TechArticle`, `BreadcrumbList`) comes from `features/guides/seo.ts`. Bump the guide's date in `content/updated.ts` (`GUIDE_UPDATED`) when its content changes meaningfully.
- The table generator's logic is the pure model in `features/guides/table/table-model.ts`; the grid and toolbar only call it. Add tests there for any change to parsing or output.
- Each guide's Open Graph image is `public/og-<slug>.png`, drawn by `node build/og/render.ts` from the guide's content and `build/og/card.html`. Run it again when a guide's H1 changes or a guide is added.

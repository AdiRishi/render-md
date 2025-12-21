<div align="center">
  <img src="public/logo512.png" alt="RenderMD Logo" width="120" height="120" />

# RenderMD

**A calm space for your thoughts.**

A modern, real-time markdown editor with live preview, syntax highlighting,
LaTeX math support, and GitHub Flavored Markdown.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://react.dev)
[![TanStack](https://img.shields.io/badge/TanStack_Start-1.x-FF4154?style=flat)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat)](LICENSE)

</div>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📝 **Rich Markdown Editing**

- Syntax-highlighted markdown editor powered by CodeMirror
- Line numbers, bracket matching, and smart indentation
- Multiple selections and rectangular selection support
- Custom editor theme matching the design system

</td>
<td width="50%">

### 👁️ **Live Preview**

- Real-time rendering with React's deferred updates
- Smooth performance even with large documents
- Clean, readable typography with proper spacing
- Responsive preview container

</td>
</tr>
<tr>
<td>

### 🧮 **LaTeX Math Support**

- Inline math: `$E = mc^2$`
- Block equations with full LaTeX syntax
- Powered by KaTeX for fast rendering
- Beautiful mathematical typography

</td>
<td>

### 📊 **GitHub Flavored Markdown**

- Tables with alignment support
- Task lists with checkboxes
- Strikethrough text
- Auto-linking URLs

</td>
</tr>
<tr>
<td>

### 🎨 **Syntax Highlighting**

- 150+ programming languages
- One Dark theme for code blocks
- Line numbers for longer code snippets
- Inline code styling

</td>
<td>

### 🖥️ **Flexible View Modes**

- **Split view**: Editor and preview side-by-side
- **Editor only**: Focus on writing
- **Preview only**: See the final result
- Smooth transitions between modes

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18.x or later
- [pnpm](https://pnpm.io/) 10.x or later

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/render-md.git
cd render-md

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The app will be available at **http://localhost:3000**

---

## 📖 Markdown Guide

RenderMD supports an extensive markdown syntax. Here's what you can do:

### Basic Formatting

```markdown
**Bold text** and _italic text_
**_Bold and italic_**
~~Strikethrough~~
`inline code`
```

### Headings

```markdown
# H1 - Main Title

## H2 - Section

### H3 - Subsection

#### H4 - Sub-subsection

##### H5 - Minor heading

###### H6 - Smallest heading
```

### Lists

```markdown
- Unordered item
- Another item
  - Nested item

1. Ordered item
2. Another item

- [x] Completed task
- [ ] Pending task
```

### Code Blocks

````markdown
```typescript
interface User {
  name: string
  email: string
}
```
````

### Tables

```markdown
| Left | Center | Right |
| :--- | :----: | ----: |
| A    |   B    |     C |
```

### Math (LaTeX)

```markdown
Inline: $E = mc^2$

Block:
$$\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$$
```

### Links & Images

```markdown
[Link text](https://example.com)
![Alt text](image-url.jpg)
```

### Blockquotes

```markdown
> "The art of writing is the art of discovering what you believe."
> — Gustave Flaubert
```

---

## 🛠️ Tech Stack

| Category                | Technology                                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Framework**           | [TanStack Start](https://tanstack.com/start) (React meta-framework)                                               |
| **UI Library**          | [React 19](https://react.dev)                                                                                     |
| **Build Tool**          | [Vite 7](https://vite.dev)                                                                                        |
| **Styling**             | [Tailwind CSS 4](https://tailwindcss.com)                                                                         |
| **Components**          | [shadcn/ui](https://ui.shadcn.com) (base-vega style)                                                              |
| **Editor**              | [CodeMirror 6](https://codemirror.net) via [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror)     |
| **Markdown**            | [react-markdown](https://github.com/remarkjs/react-markdown)                                                      |
| **GFM Support**         | [remark-gfm](https://github.com/remarkjs/remark-gfm)                                                              |
| **Math**                | [remark-math](https://github.com/remarkjs/remark-math) + [rehype-katex](https://github.com/remarkjs/rehype-katex) |
| **Syntax Highlighting** | [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)                  |
| **Typography**          | [Geist Font](https://vercel.com/font) (Sans & Mono)                                                               |
| **Icons**               | [Lucide React](https://lucide.dev)                                                                                |
| **Deployment**          | [Cloudflare Workers](https://workers.cloudflare.com) via [Nitro](https://nitro.unjs.io)                           |

---

## 📁 Project Structure

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

---

## 🔧 Development

### Available Scripts

| Command        | Description                              |
| -------------- | ---------------------------------------- |
| `pnpm dev`     | Start development server on port 3000    |
| `pnpm build`   | Build for production                     |
| `pnpm preview` | Preview production build locally         |
| `pnpm test`    | Run tests with Vitest                    |
| `pnpm lint`    | Run ESLint                               |
| `pnpm format`  | Format code with Prettier                |
| `pnpm check`   | Run all checks (format, lint, typecheck) |
| `pnpm clean`   | Clean build artifacts                    |
| `pnpm deploy`  | Deploy to Cloudflare Workers             |

### Adding UI Components

This project uses [shadcn/ui](https://ui.shadcn.com). To add a new component:

```bash
npx shadcn@latest add <component-name>
```

### Editor Theme Customization

The CodeMirror theme is defined in `src/lib/editor-theme.ts`. It includes both light and dark variants with carefully crafted color palettes that match the design system.

---

## 🌐 Deployment

### Cloudflare Workers

The project is configured for deployment to Cloudflare Workers:

```bash
pnpm build
pnpm deploy
```

### Other Platforms

Since this is built with TanStack Start and Nitro, it can be deployed to various platforms. Modify `nitro.config.ts` to target your preferred platform.

---

## 🎨 Design Philosophy

RenderMD is designed with a focus on **calm productivity**:

- **Clean Interface**: Minimal chrome, maximum content area
- **Thoughtful Typography**: Geist font family for excellent readability
- **Subtle Interactions**: Smooth transitions and unobtrusive feedback
- **Focus on Content**: The preview renders your markdown beautifully without distraction

The color scheme uses a refined slate palette with a signature blue primary color (`#137fec`) for accents and interactive elements.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️</sub>
</div>

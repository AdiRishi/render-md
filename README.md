<div align="center">
  <img src="public/logo512.png" alt="RenderMD Logo" width="120" height="120" />

# RenderMD

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

- 📝 **Rich Markdown Editing** — Syntax highlighting, line numbers, bracket matching, and smart indentation
- 👁️ **Live Preview** — Real-time rendering with smooth performance on large documents
- 🧮 **LaTeX Math Support** — Inline and block equations powered by KaTeX
- 📊 **GitHub Flavored Markdown** — Tables, task lists, strikethrough, and auto-linking
- 🎨 **Syntax Highlighting** — 150+ languages with One Dark theme
- 🖥️ **Flexible View Modes** — Split, editor-only, or preview-only layouts

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

## 📖 Supported Markdown Features

| Feature                   | Powered by                                |
| ------------------------- | ----------------------------------------- |
| Headings (h1–h6)          | react-markdown                            |
| Bold, italic, emphasis    | react-markdown                            |
| Links & images            | react-markdown                            |
| Blockquotes               | react-markdown                            |
| Ordered & unordered lists | react-markdown                            |
| Horizontal rules          | react-markdown                            |
| Inline code               | react-markdown + custom styling           |
| Code blocks (150+ langs)  | react-syntax-highlighter (One Dark theme) |
| Tables                    | remark-gfm                                |
| Task lists                | remark-gfm + shadcn/ui Checkbox           |
| Strikethrough             | remark-gfm                                |
| Autolinks                 | remark-gfm                                |
| Inline math (`$...$`)     | remark-math + rehype-katex                |
| Block math (`$$...$$`)    | remark-math + rehype-katex                |

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

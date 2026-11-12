import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { cloudflare } from '@cloudflare/vite-plugin'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

import { CHEATSHEET_UPDATED } from './src/features/cheatsheet/content/updated.ts'
import { GUIDE_UPDATED } from './src/features/guides/content/updated.ts'
import { SITE_URL } from './src/lib/seo.ts'

// KaTeX's package exports don't include its package.json.
const katex: { version: string } = JSON.parse(
  readFileSync(new URL('./node_modules/katex/package.json', import.meta.url), 'utf8'),
)

export default defineConfig({
  define: {
    'import.meta.env.KATEX_VERSION': JSON.stringify(katex.version),
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      // Its `browser` entry decodes entities with `document`, which the markdown
      // Web Worker doesn't have. The default entry is a lookup table that runs anywhere.
      'decode-named-character-reference': fileURLToPath(
        import.meta.resolve('decode-named-character-reference'),
      ),
    },
  },
  worker: {
    format: 'es',
  },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart({
      pages: [
        { path: '/' },
        { path: '/cheatsheet', sitemap: { lastmod: CHEATSHEET_UPDATED } },
        ...Object.entries(GUIDE_UPDATED).map(([slug, lastmod]) => ({
          path: `/${slug}`,
          sitemap: { lastmod },
        })),
      ],
      sitemap: { host: SITE_URL },
    }),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
    visualizer({ filename: 'dist/stats.html' }),
  ],
})

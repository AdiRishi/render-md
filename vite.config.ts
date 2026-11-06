import { fileURLToPath } from 'node:url'

import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact, { reactCompilerPreset } from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

import { sitemapPlugin } from './build/vite-sitemap-plugin.ts'

export default defineConfig({
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
    nitro(),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    babel({ presets: [reactCompilerPreset()] }),
    visualizer({ filename: '.output/stats.html' }),
    sitemapPlugin({ baseUrl: 'https://www.render-md.com' }),
  ],
})

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

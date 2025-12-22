import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { sitemapPlugin } from './src/lib/vite-sitemap-plugin'

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    visualizer(),
    sitemapPlugin({
      baseUrl: 'https://www.render-md.com',
      verbose: true,
    }),
  ],
})

export default config

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { type Plugin } from 'vite'

interface SitemapPluginOptions {
  baseUrl: string
  routeTreePath?: string
  outputPath?: string
}

export function sitemapPlugin(options: SitemapPluginOptions): Plugin {
  const {
    baseUrl,
    routeTreePath = 'src/routeTree.gen.ts',
    outputPath = 'public/sitemap.xml',
  } = options

  return {
    name: 'vite-sitemap-plugin',
    buildStart() {
      const rootDir = process.cwd()
      const routeTreeFullPath = resolve(rootDir, routeTreePath)
      const outputFullPath = resolve(rootDir, outputPath)

      // Read the route tree file
      let routeTreeContent: string
      try {
        routeTreeContent = readFileSync(routeTreeFullPath, 'utf-8')
      } catch {
        console.warn('[sitemap-plugin] Could not read routeTree.gen.ts')
        return
      }

      // Extract routes from the fullPaths type: fullPaths: '/' | '/$' | '/about'
      const fullPathsMatch = routeTreeContent.match(/fullPaths:\s*([^\n]+)/)
      if (!fullPathsMatch) {
        console.warn('[sitemap-plugin] Could not find fullPaths in routeTree')
        return
      }

      // Parse the union type string: '/' | '/$' | '/about'
      const pathsString = fullPathsMatch[1]
      const routes = pathsString
        .split('|')
        .map((p) => p.trim().replace(/^'|'$/g, ''))
        .filter((path) => !path.includes('$')) // Exclude dynamic routes

      // Generate sitemap XML
      const now = new Date().toISOString()
      const urls = routes
        .map(
          (route) => `  <url>
    <loc>${baseUrl}${route === '/' ? '' : route}</loc>
    <lastmod>${now}</lastmod>
  </url>`,
        )
        .join('\n')

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>
`

      // Write the sitemap
      writeFileSync(outputFullPath, sitemap, 'utf-8')
      console.log(`[sitemap-plugin] Generated sitemap with ${routes.length} routes`)
    },
  }
}

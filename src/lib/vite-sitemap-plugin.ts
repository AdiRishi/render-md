import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { type Plugin } from 'vite'

interface SitemapPluginOptions {
  /** Base URL for the site (e.g., 'https://example.com') */
  baseUrl: string
  /** Path to routeTree.gen.ts relative to project root */
  routeTreePath?: string
  /** Output path for sitemap.xml relative to project root */
  outputPath?: string
  /** Whether to log generation info */
  verbose?: boolean
  /** Whether to add trailing slashes to URLs */
  trailingSlash?: boolean
}

function extractRoutes(content: string): string[] {
  const interfaceMatch = content.match(/interface FileRoutesByFullPath\s*\{([^}]+)\}/)
  if (interfaceMatch) {
    const pathMatches = interfaceMatch[1].match(/'([^']+)':/g)
    if (pathMatches) {
      return pathMatches
        .map((match) => match.replace(/[':]| /g, ''))
        .filter((path) => !isDynamicRoute(path))
    }
  }

  const fullPathsMatch = content.match(/fullPaths:\s*([^\n]+)/)
  if (fullPathsMatch) {
    return fullPathsMatch[1]
      .split('|')
      .map((p) => p.trim().replace(/^'|'$/g, ''))
      .filter((path) => !isDynamicRoute(path))
  }

  return []
}

function isDynamicRoute(path: string): boolean {
  return path.includes('$') || path.includes('[') || path.includes(']')
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildUrl(baseUrl: string, path: string, trailingSlash: boolean): string {
  const cleanBase = baseUrl.replace(/\/$/, '')
  let url = path === '/' ? cleanBase : `${cleanBase}${path}`

  if (trailingSlash && !url.endsWith('/') && url !== cleanBase) {
    url += '/'
  }

  return url
}

export function sitemapPlugin(options: SitemapPluginOptions): Plugin {
  const {
    baseUrl,
    routeTreePath = 'src/routeTree.gen.ts',
    outputPath = 'public/sitemap.xml',
    verbose = false,
    trailingSlash = false,
  } = options

  return {
    name: 'vite-sitemap-plugin',
    apply: 'build',
    enforce: 'post',

    buildEnd() {
      const rootDir = process.cwd()
      const routeTreeFullPath = resolve(rootDir, routeTreePath)
      const outputFullPath = resolve(rootDir, outputPath)

      let routeTreeContent: string
      try {
        routeTreeContent = readFileSync(routeTreeFullPath, 'utf-8')
      } catch {
        console.warn('[sitemap-plugin] Could not read routeTree.gen.ts')
        return
      }

      const routes = extractRoutes(routeTreeContent)

      if (routes.length === 0) {
        console.warn('[sitemap-plugin] No static routes found')
        return
      }

      if (verbose) {
        console.log('[sitemap-plugin] Found routes:', routes)
      }

      const now = new Date().toISOString()
      const urls = routes
        .map((route) => {
          const url = escapeXml(buildUrl(baseUrl, route, trailingSlash))
          return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
  </url>`
        })
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

      const outputDir = dirname(outputFullPath)
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true })
      }

      writeFileSync(outputFullPath, sitemap, 'utf-8')
      console.log(`[sitemap-plugin] Generated sitemap with ${routes.length} route(s)`)
    },
  }
}

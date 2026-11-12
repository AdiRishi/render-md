/** Site identity and generic <head> helpers shared by every page. */

type SeoParams = {
  title: string
  description: string
  image?: string
  url?: string
  imageAlt?: string
  type?: 'website' | 'article'
}

type JsonLdSchema = Record<string, unknown>

export const SITE_NAME = 'RenderMD'
export const SITE_URL = 'https://www.render-md.com'
export const SITE_DESCRIPTION =
  'Paste, drop or link a markdown file and read it as a typeset page. Supports GitHub Flavored Markdown, Mermaid diagrams, LaTeX math and syntax highlighting for 200+ languages. Free and private, with no ads.'
export const OG_IMAGE = `${SITE_URL}/og.png`
export const THEME_COLOR = '#1c1915'
const DEFAULT_IMAGE_ALT = 'RenderMD, with markdown on the left and the typeset page on the right'

/** RenderMD as the author and publisher of an article. */
export const SITE_PUBLISHER = {
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo512.png` },
}

/** A BreadcrumbList from the home page down to `page`, the current one. */
export const breadcrumbJsonLd = (page: { name: string; url: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: SITE_NAME, item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: page.name, item: page.url },
  ],
})

/**
 * Convert JSON-LD schema objects to script tags for TanStack head
 */
export const jsonLdScripts = (schemas: JsonLdSchema | JsonLdSchema[]) => {
  const schemaArray = Array.isArray(schemas) ? schemas : [schemas]
  return schemaArray.map((schema) => ({
    type: 'application/ld+json',
    children: JSON.stringify(schema),
  }))
}

export const seo = ({
  title,
  description,
  image = OG_IMAGE,
  url = SITE_URL,
  imageAlt = DEFAULT_IMAGE_ALT,
  type = 'website',
}: SeoParams) => [
  { title },
  { name: 'description', content: description },
  { name: 'robots', content: 'index,follow,max-image-preview:large' },
  { name: 'application-name', content: SITE_NAME },
  { name: 'apple-mobile-web-app-title', content: SITE_NAME },
  // Open Graph
  { property: 'og:title', content: title },
  { property: 'og:description', content: description },
  { property: 'og:image', content: image },
  { property: 'og:image:alt', content: imageAlt },
  { property: 'og:url', content: url },
  { property: 'og:type', content: type },
  { property: 'og:site_name', content: SITE_NAME },
  // Twitter Card
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: title },
  { name: 'twitter:description', content: description },
  { name: 'twitter:image', content: image },
  { name: 'twitter:image:alt', content: imageAlt },
  // Additional
  { name: 'theme-color', content: THEME_COLOR },
  { name: 'author', content: SITE_NAME },
]

import { CHEATSHEET } from '@/content/cheatsheet'

type SeoParams = {
  title: string
  description: string
  image?: string
  url?: string
  imageAlt?: string
}

type JsonLdSchema = Record<string, unknown>

export const SITE_NAME = 'RenderMD'
export const SITE_URL = 'https://www.render-md.com'
export const SITE_DESCRIPTION =
  'Paste, drop or link any markdown and read it beautifully typeset. GitHub Flavored Markdown, Mermaid diagrams, LaTeX math and 200+ languages — private, free, no ads.'
export const OG_IMAGE = `${SITE_URL}/og.png`
export const THEME_COLOR = '#1c1915'
const DEFAULT_IMAGE_ALT = 'RenderMD — markdown on the left, a beautifully typeset page on the right'

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
  { property: 'og:type', content: 'website' },
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

export const getHomeJsonLd = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: 'render-md.com',
    url: SITE_URL,
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo512.png`,
      width: 512,
      height: 512,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Markdown editor',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Real-time markdown preview',
      'Open files, URLs and GitHub READMEs',
      'Private share links with no upload',
      'Export to HTML, PDF and rich text',
      'GitHub Flavored Markdown',
      'Mermaid diagrams',
      'LaTeX math support with KaTeX',
      'Syntax highlighting for 200+ languages',
      'Dark and light themes',
    ],
    screenshot: OG_IMAGE,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  },
]

/**
 * Generate JSON-LD structured data for the Cheatsheet page
 * Includes Article and BreadcrumbList schemas for rich search results
 */
export const getCheatsheetJsonLd = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Markdown, set in type — the RenderMD cheatsheet',
    description:
      'Every markdown syntax RenderMD understands, with live rendered examples: GFM, alerts, footnotes, LaTeX math and Mermaid diagrams.',
    image: `${SITE_URL}/og-cheatsheet.png`,
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/cheatsheet`,
    },
    articleSection: CHEATSHEET.map((section) => section.title),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Markdown Cheatsheet',
        item: `${SITE_URL}/cheatsheet`,
      },
    ],
  },
]

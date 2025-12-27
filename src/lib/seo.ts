type SeoParams = {
  title: string
  description: string
  keywords?: string
  image: string
  url?: string
}

type JsonLdSchema = Record<string, unknown>

const SITE_URL = 'https://www.render-md.com'

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

export const seo = ({ title, description, keywords, image, url = SITE_URL }: SeoParams) => [
  { title },
  { name: 'description', content: description },
  ...(keywords ? [{ name: 'keywords', content: keywords }] : []),
  // Open Graph
  { property: 'og:title', content: title },
  { property: 'og:description', content: description },
  { property: 'og:image', content: image },
  { property: 'og:url', content: url },
  { property: 'og:type', content: 'website' },
  { property: 'og:site_name', content: 'RenderMD' },
  // Twitter Card
  { name: 'twitter:card', content: 'summary_large_image' },
  { name: 'twitter:title', content: title },
  { name: 'twitter:description', content: description },
  { name: 'twitter:image', content: image },
  // Additional
  { name: 'theme-color', content: '#137fec' },
  { name: 'author', content: 'RenderMD' },
]

/**
 * Generate JSON-LD structured data for WebApplication schema
 * This helps Google understand the site and can enable rich results
 */
export const getWebAppJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'RenderMD',
  url: SITE_URL,
  description:
    'A free real-time markdown editor with instant live preview. Write GitHub Flavored Markdown with LaTeX math support, syntax highlighting for 150+ languages.',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  featureList: [
    'Real-time markdown preview',
    'GitHub Flavored Markdown',
    'LaTeX math support with KaTeX',
    'Syntax highlighting for 150+ languages',
    'Dark and light themes',
  ],
  screenshot: `${SITE_URL}/og-preview.png`,
  aggregateRating: undefined, // Can add if you have ratings
})

/**
 * Generate JSON-LD structured data for the Cheatsheet page
 * Includes Article and BreadcrumbList schemas for rich search results
 */
export const getCheatsheetJsonLd = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Ultimate Markdown Cheatsheet',
    description:
      'Complete markdown syntax reference with examples for headers, emphasis, lists, links, images, code blocks, tables, and LaTeX math.',
    author: {
      '@type': 'Organization',
      name: 'RenderMD',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'RenderMD',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo192.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/cheatsheet`,
    },
    articleSection: [
      'Headers',
      'Emphasis',
      'Lists',
      'Links & Images',
      'Code',
      'Blockquotes',
      'Tables',
      'Math (LaTeX)',
      'Horizontal Rules',
    ],
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

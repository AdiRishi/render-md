import { CHEATSHEET_UPDATED, FAQ, SECTIONS } from '@/content/cheatsheet'

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

/** Markdown → plain text, good enough for structured-data answers. */
const toPlainText = (markdown: string) =>
  markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{1,3}([^`]+)`{1,3}/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')

export const CHEATSHEET_URL = `${SITE_URL}/cheatsheet`

/**
 * Structured data for the cheat sheet: a TechArticle (with freshness), the
 * breadcrumb trail, and the FAQ — all derived from the content the page shows.
 */
export const getCheatsheetJsonLd = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: 'Markdown Cheat Sheet',
    alternativeHeadline: 'Every markdown syntax with live, editable examples',
    description:
      'A complete markdown reference: CommonMark basics, GitHub Flavored Markdown, alerts, footnotes, LaTeX math and Mermaid diagrams, each with live rendered examples.',
    image: `${SITE_URL}/og-cheatsheet.png`,
    url: CHEATSHEET_URL,
    inLanguage: 'en',
    dateModified: CHEATSHEET_UPDATED,
    proficiencyLevel: 'Beginner',
    about: { '@type': 'Thing', name: 'Markdown', sameAs: 'https://en.wikipedia.org/wiki/Markdown' },
    articleSection: SECTIONS.map((section) => section.title),
    author: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo512.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': CHEATSHEET_URL },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'RenderMD', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Markdown cheat sheet', item: CHEATSHEET_URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: toPlainText(item.answer) },
    })),
  },
]

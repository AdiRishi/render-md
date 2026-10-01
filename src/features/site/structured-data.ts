import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo'

/** Who we are, for search engines: WebSite, Organization and the WebApplication. */
export const getSiteJsonLd = () => [
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

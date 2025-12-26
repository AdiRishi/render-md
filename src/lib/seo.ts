type SeoParams = {
  title: string
  description: string
  keywords?: string
  image: string
  url?: string
}

const SITE_URL = 'https://www.render-md.com'

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

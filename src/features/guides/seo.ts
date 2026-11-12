import { breadcrumbJsonLd, jsonLdScripts, seo, SITE_PUBLISHER, SITE_URL } from '@/lib/seo'

import { GUIDE_UPDATED, GUIDES, type GuideSlug } from './content'

export const guideUrl = (slug: GuideSlug) => `${SITE_URL}/${slug}`

/** The guide's name: its H1 as one phrase, as in breadcrumbs. */
export const guideName = (slug: GuideSlug) => GUIDES[slug].h1.join(' ')

/** Everything a guide's route puts in <head>: meta, canonical link and JSON-LD. */
export function guideHead(slug: GuideSlug) {
  const guide = GUIDES[slug]
  const url = guideUrl(slug)
  const image = `${SITE_URL}/og-${slug}.png`
  const updated = GUIDE_UPDATED[slug]
  return {
    meta: [
      ...seo({
        title: guide.metaTitle,
        description: guide.metaDescription,
        url,
        image,
        imageAlt: guide.ogImageAlt,
        type: 'article',
      }),
      { property: 'article:modified_time', content: updated },
    ],
    links: [{ rel: 'canonical', href: url }],
    scripts: jsonLdScripts([
      {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: guideName(slug),
        description: guide.metaDescription,
        image,
        url,
        inLanguage: 'en',
        dateModified: updated,
        author: SITE_PUBLISHER,
        publisher: SITE_PUBLISHER,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      },
      breadcrumbJsonLd({ name: guideName(slug), url }),
    ]),
  }
}

import { jsonLdScripts, seo, SITE_NAME, SITE_URL } from '@/lib/seo'

import { CHEATSHEET_UPDATED, EXAMPLE_COUNT, FAQ, SECTIONS } from './content'

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

/** Everything the route puts in <head>: meta, canonical link and JSON-LD. */
export const cheatsheetHead = () => ({
  meta: [
    ...seo({
      title: 'Markdown Cheat Sheet — Complete Syntax Guide with Live Examples | RenderMD',
      description: `Every markdown syntax in one place: headings, lists, links, images, code, tables, task lists, footnotes, alerts, LaTeX math and Mermaid diagrams — ${EXAMPLE_COUNT} live, editable examples.`,
      url: CHEATSHEET_URL,
      image: `${SITE_URL}/og-cheatsheet.png`,
      imageAlt: 'The RenderMD markdown cheat sheet',
      type: 'article',
    }),
    { property: 'article:modified_time', content: CHEATSHEET_UPDATED },
  ],
  links: [{ rel: 'canonical', href: CHEATSHEET_URL }],
  scripts: jsonLdScripts(getCheatsheetJsonLd()),
})

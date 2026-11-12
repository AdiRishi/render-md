import { ClosingCta } from '@/features/site/ClosingCta'
import { Faq } from '@/features/site/Faq'
import { SiteFooter } from '@/features/site/SiteFooter'
import { SiteHeader } from '@/features/site/SiteHeader'

import { Hero } from './components/Hero'
import { RelatedPages } from './components/RelatedPages'
import { Section } from './components/Section'
import { GUIDES, type GuideSlug } from './content'
import { type GuideData } from './data'

/**
 * A guide: a task page built around one tool. Heading levels matter for SEO:
 * H1 in the hero, H2 per section and for the FAQ, H3 for gallery items and steps.
 */
export function GuidePage({ slug, data }: { slug: GuideSlug; data: GuideData }) {
  const guide = GUIDES[slug]

  return (
    <div className="min-h-screen bg-desk">
      <SiteHeader />
      <main>
        <Hero guide={guide} data={data} />
        <div className="mx-auto max-w-6xl space-y-20 px-5 py-16 md:space-y-28 md:py-24">
          {guide.sections.map((section, index) => (
            <Section key={section.id} section={section} number={index + 1} data={data} />
          ))}
          <Faq items={guide.faq} answers={guide.faq.map((item) => data.rendered[item.answer])} />
          <RelatedPages current={`/${slug}`} />
          <ClosingCta headline={guide.cta} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

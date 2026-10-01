import { SiteFooter } from '@/features/site/SiteFooter'
import { SiteHeader } from '@/features/site/SiteHeader'

import { Chapter } from './components/Chapter'
import { ClosingCta } from './components/ClosingCta'
import { Faq } from './components/Faq'
import { Hero } from './components/Hero'
import { MobileNav } from './components/MobileNav'
import { QuickReference } from './components/QuickReference'
import { Sidebar } from './components/Sidebar'
import { CHAPTERS } from './content'
import { type CheatsheetData } from './data'
import { useActiveSection } from './hooks/use-active-section'

/**
 * The markdown cheat sheet: hero → quick reference → three chapters of live,
 * editable examples → FAQ. Heading levels matter for SEO: H1 in the hero, H2 per
 * chapter / quick reference / FAQ, H3 per syntax section.
 */
export function CheatsheetPage({ data }: { data: CheatsheetData }) {
  const active = useActiveSection()

  return (
    <div className="min-h-screen bg-desk">
      <SiteHeader />
      <MobileNav active={active} />
      <Hero specimen={data.hero} />

      <div className="mx-auto flex max-w-6xl gap-14 px-5 py-16 md:py-24">
        <Sidebar active={active} />

        <main className="min-w-0 flex-1 space-y-28">
          <QuickReference />
          {CHAPTERS.map((chapter) => (
            <Chapter key={chapter.id} chapter={chapter} data={data} />
          ))}
          <Faq answers={data.faq} />
          <ClosingCta />
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}

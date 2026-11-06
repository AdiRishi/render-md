import { SITE_URL } from '@/lib/seo'

const GA_ID = 'G-BF428L3QLQ'

/**
 * Google Analytics, loaded client-side only (see __root.tsx) and only on the production origin.
 * Preview deployments run the same build as production, so the origin is what tells them apart.
 */
export function GoogleAnalytics() {
  if (window.location.origin !== SITE_URL) return null

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script async src="/ga-init.js" />
    </>
  )
}

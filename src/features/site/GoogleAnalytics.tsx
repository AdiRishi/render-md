const GA_ID = 'G-BF428L3QLQ'

/** Google Analytics, loaded client-side only (see __root.tsx). */
export function GoogleAnalytics() {
  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script async src="/ga-init.js" />
    </>
  )
}

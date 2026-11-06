import { type PostHog } from 'posthog-js'

import { SITE_URL } from '@/lib/seo'

const POSTHOG_TOKEN = 'phc_wYPd3HqcqAp9HEdV6UndC549femweonorfk3B39YG28w'

let client: Promise<PostHog> | undefined

/** Loads posthog-js on first use, and only on the production origin (previews run the same build). */
function loadPostHog() {
  // Analytics only run in the browser. The SSR branch keeps posthog-js out of the server bundle.
  if (import.meta.env.SSR || window.location.origin !== SITE_URL) return undefined
  client ??= import('posthog-js').then(({ posthog }) => {
    posthog.init(POSTHOG_TOKEN, {
      api_host: 'https://us.i.posthog.com',
      defaults: '2026-08-30',
      capture_exceptions: true,
      // Documents never leave the browser: share links carry them in the URL fragment, `?url=`
      // names a remote one, and the editor, preview and palette show their text.
      disable_capture_url_hashes: true,
      mask_personal_data_properties: true,
      custom_personal_data_properties: ['url'],
      mask_all_text: true,
      mask_all_element_attributes: true,
      disable_session_recording: true,
    })
    return posthog
  })
  return client
}

/** Product analytics and error reports, sent to PostHog. */
export const analytics = {
  /** Starts PostHog so it records page views. */
  start: () => void loadPostHog(),

  capture: (event: string, properties: Record<string, string>) =>
    void loadPostHog()?.then((posthog) => posthog.capture(event, properties)),

  captureException: (error: unknown) =>
    void loadPostHog()?.then((posthog) => posthog.captureException(error)),
}

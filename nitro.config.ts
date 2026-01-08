import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  compatibilityDate: '2026-01-08',
  preset: 'cloudflare_module',
  cloudflare: {
    deployConfig: true,
    wrangler: {
      name: 'render-md',
      routes: [
        { pattern: 'render-md.com', custom_domain: true },
        { pattern: 'www.render-md.com', custom_domain: true },
      ],
      observability: {
        enabled: true,
        head_sampling_rate: 1,
      },
      // @ts-expect-error - Nitro is not updated here
      traces: {
        enabled: true,
      },
      preview_urls: true,
    },
  },
})

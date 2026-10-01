import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  compatibilityDate: '2026-09-01',
  preset: 'cloudflare_module',
  // Develop on Node: the app needs no Cloudflare bindings, and the workerd runner
  // can't evaluate some CommonJS dependencies during dev SSR.
  devServer: { runner: 'node-worker' },
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
      // @ts-expect-error - Nitro's wrangler types lag behind Cloudflare's config schema
      traces: {
        enabled: true,
      },
      preview_urls: true,
    },
  },
})

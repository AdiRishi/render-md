import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  compatibilityDate: '2025-12-18',
  preset: 'cloudflare_module',
  cloudflare: {
    deployConfig: true,
    wrangler: {
      name: 'render-md',
      routes: [
        { pattern: 'render-md.com', custom_domain: true },
        { pattern: 'www.render-md.com', custom_domain: true },
      ],
    },
  },
})

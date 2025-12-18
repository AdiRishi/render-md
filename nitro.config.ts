import { defineNitroConfig } from 'nitro/config'

export default defineNitroConfig({
  compatibilityDate: '2025-12-18',
  preset: 'cloudflare_module',
  cloudflare: {
    deployConfig: true,
  },
})

const CF_DELIVERY_BASE = 'https://imagedelivery.net/dUGyBDwDArlYQF97CccBHg'

const cfImages = {
  editorOg: 'd5f164f8-aa7c-47d1-1a28-b7f9efb76b00',
  cheatsheetOg: '84f23d01-d730-4fd9-6be1-2a9e4aceea00',
} as const

export type CfImageId = keyof typeof cfImages

export const getCfImageUrl = (id: CfImageId, variant: 'public' = 'public') =>
  `${CF_DELIVERY_BASE}/${cfImages[id]}/${variant}`

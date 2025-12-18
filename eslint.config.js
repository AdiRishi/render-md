//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: ['.output', '.wrangler', '.tanstack', 'public', '**/*.gen.ts'],
  },
  ...tanstackConfig,
]

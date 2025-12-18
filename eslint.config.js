//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  {
    ignores: [
      '.output',
      '.wrangler',
      '.tanstack',
      'public',
      '**/*.gen.ts',
      'eslint.config.js',
      'prettier.config.js',
    ],
  },
  ...tanstackConfig,
  {
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
    },
  },
]

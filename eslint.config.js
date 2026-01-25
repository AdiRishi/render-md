//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
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
  {
    rules: {
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      'import/consistent-type-specifier-style': ['error', 'prefer-inline'],
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
]

import { describe, expect, it } from 'vitest'

import { cssString, defaultPaper, defaultPdfSettings, pageStyle } from './page-setup'

describe('defaultPaper', () => {
  it('uses Letter in the Americas regions that use it', () => {
    expect(defaultPaper('en-US')).toBe('letter')
    expect(defaultPaper('en')).toBe('letter')
    expect(defaultPaper('es-MX')).toBe('letter')
    expect(defaultPaper('fr-CA')).toBe('letter')
  })

  it('uses A4 everywhere else', () => {
    expect(defaultPaper('en-GB')).toBe('a4')
    expect(defaultPaper('de')).toBe('a4')
    expect(defaultPaper('es')).toBe('a4')
    expect(defaultPaper('ja-JP')).toBe('a4')
  })

  it('falls back to A4 for a malformed locale', () => {
    expect(defaultPaper('not a locale!')).toBe('a4')
  })
})

describe('pageStyle', () => {
  it('quotes a title so it cannot end the CSS string or rule', () => {
    expect(cssString('He said "hi" \\ }')).toBe('"He said \\"hi\\" \\\\ }"')
    expect(cssString('Two\nlines')).toBe('"Two lines"')
  })

  it('sizes the page in millimetres for each paper', () => {
    const settings = defaultPdfSettings('en-GB')
    expect(pageStyle(settings, 'Doc')).toContain('size: 210mm 297mm;')
    expect(pageStyle({ ...settings, paper: 'letter' }, 'Doc')).toContain('size: 215.9mm 279.4mm;')
  })
})

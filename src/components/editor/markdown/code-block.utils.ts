import { type ReactNode } from 'react'

export function getCodeBlockLanguage(className?: string) {
  const match = /language-([\w-]+)/i.exec(className ?? '')
  return match ? match[1].toLowerCase() : null
}

export function isInlineCodeBlock(children: ReactNode, language: string | null) {
  return !language && !String(children).includes('\n')
}

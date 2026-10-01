import { createContext } from 'react'

import { type DiagramLook } from './typesets'

export type DocumentContextValue = {
  /** Toggle a GFM task on a 1-based source line. Omit for read-only docs. */
  onToggleTask?: (line: number) => void
  /** How Mermaid diagrams are drawn. */
  diagramLook?: DiagramLook
}

export const DocumentContext = createContext<DocumentContextValue>({})

/** Source line of the nearest list item, used by task checkboxes. */
export const ListItemLineContext = createContext<number | null>(null)

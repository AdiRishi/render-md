import { createContext } from 'react'

export type DocumentContextValue = {
  /** Toggle a GFM task on a 1-based source line. Omit for read-only docs. */
  onToggleTask?: (line: number) => void
}

export const DocumentContext = createContext<DocumentContextValue>({})

/** Source line of the nearest list item, used by task checkboxes. */
export const ListItemLineContext = createContext<number | null>(null)

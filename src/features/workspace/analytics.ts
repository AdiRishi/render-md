import { analytics } from '@/features/site/analytics'

import { type SaveResult } from './io/file-system'
import { type Paper } from './pdf/page-setup'
import { type DocumentSource, useDocumentStore } from './state/document-store'

/**
 * Every product event the workspace sends, with its properties. Each one answers a product
 * question: how people bring documents in, whether they write, and what they take away.
 */
type WorkspaceEvents = {
  document_opened: {
    source:
      | 'file_picker'
      | 'file_drop'
      | 'os_file'
      | 'url'
      | 'shared_link'
      | 'cheatsheet_example'
      | 'guide_example'
      | 'blank_page'
      | 'sample'
      | 'clipboard'
  }
  document_open_failed: { source: 'url' }
  document_edited: { document_source: DocumentSource }
  document_saved: { destination: Exclude<SaveResult, 'cancelled'> }
  document_exported:
    | { format: 'markdown' | 'html' }
    | { format: 'pdf'; paper: Paper; title_page: boolean; contents: boolean }
  document_copied: { format: 'markdown' | 'html' | 'rich_text' | 'markdown_fallback' }
  document_shared: { method: 'copy_link' | 'share_sheet' }
}

export function track<E extends keyof WorkspaceEvents>(event: E, properties: WorkspaceEvents[E]) {
  analytics.capture(event, properties)
}

const trackedLoads = new Set<string>()

/** Tracks an action people repeat, like typing or ⌘S, once for each document they load. */
export function trackOncePerDocument<E extends keyof WorkspaceEvents>(
  event: E,
  properties: WorkspaceEvents[E],
) {
  const key = `${event}:${useDocumentStore.getState().loadKey}`
  if (trackedLoads.has(key)) return
  trackedLoads.add(key)
  track(event, properties)
}

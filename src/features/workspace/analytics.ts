import { analytics } from '@/features/site/analytics'

import { type SaveResult } from './io/file-system'
import { type ViewMode } from './state/settings-store'

/** Every product event the workspace sends, with its properties. */
type WorkspaceEvents = {
  document_opened: {
    source:
      | 'file_picker'
      | 'file_drop'
      | 'os_file'
      | 'url'
      | 'shared_link'
      | 'blank_page'
      | 'sample'
      | 'clipboard'
  }
  document_open_failed: { source: 'url' }
  document_saved: { destination: Exclude<SaveResult, 'cancelled'> }
  document_exported: { format: 'markdown' | 'html' | 'print' }
  document_copied: { format: 'markdown' | 'rich_text' | 'markdown_fallback' }
  document_shared: { method: 'copy_link' | 'share_sheet' }
  view_mode_changed: { view_mode: ViewMode }
}

export function track<E extends keyof WorkspaceEvents>(event: E, properties: WorkspaceEvents[E]) {
  analytics.capture(event, properties)
}

import { useEffect } from 'react'

import { getEditorView } from '@/features/editor/bridge'

import { documentActions } from '../actions'
import { type ViewMode, useSettingsStore } from '../state/settings-store'
import { useUiStore } from '../state/ui-store'

const CYCLE: Record<ViewMode, ViewMode> = { write: 'split', split: 'read', read: 'write' }

export function useHotkeys() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey
      if (!mod || event.altKey) return
      const key = event.key.toLowerCase()

      if (key === 'k' && !event.shiftKey) {
        event.preventDefault()
        const { dialog, openDialog, closeDialog } = useUiStore.getState()
        if (dialog === 'palette') closeDialog()
        else openDialog('palette')
      } else if (key === 'o' && !event.shiftKey) {
        event.preventDefault()
        void documentActions.openFile()
      } else if (key === 'p' && !event.shiftKey) {
        event.preventDefault()
        const { dialog, openDialog } = useUiStore.getState()
        if (dialog === 'pdf') documentActions.printPdf()
        else openDialog('pdf')
      } else if (key === 's' && !event.shiftKey) {
        event.preventDefault()
        void documentActions.save()
      } else if (key === '\\') {
        event.preventDefault()
        const settings = useSettingsStore.getState()
        settings.set('viewMode', CYCLE[settings.viewMode])
        // Read mode makes the editor inert, which drops focus to the page. Hand it back once the
        // editor is interactive again, unless the user has focused something else.
        if (settings.viewMode === 'read' && document.activeElement === document.body) {
          requestAnimationFrame(() => getEditorView()?.focus())
        }
      }
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [])
}

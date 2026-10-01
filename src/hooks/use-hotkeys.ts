import { useEffect } from 'react'

import { type ViewMode, useSettingsStore } from '@/stores/settings-store'
import { useUiStore } from '@/stores/ui-store'

import { documentActions } from './use-document-actions'

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
      } else if (key === 's' && !event.shiftKey) {
        event.preventDefault()
        void documentActions.save()
      } else if (key === '\\') {
        event.preventDefault()
        const settings = useSettingsStore.getState()
        settings.set('viewMode', CYCLE[settings.viewMode])
      }
    }
    window.addEventListener('keydown', onKeyDown, { capture: true })
    return () => window.removeEventListener('keydown', onKeyDown, { capture: true })
  }, [])
}

import { useEffect } from 'react'
import { toast } from 'sonner'

import { decodeShareFragment, readSharePayload, readShareView } from '@/lib/share-link'

import { documentActions } from '../actions'
import { rememberFileHandle } from '../io/file-system'
import { useDocumentStore } from '../state/document-store'
import { useSettingsStore } from '../state/settings-store'

type LaunchParams = { files: FileSystemFileHandle[] }
type LaunchQueueWindow = Window & {
  launchQueue?: { setConsumer: (consumer: (params: LaunchParams) => void) => void }
}

/** Incoming documents are consumed once per page load (StrictMode re-runs effects). */
let incomingHandled = false

const cleanUrl = () => window.history.replaceState(null, '', window.location.pathname)

/** Open the share link in the current URL fragment, if there is one. */
function openSharedFromHash() {
  const payload = readSharePayload(window.location.hash)
  if (!payload) return false
  const view = readShareView(window.location.hash)
  decodeShareFragment(payload).then(
    (markdown) => {
      documentActions.openShared(markdown, view)
      cleanUrl()
    },
    () =>
      toast.error('That share link looks damaged', {
        description: 'It may have been cut off when copied.',
      }),
  )
  return true
}

/**
 * Documents that arrive with the page: share links (`#md=`), `?url=`, `?new`,
 * and files opened from the OS when RenderMD is installed as an app.
 */
export function useIncomingDocuments(
  initialUrl: string | undefined,
  startBlank: boolean | undefined,
) {
  useEffect(() => {
    if (incomingHandled) return
    incomingHandled = true

    if (openSharedFromHash()) {
      // Handled.
    } else if (initialUrl) {
      void documentActions.openUrl(initialUrl).then(cleanUrl)
    } else if (startBlank) {
      documentActions.newDocument()
      cleanUrl()
    }

    // Installed as an app: "Open with RenderMD" from the OS file manager.
    ;(window as LaunchQueueWindow).launchQueue?.setConsumer(({ files }) => {
      const handle = files[0]
      if (!handle) return
      void (async () => {
        const file = await handle.getFile()
        useDocumentStore
          .getState()
          .openDocument({ markdown: await file.text(), source: 'file', name: file.name })
        rememberFileHandle(useDocumentStore.getState().id, handle)
        useSettingsStore.getState().set('viewMode', 'read')
      })()
    })
  }, [initialUrl, startBlank])

  // A share link pasted into the address bar of an open tab only changes the hash.
  useEffect(() => {
    const onHashChange = () => void openSharedFromHash()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])
}

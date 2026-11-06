import { posthog } from 'posthog-js'

type SaveDestination = 'saved' | 'downloaded'

export const posthogLogs = {
  remoteDocumentOpened: () => {
    posthog.logger.info('remote document opened', { document_source: 'remote_url' })
  },

  remoteDocumentOpenFailed: () => {
    posthog.logger.warn('remote document open failed', { document_source: 'remote_url' })
  },

  documentSaved: (destination: SaveDestination) => {
    posthog.logger.info('document saved', { destination })
  },
}

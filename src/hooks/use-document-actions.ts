import { toast } from 'sonner'

import { buildStandaloneHtml, copyRichText } from '@/lib/export'
import {
  downloadFile,
  getFileHandle,
  openMarkdownFile,
  readFile,
  rememberFileHandle,
  saveMarkdownFile,
} from '@/lib/file-system'
import { guessTitle } from '@/lib/markdown/source'
import { fetchRemoteMarkdown } from '@/lib/remote'
import { toFileSlug } from '@/lib/utils'
import { SAMPLE_MARKDOWN, useDocumentStore } from '@/stores/document-store'
import { useSettingsStore } from '@/stores/settings-store'
import { previewArticle } from '@/stores/ui-store'

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Something went wrong.'
}

export function getDocumentTitle() {
  const { markdown, name } = useDocumentStore.getState()
  return guessTitle(markdown) ?? name ?? 'Untitled'
}

function getFileName(extension: 'md' | 'html') {
  const { name } = useDocumentStore.getState()
  if (extension === 'md' && name && /\.(md|markdown|mdx|txt)$/i.test(name)) return name
  return `${toFileSlug(getDocumentTitle())}.${extension}`
}

/**
 * Replace the current document, offering an Undo that brings the previous one
 * back (it was moved to the recents shelf, so nothing is ever lost).
 */
function replaceDocument(open: () => void, message: string) {
  const before = useDocumentStore.getState()
  const previousId = before.id
  const wasPristineSample = before.source === 'sample' && before.markdown === SAMPLE_MARKDOWN
  open()

  const store = useDocumentStore.getState()
  const canRestore = store.recents.some((entry) => entry.id === previousId)
  toast(message, {
    action:
      canRestore || wasPristineSample
        ? {
            label: 'Undo',
            onClick: () =>
              canRestore
                ? useDocumentStore.getState().restoreRecent(previousId)
                : useDocumentStore
                    .getState()
                    .openDocument({ markdown: SAMPLE_MARKDOWN, source: 'sample' }),
          }
        : undefined,
  })
}

/** Every document-level action, shared by the top bar, palette and shortcuts. */
export const documentActions = {
  openFile: async () => {
    try {
      const file = await openMarkdownFile()
      if (!file) return
      replaceDocument(() => {
        useDocumentStore
          .getState()
          .openDocument({ markdown: file.markdown, source: 'file', name: file.name })
        rememberFileHandle(useDocumentStore.getState().id, file.handle)
      }, `Opened ${file.name}`)
    } catch (error) {
      toast.error('Couldn’t open that file', { description: errorMessage(error) })
    }
  },

  openDroppedFile: async (file: File) => {
    try {
      const opened = await readFile(file)
      replaceDocument(
        () =>
          useDocumentStore
            .getState()
            .openDocument({ markdown: opened.markdown, source: 'file', name: opened.name }),
        `Opened ${opened.name}`,
      )
    } catch (error) {
      toast.error('Couldn’t read that file', { description: errorMessage(error) })
    }
  },

  openUrl: async (input: string) => {
    const loading = toast.loading('Fetching document…')
    try {
      const remote = await fetchRemoteMarkdown(input)
      toast.dismiss(loading)
      replaceDocument(
        () =>
          useDocumentStore.getState().openDocument({
            markdown: remote.markdown,
            source: 'url',
            name: remote.name,
            baseUrl: remote.url,
          }),
        `Loaded ${remote.name}`,
      )
      return true
    } catch (error) {
      toast.error('Couldn’t load that URL', { id: loading, description: errorMessage(error) })
      return false
    }
  },

  openShared: (markdown: string) => {
    replaceDocument(
      () => useDocumentStore.getState().openDocument({ markdown, source: 'shared' }),
      'Opened a shared document',
    )
    useSettingsStore.getState().set('viewMode', 'read')
  },

  newDocument: () => {
    replaceDocument(
      () => useDocumentStore.getState().openDocument({ markdown: '', source: 'local' }),
      'Started a blank page',
    )
    const settings = useSettingsStore.getState()
    if (settings.viewMode === 'read') settings.set('viewMode', 'split')
  },

  loadSample: () => {
    replaceDocument(
      () =>
        useDocumentStore.getState().openDocument({ markdown: SAMPLE_MARKDOWN, source: 'sample' }),
      'Loaded the field guide',
    )
  },

  pasteFromClipboard: async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (!text.trim()) {
        toast('Your clipboard is empty')
        return
      }
      replaceDocument(
        () => useDocumentStore.getState().openDocument({ markdown: text, source: 'local' }),
        'Pasted from clipboard',
      )
    } catch {
      toast.error('Clipboard access was blocked', {
        description: 'Click into the editor and paste with ⌘V / Ctrl+V instead.',
      })
    }
  },

  save: async () => {
    const { id, markdown } = useDocumentStore.getState()
    try {
      const hadHandle = Boolean(getFileHandle(id))
      const result = await saveMarkdownFile({
        documentId: id,
        markdown,
        suggestedName: getFileName('md'),
      })
      if (result === 'saved') toast.success(hadHandle ? 'Saved' : 'Saved to disk')
      if (result === 'downloaded') toast.success('Downloaded markdown')
    } catch (error) {
      toast.error('Couldn’t save', { description: errorMessage(error) })
    }
  },

  downloadMarkdown: () => {
    downloadFile(getFileName('md'), useDocumentStore.getState().markdown)
  },

  downloadHtml: () => {
    const article = previewArticle.current
    if (!article) {
      toast.error('Open the preview to export HTML')
      return
    }
    downloadFile(getFileName('html'), buildStandaloneHtml(article, getDocumentTitle()), 'text/html')
    toast.success('Exported a standalone HTML file')
  },

  copyMarkdown: async () => {
    await navigator.clipboard.writeText(useDocumentStore.getState().markdown)
    toast.success('Markdown copied')
  },

  copyRichText: async () => {
    const article = previewArticle.current
    if (!article) {
      toast.error('Open the preview to copy formatted text')
      return
    }
    try {
      const mode = await copyRichText(article, useDocumentStore.getState().markdown)
      toast.success(mode === 'rich' ? 'Copied formatted text' : 'Copied markdown', {
        description: mode === 'rich' ? 'Paste into Docs, Gmail, Notion or Word.' : undefined,
      })
    } catch (error) {
      toast.error('Couldn’t copy', { description: errorMessage(error) })
    }
  },

  print: () => {
    const { viewMode } = useSettingsStore.getState()
    if (viewMode === 'write') {
      useSettingsStore.getState().set('viewMode', 'read')
      setTimeout(() => window.print(), 350)
      return
    }
    window.print()
  },
}

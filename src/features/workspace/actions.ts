import { guessTitle } from '@/features/markdown/engine/source'
import { downloadFile } from '@/lib/download'
import { toFileSlug } from '@/lib/format'
import { type ShareOrigin } from '@/lib/share-link'
import { toast } from '@/ui/toast'

import { track, trackOncePerDocument } from './analytics'
import { buildStandaloneHtml, copyRichText } from './io/export'
import {
  getFileHandle,
  openMarkdownFile,
  readFile,
  rememberFileHandle,
  saveMarkdownFile,
} from './io/file-system'
import { fetchRemoteMarkdown } from './io/remote'
import { SAMPLE_MARKDOWN, useDocumentStore } from './state/document-store'
import { type ViewMode, useSettingsStore } from './state/settings-store'
import { previewArticle, useUiStore } from './state/ui-store'

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
  const undo = () => {
    toast.close(id)
    if (canRestore) useDocumentStore.getState().restoreRecent(previousId)
    else useDocumentStore.getState().openDocument({ markdown: SAMPLE_MARKDOWN, source: 'sample' })
  }
  const id = toast.add({
    title: message,
    actionProps: canRestore || wasPristineSample ? { children: 'Undo', onClick: undo } : undefined,
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
      track('document_opened', { source: 'file_picker' })
    } catch (error) {
      toast.add({
        type: 'error',
        title: 'Couldn’t open that file',
        description: errorMessage(error),
      })
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
      track('document_opened', { source: 'file_drop' })
    } catch (error) {
      toast.add({
        type: 'error',
        title: 'Couldn’t read that file',
        description: errorMessage(error),
      })
    }
  },

  openUrl: async (input: string) => {
    const loading = toast.add({ title: 'Fetching document…', type: 'loading' })
    try {
      const remote = await fetchRemoteMarkdown(input)
      toast.close(loading)
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
      track('document_opened', { source: 'url' })
      return true
    } catch (error) {
      track('document_open_failed', { source: 'url' })
      toast.update(loading, {
        type: 'error',
        title: 'Couldn’t load that URL',
        description: errorMessage(error),
      })
      return false
    }
  },

  openShared: (markdown: string, view: ViewMode, from: ShareOrigin) => {
    replaceDocument(
      () => useDocumentStore.getState().openDocument({ markdown, source: 'shared' }),
      'Opened a shared document',
    )
    useSettingsStore.getState().set('viewMode', view)
    track('document_opened', {
      source: from === 'cheatsheet' ? 'cheatsheet_example' : 'shared_link',
    })
  },

  newDocument: () => {
    replaceDocument(
      () => useDocumentStore.getState().openDocument({ markdown: '', source: 'local' }),
      'Started a blank page',
    )
    const settings = useSettingsStore.getState()
    if (settings.viewMode === 'read') settings.set('viewMode', 'split')
    track('document_opened', { source: 'blank_page' })
  },

  loadSample: () => {
    replaceDocument(
      () =>
        useDocumentStore.getState().openDocument({ markdown: SAMPLE_MARKDOWN, source: 'sample' }),
      'Loaded the field guide',
    )
    track('document_opened', { source: 'sample' })
  },

  pasteFromClipboard: async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (!text.trim()) {
        toast.add({ title: 'Your clipboard is empty' })
        return
      }
      replaceDocument(
        () => useDocumentStore.getState().openDocument({ markdown: text, source: 'local' }),
        'Pasted from clipboard',
      )
      track('document_opened', { source: 'clipboard' })
    } catch {
      toast.add({
        type: 'error',
        title: 'Clipboard access was blocked',
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
      if (result === 'cancelled') return
      toast.add({
        type: 'success',
        title:
          result === 'downloaded' ? 'Downloaded markdown' : hadHandle ? 'Saved' : 'Saved to disk',
      })
      trackOncePerDocument('document_saved', { destination: result })
    } catch (error) {
      toast.add({ type: 'error', title: 'Couldn’t save', description: errorMessage(error) })
    }
  },

  downloadMarkdown: () => {
    downloadFile(getFileName('md'), useDocumentStore.getState().markdown)
    track('document_exported', { format: 'markdown' })
  },

  downloadHtml: () => {
    const article = previewArticle.current
    if (!article) {
      toast.add({ type: 'error', title: 'Open the preview to export HTML' })
      return
    }
    downloadFile(getFileName('html'), buildStandaloneHtml(article, getDocumentTitle()), 'text/html')
    track('document_exported', { format: 'html' })
    toast.add({ type: 'success', title: 'Exported a standalone HTML file' })
  },

  copyMarkdown: async () => {
    await navigator.clipboard.writeText(useDocumentStore.getState().markdown)
    track('document_copied', { format: 'markdown' })
    toast.add({ type: 'success', title: 'Markdown copied' })
  },

  copyRichText: async () => {
    const article = previewArticle.current
    if (!article) {
      toast.add({ type: 'error', title: 'Open the preview to copy formatted text' })
      return
    }
    try {
      const mode = await copyRichText(article, useDocumentStore.getState().markdown)
      track('document_copied', { format: mode === 'rich' ? 'rich_text' : 'markdown_fallback' })
      toast.add({
        type: 'success',
        title: mode === 'rich' ? 'Copied formatted text' : 'Copied markdown',
        description: mode === 'rich' ? 'Paste into Docs, Gmail, Notion or Word.' : undefined,
      })
    } catch (error) {
      toast.add({ type: 'error', title: 'Couldn’t copy', description: errorMessage(error) })
    }
  },

  /** Lay the document out for paper and open the print dialog once it's ready. */
  printPdf: () => {
    const ui = useUiStore.getState()
    ui.closeDialog()
    if (!useDocumentStore.getState().markdown.trim()) {
      toast.add({ title: 'There’s nothing to print yet' })
      return
    }
    if (ui.printJob) return
    ui.startPrint('export')
    const { pdf } = useSettingsStore.getState()
    track('document_exported', {
      format: 'pdf',
      paper: pdf.paper,
      title_page: pdf.titlePage,
      contents: pdf.contents,
    })
  },
}

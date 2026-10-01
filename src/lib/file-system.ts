/**
 * Local files. Uses the File System Access API where available (so ⌘S writes
 * back to the file you opened) and falls back to <input type=file> + download.
 */

type FilePickerType = { description: string; accept: Record<string, string[]> }
type FileSystemWindow = Window & {
  showOpenFilePicker?: (options: {
    types?: FilePickerType[]
    excludeAcceptAllOption?: boolean
    multiple?: boolean
  }) => Promise<FileSystemFileHandle[]>
  showSaveFilePicker?: (options: {
    suggestedName?: string
    types?: FilePickerType[]
  }) => Promise<FileSystemFileHandle>
}

export type OpenedFile = {
  markdown: string
  name: string
  handle: FileSystemFileHandle | null
}

const MARKDOWN_TYPES: FilePickerType[] = [
  {
    description: 'Markdown',
    accept: {
      'text/markdown': ['.md', '.markdown', '.mdx', '.mdown', '.mkd'],
      'text/plain': ['.txt'],
    },
  },
]

export const MARKDOWN_EXTENSIONS = /\.(md|markdown|mdx|mdown|mkd|txt)$/i

const fsWindow = () => window as FileSystemWindow

/** The file the current document was opened from / saved to, if any. */
let activeHandle: { documentId: string; handle: FileSystemFileHandle } | null = null

export function rememberFileHandle(documentId: string, handle: FileSystemFileHandle | null) {
  activeHandle = handle ? { documentId, handle } : null
}

export function getFileHandle(documentId: string) {
  return activeHandle?.documentId === documentId ? activeHandle.handle : null
}

function isAbort(error: unknown) {
  return error instanceof DOMException && error.name === 'AbortError'
}

function pickWithInput(): Promise<File | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.mdx,.mdown,.mkd,.txt,text/markdown,text/plain'
    input.addEventListener('change', () => resolve(input.files?.[0] ?? null), { once: true })
    input.addEventListener('cancel', () => resolve(null), { once: true })
    input.click()
  })
}

export async function openMarkdownFile(): Promise<OpenedFile | null> {
  const picker = fsWindow().showOpenFilePicker
  if (picker) {
    try {
      const [handle] = await picker({ types: MARKDOWN_TYPES, multiple: false })
      const file = await handle.getFile()
      return { markdown: await file.text(), name: file.name, handle }
    } catch (error) {
      if (isAbort(error)) return null
      throw error
    }
  }

  const file = await pickWithInput()
  return file ? { markdown: await file.text(), name: file.name, handle: null } : null
}

export async function readFile(file: File): Promise<OpenedFile> {
  return { markdown: await file.text(), name: file.name, handle: null }
}

/** First markdown-ish file in a drop/paste payload. */
export function findMarkdownFile(files: FileList | File[] | null | undefined) {
  if (!files) return null
  return (
    Array.from(files).find(
      (file) => MARKDOWN_EXTENSIONS.test(file.name) || file.type === 'text/markdown',
    ) ?? null
  )
}

export function downloadFile(name: string, content: string | Blob, type = 'text/markdown') {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type: `${type};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = name
  anchor.rel = 'noopener'
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

export type SaveResult = 'saved' | 'downloaded' | 'cancelled'

export async function saveMarkdownFile({
  documentId,
  markdown,
  suggestedName,
}: {
  documentId: string
  markdown: string
  suggestedName: string
}): Promise<SaveResult> {
  const existing = getFileHandle(documentId)
  const savePicker = fsWindow().showSaveFilePicker

  try {
    const handle =
      existing ?? (savePicker ? await savePicker({ suggestedName, types: MARKDOWN_TYPES }) : null)

    if (!handle) {
      downloadFile(suggestedName, markdown)
      return 'downloaded'
    }

    const writable = await handle.createWritable()
    await writable.write(markdown)
    await writable.close()
    rememberFileHandle(documentId, handle)
    return 'saved'
  } catch (error) {
    if (isAbort(error)) return 'cancelled'
    throw error
  }
}

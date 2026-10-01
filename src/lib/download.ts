/** Hand the browser a file to save. */
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

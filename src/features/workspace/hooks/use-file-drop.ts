import { useEffect } from 'react'

import { findMarkdownFile } from '../io/file-system'
import { useUiStore } from '../state/ui-store'

/** Drop a markdown file anywhere on the page to open it. */
export function useFileDrop(onFile: (file: File) => void) {
  useEffect(() => {
    let depth = 0
    const setDragging = useUiStore.getState().setDragging
    const hasFiles = (event: DragEvent) => event.dataTransfer?.types.includes('Files') ?? false

    const onEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth++
      setDragging(true)
    }
    const onOver = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
    }
    const onLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return
      depth = Math.max(0, depth - 1)
      if (depth === 0) setDragging(false)
    }
    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth = 0
      setDragging(false)
      const file = findMarkdownFile(event.dataTransfer?.files)
      if (!file) return
      // Capture phase: stop CodeMirror from also inserting the file's text.
      event.stopPropagation()
      onFile(file)
    }

    window.addEventListener('dragenter', onEnter)
    window.addEventListener('dragover', onOver)
    window.addEventListener('dragleave', onLeave)
    window.addEventListener('drop', onDrop, { capture: true })
    return () => {
      window.removeEventListener('dragenter', onEnter)
      window.removeEventListener('dragover', onOver)
      window.removeEventListener('dragleave', onLeave)
      window.removeEventListener('drop', onDrop, { capture: true })
    }
  }, [onFile])
}

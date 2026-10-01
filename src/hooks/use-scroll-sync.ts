import { type RefObject, useEffect } from 'react'

import { getEditorView, onEditorView } from '@/lib/editor/bridge'
import { type Anchor, collectAnchors, lineToOffset, offsetToLine } from '@/lib/scroll-sync'

/**
 * Keep editor and preview aligned by source line. Whichever pane the user is
 * interacting with drives; the other follows. No feedback loops, no jitter.
 */
export function useScrollSync({
  enabled,
  previewRef,
  revision,
}: {
  enabled: boolean
  previewRef: RefObject<HTMLDivElement | null>
  /** Changes whenever the rendered output changes, to re-measure anchors. */
  revision: unknown
}) {
  useEffect(() => {
    const preview = previewRef.current
    if (!enabled || !preview) return

    let view = getEditorView()
    let anchors: Anchor[] = []
    let driver: 'editor' | 'preview' = 'editor'
    let frame = 0
    let measureFrame = 0

    const measure = () => {
      measureFrame = 0
      anchors = collectAnchors(preview)
    }
    const scheduleMeasure = () => {
      measureFrame ||= requestAnimationFrame(measure)
    }
    measure()

    const resizeObserver = new ResizeObserver(scheduleMeasure)
    const content = preview.firstElementChild
    if (content) resizeObserver.observe(content)

    const editorTopLine = () => {
      if (!view) return 1
      const scroller = view.scrollDOM
      const offset = Math.max(0, scroller.scrollTop - view.documentPadding.top)
      const block = view.lineBlockAtHeight(offset)
      const line = view.state.doc.lineAt(block.from).number
      return line + (block.height > 0 ? (offset - block.top) / block.height : 0)
    }

    const syncPreviewToEditor = () => {
      frame = 0
      if (!view) return
      const scroller = view.scrollDOM
      if (scroller.scrollTop <= 1) {
        preview.scrollTop = 0
        return
      }
      const totalLines = view.state.doc.lines
      preview.scrollTop = lineToOffset(anchors, editorTopLine(), totalLines, preview.scrollHeight)
    }

    const syncEditorToPreview = () => {
      frame = 0
      if (!view) return
      const scroller = view.scrollDOM
      if (preview.scrollTop <= 1) {
        scroller.scrollTop = 0
        return
      }
      const doc = view.state.doc
      const line = offsetToLine(anchors, preview.scrollTop, doc.lines, preview.scrollHeight)
      const whole = Math.min(doc.lines, Math.max(1, Math.floor(line)))
      const block = view.lineBlockAt(doc.line(whole).from)
      scroller.scrollTop = block.top + (line - whole) * block.height + view.documentPadding.top
    }

    const onEditorScroll = () => {
      if (driver !== 'editor') return
      frame ||= requestAnimationFrame(syncPreviewToEditor)
    }
    const onPreviewScroll = () => {
      if (driver !== 'preview') return
      frame ||= requestAnimationFrame(syncEditorToPreview)
    }
    const driveFromEditor = () => {
      driver = 'editor'
    }
    const driveFromPreview = () => {
      driver = 'preview'
    }

    const intentEvents = [
      'pointerenter',
      'pointerdown',
      'wheel',
      'touchstart',
      'keydown',
      'focusin',
    ] as const

    const attachEditor = () => {
      if (!view) return
      view.scrollDOM.addEventListener('scroll', onEditorScroll, { passive: true })
      for (const type of intentEvents)
        view.dom.addEventListener(type, driveFromEditor, { passive: true })
    }
    const detachEditor = () => {
      if (!view) return
      view.scrollDOM.removeEventListener('scroll', onEditorScroll)
      for (const type of intentEvents) view.dom.removeEventListener(type, driveFromEditor)
    }

    attachEditor()
    preview.addEventListener('scroll', onPreviewScroll, { passive: true })
    for (const type of intentEvents)
      preview.addEventListener(type, driveFromPreview, { passive: true })

    const unsubscribe = onEditorView((next) => {
      detachEditor()
      view = next
      attachEditor()
    })

    return () => {
      unsubscribe()
      detachEditor()
      resizeObserver.disconnect()
      cancelAnimationFrame(frame)
      cancelAnimationFrame(measureFrame)
      preview.removeEventListener('scroll', onPreviewScroll)
      for (const type of intentEvents) preview.removeEventListener(type, driveFromPreview)
    }
    // `revision` is intentionally a dependency: a new render means new anchors.
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [enabled, previewRef, revision])
}

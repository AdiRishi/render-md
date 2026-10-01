import { ClientOnly } from '@tanstack/react-router'
import { Activity, type KeyboardEvent, type PointerEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { documentActions } from '@/hooks/use-document-actions'
import { useFileDrop } from '@/hooks/use-file-drop'
import { useHotkeys } from '@/hooks/use-hotkeys'
import { useRenderedMarkdown } from '@/hooks/use-rendered-markdown'
import { useScrollSync } from '@/hooks/use-scroll-sync'
import { rememberFileHandle } from '@/lib/file-system'
import { decodeShareFragment, readSharePayload } from '@/lib/share'
import { cn } from '@/lib/utils'
import { useDocumentStore } from '@/stores/document-store'
import { useSettingsStore } from '@/stores/settings-store'

import { CommandPalette } from './CommandPalette'
import { DropOverlay } from './DropOverlay'
import { EditorPane } from './EditorPane'
import { OpenUrlDialog } from './OpenUrlDialog'
import { PreviewPane } from './PreviewPane'
import { ShareDialog } from './ShareDialog'
import { StatusBar } from './StatusBar'
import { TopBar } from './TopBar'

/* -- Things that arrive with the page: share links, ?url=, OS file opens --- */

type LaunchParams = { files: FileSystemFileHandle[] }
type LaunchQueueWindow = Window & {
  launchQueue?: { setConsumer: (consumer: (params: LaunchParams) => void) => void }
}

/** Incoming documents are consumed once per page load (StrictMode re-runs effects). */
let incomingHandled = false

function useIncomingDocuments(initialUrl: string | undefined, startBlank: boolean | undefined) {
  useEffect(() => {
    if (incomingHandled) return
    incomingHandled = true

    const payload = readSharePayload(window.location.hash)
    const clean = () => window.history.replaceState(null, '', window.location.pathname)

    if (payload) {
      decodeShareFragment(payload).then(
        (markdown) => {
          documentActions.openShared(markdown)
          clean()
        },
        () =>
          toast.error('That share link looks damaged', {
            description: 'It may have been cut off when copied.',
          }),
      )
    } else if (initialUrl) {
      void documentActions.openUrl(initialUrl).then(clean)
    } else if (startBlank) {
      documentActions.newDocument()
      clean()
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
}

/* -- Draggable divider --------------------------------------------------- */

const clamp = (value: number) => Math.min(0.78, Math.max(0.22, value))
const openDroppedFile = (file: File) => void documentActions.openDroppedFile(file)

function Divider({
  containerRef,
  onDragChange,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  onDragChange: (dragging: boolean) => void
}) {
  const splitRatio = useSettingsStore((state) => state.splitRatio)
  const setSetting = useSettingsStore((state) => state.set)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    onDragChange(true)
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setSetting('splitRatio', clamp((event.clientX - rect.left) / rect.width))
  }
  const onPointerUp = () => onDragChange(false)
  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 0.1 : 0.02
    if (event.key === 'ArrowLeft') setSetting('splitRatio', clamp(splitRatio - step))
    if (event.key === 'ArrowRight') setSetting('splitRatio', clamp(splitRatio + step))
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize editor and preview"
      aria-valuenow={Math.round(splitRatio * 100)}
      aria-valuemin={22}
      aria-valuemax={78}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => setSetting('splitRatio', 0.5)}
      onKeyDown={onKeyDown}
      title="Drag to resize · double-click to reset"
      className="group relative z-10 -mx-1 w-2 shrink-0 cursor-col-resize touch-none outline-none max-md:hidden"
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-rule transition-colors group-hover:bg-proof group-focus-visible:bg-proof group-active:bg-proof" />
      <span className="absolute top-1/2 left-1/2 h-8 w-1 -translate-1/2 rounded-full bg-rule-strong opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}

/* -- Workspace ---------------------------------------------------------- */

export function Workspace({
  initialUrl,
  startBlank,
}: {
  initialUrl?: string
  startBlank?: boolean
}) {
  const markdown = useDocumentStore((state) => state.markdown)
  const baseUrl = useDocumentStore((state) => state.baseUrl)
  const viewMode = useSettingsStore((state) => state.viewMode)
  const splitRatio = useSettingsStore((state) => state.splitRatio)
  const syncScroll = useSettingsStore((state) => state.syncScroll)
  const [resizing, setResizing] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const { result } = useRenderedMarkdown(markdown, baseUrl)

  useHotkeys()
  useFileDrop(openDroppedFile)
  useIncomingDocuments(initialUrl, startBlank)
  useScrollSync({ enabled: syncScroll && viewMode === 'split', previewRef, revision: result })

  const editorBasis =
    viewMode === 'write' ? '100%' : viewMode === 'read' ? '0%' : `${splitRatio * 100}%`

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-desk">
      <TopBar />

      <main
        ref={containerRef}
        className={cn('relative flex min-h-0 flex-1', resizing && 'cursor-col-resize select-none')}
      >
        <section
          aria-label="Editor"
          inert={viewMode === 'read'}
          className={cn(
            'min-w-0 overflow-hidden ease-(--ease-out-quint) max-md:!basis-full',
            !resizing && 'transition-[flex-basis] duration-300',
            viewMode === 'read' && 'max-md:hidden',
          )}
          style={{ flexBasis: editorBasis, flexShrink: 0 }}
        >
          <EditorPane />
        </section>

        {viewMode === 'split' ? (
          <Divider containerRef={containerRef} onDragChange={setResizing} />
        ) : null}

        <Activity mode={viewMode === 'write' ? 'hidden' : 'visible'}>
          <section
            aria-label="Preview"
            className={cn('min-w-0 flex-1', viewMode === 'split' && 'max-md:hidden')}
          >
            <PreviewPane result={result} scrollRef={previewRef} />
          </section>
        </Activity>
      </main>

      <StatusBar stats={result?.stats ?? null} />

      <ClientOnly>
        <CommandPalette headings={result?.headings ?? []} />
        <ShareDialog />
        <OpenUrlDialog />
        <DropOverlay />
      </ClientOnly>
    </div>
  )
}

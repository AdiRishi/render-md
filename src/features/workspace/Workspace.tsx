import { ClientOnly } from '@tanstack/react-router'
import { Activity, useRef, useState } from 'react'

import { useRenderedMarkdown } from '@/features/markdown/worker/use-rendered-markdown'
import { cn } from '@/lib/utils'

import { documentActions } from './actions'
import { StatusBar } from './chrome/StatusBar'
import { TopBar } from './chrome/TopBar'
import { CommandPalette } from './dialogs/CommandPalette'
import { DropOverlay } from './dialogs/DropOverlay'
import { OpenUrlDialog } from './dialogs/OpenUrlDialog'
import { ShareDialog } from './dialogs/ShareDialog'
import { useFileDrop } from './hooks/use-file-drop'
import { useHotkeys } from './hooks/use-hotkeys'
import { useIncomingDocuments } from './hooks/use-incoming-documents'
import { EditorPane } from './panes/EditorPane'
import { PreviewPane } from './panes/preview/PreviewPane'
import { SplitDivider } from './panes/SplitDivider'
import { useScrollSync } from './scroll-sync/use-scroll-sync'
import { useDocumentStore } from './state/document-store'
import { useSettingsStore } from './state/settings-store'

const openDroppedFile = (file: File) => void documentActions.openDroppedFile(file)

/**
 * The app at "/": top bar, the editor | divider | preview split, status bar
 * and dialogs. The preview sits in a React 19 <Activity> so it's paused, not
 * re-rendered, while you're in Write mode.
 */
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

  const { result, error } = useRenderedMarkdown(markdown, baseUrl)

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
          <SplitDivider containerRef={containerRef} onDragChange={setResizing} />
        ) : null}

        <Activity mode={viewMode === 'write' ? 'hidden' : 'visible'}>
          <section
            aria-label="Preview"
            className={cn('min-w-0 flex-1', viewMode === 'split' && 'max-md:hidden')}
          >
            <PreviewPane result={result} error={error} scrollRef={previewRef} />
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

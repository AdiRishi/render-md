import { type UIEvent, useCallback, useDeferredValue, useEffect, useRef, useState } from 'react'
import { ClientOnly } from '@tanstack/react-router'
import { cva } from 'class-variance-authority'
import { type EditorView } from '@codemirror/view'

import { EditorHeader, type ViewMode } from './EditorHeader'
import { MarkdownPane } from './MarkdownPane'
import { PreviewPane } from './PreviewPane'
import { defaultContent } from './markdown/default-content'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const editorPaneVariants = cva('h-full min-w-0 transition-[width] duration-200 border-border', {
  variants: {
    viewMode: {
      split: 'max-md:w-full md:w-1/2 md:border-r',
      editor: 'max-md:w-full md:w-full md:border-r-0',
      preview: 'max-md:hidden md:w-0 md:overflow-hidden md:border-r-0',
    } satisfies Record<ViewMode, string>,
  },
})

const previewPaneVariants = cva('h-full min-w-0 transition-[width] duration-200', {
  variants: {
    viewMode: {
      split: 'max-md:hidden md:w-1/2',
      preview: 'max-md:w-full md:w-full',
      editor: 'max-md:hidden md:w-0 md:overflow-hidden',
    } satisfies Record<ViewMode, string>,
  },
})

export function EditorLayout() {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [markdown, setMarkdown] = useState(defaultContent)

  const deferredMarkdown = useDeferredValue(markdown)

  // Scroll sync refs
  const editorViewRef = useRef<EditorView | null>(null)
  const previewScrollRef = useRef<HTMLDivElement | null>(null)
  const scrollSourceRef = useRef<'editor' | 'preview' | null>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup scroll timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Handle editor scroll → sync to preview
  const handleEditorScroll = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      // Skip if preview initiated this scroll cycle
      if (scrollSourceRef.current === 'preview') return

      const previewEl = previewScrollRef.current
      if (!previewEl) return

      // Mark editor as scroll source
      scrollSourceRef.current = 'editor'
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

      // Calculate scroll percentage and apply to preview
      const maxScroll = scrollHeight - clientHeight
      const previewMaxScroll = previewEl.scrollHeight - previewEl.clientHeight
      if (maxScroll <= 0 || previewMaxScroll <= 0) return

      const scrollPercent = scrollTop / maxScroll
      const targetScroll = scrollPercent * previewMaxScroll

      previewEl.scrollTop = targetScroll

      // Reset scroll source after debounce to allow future syncs
      scrollTimeoutRef.current = setTimeout(() => {
        scrollSourceRef.current = null
      }, 50)
    },
    [],
  )

  // Handle preview scroll → sync to editor
  const handlePreviewScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    // Skip if editor initiated this scroll cycle
    if (scrollSourceRef.current === 'editor') return

    const previewEl = e.currentTarget
    const editorView = editorViewRef.current
    if (!editorView) return

    // Mark preview as scroll source
    scrollSourceRef.current = 'preview'
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)

    // Calculate scroll percentage and apply to editor
    const previewMaxScroll = previewEl.scrollHeight - previewEl.clientHeight
    const editorMaxScroll = editorView.scrollDOM.scrollHeight - editorView.scrollDOM.clientHeight
    if (previewMaxScroll <= 0 || editorMaxScroll <= 0) return

    const scrollPercent = previewEl.scrollTop / previewMaxScroll
    const targetScroll = scrollPercent * editorMaxScroll

    editorView.scrollDOM.scrollTop = targetScroll

    // Reset scroll source after debounce to allow future syncs
    scrollTimeoutRef.current = setTimeout(() => {
      scrollSourceRef.current = null
    }, 50)
  }, [])

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <EditorHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      {/* Mobile tab bar - visible only below md breakpoint */}
      <Tabs
        value={viewMode === 'split' ? 'editor' : viewMode}
        onValueChange={(v) => setViewMode(v as ViewMode)}
        className="md:hidden border-b border-border"
      >
        <TabsList className="w-full rounded-none p-1">
          <TabsTrigger value="editor" className="flex-1">
            Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex-1">
            Preview
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <main className="flex flex-1 overflow-hidden">
        {/* Editor pane - always mounted to preserve CodeMirror state (undo history, selections, scroll) */}
        <div className={editorPaneVariants({ viewMode })}>
          <ClientOnly fallback={<EditorSkeleton />}>
            <MarkdownPane
              value={markdown}
              onChange={setMarkdown}
              onScroll={handleEditorScroll}
              editorViewRef={editorViewRef}
            />
          </ClientOnly>
        </div>

        {/* Preview pane - always mounted to preserve scroll position */}
        <div className={previewPaneVariants({ viewMode })}>
          <ClientOnly fallback={<PreviewSkeleton />}>
            <PreviewPane
              markdown={deferredMarkdown}
              onScroll={handlePreviewScroll}
              scrollRef={previewScrollRef}
            />
          </ClientOnly>
        </div>
      </main>
    </div>
  )
}

function EditorSkeleton() {
  return (
    <section className="flex flex-col bg-background relative h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-background sticky top-0 z-10">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Markdown
        </span>
      </div>
      <div className="flex-1 p-4">
        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-4 w-1/2 bg-muted animate-pulse rounded mt-2" />
        <div className="h-4 w-2/3 bg-muted animate-pulse rounded mt-2" />
      </div>
    </section>
  )
}

function PreviewSkeleton() {
  return (
    <section className="flex flex-col bg-muted/50 h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border shrink-0 z-10">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Preview
        </span>
      </div>
      <div className="flex-1 p-8">
        <div className="max-w-[720px] mx-auto space-y-4">
          <div className="h-8 w-1/2 bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </section>
  )
}

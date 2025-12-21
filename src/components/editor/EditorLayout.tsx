import { useDeferredValue, useState } from 'react'
import { ClientOnly } from '@tanstack/react-router'

import { EditorHeader, type ViewMode } from './EditorHeader'
import { MarkdownPane } from './MarkdownPane'
import { PreviewPane } from './PreviewPane'
import { defaultContent } from './markdown/default-content'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

// Helper functions for readable mobile/desktop pane classes
function getEditorPaneClasses(viewMode: ViewMode) {
  // Mobile: full width, hidden only when showing preview
  const mobile = viewMode === 'preview' ? 'max-md:hidden' : 'max-md:w-full'

  // Desktop: width transitions based on view mode
  const desktop = {
    split: 'md:w-1/2 md:border-r',
    editor: 'md:w-full md:border-r-0',
    preview: 'md:w-0 md:overflow-hidden md:border-r-0',
  }[viewMode]

  return cn('h-full min-w-0 transition-[width] duration-200 border-border', mobile, desktop)
}

function getPreviewPaneClasses(viewMode: ViewMode) {
  // Mobile: full width, hidden unless showing preview
  const mobile = viewMode === 'preview' ? 'max-md:w-full' : 'max-md:hidden'

  // Desktop: width transitions based on view mode
  const desktop = {
    split: 'md:w-1/2',
    preview: 'md:w-full',
    editor: 'md:w-0 md:overflow-hidden',
  }[viewMode]

  return cn('h-full min-w-0 transition-[width] duration-200', mobile, desktop)
}

export function EditorLayout() {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [markdown, setMarkdown] = useState(defaultContent)

  const deferredMarkdown = useDeferredValue(markdown)

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
        <div className={getEditorPaneClasses(viewMode)}>
          <ClientOnly fallback={<EditorSkeleton />}>
            <MarkdownPane value={markdown} onChange={setMarkdown} />
          </ClientOnly>
        </div>

        {/* Preview pane - always mounted to preserve scroll position */}
        <div className={getPreviewPaneClasses(viewMode)}>
          <ClientOnly fallback={<PreviewSkeleton />}>
            <PreviewPane markdown={deferredMarkdown} />
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

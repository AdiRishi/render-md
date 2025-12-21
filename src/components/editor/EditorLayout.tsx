import { useDeferredValue, useState } from 'react'

import { EditorHeader, type ViewMode } from './EditorHeader'
import { MarkdownPane } from './MarkdownPane'
import { PreviewPane } from './PreviewPane'
import { defaultContent } from './markdown/default-content'
import { cn } from '@/lib/utils'

export function EditorLayout() {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [markdown, setMarkdown] = useState(defaultContent)

  // Use React's useDeferredValue for built-in debouncing
  // This allows the editor to remain responsive while deferring expensive preview updates
  const deferredMarkdown = useDeferredValue(markdown)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <EditorHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <main className="flex flex-1 overflow-hidden relative">
        {/* Editor pane - always mounted to preserve CodeMirror state (undo history, selections, scroll) */}
        <div
          className={cn(
            'h-full border-r border-border transition-[width] duration-200',
            viewMode === 'split' && 'w-1/2',
            viewMode === 'editor' && 'w-full border-r-0',
            viewMode === 'preview' && 'w-0 overflow-hidden border-r-0',
          )}
        >
          <MarkdownPane value={markdown} onChange={setMarkdown} />
        </div>

        {/* Preview pane - always mounted to preserve scroll position */}
        <div
          className={cn(
            'h-full transition-[width] duration-200',
            viewMode === 'split' && 'w-1/2',
            viewMode === 'preview' && 'w-full',
            viewMode === 'editor' && 'w-0 overflow-hidden',
          )}
        >
          <PreviewPane markdown={deferredMarkdown} />
        </div>
      </main>
    </div>
  )
}

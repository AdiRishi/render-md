import { useDeferredValue, useState } from 'react'

import { EditorHeader, type ViewMode } from './EditorHeader'
import { MarkdownPane } from './MarkdownPane'
import { PreviewPane } from './PreviewPane'
import { defaultContent } from './markdown'

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
        {viewMode === 'split' && (
          <>
            <div className="w-1/2 border-r border-border">
              <MarkdownPane value={markdown} onChange={setMarkdown} />
            </div>
            <div className="w-1/2">
              <PreviewPane markdown={deferredMarkdown} />
            </div>
          </>
        )}

        {viewMode === 'editor' && (
          <div className="w-full h-full">
            <MarkdownPane value={markdown} onChange={setMarkdown} />
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="w-full h-full">
            <PreviewPane markdown={deferredMarkdown} />
          </div>
        )}
      </main>
    </div>
  )
}

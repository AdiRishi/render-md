import { useState } from 'react'

import { EditorHeader, type ViewMode } from './EditorHeader'
import { MarkdownPane } from './MarkdownPane'
import { PreviewPane } from './PreviewPane'
import { StatusBar } from './StatusBar'

export function EditorLayout() {
  const [viewMode, setViewMode] = useState<ViewMode>('split')

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <EditorHeader viewMode={viewMode} onViewModeChange={setViewMode} />

      <main className="flex flex-1 overflow-hidden relative">
        {viewMode === 'split' && (
          <>
            <div className="w-1/2 border-r border-border">
              <MarkdownPane />
            </div>
            <div className="w-1/2">
              <PreviewPane />
            </div>
          </>
        )}

        {viewMode === 'editor' && (
          <div className="w-full h-full">
            <MarkdownPane />
          </div>
        )}

        {viewMode === 'preview' && (
          <div className="w-full h-full">
            <PreviewPane />
          </div>
        )}

        <StatusBar wordCount={42} readingTime={3} />
      </main>
    </div>
  )
}

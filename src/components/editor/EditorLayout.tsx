import { useState, useMemo } from 'react'

import { EditorHeader, type ViewMode } from './EditorHeader'
import { MarkdownPane, defaultContent } from './MarkdownPane'
import { PreviewPane } from './PreviewPane'
import { StatusBar } from './StatusBar'

/**
 * Calculate word count and reading time from markdown content
 */
function useContentStats(content: string) {
  return useMemo(() => {
    // Count words (split by whitespace, filter empty strings)
    const words = content.trim().split(/\s+/).filter(Boolean)
    const wordCount = words.length

    // Average reading speed: 200 words per minute
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    return { wordCount, readingTime }
  }, [content])
}

export function EditorLayout() {
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [markdown, setMarkdown] = useState(defaultContent)

  const { wordCount, readingTime } = useContentStats(markdown)

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
              <PreviewPane markdown={markdown} />
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
            <PreviewPane markdown={markdown} />
          </div>
        )}

        <StatusBar wordCount={wordCount} readingTime={readingTime} />
      </main>
    </div>
  )
}

import { useState } from 'react'
import { Code, Columns2, Eye, FileCode2, Pencil, Share2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

export type ViewMode = 'split' | 'editor' | 'preview'

interface EditorHeaderProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

const viewModeButtons = [
  { mode: 'split' as const, icon: Columns2, label: 'Split View' },
  { mode: 'editor' as const, icon: Code, label: 'Editor Only' },
  { mode: 'preview' as const, icon: Eye, label: 'Preview Only' },
]

export function EditorHeader({ viewMode, onViewModeChange }: EditorHeaderProps) {
  const [documentTitle, setDocumentTitle] = useState('Untitled Document')

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-border bg-background px-6 py-3 shrink-0 z-10">
      {/* Left section: Logo and document info */}
      <div className="flex items-center gap-4 flex-1">
        <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
          <FileCode2 className="size-5" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2 group cursor-pointer">
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="bg-transparent border-none p-0 text-foreground text-base font-bold focus:ring-0 focus:outline-none w-48 hover:text-primary transition-colors truncate"
            />
            <Pencil className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="text-xs text-muted-foreground">Last saved 2 mins ago</span>
        </div>
      </div>

      {/* Right section: View toggles, actions, and avatar */}
      <div className="flex items-center justify-end gap-4">
        {/* View mode toggle - custom implementation */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {viewModeButtons.map(({ mode, icon: Icon, label }) => (
            <button
              key={mode}
              onClick={() => onViewModeChange(mode)}
              className={cn(
                'p-1.5 rounded transition-all',
                viewMode === mode
                  ? 'bg-background shadow-sm text-foreground'
                  : 'text-muted-foreground hover:bg-background/50',
              )}
              aria-label={label}
              title={label}
            >
              <Icon className="size-5" />
            </button>
          ))}
        </div>

        <div className="flex items-center">
          <Separator orientation="vertical" className="h-6" />
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button variant="secondary" size="lg">
            Copy Link
          </Button>
          <Button className="font-bold shadow-md shadow-primary/20" size="lg">
            <Share2 className="size-4 mr-2" />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

import { Code, Columns2, Eye } from 'lucide-react'

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
  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3 shrink-0">
      {/* Left section: Logo and app title */}
      <div className="flex items-center gap-3">
        <img src="/logo192.png" alt="RenderMD" className="size-8" />
        <span className="text-base font-semibold text-foreground">Markdown Editor</span>
      </div>

      {/* View mode toggle */}
      <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
        {viewModeButtons.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={cn(
              'p-1.5 rounded-md transition-all',
              viewMode === mode
                ? 'bg-background shadow-sm text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
            aria-label={label}
            title={label}
          >
            <Icon className="size-5" />
          </button>
        ))}
      </div>
    </header>
  )
}

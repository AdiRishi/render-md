import { Link } from '@tanstack/react-router'
import { Code, Columns2, Eye, RotateCcw } from 'lucide-react'
import { cva } from 'class-variance-authority'

import { ThemeToggle } from '@/components/theme-toggle'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export type ViewMode = 'split' | 'editor' | 'preview'

interface EditorHeaderProps {
  viewMode: ViewMode
  canResetMarkdown: boolean
  onViewModeChange: (mode: ViewMode) => void
  onResetMarkdown: () => void
}

const viewModeButtons = [
  { mode: 'split' as const, icon: Columns2, label: 'Split View' },
  { mode: 'editor' as const, icon: Code, label: 'Editor Only' },
  { mode: 'preview' as const, icon: Eye, label: 'Preview Only' },
]

const viewModeButtonVariants = cva(
  'p-1.5 rounded-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  {
    variants: {
      state: {
        active: 'bg-background shadow-sm text-foreground',
        inactive: 'text-muted-foreground hover:text-foreground',
      },
    },
    defaultVariants: {
      state: 'inactive',
    },
  },
)

const actionButtonVariants = cva(
  'p-2 rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40',
)

export function EditorHeader({
  viewMode,
  canResetMarkdown,
  onViewModeChange,
  onResetMarkdown,
}: EditorHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-background px-6 py-3 shrink-0">
      {/* Left section: Logo and app title */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/logo192.png" alt="RenderMD" className="size-8" />
          <span className="text-base font-semibold text-foreground">RenderMD</span>
        </Link>
      </div>

      {/* Right section: View mode toggle and theme toggle */}
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex items-center gap-4 mr-2">
          <Link
            to="/cheatsheet"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cheatsheet
          </Link>
        </nav>

        <Tooltip>
          <TooltipTrigger
            render={
              <button
                onClick={onResetMarkdown}
                disabled={!canResetMarkdown}
                className={actionButtonVariants()}
                aria-label="Reset to default markdown"
              >
                <RotateCcw className="size-5" />
              </button>
            }
          />
          <TooltipContent>Reset to default markdown</TooltipContent>
        </Tooltip>

        {/* View mode toggle */}
        <div className="hidden md:flex items-center gap-1 bg-muted rounded-lg p-1">
          {viewModeButtons.map(({ mode, icon: Icon, label }) => (
            <Tooltip key={mode}>
              <TooltipTrigger
                render={
                  <button
                    onClick={() => onViewModeChange(mode)}
                    className={viewModeButtonVariants({
                      state: viewMode === mode ? 'active' : 'inactive',
                    })}
                    aria-label={label}
                    aria-pressed={viewMode === mode}
                  >
                    <Icon className="size-5" />
                  </button>
                }
              />
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  )
}

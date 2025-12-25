import { Link, useLocation } from '@tanstack/react-router'
import { ThemeToggle } from '@/components/theme-toggle'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const location = useLocation()
  const isCheatsheet = location.pathname === '/cheatsheet'

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-border bg-background/90 backdrop-blur-md px-4 py-3 md:px-10">
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo192.png" alt="RenderMD" className="size-8" />
        <span className="text-lg font-bold leading-tight tracking-tight">Markdown Editor</span>
      </Link>

      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              !isCheatsheet ? 'text-primary font-bold' : 'text-muted-foreground',
            )}
          >
            Editor
          </Link>
          <Link
            to="/cheatsheet"
            className={cn(
              'text-sm font-medium transition-colors hover:text-primary',
              isCheatsheet ? 'text-primary font-bold' : 'text-muted-foreground',
            )}
          >
            Cheatsheet
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}

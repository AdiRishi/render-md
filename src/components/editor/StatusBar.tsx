import { AlignLeft, Clock } from 'lucide-react'

interface StatusBarProps {
  wordCount?: number
  readingTime?: number
}

export function StatusBar({ wordCount = 0, readingTime = 0 }: StatusBarProps) {
  return (
    <div className="absolute bottom-6 right-6 z-20">
      <div className="flex items-center gap-3 bg-background shadow-lg border border-border rounded-full px-4 py-2">
        <div className="flex items-center gap-1.5 pr-3 border-r border-border">
          <AlignLeft className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{wordCount} Words</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="size-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">{readingTime} mins read</span>
        </div>
      </div>
    </div>
  )
}

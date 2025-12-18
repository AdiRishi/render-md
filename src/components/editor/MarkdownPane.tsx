import { Bold, Code, Image, Italic, Link } from 'lucide-react'

import { Button } from '@/components/ui/button'

const toolbarButtons = [
  { icon: Bold, label: 'Bold' },
  { icon: Italic, label: 'Italic' },
  { icon: Link, label: 'Link' },
  { icon: Image, label: 'Image' },
  { icon: Code, label: 'Code' },
]

export function MarkdownPane() {
  return (
    <section className="flex flex-col bg-background relative group/editor h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background sticky top-0 z-10">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Markdown
        </span>
        <div className="flex gap-1">
          {toolbarButtons.map(({ icon: Icon, label }) => (
            <Button
              key={label}
              variant="ghost"
              size="icon-xs"
              className="text-muted-foreground hover:text-primary transition-colors"
              title={label}
            >
              <Icon className="size-4" />
            </Button>
          ))}
        </div>
      </div>

      {/* Editor Surface */}
      <div className="flex flex-1 overflow-y-auto editor-scrollbar">
        {/* Line Numbers */}
        <div className="w-12 bg-muted/30 border-r border-border flex flex-col items-end pt-4 pr-3 gap-[2px] select-none shrink-0">
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} className="text-xs font-mono text-muted-foreground/50 h-6 leading-6">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Editor Content Placeholder */}
        <div className="flex-1 p-4 font-mono text-sm leading-relaxed text-foreground outline-none">
          {/* This will be replaced with an actual editor */}
          <div className="text-muted-foreground/50 italic">Editor content will go here...</div>
        </div>
      </div>

      {/* Editor Status Badge (shown on hover) */}
      <div className="absolute bottom-4 right-6 bg-foreground/80 backdrop-blur text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover/editor:opacity-100 transition-opacity">
        Markdown
      </div>
    </section>
  )
}

import { CheckCircle } from 'lucide-react'

export function PreviewPane() {
  return (
    <section className="flex flex-col bg-muted/50 overflow-y-auto h-full editor-scrollbar">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-transparent bg-muted/50 sticky top-0 z-10">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Preview
        </span>
        <div className="flex gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CheckCircle className="size-3.5 text-emerald-500" />
            Saved
          </span>
        </div>
      </div>

      {/* Preview Content Placeholder */}
      <div className="max-w-[720px] mx-auto w-full p-8 pb-20">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          {/* This will be replaced with rendered markdown */}
          <div className="text-muted-foreground/50 italic">Preview content will appear here...</div>
        </article>
      </div>
    </section>
  )
}

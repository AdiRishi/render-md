import { BrandMark, Wordmark } from './Brand'

/** Server-rendered first paint: the shape of the workspace with a real intro. */
export function WorkspaceSkeleton() {
  return (
    <div className="fixed inset-0 flex flex-col bg-desk">
      <header className="flex h-13 shrink-0 items-center gap-2.5 border-b border-rule px-4">
        <BrandMark className="size-[26px]" />
        <Wordmark />
      </header>
      <div className="flex min-h-0 flex-1">
        <div className="w-1/2 border-e border-rule bg-paper max-md:hidden">
          <div className="h-10 border-b border-rule" />
          <div className="space-y-3 p-8 font-mono text-[13px] text-ink-4">
            <p># A field guide to RenderMD</p>
            <p>Paste it, drop it, or type it…</p>
          </div>
        </div>
        <div className="flex-1 overflow-hidden desk-grid px-4 pt-12 md:px-10">
          <div className="mx-auto max-w-[54rem] rounded-[3px] bg-paper px-6 py-12 shadow-paper md:px-16 md:py-16">
            <div className="doc" data-typeset="sans">
              <h1>Beautiful markdown, rendered instantly.</h1>
              <p>
                Paste it, drop it, or link it — RenderMD typesets any markdown file in your browser.
                GitHub Flavored Markdown, Mermaid diagrams, LaTeX math, syntax highlighting for 200+
                languages, private share links and clean PDF export. No ads, no sign-up.
              </p>
              <div className="animate-pulse space-y-3 pt-4">
                <div className="h-4 w-full rounded bg-paper-3" />
                <div className="h-4 w-5/6 rounded bg-paper-3" />
                <div className="h-4 w-2/3 rounded bg-paper-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

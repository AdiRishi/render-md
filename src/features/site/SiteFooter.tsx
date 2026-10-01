import { BrandMark } from '@/ui/brand'

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-8 text-[13px] text-ink-3">
        <span className="flex items-center gap-2">
          <BrandMark className="size-4" /> RenderMD
        </span>
        <span>Free, private, no ads. Everything renders in your browser.</span>
        <a
          href="https://github.com/AdiRishi/render-md"
          className="ms-auto underline decoration-rule-strong underline-offset-4 hover:text-ink"
        >
          Source on GitHub
        </a>
      </div>
    </footer>
  )
}

import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button'

export function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center desk-grid p-6">
      <div className="relative w-full max-w-lg rounded-[3px] bg-paper px-10 py-14 shadow-paper">
        <p className="label-caps text-proof">Error 404 · Page not found</p>
        <h1 className="mt-4 font-display text-6xl leading-[1.02] tracking-tight text-ink">
          This page was
          <br />
          <em className="text-ink-3 line-through decoration-proof decoration-2">never written.</em>
        </h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ink-2">
          The link may be mistyped, or the page has moved. Your documents are safe.
        </p>
        <Link to="/" className={cn(buttonVariants({ size: 'lg' }), 'mt-8')}>
          <ArrowLeft /> Back to the editor
        </Link>
      </div>
    </div>
  )
}

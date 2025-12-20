import { memo } from 'react'
import { CheckCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { type PluggableList } from 'unified'
import 'katex/dist/katex.min.css'
import { markdownComponents } from './markdown'

interface PreviewPaneProps {
  markdown: string
}

// Static plugin arrays - defined outside component since they never change
const remarkPlugins: PluggableList = [remarkGfm, remarkMath]
const rehypePlugins: PluggableList = [rehypeKatex]

function PreviewPaneComponent({ markdown }: PreviewPaneProps) {
  return (
    <section className="flex flex-col bg-muted/50 overflow-y-auto h-full editor-scrollbar">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-2 border-b border-transparent bg-muted/50 sticky top-0 z-10 h-[45px]">
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

      {/* Preview Content */}
      <div className="max-w-[720px] mx-auto w-full p-8 pb-20">
        <article className="max-w-none">
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={markdownComponents}
          >
            {markdown}
          </ReactMarkdown>
        </article>
      </div>
    </section>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const PreviewPane = memo(PreviewPaneComponent)

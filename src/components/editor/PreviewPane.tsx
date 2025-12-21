import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { type PluggableList } from 'unified'
import 'katex/dist/katex.min.css'
import { markdownComponents } from './markdown/markdown-components'

interface PreviewPaneProps {
  markdown: string
}

// Static plugin arrays - defined outside component since they never change
const remarkPlugins: PluggableList = [remarkGfm, remarkMath]
const rehypePlugins: PluggableList = [rehypeKatex]

function PreviewPaneComponent({ markdown }: PreviewPaneProps) {
  return (
    <section className="flex flex-col bg-muted/50 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 py-2.5 border-b border-border shrink-0">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Preview
        </span>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden editor-scrollbar">
        <div className="max-w-[720px] mx-auto w-full p-4 pb-20 md:p-8 md:pb-20">
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
      </div>
    </section>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const PreviewPane = memo(PreviewPaneComponent)

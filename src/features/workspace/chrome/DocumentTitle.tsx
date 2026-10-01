import { guessTitle } from '@/features/markdown/engine/source'

import { type DocumentSource, useDocumentStore } from '../state/document-store'

const SOURCE_LABEL: Record<DocumentSource, string> = {
  sample: 'Field guide',
  local: 'Draft',
  file: 'File',
  url: 'Web',
  shared: 'Shared',
}

export function DocumentTitle() {
  const markdown = useDocumentStore((state) => state.markdown)
  const name = useDocumentStore((state) => state.name)
  const source = useDocumentStore((state) => state.source)
  const title = name ?? guessTitle(markdown) ?? 'Untitled'

  return (
    <div className="flex min-w-0 items-center gap-2.5 max-lg:hidden">
      <span className="h-4 w-px rotate-[18deg] bg-rule-strong" aria-hidden />
      <span className="truncate text-[13px] font-medium text-ink-2" title={title}>
        {title}
      </span>
      <span className="shrink-0 rounded-[4px] px-1.5 py-0.5 label-caps text-[9.5px] text-ink-3 shadow-[inset_0_0_0_1px_var(--rule-strong)]">
        {SOURCE_LABEL[source]}
      </span>
    </div>
  )
}

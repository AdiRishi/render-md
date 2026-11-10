import { guessTitle } from '@/features/markdown/engine/source'

import { type DocumentSource, useDocumentStore } from '../state/document-store'

const SOURCE_LABEL: Record<DocumentSource, string> = {
  sample: 'Sample',
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
      <span className="shrink-0 label-caps text-ink-3">{SOURCE_LABEL[source]}</span>
    </div>
  )
}

import { FormattingToolbar } from '@/features/editor/FormattingToolbar'
import { MarkdownEditor } from '@/features/editor/MarkdownEditor'

import { useDocumentStore } from '../state/document-store'
import { useUiStore } from '../state/ui-store'

/** The writing side of the workspace: toolbar + editor bound to the document. */
export function EditorPane() {
  const markdown = useDocumentStore((state) => state.markdown)
  const setMarkdown = useDocumentStore((state) => state.setMarkdown)
  // A fresh editor per loaded document: undo history must never cross files.
  const loadKey = useDocumentStore((state) => state.loadKey)
  const setCursor = useUiStore((state) => state.setCursor)

  return (
    <div className="flex h-full min-h-0 flex-col bg-paper">
      <FormattingToolbar />
      <div className="min-h-0 flex-1">
        <MarkdownEditor
          key={loadKey}
          value={markdown}
          onChange={setMarkdown}
          onCursorChange={setCursor}
        />
      </div>
    </div>
  )
}

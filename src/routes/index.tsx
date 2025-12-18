import { createFileRoute } from '@tanstack/react-router'

import { EditorLayout } from '@/components/editor/EditorLayout'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return <EditorLayout />
}

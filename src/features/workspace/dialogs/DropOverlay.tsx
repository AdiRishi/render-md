import { CropMarks } from '@/ui/CropMarks'

import { useUiStore } from '../state/ui-store'

export function DropOverlay() {
  const dragging = useUiStore((state) => state.dragging)
  if (!dragging) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] grid animate-in place-items-center bg-desk/80 p-6 backdrop-blur-sm duration-150 fade-in-0">
      <div className="relative w-full max-w-lg animate-in rounded-[3px] bg-paper px-10 py-14 text-center shadow-float duration-200 zoom-in-95">
        <CropMarks size={16} className="border-proof" />
        <p className="label-caps text-proof">Release to open</p>
        <p className="mt-4 font-display text-6xl leading-none tracking-tight text-ink italic">
          Drop to render.
        </p>
        <p className="mt-5 text-sm text-ink-3">Markdown or plain text · stays on your device</p>
      </div>
    </div>
  )
}

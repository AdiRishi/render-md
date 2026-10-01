import { type KeyboardEvent, type PointerEvent } from 'react'

import { useSettingsStore } from '../state/settings-store'

/** Draggable divider */
const clamp = (value: number) => Math.min(0.78, Math.max(0.22, value))

export function SplitDivider({
  containerRef,
  onDragChange,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>
  onDragChange: (dragging: boolean) => void
}) {
  const splitRatio = useSettingsStore((state) => state.splitRatio)
  const setSetting = useSettingsStore((state) => state.set)

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    onDragChange(true)
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setSetting('splitRatio', clamp((event.clientX - rect.left) / rect.width))
  }
  const onPointerUp = () => onDragChange(false)
  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.shiftKey ? 0.1 : 0.02
    if (event.key === 'ArrowLeft') setSetting('splitRatio', clamp(splitRatio - step))
    if (event.key === 'ArrowRight') setSetting('splitRatio', clamp(splitRatio + step))
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize editor and preview"
      aria-valuenow={Math.round(splitRatio * 100)}
      aria-valuemin={22}
      aria-valuemax={78}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onDoubleClick={() => setSetting('splitRatio', 0.5)}
      onKeyDown={onKeyDown}
      title="Drag to resize · double-click to reset"
      className="group relative z-10 -mx-1 w-2 shrink-0 cursor-col-resize touch-none outline-none max-md:hidden"
    >
      <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-rule transition-colors group-hover:bg-proof group-focus-visible:bg-proof group-active:bg-proof" />
      <span className="absolute top-1/2 left-1/2 h-8 w-1 -translate-1/2 rounded-full bg-rule-strong opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}

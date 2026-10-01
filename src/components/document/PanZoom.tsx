import { Minus, Plus, RotateCcw } from 'lucide-react'
import { type PointerEvent, type WheelEvent, useRef, useState } from 'react'

type Transform = { x: number; y: number; scale: number }
const IDENTITY: Transform = { x: 0, y: 0, scale: 1 }
const clamp = (value: number) => Math.min(8, Math.max(0.2, value))

/** Drag to pan, wheel/pinch to zoom around the pointer. */
export function PanZoom({ svg }: { svg: string }) {
  const [transform, setTransform] = useState(IDENTITY)
  const drag = useRef<{ x: number; y: number; origin: Transform } | null>(null)
  const surface = useRef<HTMLDivElement>(null)

  function zoomAt(factor: number, clientX?: number, clientY?: number) {
    setTransform((current) => {
      const rect = surface.current?.getBoundingClientRect()
      const scale = clamp(current.scale * factor)
      if (!rect || clientX === undefined || clientY === undefined) return { ...current, scale }
      const px = clientX - rect.left - rect.width / 2
      const py = clientY - rect.top - rect.height / 2
      const ratio = scale / current.scale
      return { scale, x: px - (px - current.x) * ratio, y: py - (py - current.y) * ratio }
    })
  }

  const onWheel = (event: WheelEvent) => {
    zoomAt(Math.exp(-event.deltaY * (event.ctrlKey ? 0.01 : 0.0018)), event.clientX, event.clientY)
  }

  const onPointerDown = (event: PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { x: event.clientX, y: event.clientY, origin: transform }
  }
  const onPointerMove = (event: PointerEvent) => {
    const start = drag.current
    if (!start) return
    setTransform({
      ...start.origin,
      x: start.origin.x + event.clientX - start.x,
      y: start.origin.y + event.clientY - start.y,
    })
  }
  const onPointerUp = () => {
    drag.current = null
  }

  return (
    <div className="relative h-full overflow-hidden">
      <div
        ref={surface}
        className="grid h-full cursor-grab touch-none place-items-center desk-grid active:cursor-grabbing"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={() => setTransform(IDENTITY)}
      >
        <div
          className="[&_svg]:h-auto [&_svg]:max-h-[78vh] [&_svg]:max-w-[86vw]"
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: 'center',
          }}
          // Mermaid output is sanitized by Mermaid itself (securityLevel: strict).
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-paper p-1 shadow-float">
        <button
          className="grid size-8 place-items-center rounded-full hover:bg-desk-2"
          onClick={() => zoomAt(1 / 1.25)}
          aria-label="Zoom out"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-12 text-center font-mono text-[11px] text-ink-2 tabular-nums">
          {Math.round(transform.scale * 100)}%
        </span>
        <button
          className="grid size-8 place-items-center rounded-full hover:bg-desk-2"
          onClick={() => zoomAt(1.25)}
          aria-label="Zoom in"
        >
          <Plus className="size-4" />
        </button>
        <button
          className="grid size-8 place-items-center rounded-full hover:bg-desk-2"
          onClick={() => setTransform(IDENTITY)}
          aria-label="Reset zoom"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

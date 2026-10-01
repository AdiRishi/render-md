import { type RefObject, useEffect, useState } from 'react'

/** Reading progress */
export function ReadingProgress({ scrollRef }: { scrollRef: RefObject<HTMLDivElement | null> }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const scroller = scrollRef.current
    if (!scroller) return
    const update = () => {
      const max = scroller.scrollHeight - scroller.clientHeight
      setProgress(max > 0 ? scroller.scrollTop / max : 0)
    }
    update()
    scroller.addEventListener('scroll', update, { passive: true })
    return () => scroller.removeEventListener('scroll', update)
  }, [scrollRef])

  return (
    <div className="pointer-events-none sticky top-0 z-10 h-0.5 print:hidden" aria-hidden>
      <div
        className="h-full origin-left bg-proof transition-transform duration-75"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}

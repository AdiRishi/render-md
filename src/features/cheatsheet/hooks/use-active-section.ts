import { useEffect, useState } from 'react'

import { SECTIONS } from '../content'

/** Every navigable anchor on the page, in document order. */
export const NAV_IDS = ['quick-reference', ...SECTIONS.map((section) => section.id), 'faq']

/** Which section the reader is in — the last one whose top has scrolled past the header. */
export function useActiveSection() {
  const [active, setActive] = useState<string>(NAV_IDS[0])
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      let current = NAV_IDS[0]
      for (const id of NAV_IDS) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= 140) current = id
      }
      setActive(current)
    }
    const onScroll = () => {
      frame ||= requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return active
}

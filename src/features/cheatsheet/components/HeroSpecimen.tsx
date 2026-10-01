import { type Root } from 'hast'

import { DocumentView } from '@/features/markdown/render/DocumentView'
import { CropMarks } from '@/ui/crop-marks'

import { HERO_SOURCE } from '../data'

export function HeroSpecimen({ hast }: { hast: Root }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-1/2 right-[max(1.25rem,calc(50%-36rem))] hidden w-[25rem] -translate-y-1/2 lg:block print:hidden"
    >
      <pre className="ms-10 -rotate-2 animate-rise rounded-lg bg-ink px-5 py-4 font-mono text-[12px] leading-[1.75] whitespace-pre-wrap text-paper/80 shadow-float [animation-delay:200ms]">
        {HERO_SOURCE}
      </pre>
      <div className="relative me-4 -mt-6 rotate-[1.5deg] animate-rise rounded-[3px] bg-paper px-8 py-7 shadow-paper [animation-delay:320ms]">
        <CropMarks offset={20} size={14} />
        <DocumentView hast={hast} typeset="serif" textSize="s" />
      </div>
    </div>
  )
}

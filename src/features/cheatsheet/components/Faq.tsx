import { type Root } from 'hast'

import { DocumentView } from '@/features/markdown/render/DocumentView'

import { FAQ } from '../content'

export function Faq({ answers }: { answers: Root[] }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-24">
      <p className="label-caps text-proof">Questions</p>
      <h2
        id="faq-title"
        className="mt-2 mb-10 font-display text-[clamp(2.2rem,4.5vw,3.2rem)] leading-none tracking-[-0.015em] text-ink"
      >
        Frequently asked
      </h2>
      <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
        {FAQ.map((item, index) => (
          <div key={item.question} className="border-t border-rule pt-5">
            <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.01em] text-ink">
              {item.question}
            </h3>
            <DocumentView
              hast={answers[index]}
              textSize="s"
              className="mt-2 [&_p]:text-[15px] [&_p]:text-ink-2"
            />
          </div>
        ))}
      </div>
    </section>
  )
}

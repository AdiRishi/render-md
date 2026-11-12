import { type RenderedFragments } from '@/features/markdown/engine/render-static'
import { DocumentView } from '@/features/markdown/render/DocumentView'

/** Numbered steps, each an H3 beside an oversized numeral. */
export function Steps({
  steps,
  rendered,
}: {
  steps: Array<{ title: string; markdown: string }>
  rendered: RenderedFragments
}) {
  return (
    <ol className="max-w-[44rem]">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 border-t border-rule py-6 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[5rem_minmax(0,1fr)]"
        >
          <span
            aria-hidden
            className="font-display text-[3.5rem] leading-[0.82] text-ink-4 italic md:text-[4.5rem]"
          >
            {index + 1}
          </span>
          <div className="min-w-0">
            <h3 className="text-[19px] leading-snug font-semibold tracking-[-0.01em] text-ink">
              {step.title}
            </h3>
            <DocumentView
              hast={rendered[step.markdown]}
              textSize="s"
              className="mt-1.5 [&_p]:text-ink-2"
            />
          </div>
        </li>
      ))}
    </ol>
  )
}

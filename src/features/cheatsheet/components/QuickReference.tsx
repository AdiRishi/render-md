import { Printer } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/ui/button'
import { CopyButton } from '@/ui/copy-button'
import { CropMarks } from '@/ui/crop-marks'

import { QUICK_REFERENCE, SUPPORT_LABEL, type Support } from '../content'
import { SupportBadge } from './SupportBadge'

export function QuickReference() {
  const half = Math.ceil(QUICK_REFERENCE.length / 2)
  const columns = [QUICK_REFERENCE.slice(0, half), QUICK_REFERENCE.slice(half)]

  return (
    <section id="quick-reference" aria-labelledby="quick-reference-title" className="scroll-mt-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps text-proof">At a glance</p>
          <h2
            id="quick-reference-title"
            className="mt-2 font-display text-[clamp(2.2rem,4.5vw,3.2rem)] leading-none tracking-[-0.015em] text-ink"
          >
            Markdown syntax, quick reference
          </h2>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className={cn(buttonVariants({ variant: 'outline' }), 'print:hidden')}
        >
          <Printer /> Print this cheat sheet
        </button>
      </div>

      <div className="relative rounded-[3px] bg-paper px-5 py-6 shadow-paper md:px-10 md:py-9 print:shadow-none">
        <CropMarks offset={20} size={14} />
        <div className="grid gap-x-12 md:grid-cols-2">
          {columns.map((rows, column) => (
            <table key={column} className="w-full border-collapse text-start">
              {column === 0 ? <caption className="sr-only">Common markdown syntax</caption> : null}
              <thead className={cn(column === 1 && 'max-md:hidden')}>
                <tr>
                  <th
                    scope="col"
                    className="w-[38%] pb-3 text-start label-caps font-medium text-ink-3"
                  >
                    Element
                  </th>
                  <th scope="col" className="pb-3 text-start label-caps font-medium text-ink-3">
                    Markdown
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.element} className="group/row border-t border-rule">
                    <th
                      scope="row"
                      className="py-2.5 pe-3 text-start align-top text-[14px] font-medium text-ink"
                    >
                      <a
                        href={`#${row.id}`}
                        className="decoration-proof underline-offset-4 hover:text-proof hover:underline"
                      >
                        {row.element}
                      </a>
                    </th>
                    <td className="py-2 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <code className="font-mono text-[12.5px] leading-[1.9] whitespace-pre-wrap text-ink-2">
                          {row.syntax}
                        </code>
                        <CopyButton
                          value={row.syntax}
                          label={`Copy ${row.element} syntax`}
                          className="-my-0.5 opacity-0 transition-opacity group-hover/row:opacity-100 focus-visible:opacity-100 print:hidden"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>

      <dl className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-2">
        {(Object.keys(SUPPORT_LABEL) as Support[]).map((support) => (
          <div key={support} className="flex items-start gap-2.5">
            <dt className="pt-px">
              <SupportBadge support={support} />
            </dt>
            <dd className="m-0 text-[12.5px] leading-snug text-ink-3">
              {SUPPORT_LABEL[support].description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

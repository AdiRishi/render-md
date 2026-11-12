import { type UrlFormRow } from '../content'

/** The links RenderMD can open: what you paste, and what opens. */
export function UrlFormsTable({ rows }: { rows: UrlFormRow[] }) {
  return (
    <div className="rounded-[3px] bg-paper shadow-[0_0_0_1px_var(--rule)]">
      <table className="w-full border-collapse text-start">
        <caption className="sr-only">Links RenderMD can open</caption>
        <thead className="max-sm:sr-only">
          <tr>
            <th scope="col" className="px-5 pt-4 pb-3 text-start label-caps text-ink-3 md:px-7">
              You paste
            </th>
            <th scope="col" className="px-5 pt-4 pb-3 text-start label-caps text-ink-3 md:px-7">
              RenderMD opens
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.paste}
              className="border-t border-rule max-sm:block max-sm:px-5 max-sm:py-3.5 max-sm:first:border-t-0"
            >
              <th
                scope="row"
                className="text-start align-top font-mono text-[13px] leading-6 font-normal break-all text-ink max-sm:block sm:w-[56%] sm:px-5 sm:py-3 md:px-7"
              >
                {row.paste}
              </th>
              <td className="align-top text-[14px] leading-6 text-ink-2 max-sm:mt-1 max-sm:block sm:px-5 sm:py-3 md:px-7">
                <span aria-hidden className="me-2 font-mono text-ink-4">
                  →
                </span>
                {row.opens}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

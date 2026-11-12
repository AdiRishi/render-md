import { type Root } from 'hast'
import { ArrowUpRight, RotateCcw } from 'lucide-react'
import { useEffect, useState } from 'react'

import { stripHeadingIds } from '@/features/markdown/engine/hast'
import { DocumentView } from '@/features/markdown/render/DocumentView'
import { type ShareOrigin } from '@/lib/share-link'
import { CopyButton } from '@/ui/copy-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

/** One example: its markdown, and an optional caption for the variant it shows. */
export type SpecimenEntry = {
  /** Optional caption for this variant, e.g. "Alignment". */
  label?: string
  source: string
}

async function openInEditor(source: string, origin: ShareOrigin) {
  const { createShareUrl } = await import('@/lib/share-link')
  window.location.assign(
    await createShareUrl(source, window.location.origin, { view: 'split', from: origin }),
  )
}

/**
 * A live markdown example: editable source beside its rendered result. It
 * starts from HAST rendered on the server and re-renders edits in the worker.
 */
export function Specimen({
  entry,
  hast,
  origin,
}: {
  entry: SpecimenEntry
  hast: Root
  /** Which page made the "Open in the editor" link, for analytics. */
  origin: ShareOrigin
}) {
  const [source, setSource] = useState(entry.source)
  const [rendered, setRendered] = useState(hast)
  const edited = source !== entry.source

  // Edits re-render live through the same worker the editor uses.
  useEffect(() => {
    // The SSR branch keeps the worker bundle out of the server build.
    if (import.meta.env.SSR || source === entry.source) return
    let active = true
    const timer = setTimeout(() => {
      void import('@/features/markdown/worker/client')
        .then(({ renderInBackground }) => renderInBackground(source))
        .then(
          (result) => active && setRendered(stripHeadingIds(result.hast)),
          () => undefined,
        )
    }, 120)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [source, entry.source])

  const iconButton =
    'inline-grid size-7 place-items-center rounded-md text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink'

  return (
    <figure className="group/specimen m-0 break-inside-avoid">
      {entry.label ? (
        <figcaption className="mb-2.5 text-[13px] font-medium text-ink-2">{entry.label}</figcaption>
      ) : null}
      <div className="grid overflow-hidden rounded-[3px] bg-paper shadow-[0_0_0_1px_var(--rule)] md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <div className="flex min-w-0 flex-col border-rule bg-paper-2 max-md:border-b md:border-e">
          <div className="flex h-9 items-center gap-2 ps-4 pe-1.5">
            <span className="label-caps text-ink-3">Markdown</span>
            {edited ? (
              <span className="rounded-sm px-1.5 py-0.5 label-caps text-ink-2 shadow-[inset_0_0_0_1px_var(--rule-strong)]">
                Edited
              </span>
            ) : (
              <span className="label-caps text-ink-3 opacity-0 transition-opacity group-hover/specimen:opacity-100 print:hidden">
                · Click to edit
              </span>
            )}
            <span className="ms-auto flex items-center print:hidden">
              {edited ? (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <button
                        type="button"
                        aria-label="Reset example"
                        className={iconButton}
                        onClick={() => {
                          setSource(entry.source)
                          setRendered(hast)
                        }}
                      />
                    }
                  >
                    <RotateCcw className="size-3.5" />
                  </TooltipTrigger>
                  <TooltipContent>Reset example</TooltipContent>
                </Tooltip>
              ) : null}
              <CopyButton value={source} label="Copy markdown" />
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Open in the editor"
                      className={iconButton}
                      onClick={() => void openInEditor(source, origin)}
                    />
                  }
                >
                  <ArrowUpRight className="size-4" />
                </TooltipTrigger>
                <TooltipContent>Open in the editor</TooltipContent>
              </Tooltip>
            </span>
          </div>
          <textarea
            value={source}
            onChange={(event) => setSource(event.target.value)}
            spellCheck={false}
            aria-label={`Markdown example${entry.label ? `: ${entry.label}` : ''}`}
            className="[field-sizing:content] min-h-16 w-full flex-1 resize-none bg-transparent px-4 pt-1 pb-5 font-mono text-[13px] leading-[1.75] text-ink-2 outline-none focus:text-ink"
          />
        </div>
        <div className="min-w-0">
          <div className="flex h-9 items-center px-5 md:px-7">
            <span className="label-caps text-ink-3">Result</span>
          </div>
          <div className="px-5 pt-1 pb-6 md:px-7">
            <DocumentView hast={rendered} textSize="s" />
          </div>
        </div>
      </div>
    </figure>
  )
}

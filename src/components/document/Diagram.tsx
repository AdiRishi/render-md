import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Download, Maximize2, TriangleAlert, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useTheme } from '@/components/theme-provider'
import { downloadFile } from '@/lib/file-system'
import { renderMermaid } from '@/lib/mermaid'
import { useSettingsStore } from '@/stores/settings-store'

import { CopyButton } from './CopyButton'
import { PanZoom } from './PanZoom'

type DiagramState =
  | { status: 'loading'; svg: string | null }
  | { status: 'ready'; svg: string }
  | { status: 'error'; svg: string | null; message: string }

const actionClass =
  'inline-grid size-7 place-items-center rounded-md text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink disabled:opacity-40'

export function Diagram({ code, line }: { code: string; line?: number }) {
  const { resolved } = useTheme()
  const look = useSettingsStore((state) => state.diagramLook)
  const [state, setState] = useState<DiagramState>({ status: 'loading', svg: null })
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    let active = true
    // Debounce so typing inside a diagram doesn't queue a render per keystroke.
    const timer = setTimeout(() => {
      renderMermaid(code, resolved, look).then(
        (svg) => active && setState({ status: 'ready', svg }),
        (error: unknown) =>
          active &&
          setState((previous) => ({
            status: 'error',
            svg: previous.svg,
            message: error instanceof Error ? error.message : 'This diagram could not be rendered.',
          })),
      )
    }, 220)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [code, resolved, look])

  const svg = state.svg

  return (
    <figure className="diagram" data-line={line}>
      <figcaption className="code-block-header">
        <span>Mermaid</span>
        {state.status === 'error' ? (
          <span className="flex items-center gap-1.5 tracking-normal text-[color:var(--alert-caution)] normal-case">
            <TriangleAlert className="size-3.5" /> Syntax error
          </span>
        ) : null}
        <span className="diagram-actions ms-auto flex items-center">
          <button
            type="button"
            className={actionClass}
            disabled={!svg}
            onClick={() => setExpanded(true)}
            aria-label="Expand diagram"
            title="Expand"
          >
            <Maximize2 className="size-3.5" />
          </button>
          <button
            type="button"
            className={actionClass}
            disabled={!svg}
            onClick={() => svg && downloadFile('diagram.svg', svg, 'image/svg+xml')}
            aria-label="Download SVG"
            title="Download SVG"
          >
            <Download className="size-3.5" />
          </button>
          <CopyButton value={code} label="Copy source" />
        </span>
      </figcaption>

      {svg ? (
        <div
          className="diagram-canvas transition-opacity duration-200"
          style={{ opacity: state.status === 'ready' ? 1 : 0.45 }}
          // Sanitized by Mermaid (securityLevel: strict).
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : state.status === 'loading' ? (
        <div className="diagram-canvas">
          <div className="h-40 w-full animate-pulse rounded-lg bg-paper-3/60" />
        </div>
      ) : null}

      {state.status === 'error' ? (
        <pre className="!py-3 font-mono text-xs whitespace-pre-wrap text-ink-2">
          {state.message}
        </pre>
      ) : null}

      <DialogPrimitive.Root open={expanded} onOpenChange={setExpanded}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
          <DialogPrimitive.Popup className="fixed inset-3 z-50 overflow-hidden rounded-2xl bg-paper shadow-float transition-[opacity,scale] duration-200 outline-none data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0 md:inset-8">
            <DialogPrimitive.Title className="sr-only">Diagram</DialogPrimitive.Title>
            {svg ? <PanZoom svg={svg} /> : null}
            <DialogPrimitive.Close
              className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-paper text-ink-2 shadow-float hover:text-ink"
              aria-label="Close"
            >
              <X className="size-4" />
            </DialogPrimitive.Close>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </figure>
  )
}

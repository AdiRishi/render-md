import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { Copy, Download, FileCode2, FileImage, Maximize2, TriangleAlert, X } from 'lucide-react'
import { use, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useTheme } from '@/features/theme/ThemeProvider'
import { downloadFile } from '@/lib/download'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

import { DocumentContext } from '../context'
import { diagramBackground, renderMermaid } from './mermaid'
import { PanZoom } from './PanZoom'
import { svgToPng } from './png'

type DiagramState =
  | { status: 'loading'; svg: string | null }
  | { status: 'ready'; svg: string }
  | { status: 'error'; svg: string | null; message: string }

const actionClass =
  'inline-grid size-7 place-items-center rounded-md text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink disabled:opacity-40'

export function Diagram({ code, line }: { code: string; line?: number }) {
  const { resolved } = useTheme()
  const look = use(DocumentContext).diagramLook ?? 'clean'
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

  async function renderPng() {
    const flat = await renderMermaid(code, resolved, look, { htmlLabels: false })
    return svgToPng(flat, diagramBackground(resolved))
  }

  async function downloadPng() {
    try {
      downloadFile('diagram.png', await renderPng())
    } catch {
      toast.error('This diagram could not be exported as PNG.')
    }
  }

  async function copyPng() {
    try {
      // Hand the clipboard a promise so Safari still counts this as part of the click.
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': renderPng() })])
      toast.success('Copied diagram as image')
    } catch {
      toast.error('This diagram could not be copied as an image.')
    }
  }

  async function copySource() {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Copied Mermaid source')
    } catch {
      toast.error('Clipboard access was blocked')
    }
  }

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
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={actionClass}
                  disabled={!svg}
                  aria-label="Download diagram"
                  title="Download"
                />
              }
            >
              <Download className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => void downloadPng()}>
                <FileImage />
                Image (.png)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => svg && downloadFile('diagram.svg', svg, 'image/svg+xml')}
              >
                <FileCode2 />
                Vector (.svg)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={actionClass}
                  aria-label="Copy diagram"
                  title="Copy"
                />
              }
            >
              <Copy className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem disabled={!svg} onClick={() => void copyPng()}>
                <FileImage />
                Image (.png)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void copySource()}>
                <FileCode2 />
                Mermaid source
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

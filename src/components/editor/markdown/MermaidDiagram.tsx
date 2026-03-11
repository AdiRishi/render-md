import '@excalidraw/excalidraw/index.css'
import { Excalidraw, convertToExcalidrawElements, exportToSvg } from '@excalidraw/excalidraw'
import { parseMermaidToExcalidraw } from '@excalidraw/mermaid-to-excalidraw'
import { Check, Copy, Maximize2, TriangleAlert, X } from 'lucide-react'
import { startTransition, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

type MermaidDiagramProps = {
  code: string
  sourceLine?: number
}

type MermaidRenderState =
  | { status: 'loading' }
  | { status: 'ready' }
  | { status: 'error'; message: string }

type MermaidScene = {
  elements: ReturnType<typeof convertToExcalidrawElements>
  files: Awaited<ReturnType<typeof parseMermaidToExcalidraw>>['files'] | null
}

const MERMAID_CONFIG = {
  flowchart: {
    curve: 'linear',
  },
  themeVariables: {
    fontSize: '20px',
  },
  maxEdges: 500,
  maxTextSize: 50_000,
} as const

const mermaidSceneCache = new Map<string, Promise<MermaidScene>>()

let mermaidParseQueue: Promise<void> = Promise.resolve()

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Unable to render this Mermaid diagram.'
}

function enqueueMermaidTask<T>(task: () => Promise<T>) {
  const result = mermaidParseQueue.then(task, task)
  mermaidParseQueue = result.then(
    () => undefined,
    () => undefined,
  )
  return result
}

function getMermaidScene(code: string) {
  const cachedScene = mermaidSceneCache.get(code)

  if (cachedScene) {
    return cachedScene
  }

  const scenePromise = enqueueMermaidTask(async () => {
    const { elements: skeletons, files } = await parseMermaidToExcalidraw(code, MERMAID_CONFIG)

    return {
      elements: convertToExcalidrawElements(skeletons),
      files: files ?? null,
    }
  })

  mermaidSceneCache.set(code, scenePromise)
  scenePromise.catch(() => {
    mermaidSceneCache.delete(code)
  })

  return scenePromise
}

export function MermaidDiagram({ code, sourceLine }: MermaidDiagramProps) {
  const { theme } = useTheme()
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [renderState, setRenderState] = useState<MermaidRenderState>({ status: 'loading' })
  const [scene, setScene] = useState<MermaidScene | null>(null)
  const svgHostRef = useRef<HTMLDivElement | null>(null)
  const svgRef = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    let cancelled = false

    startTransition(() => {
      setRenderState({ status: 'loading' })
      setScene(null)
    })

    async function renderDiagram() {
      try {
        const nextScene = await getMermaidScene(code)

        const svg = await exportToSvg({
          elements: nextScene.elements,
          files: nextScene.files,
          exportPadding: 24,
          appState: {
            exportWithDarkMode: theme === 'dark',
            viewBackgroundColor: theme === 'dark' ? '#020617' : '#ffffff',
          },
        })

        svg.setAttribute('role', 'img')
        svg.setAttribute('aria-label', 'Mermaid diagram rendered with Excalidraw')
        svg.style.display = 'block'
        svg.style.height = 'auto'
        svg.style.maxWidth = '100%'

        if (cancelled) {
          return
        }

        svgRef.current = svg

        startTransition(() => {
          setScene(nextScene)
          setRenderState({ status: 'ready' })
        })
      } catch (error) {
        if (cancelled) {
          return
        }

        startTransition(() => {
          setRenderState({ status: 'error', message: getErrorMessage(error) })
        })
      }
    }

    void renderDiagram()

    return () => {
      cancelled = true
    }
  }, [code, theme])

  useEffect(() => {
    const host = svgHostRef.current

    if (!host) {
      return
    }

    if (renderState.status !== 'ready' || !svgRef.current) {
      host.replaceChildren()
      return
    }

    host.replaceChildren(svgRef.current.cloneNode(true))
  }, [renderState])

  useEffect(() => {
    if (!expanded) {
      return
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [expanded])

  const onCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      data-source-line={sourceLine}
      className="my-4 overflow-hidden rounded-xl border border-border/60 bg-background shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/50 px-3 py-2">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
          Mermaid
        </div>

        <div className="flex items-center gap-1">
          <Button
            onClick={() => setExpanded(true)}
            variant="ghost"
            size="icon-xs"
            className="shrink-0"
            aria-label="Expand Mermaid diagram"
            title="Expand Mermaid diagram"
            disabled={renderState.status !== 'ready'}
          >
            <Maximize2 className="size-4" />
          </Button>

          <Button
            onClick={onCopy}
            variant="ghost"
            size="icon-xs"
            className="shrink-0"
            aria-label="Copy Mermaid source"
            title="Copy Mermaid source"
          >
            {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </div>

      {renderState.status === 'loading' ? (
        <div className="space-y-3 p-4">
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="h-48 animate-pulse rounded-xl border border-dashed border-border/60 bg-muted/40" />
        </div>
      ) : null}

      {renderState.status === 'error' ? (
        <div className="space-y-3 p-4">
          <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-950 dark:text-amber-100">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <div>
              <p className="font-medium">Mermaid diagram could not be rendered.</p>
              <p className="mt-1 text-xs opacity-90">{renderState.message}</p>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed text-foreground">
            <code>{code}</code>
          </pre>
        </div>
      ) : null}

      {renderState.status === 'ready' ? (
        <div className="overflow-x-auto bg-slate-50/70 p-4 dark:bg-slate-950/70">
          <div ref={svgHostRef} className="mx-auto w-fit min-w-full sm:min-w-0" />
        </div>
      ) : null}

      {expanded && scene
        ? createPortal(
            <div
              className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm"
              onClick={() => setExpanded(false)}
            >
              <div
                className="absolute inset-3 overflow-hidden rounded-2xl border border-border/70 bg-background shadow-2xl md:inset-6"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Mermaid
                    </div>
                    <div className="hidden text-xs text-muted-foreground/80 md:block">
                      Drag to pan, scroll to zoom
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      onClick={onCopy}
                      variant="ghost"
                      size="icon-xs"
                      className="shrink-0"
                      aria-label="Copy Mermaid source"
                      title="Copy Mermaid source"
                    >
                      {copied ? (
                        <Check className="size-4 text-emerald-500" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>

                    <Button
                      onClick={() => setExpanded(false)}
                      variant="ghost"
                      size="icon-xs"
                      className="shrink-0"
                      aria-label="Close expanded Mermaid diagram"
                      title="Close expanded Mermaid diagram"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="h-[calc(100%-57px)]">
                  <Excalidraw
                    key={`${code}-${theme}`}
                    initialData={{
                      elements: scene.elements,
                      files: scene.files ?? undefined,
                      appState: {
                        viewBackgroundColor: theme === 'dark' ? '#020617' : '#ffffff',
                        zenModeEnabled: true,
                        viewModeEnabled: true,
                      },
                      scrollToContent: true,
                    }}
                    theme={theme}
                    viewModeEnabled
                    zenModeEnabled
                    gridModeEnabled={false}
                    handleKeyboardGlobally={false}
                  />
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'

import { type RenderResult } from '../engine/pipeline'

type RenderInput = { markdown: string; baseUrl: string | null }

/**
 * Renders markdown in a worker. While a render is in flight, newer input is
 * coalesced so only the latest text is rendered next — the preview never
 * falls further behind than one render. `pending` is true until the result
 * (or error) matches the current input.
 */
export function useRenderedMarkdown(markdown: string, baseUrl: string | null) {
  const [result, setResult] = useState<RenderResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [renderedInput, setRenderedInput] = useState<RenderInput | null>(null)
  const inFlight = useRef(false)
  const queued = useRef<RenderInput | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    // Effects never run on the server; the SSR branch keeps the worker bundle,
    // with its copy of every grammar, out of the server build.
    if (import.meta.env.SSR) return
    queued.current = { markdown, baseUrl }
    if (inFlight.current) return

    const pump = async () => {
      while (queued.current && mounted.current) {
        const next = queued.current
        queued.current = null
        inFlight.current = true
        try {
          const { renderInBackground } = await import('./client')
          const rendered = await renderInBackground(next.markdown, { baseUrl: next.baseUrl })
          if (mounted.current) {
            setResult(rendered)
            setError(null)
          }
        } catch (renderError) {
          if (mounted.current) {
            setError(renderError instanceof Error ? renderError.message : String(renderError))
          }
        } finally {
          if (mounted.current) setRenderedInput(next)
          inFlight.current = false
        }
      }
    }
    void pump()
  }, [markdown, baseUrl])

  const pending = renderedInput?.markdown !== markdown || renderedInput.baseUrl !== baseUrl
  return { result, error, pending }
}

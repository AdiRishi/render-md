import { useEffect, useRef, useState } from 'react'

import { renderInBackground } from '@/lib/markdown/client'
import { type RenderResult } from '@/lib/markdown/pipeline'

/**
 * Renders markdown in a worker. While a render is in flight, newer input is
 * coalesced so only the latest text is rendered next — the preview never
 * falls further behind than one render.
 */
export function useRenderedMarkdown(markdown: string, baseUrl: string | null) {
  const [result, setResult] = useState<RenderResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inFlight = useRef(false)
  const queued = useRef<{ markdown: string; baseUrl: string | null } | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    queued.current = { markdown, baseUrl }
    if (inFlight.current) return

    const pump = async () => {
      while (queued.current && mounted.current) {
        const next = queued.current
        queued.current = null
        inFlight.current = true
        try {
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
          inFlight.current = false
        }
      }
    }
    void pump()
  }, [markdown, baseUrl])

  return { result, error }
}

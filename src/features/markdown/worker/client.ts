import { type RenderOptions, type RenderResult } from '../engine/pipeline'
import { type RenderRequest, type RenderResponse } from './render.worker'

type Pending = {
  resolve: (result: RenderResult) => void
  reject: (error: Error) => void
}

let worker: Worker | null = null
let workerFailed = false
let nextId = 0
const pending = new Map<number, Pending>()

function getWorker() {
  if (worker || workerFailed || typeof Worker === 'undefined') return worker

  try {
    worker = new Worker(new URL('./render.worker.ts', import.meta.url), {
      type: 'module',
      name: 'markdown-renderer',
    })
    worker.addEventListener('message', ({ data }: MessageEvent<RenderResponse>) => {
      const request = pending.get(data.id)
      if (!request) return
      pending.delete(data.id)
      if (data.ok) request.resolve(data.result)
      else request.reject(new Error(data.error))
    })
    worker.addEventListener('error', (event) => {
      console.error('The markdown worker crashed; rendering on the main thread.', event.message)
      // Fall back to the main thread for this and every future render.
      workerFailed = true
      worker?.terminate()
      worker = null
      for (const [id, request] of pending) {
        pending.delete(id)
        request.reject(new Error('worker-crashed'))
      }
    })
  } catch {
    workerFailed = true
    worker = null
  }

  return worker
}

async function renderOnMainThread(markdown: string, options: RenderOptions) {
  const [{ renderMarkdown }, { highlightCodeBlocks }] = await Promise.all([
    import('../engine/pipeline'),
    import('../engine/highlight'),
  ])
  const result = renderMarkdown(markdown, options)
  await highlightCodeBlocks(result.hast)
  return result
}

/**
 * Render markdown off the main thread so typing never waits on parsing,
 * KaTeX or sanitization. Falls back to an in-thread render if workers fail.
 */
export async function renderInBackground(
  markdown: string,
  options: RenderOptions = {},
): Promise<RenderResult> {
  const target = getWorker()
  if (!target) return renderOnMainThread(markdown, options)

  const id = nextId++
  const request: RenderRequest = { id, markdown, options }

  try {
    return await new Promise<RenderResult>((resolve, reject) => {
      pending.set(id, { resolve, reject })
      target.postMessage(request)
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'worker-crashed') {
      return renderOnMainThread(markdown, options)
    }
    throw error
  }
}

import { type RenderOptions, type RenderResult, renderMarkdown } from './pipeline'

export type RenderRequest = { id: number; markdown: string; options: RenderOptions }
export type RenderResponse =
  | { id: number; ok: true; result: RenderResult }
  | { id: number; ok: false; error: string }

const scope = self as unknown as {
  addEventListener: (
    type: 'message',
    listener: (event: MessageEvent<RenderRequest>) => void,
  ) => void
  postMessage: (message: RenderResponse) => void
}

scope.addEventListener('message', ({ data }) => {
  try {
    const result = renderMarkdown(data.markdown, { ...data.options, stripPositions: true })
    scope.postMessage({ id: data.id, ok: true, result })
  } catch (error) {
    scope.postMessage({
      id: data.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    })
  }
})

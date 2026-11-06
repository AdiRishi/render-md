import { highlightCodeBlocks } from '../engine/highlight'
import { type RenderOptions, type RenderResult, renderMarkdown } from '../engine/pipeline'

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

async function render({ id, markdown, options }: RenderRequest): Promise<RenderResponse> {
  try {
    const result = renderMarkdown(markdown, { ...options, stripPositions: true })
    await highlightCodeBlocks(result.hast)
    return { id, ok: true, result }
  } catch (error) {
    return { id, ok: false, error: error instanceof Error ? error.message : String(error) }
  }
}

scope.addEventListener('message', ({ data }) => {
  void render(data).then((response) => scope.postMessage(response))
})

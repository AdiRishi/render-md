/**
 * Smoke-test the built markdown worker: load it without a DOM, as a Web Worker
 * runs, and render a document that exercises entities and math. Vite bundles
 * workers with the `browser` export condition, which can select DOM-only entry
 * points; a worker that crashes on load is otherwise invisible, because the app
 * falls back to rendering on the main thread.
 *
 * Run after `pnpm build`: `node build/check-render-worker.ts`
 */
import { readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

import type {
  RenderRequest,
  RenderResponse,
} from '../src/features/markdown/worker/render.worker.ts'

const assets = resolve('.output/public/assets')
const file = readdirSync(assets).find((name) => /^render\.worker-.+\.js$/.test(name))
if (!file) throw new Error(`No render worker bundle in ${assets}. Run \`pnpm build\` first.`)

const response = await new Promise<RenderResponse>((respond, reject) => {
  let onMessage: ((event: { data: RenderRequest }) => void) | undefined
  Object.assign(globalThis, {
    self: {
      addEventListener: (_type: 'message', listener: typeof onMessage) => {
        onMessage = listener
      },
      postMessage: respond,
    },
  })
  import(pathToFileURL(join(assets, file)).href).then(() => {
    if (!onMessage) throw new Error('The worker never listened for messages.')
    onMessage({
      data: { id: 1, markdown: '# Fish &amp; chips &copy;\n\n$e^{i\\pi}$', options: {} },
    })
  }, reject)
})

if (!response.ok) throw new Error(`The worker failed to render: ${response.error}`)
if (response.result.title !== 'Fish & chips ©') {
  throw new Error(`The worker rendered the wrong title: ${JSON.stringify(response.result.title)}`)
}
if (!JSON.stringify(response.result.hast).includes('"katex"')) {
  throw new Error('The worker rendered no KaTeX.')
}
console.log(`✓ ${file} renders without a DOM`)

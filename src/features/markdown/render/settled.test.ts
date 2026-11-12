// @vitest-environment jsdom
import { beforeAll, describe, expect, it, vi } from 'vitest'

import { whenDocumentSettled } from './settled'

beforeAll(() => {
  // jsdom has no font loading; every font counts as loaded.
  Object.defineProperty(document, 'fonts', { value: { ready: Promise.resolve() } })
})

const tick = () => new Promise((resolve) => setTimeout(resolve, 20))

function track(promise: Promise<boolean>) {
  const state: { result: boolean | null } = { result: null }
  void promise.then((result) => (state.result = result))
  return state
}

describe('whenDocumentSettled', () => {
  it('waits for every pending diagram and the render in flight', async () => {
    const root = document.createElement('div')
    root.setAttribute('aria-busy', 'true')
    root.innerHTML =
      '<article class="doc"><figure class="diagram" data-pending=""></figure></article>'
    const diagram = root.querySelector('figure')!

    const state = track(whenDocumentSettled(root))
    await tick()
    root.setAttribute('aria-busy', 'false')
    await tick()
    expect(state.result).toBeNull()

    diagram.removeAttribute('data-pending')
    await vi.waitFor(() => expect(state.result).toBe(true))
  })

  it('gives up after the timeout', async () => {
    const root = document.createElement('div')
    root.innerHTML = '<figure data-pending=""></figure>'
    expect(await whenDocumentSettled(root, { timeout: 30 })).toBe(false)
  })
})

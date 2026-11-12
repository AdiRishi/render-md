/**
 * Resolves once a rendered document has finished drawing: no render in flight
 * (`aria-busy`), no diagram still drawing (`data-pending`), fonts loaded and
 * every image decoded. Resolves `false` if that takes longer than `timeout`,
 * which a remote image that never loads can cause.
 */

const PENDING = '[aria-busy="true"], [data-pending]'

const isBusy = (root: HTMLElement) => root.matches(PENDING) || root.querySelector(PENDING) !== null

function whenIdle(root: HTMLElement) {
  return new Promise<void>((resolve) => {
    if (!isBusy(root)) return resolve()
    const observer = new MutationObserver(() => {
      if (isBusy(root)) return
      observer.disconnect()
      resolve()
    })
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['aria-busy', 'data-pending'],
    })
  })
}

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

async function whenDrawn(root: HTMLElement) {
  await whenIdle(root)
  // Fonts start loading when text is laid out, so let a frame pass before waiting on them.
  await nextFrame()
  await document.fonts.ready
  // A broken image is drawn as broken; it shouldn't hold anything up.
  await Promise.allSettled(Array.from(root.querySelectorAll('img'), (image) => image.decode()))
  await nextFrame()
}

export function whenDocumentSettled(root: HTMLElement, { timeout = 10_000 } = {}) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const expired = new Promise<false>((resolve) => {
    timer = setTimeout(() => resolve(false), timeout)
  })
  return Promise.race([whenDrawn(root).then(() => true as const), expired]).finally(() =>
    clearTimeout(timer),
  )
}

/**
 * Rasterizes a Mermaid SVG to PNG. The SVG is drawn into a canvas as an image, so
 * it can't reach the page's fonts: Hanken Grotesk is embedded as a data URL, and
 * the diagram should be rendered without HTML labels (`foreignObject` taints the
 * canvas in Safari).
 */
import hankenGroteskWoff2 from '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2?url'

let fontCss: Promise<string> | null = null

function embeddedFontCss() {
  fontCss ??= fetch(hankenGroteskWoff2)
    .then((response) => response.blob())
    .then((blob) => blobToDataUrl(blob))
    .then(
      (url) =>
        `@font-face{font-family:'Hanken Grotesk Variable';font-weight:100 900;src:url(${url}) format('woff2')}`,
    )
    .catch(() => '')
  return fontCss
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result as string))
    reader.addEventListener('error', () => reject(reader.error))
    reader.readAsDataURL(blob)
  })
}

export async function svgToPng(svg: string, background: string, scale = 2) {
  const doc = new DOMParser().parseFromString(svg, 'image/svg+xml')
  const root = doc.documentElement
  const [, , width = 0, height = 0] = (root.getAttribute('viewBox') ?? '')
    .split(/[\s,]+/)
    .map(Number)
  if (!width || !height) throw new Error('This diagram has no size to export.')

  // Mermaid sizes the SVG with `width="100%"` and an inline max-width; give it real pixels.
  root.setAttribute('width', String(width))
  root.setAttribute('height', String(height))
  root.style.removeProperty('max-width')
  const style = doc.createElementNS('http://www.w3.org/2000/svg', 'style')
  style.textContent = await embeddedFontCss()
  root.prepend(style)

  const source = new XMLSerializer().serializeToString(root)
  const image = new Image()
  image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`
  await image.decode()

  const canvas = document.createElement('canvas')
  canvas.width = Math.ceil(width * scale)
  canvas.height = Math.ceil(height * scale)
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not create an image.')
  context.fillStyle = background
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.drawImage(image, 0, 0, canvas.width, canvas.height)

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not create an image.'))),
      'image/png',
    ),
  )
}

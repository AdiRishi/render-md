/**
 * Share links carry the whole document, deflate-compressed and base64url
 * encoded, in the URL *fragment* (`/#md=…`). Fragments are never sent to a
 * server, so a shared document stays between you and whoever you send it to.
 */

export const SHARE_PARAM = 'md'

type Base64Uint8Array = Uint8Array & {
  toBase64?: (options: { alphabet: 'base64url'; omitPadding: boolean }) => string
}
type Base64Uint8ArrayConstructor = typeof Uint8Array & {
  fromBase64?: (value: string, options: { alphabet: 'base64url' }) => Uint8Array
}

function toBase64Url(bytes: Uint8Array) {
  const native = (bytes as Base64Uint8Array).toBase64
  if (native) return native.call(bytes, { alphabet: 'base64url', omitPadding: true })

  let binary = ''
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000))
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(value: string) {
  const native = (Uint8Array as Base64Uint8ArrayConstructor).fromBase64
  if (native) return native(value, { alphabet: 'base64url' })

  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='))
  return Uint8Array.from(binary, (char) => char.charCodeAt(0))
}

async function pipeThrough(bytes: Uint8Array, stream: CodecStream) {
  const response = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream))
  return new Uint8Array(await response.arrayBuffer())
}

type CodecStream = CompressionStream | DecompressionStream

export async function encodeShareFragment(markdown: string) {
  const bytes = new TextEncoder().encode(markdown)
  const compressed = await pipeThrough(bytes, new CompressionStream('deflate-raw'))
  return toBase64Url(compressed)
}

export async function decodeShareFragment(payload: string) {
  try {
    const bytes = fromBase64Url(payload)
    const decompressed = await pipeThrough(bytes, new DecompressionStream('deflate-raw'))
    return new TextDecoder('utf-8', { fatal: true }).decode(decompressed)
  } catch {
    throw new Error('This share link is incomplete or damaged.')
  }
}

export type ShareView = 'read' | 'split' | 'write'

export function readSharePayload(hash: string) {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  return params.get(SHARE_PARAM)
}

/** The view a share link asks to open in (defaults to reading). */
export function readShareView(hash: string): ShareView {
  const view = new URLSearchParams(hash.replace(/^#/, '')).get('view')
  return view === 'split' || view === 'write' ? view : 'read'
}

export async function createShareUrl(
  markdown: string,
  origin: string,
  { view = 'read' }: { view?: ShareView } = {},
) {
  const payload = await encodeShareFragment(markdown)
  return `${origin}/#${SHARE_PARAM}=${payload}${view === 'read' ? '' : `&view=${view}`}`
}

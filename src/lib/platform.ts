/** Platform detection for keyboard shortcut labels. */

export const isMac = () =>
  typeof navigator !== 'undefined' &&
  /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent)

/** The label of the primary modifier key: "⌘" on Apple platforms, "Ctrl" elsewhere. */
export const modKey = () => (isMac() ? '⌘' : 'Ctrl')

import { create } from 'zustand'

type Dialog = 'palette' | 'share' | 'open-url' | null

type UiStore = {
  dialog: Dialog
  dragging: boolean
  cursor: { line: number; column: number; selected: number } | null
  openDialog: (dialog: Exclude<Dialog, null>) => void
  closeDialog: () => void
  setDragging: (dragging: boolean) => void
  setCursor: (cursor: UiStore['cursor']) => void
}

export const useUiStore = create<UiStore>()((set) => ({
  dialog: null,
  dragging: false,
  cursor: null,
  openDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
  setDragging: (dragging) => set({ dragging }),
  setCursor: (cursor) => set({ cursor }),
}))

/** The rendered <article> currently on screen — used by export & copy. */
export const previewArticle: { current: HTMLElement | null } = { current: null }

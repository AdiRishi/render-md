import { create } from 'zustand'

type Dialog = 'palette' | 'share' | 'open-url' | 'pdf' | null

/**
 * A print in progress. `export` is ours: the print sheet waits until it is
 * ready, then opens the print dialog. `browser` was started from the
 * browser's own menu, which is already printing.
 */
export type PrintJob = 'export' | 'browser'

type UiStore = {
  dialog: Dialog
  dragging: boolean
  cursor: { line: number; column: number; selected: number } | null
  printJob: PrintJob | null
  openDialog: (dialog: Exclude<Dialog, null>) => void
  closeDialog: () => void
  setDragging: (dragging: boolean) => void
  setCursor: (cursor: UiStore['cursor']) => void
  startPrint: (job: PrintJob) => void
  endPrint: () => void
}

export const useUiStore = create<UiStore>()((set) => ({
  dialog: null,
  dragging: false,
  cursor: null,
  printJob: null,
  openDialog: (dialog) => set({ dialog }),
  closeDialog: () => set({ dialog: null }),
  setDragging: (dragging) => set({ dragging }),
  setCursor: (cursor) => set({ cursor }),
  startPrint: (printJob) => set({ printJob }),
  endPrint: () => set({ printJob: null }),
}))

/** The rendered <article> currently on screen — used by export & copy. */
export const previewArticle: { current: HTMLElement | null } = { current: null }

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type ViewMode = 'write' | 'split' | 'read'
export type Typeset = 'sans' | 'serif' | 'mono'
export type Measure = 'narrow' | 'normal' | 'wide'
export type TextSize = 's' | 'm' | 'l'
export type DiagramLook = 'clean' | 'sketch'

type Settings = {
  viewMode: ViewMode
  typeset: Typeset
  measure: Measure
  textSize: TextSize
  diagramLook: DiagramLook
  syncScroll: boolean
  showOutline: boolean
  /** Editor share of the split view, 0–1. */
  splitRatio: number
}

type SettingsStore = Settings & {
  set: <K extends keyof Settings>(key: K, value: Settings[K]) => void
}

export const DEFAULT_SETTINGS: Settings = {
  viewMode: 'split',
  typeset: 'sans',
  measure: 'normal',
  textSize: 'm',
  diagramLook: 'clean',
  syncScroll: true,
  showOutline: true,
  splitRatio: 0.5,
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      set: (key, value) => set({ [key]: value }),
    }),
    {
      name: 'render-md:settings',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: ({ set: _set, ...settings }) => settings,
    },
  ),
)

export const TYPESETS: Array<{ value: Typeset; label: string; hint: string }> = [
  { value: 'sans', label: 'Modern', hint: 'Instrument Sans' },
  { value: 'serif', label: 'Editorial', hint: 'Newsreader & Instrument Serif' },
  { value: 'mono', label: 'Technical', hint: 'Geist Mono' },
]

export const MEASURES: Record<Measure, string> = {
  narrow: '36rem',
  normal: '44rem',
  wide: '60rem',
}

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { type DiagramLook, type TextSize, type Typeset } from '@/features/markdown/render/typesets'

import { type PdfSettings, defaultPdfSettings } from '../pdf/page-setup'

export type ViewMode = 'write' | 'split' | 'read'
export type Measure = 'narrow' | 'normal' | 'wide'

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
  pdf: PdfSettings
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
  pdf: defaultPdfSettings(typeof navigator === 'undefined' ? 'en-GB' : navigator.language),
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

export const MEASURES: Record<Measure, string> = {
  narrow: '30rem',
  normal: '36rem',
  wide: '60rem',
}

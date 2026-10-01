import { BookOpen, Columns2, PenLine } from 'lucide-react'

import { cn } from '@/lib/utils'

import { type ViewMode, useSettingsStore } from '../state/settings-store'

const VIEW_MODES: Array<{ value: ViewMode; label: string; icon: typeof PenLine; mobile: boolean }> =
  [
    { value: 'write', label: 'Write', icon: PenLine, mobile: true },
    { value: 'split', label: 'Split', icon: Columns2, mobile: false },
    { value: 'read', label: 'Read', icon: BookOpen, mobile: true },
  ]

export function ViewSwitch() {
  const viewMode = useSettingsStore((state) => state.viewMode)
  const setSetting = useSettingsStore((state) => state.set)

  return (
    <div role="radiogroup" aria-label="View" className="flex rounded-lg bg-desk-2 p-0.5">
      {VIEW_MODES.map(({ value, label, icon: Icon, mobile }) => {
        const active = viewMode === value
        // On phones there's no split view; it falls back to Write.
        const mobileActive = value === 'write' && viewMode === 'split'
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setSetting('viewMode', value)}
            className={cn(
              'flex h-7 items-center gap-1.5 rounded-md px-2.5 text-[12.5px] font-medium transition-all duration-150 max-md:px-3',
              !mobile && 'max-md:hidden',
              active
                ? 'bg-paper text-ink shadow-[0_1px_2px_rgb(var(--shadow-ink)/0.14),0_0_0_1px_rgb(var(--shadow-ink)/0.06)]'
                : 'text-ink-3 hover:text-ink',
              mobileActive &&
                'max-md:bg-paper max-md:text-ink max-md:shadow-[0_1px_2px_rgb(var(--shadow-ink)/0.14),0_0_0_1px_rgb(var(--shadow-ink)/0.06)]',
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

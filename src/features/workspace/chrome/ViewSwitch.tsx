import { usePostHog } from '@posthog/react'
import { BookOpen, Columns2, PenLine } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group'

import { type ViewMode, useSettingsStore } from '../state/settings-store'

const VIEW_MODES: Array<{ value: ViewMode; label: string; icon: typeof PenLine; mobile: boolean }> =
  [
    { value: 'write', label: 'Write', icon: PenLine, mobile: true },
    { value: 'split', label: 'Split', icon: Columns2, mobile: false },
    { value: 'read', label: 'Read', icon: BookOpen, mobile: true },
  ]

export function ViewSwitch() {
  const posthog = usePostHog()
  const viewMode = useSettingsStore((state) => state.viewMode)
  const setSetting = useSettingsStore((state) => state.set)

  return (
    <ToggleGroup
      aria-label="View"
      value={[viewMode]}
      onValueChange={(next) => {
        const mode = VIEW_MODES.find((option) => option.value === next[0])
        if (mode && mode.value !== viewMode) {
          setSetting('viewMode', mode.value)
          posthog.capture('view_mode_changed', { view_mode: mode.value })
        }
      }}
      className="gap-0 rounded-lg bg-desk-2 p-0.5"
    >
      {VIEW_MODES.map(({ value, label, icon: Icon, mobile }) => (
        <ToggleGroupItem
          key={value}
          value={value}
          className={cn(
            'h-7 min-w-0 gap-1.5 px-2.5 text-[12.5px] text-ink-3 transition-all duration-150 hover:bg-transparent hover:text-ink max-md:px-3',
            'aria-pressed:bg-paper aria-pressed:text-ink aria-pressed:shadow-[0_1px_2px_rgb(var(--shadow-ink)/0.14),0_0_0_1px_rgb(var(--shadow-ink)/0.06)]',
            !mobile && 'max-md:hidden',
            // On phones there's no split view; it falls back to Write.
            value === 'write' &&
              viewMode === 'split' &&
              'max-md:bg-paper max-md:text-ink max-md:shadow-[0_1px_2px_rgb(var(--shadow-ink)/0.14),0_0_0_1px_rgb(var(--shadow-ink)/0.06)]',
          )}
        >
          <Icon className="size-3.5" />
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

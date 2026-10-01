import { Type } from 'lucide-react'

import { TYPESETS } from '@/features/markdown/render/typesets'
import { cn } from '@/lib/utils'
import { Button } from '@/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover'
import { Switch } from '@/ui/switch'
import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

import { useSettingsStore } from '../state/settings-store'

const SPECIMEN_FONT = {
  sans: 'font-sans font-semibold tracking-tight',
  serif: 'font-display',
  mono: 'font-mono font-semibold text-[19px] tracking-tight',
} as const

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[12.5px] text-ink-2">{label}</span>
      {children}
    </div>
  )
}

/** A single-choice toggle group: one option is always selected. */
function Choice<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: React.ReactNode; title?: string }>
}) {
  return (
    <ToggleGroup
      aria-label={label}
      variant="outline"
      size="sm"
      spacing={0}
      value={[value]}
      onValueChange={(next) => {
        if (next[0]) onChange(next[0] as T)
      }}
      className="w-36"
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          title={option.title}
          aria-label={option.title}
          className="h-7 flex-1 text-xs text-ink-3 aria-pressed:text-ink"
        >
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}

export function ReaderSettings() {
  const settings = useSettingsStore()

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Typeset and reading settings" />
              }
            />
          }
        >
          <Type />
        </TooltipTrigger>
        <TooltipContent side="bottom">Typeset & reading</TooltipContent>
      </Tooltip>
      <PopoverContent align="end" className="w-[22rem] gap-0 p-0">
        <div className="p-4 pb-3">
          <p className="mb-3 label-caps text-ink-3">Typeset</p>
          <div className="grid grid-cols-3 gap-2">
            {TYPESETS.map((typeset) => {
              const active = settings.typeset === typeset.value
              return (
                <button
                  key={typeset.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => settings.set('typeset', typeset.value)}
                  className={cn(
                    'group flex flex-col items-start gap-2 rounded-lg p-2.5 text-start transition-all duration-150',
                    active
                      ? 'bg-paper-2 shadow-[inset_0_0_0_1.5px_var(--ink)]'
                      : 'shadow-[inset_0_0_0_1px_var(--rule)] hover:bg-paper-2',
                  )}
                >
                  <span
                    className={cn(
                      'text-[26px] leading-none text-ink',
                      SPECIMEN_FONT[typeset.value],
                    )}
                  >
                    Aa
                  </span>
                  <span className="text-[12px] leading-tight font-medium text-ink">
                    {typeset.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-3 border-t border-rule p-4">
          <Row label="Text size">
            <Choice
              label="Text size"
              value={settings.textSize}
              onChange={(value) => settings.set('textSize', value)}
              options={[
                { value: 's', label: <span className="text-[11px]">A</span>, title: 'Small' },
                { value: 'm', label: <span className="text-[13px]">A</span>, title: 'Medium' },
                { value: 'l', label: <span className="text-[15px]">A</span>, title: 'Large' },
              ]}
            />
          </Row>
          <Row label="Line length">
            <Choice
              label="Line length"
              value={settings.measure}
              onChange={(value) => settings.set('measure', value)}
              options={[
                { value: 'narrow', label: 'S', title: 'Narrow' },
                { value: 'normal', label: 'M', title: 'Comfortable' },
                { value: 'wide', label: 'L', title: 'Wide' },
              ]}
            />
          </Row>
          <Row label="Diagrams">
            <Choice
              label="Diagram look"
              value={settings.diagramLook}
              onChange={(value) => settings.set('diagramLook', value)}
              options={[
                { value: 'clean', label: 'Clean' },
                { value: 'sketch', label: 'Sketch' },
              ]}
            />
          </Row>
        </div>

        <div className="space-y-3 border-t border-rule p-4">
          <Row label="Show outline when reading">
            <Switch
              aria-label="Show outline when reading"
              checked={settings.showOutline}
              onCheckedChange={(value) => settings.set('showOutline', value)}
            />
          </Row>
          <Row label="Sync scrolling in split view">
            <Switch
              aria-label="Sync scrolling in split view"
              checked={settings.syncScroll}
              onCheckedChange={(value) => settings.set('syncScroll', value)}
            />
          </Row>
        </div>
      </PopoverContent>
    </Popover>
  )
}

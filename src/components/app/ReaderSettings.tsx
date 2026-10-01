import { Type } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger, Segmented } from '@/components/ui/popover'
import { Tooltip } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { TYPESETS, useSettingsStore } from '@/stores/settings-store'

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

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-5 w-9 rounded-full transition-colors duration-200',
        checked ? 'bg-ink' : 'bg-rule-strong',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 left-0.5 size-4 rounded-full bg-paper shadow-sm transition-transform duration-200 ease-(--ease-out-quint)',
          checked && 'translate-x-4',
        )}
      />
    </button>
  )
}

export function ReaderSettings() {
  const settings = useSettingsStore()

  return (
    <Popover>
      <Tooltip label="Typeset & reading">
        <PopoverTrigger render={<Button size="icon" aria-label="Typeset and reading settings" />}>
          <Type />
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="w-[22rem] p-0">
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
            <Segmented
              label="Text size"
              value={settings.textSize}
              onChange={(value) => settings.set('textSize', value)}
              className="w-36"
              options={[
                { value: 's', label: <span className="text-[11px]">A</span>, title: 'Small' },
                { value: 'm', label: <span className="text-[13px]">A</span>, title: 'Medium' },
                { value: 'l', label: <span className="text-[15px]">A</span>, title: 'Large' },
              ]}
            />
          </Row>
          <Row label="Line length">
            <Segmented
              label="Line length"
              value={settings.measure}
              onChange={(value) => settings.set('measure', value)}
              className="w-36"
              options={[
                { value: 'narrow', label: 'S', title: 'Narrow' },
                { value: 'normal', label: 'M', title: 'Comfortable' },
                { value: 'wide', label: 'L', title: 'Wide' },
              ]}
            />
          </Row>
          <Row label="Diagrams">
            <Segmented
              label="Diagram look"
              value={settings.diagramLook}
              onChange={(value) => settings.set('diagramLook', value)}
              className="w-36"
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
              label="Show outline when reading"
              checked={settings.showOutline}
              onChange={(value) => settings.set('showOutline', value)}
            />
          </Row>
          <Row label="Sync scrolling in split view">
            <Switch
              label="Sync scrolling in split view"
              checked={settings.syncScroll}
              onChange={(value) => settings.set('syncScroll', value)}
            />
          </Row>
        </div>
      </PopoverContent>
    </Popover>
  )
}

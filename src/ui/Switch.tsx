import { cn } from '@/lib/cn'

/** An on/off toggle with switch semantics. */
export function Switch({
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

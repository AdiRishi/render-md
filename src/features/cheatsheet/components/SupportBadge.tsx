import { SUPPORT_LABEL, type Support } from '../content'

export function SupportBadge({ support }: { support: Support }) {
  const info = SUPPORT_LABEL[support]
  return (
    <span
      title={info.description}
      className="inline-flex h-5 shrink-0 items-center rounded-sm px-1.5 label-caps text-ink-2 shadow-[inset_0_0_0_1px_var(--rule-strong)]"
    >
      {info.label}
    </span>
  )
}

import { cn } from '@/lib/utils'

import { SUPPORT_LABEL, type Support } from '../content'

export function SupportBadge({ support }: { support: Support }) {
  const info = SUPPORT_LABEL[support]
  return (
    <span
      title={info.description}
      className={cn(
        'inline-flex h-5 shrink-0 items-center rounded-full px-2 label-caps text-[9.5px]',
        support === 'commonmark' && 'text-ink-2 shadow-[inset_0_0_0_1px_var(--rule-strong)]',
        support === 'gfm' && 'bg-ink text-paper',
        support === 'github' && 'bg-proof text-proof-ink',
        support === 'extended' && 'bg-paper-3 text-ink-2',
      )}
    >
      {info.label}
    </span>
  )
}

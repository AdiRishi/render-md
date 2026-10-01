import { ArrowDownUp } from 'lucide-react'

import { type DocumentStats } from '@/lib/markdown/stats'
import { cn, formatNumber } from '@/lib/utils'
import { useDocumentStore, usePersistStatus } from '@/stores/document-store'
import { useSettingsStore } from '@/stores/settings-store'
import { useUiStore } from '@/stores/ui-store'

const Dot = () => <span className="text-ink-4">·</span>

export function StatusBar({ stats }: { stats: DocumentStats | null }) {
  const cursor = useUiStore((state) => state.cursor)
  const source = useDocumentStore((state) => state.source)
  const saved = usePersistStatus((state) => state.saved)
  const viewMode = useSettingsStore((state) => state.viewMode)
  const syncScroll = useSettingsStore((state) => state.syncScroll)
  const setSetting = useSettingsStore((state) => state.set)

  return (
    <footer className="flex h-7 shrink-0 items-center gap-3 border-t border-rule bg-desk px-4 font-mono text-[10.5px] text-ink-3 tabular-nums max-md:hidden print:hidden">
      {stats ? (
        <span className="flex items-center gap-2">
          <span>{formatNumber(stats.words)} words</span>
          <Dot />
          <span>{formatNumber(stats.characters)} chars</span>
          <Dot />
          <span>{formatNumber(stats.lines)} lines</span>
        </span>
      ) : null}

      <span className="ms-auto flex items-center gap-3">
        {cursor && viewMode !== 'read' ? (
          <span>
            Ln {cursor.line}, Col {cursor.column}
            {cursor.selected > 0 ? ` (${formatNumber(cursor.selected)} selected)` : ''}
          </span>
        ) : null}

        {viewMode === 'split' ? (
          <button
            type="button"
            onClick={() => setSetting('syncScroll', !syncScroll)}
            aria-pressed={syncScroll}
            className={cn(
              'flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-desk-2 hover:text-ink',
              syncScroll && 'text-ink-2',
            )}
            title="Keep the editor and preview scrolled together"
          >
            <ArrowDownUp className="size-3" />
            Sync {syncScroll ? 'on' : 'off'}
          </button>
        ) : null}

        {saved ? (
          <span
            className="flex items-center gap-1.5"
            title="Your document is stored in this browser only"
          >
            <span className="size-1.5 rounded-full bg-[color:var(--alert-tip)]" />
            {source === 'shared' ? 'Shared copy · saved on this device' : 'Saved on this device'}
          </span>
        ) : (
          <span
            className="flex items-center gap-1.5 text-[color:var(--alert-caution)]"
            title="Browser storage is full or unavailable. Save the file to disk to keep it."
          >
            <span className="size-1.5 rounded-full bg-current" />
            Not saved — too large for browser storage
          </span>
        )}
      </span>
    </footer>
  )
}

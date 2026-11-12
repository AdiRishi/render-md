import { type Root } from 'hast'
import { AlignCenter, AlignLeft, AlignRight, ArrowUpRight, Eraser, Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

import { DocumentView } from '@/features/markdown/render/DocumentView'
import { openInEditor } from '@/lib/share-link'
import { Button } from '@/ui/button'
import { CopyButton } from '@/ui/copy-button'
import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group'

import {
  type Align,
  type CellPosition,
  clearCells,
  insertColumn,
  insertRow,
  removeColumn,
  removeRow,
  setAlign,
  type Table,
  toMarkdown,
} from './table-model'
import { TableGrid } from './TableGrid'

const ALIGNMENTS = [
  { value: 'left', label: 'Align left', Icon: AlignLeft },
  { value: 'center', label: 'Align centre', Icon: AlignCenter },
  { value: 'right', label: 'Align right', Icon: AlignRight },
] satisfies Array<{ value: Align; label: string; Icon: typeof AlignLeft }>

/**
 * The markdown table generator: a grid to fill in, with the aligned markdown
 * it makes and that markdown rendered. It starts from a table the server has
 * already rendered, and re-renders edits in the worker.
 */
export function TableGenerator({ initial, rendered }: { initial: Table; rendered: Root }) {
  const [table, setTable] = useState(initial)
  const [focused, setFocused] = useState<CellPosition>({ row: 1, column: 0 })
  const [preview, setPreview] = useState(() => ({ markdown: toMarkdown(initial), hast: rendered }))
  const markdown = toMarkdown(table)

  // Toolbar buttons act on the cell that last had focus, kept inside the table as it shrinks.
  const at = {
    row: Math.min(focused.row, table.rows.length - 1),
    column: Math.min(focused.column, table.align.length - 1),
  }
  const align = table.align[at.column]

  useEffect(() => {
    // The SSR branch keeps the worker bundle out of the server build.
    if (import.meta.env.SSR || markdown === preview.markdown) return
    // A result that arrives late is for older markdown, so this effect runs again and replaces it.
    const timer = setTimeout(() => {
      void import('@/features/markdown/worker/client')
        .then(({ renderInBackground }) => renderInBackground(markdown))
        .then(
          (result) => setPreview({ markdown, hast: result.hast }),
          () => undefined,
        )
    }, 120)
    return () => clearTimeout(timer)
  }, [markdown, preview.markdown])

  return (
    <div className="@container overflow-hidden rounded-[3px] bg-paper shadow-[0_0_0_1px_var(--rule)]">
      <div
        role="toolbar"
        aria-label="Table"
        className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-rule px-3 py-2.5 md:px-4"
      >
        <span className="flex items-center gap-1">
          <span className="me-1 text-[13px] font-medium text-ink-2">Row</span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Add row"
            title="Add row"
            onClick={() => setTable(insertRow(table, at.row + 1))}
          >
            <Plus />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Remove row"
            title="Remove row"
            disabled={at.row === 0 || table.rows.length <= 2}
            onClick={() => setTable(removeRow(table, at.row))}
          >
            <Minus />
          </Button>
        </span>
        <span className="ms-2 flex items-center gap-1">
          <span className="me-1 text-[13px] font-medium text-ink-2">Column</span>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Add column"
            title="Add column"
            onClick={() => setTable(insertColumn(table, at.column + 1))}
          >
            <Plus />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Remove column"
            title="Remove column"
            disabled={table.align.length <= 1}
            onClick={() => setTable(removeColumn(table, at.column))}
          >
            <Minus />
          </Button>
        </span>

        <span className="mx-1 h-5 w-px bg-rule max-sm:hidden" />

        <span className="flex items-center gap-2">
          <span className="label-caps text-ink-3">Align column {at.column + 1}</span>
          <ToggleGroup
            aria-label={`Alignment of column ${at.column + 1}`}
            value={align === 'none' ? [] : [align]}
            onValueChange={(next) => {
              const chosen = ALIGNMENTS.find((option) => option.value === next[0])
              setTable(setAlign(table, at.column, chosen?.value ?? 'none'))
            }}
            className="gap-0 rounded-lg bg-desk-2 p-0.5 dark:bg-desk"
          >
            {ALIGNMENTS.map(({ value, label, Icon }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                title={label}
                aria-label={label}
                className="h-7 min-w-8 rounded-md px-2 text-ink-3 hover:bg-transparent hover:text-ink aria-pressed:bg-segment aria-pressed:text-ink aria-pressed:shadow-segment"
              >
                <Icon className="size-3.5" />
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="ms-auto text-ink-3"
          onClick={() => setTable(clearCells(table))}
        >
          <Eraser /> Clear
        </Button>
      </div>

      <div className="scrollbar-quiet overflow-x-auto">
        <TableGrid table={table} onChange={setTable} onActiveChange={setFocused} />
      </div>

      <div className="grid @2xl:grid-cols-2">
        <div className="flex min-w-0 flex-col border-rule bg-paper-2 @max-2xl:border-b @2xl:border-e">
          <div className="flex h-10 items-center gap-1 ps-4 pe-1.5">
            <span className="label-caps text-ink-3">Markdown</span>
            <CopyButton value={markdown} label="Copy markdown" className="ms-auto" />
            <Button
              variant="ghost"
              size="xs"
              className="text-ink-2"
              onClick={() => void openInEditor(markdown, { view: 'split', from: 'guide' })}
            >
              Open in the editor <ArrowUpRight />
            </Button>
          </div>
          <pre className="m-0 scrollbar-quiet overflow-x-auto px-4 pt-1 pb-6 font-mono text-[13px] leading-[1.75] text-ink-2">
            {markdown}
          </pre>
        </div>
        <div className="min-w-0">
          <div className="flex h-10 items-center px-5 @2xl:px-7">
            <span className="label-caps text-ink-3">Preview</span>
          </div>
          <div className="px-5 pt-1 pb-6 @2xl:px-7">
            <DocumentView hast={preview.hast} textSize="s" />
          </div>
        </div>
      </div>
    </div>
  )
}

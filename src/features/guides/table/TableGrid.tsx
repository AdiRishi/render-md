import { type KeyboardEvent, useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import { type CellPosition, insertRow, paste, setCell, type Table } from './table-model'

const cellName = ({ row, column }: CellPosition) => `${row}:${column}`

/**
 * The table as a grid of cells you type into. Arrow keys, Tab and Enter move
 * between cells, and pasted spreadsheet rows fill the grid from the cell that
 * has focus.
 */
export function TableGrid({
  table,
  onChange,
  onActiveChange,
}: {
  table: Table
  onChange: (table: Table) => void
  /** Called with the cell that takes focus. */
  onActiveChange: (at: CellPosition) => void
}) {
  const grid = useRef<HTMLTableElement>(null)
  // A cell to focus once the row it is in has rendered.
  const pendingFocus = useRef<CellPosition | null>(null)
  const lastRow = table.rows.length - 1
  const lastColumn = table.align.length - 1

  function focusCell(at: CellPosition) {
    const cell = grid.current?.querySelector<HTMLTextAreaElement>(`[data-cell="${cellName(at)}"]`)
    if (!cell) return
    cell.focus()
    cell.setSelectionRange(cell.value.length, cell.value.length)
  }

  useEffect(() => {
    if (!pendingFocus.current) return
    focusCell(pendingFocus.current)
    pendingFocus.current = null
  })

  function addRowAndFocus(column: number) {
    pendingFocus.current = { row: table.rows.length, column }
    onChange(insertRow(table, table.rows.length))
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>, at: CellPosition) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.nativeEvent.isComposing) return
    const cell = event.currentTarget
    const collapsed = cell.selectionStart === cell.selectionEnd
    const move = (to: CellPosition) => {
      event.preventDefault()
      focusCell(to)
    }

    switch (event.key) {
      case 'Enter':
        event.preventDefault()
        if (event.shiftKey) focusCell({ ...at, row: Math.max(at.row - 1, 0) })
        else if (at.row === lastRow) addRowAndFocus(at.column)
        else focusCell({ ...at, row: at.row + 1 })
        return
      case 'ArrowUp':
        if (!event.shiftKey && at.row > 0) move({ ...at, row: at.row - 1 })
        return
      case 'ArrowDown':
        if (!event.shiftKey && at.row < lastRow) move({ ...at, row: at.row + 1 })
        return
      case 'ArrowLeft':
        if (!event.shiftKey && collapsed && cell.selectionStart === 0 && at.column > 0) {
          move({ ...at, column: at.column - 1 })
        }
        return
      case 'ArrowRight':
        if (
          !event.shiftKey &&
          collapsed &&
          cell.selectionStart === cell.value.length &&
          at.column < lastColumn
        ) {
          move({ ...at, column: at.column + 1 })
        }
    }
  }

  return (
    <table ref={grid} className="w-full border-collapse">
      <caption className="sr-only">The table’s cells. The first row is the header.</caption>
      <tbody>
        {table.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((value, column) => {
              const at = { row: rowIndex, column }
              const header = rowIndex === 0
              const align = table.align[column]
              const Cell = header ? 'th' : 'td'
              return (
                <Cell
                  key={column}
                  scope={header ? 'col' : undefined}
                  className={cn(
                    'border-e border-b border-rule p-0 align-top last:border-e-0',
                    header && 'bg-paper-2',
                  )}
                >
                  <textarea
                    rows={1}
                    value={value}
                    data-cell={cellName(at)}
                    aria-label={
                      header
                        ? `Header, column ${column + 1}`
                        : `Row ${rowIndex}, column ${column + 1}`
                    }
                    placeholder={header ? 'Header' : undefined}
                    spellCheck={false}
                    onChange={(event) => onChange(setCell(table, at, event.target.value))}
                    onFocus={() => onActiveChange(at)}
                    onKeyDown={(event) => onKeyDown(event, at)}
                    onPaste={(event) => {
                      const next = paste(table, at, event.clipboardData.getData('text/plain'))
                      if (!next) return
                      event.preventDefault()
                      onChange(next)
                    }}
                    style={{ textAlign: align === 'none' ? undefined : align }}
                    className={cn(
                      'block [field-sizing:content] w-full min-w-28 resize-none overflow-hidden bg-transparent px-3.5 py-2.5 text-[14px] leading-6 outline-none placeholder:text-ink-4 focus:shadow-[inset_0_0_0_2px_var(--proof)]',
                      header ? 'font-semibold text-ink' : 'text-ink-2 focus:text-ink',
                    )}
                  />
                </Cell>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

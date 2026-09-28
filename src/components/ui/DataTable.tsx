import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface Column<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  align?: 'left' | 'right' | 'center'
  className?: string
  /** Valor usado para ordenação ao clicar no cabeçalho. */
  sortValue?: (row: T) => string | number
  /** Oculta a coluna abaixo do breakpoint (a informação deve existir no card mobile). */
  hideBelow?: 'lg' | 'xl'
}

interface DataTableProps<T> {
  columns: Column<T>[]
  rows: T[]
  getRowId: (row: T) => string
  caption: string
  /** Renderização em card para telas pequenas (evita scroll horizontal). */
  mobileCard?: (row: T) => ReactNode
  empty?: ReactNode
  pageSize?: number
  initialSort?: { key: string; direction: 'asc' | 'desc' }
  rowClassName?: (row: T) => string | undefined
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' }
const hideClass = { lg: 'hidden lg:table-cell', xl: 'hidden xl:table-cell' }

export function DataTable<T>({ columns, rows, getRowId, caption, mobileCard, empty, pageSize = 10, initialSort, rowClassName }: DataTableProps<T>) {
  const [sort, setSort] = useState(initialSort ?? null)
  const [page, setPage] = useState(0)

  const sorted = useMemo(() => {
    if (!sort) return rows
    const column = columns.find((c) => c.key === sort.key)
    if (!column?.sortValue) return rows
    const get = column.sortValue
    return [...rows].sort((a, b) => {
      const va = get(a)
      const vb = get(b)
      const result = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'pt-BR')
      return sort.direction === 'asc' ? result : -result
    })
  }, [rows, sort, columns])

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize))
  const currentPage = Math.min(page, pageCount - 1)
  const visible = sorted.slice(currentPage * pageSize, currentPage * pageSize + pageSize)

  if (rows.length === 0) return <>{empty}</>

  const toggleSort = (key: string) => {
    setSort((current) => (current?.key === key ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' } : { key, direction: 'asc' }))
  }

  return (
    <div>
      {mobileCard && (
        <ul className="divide-y divide-line md:hidden" aria-label={caption}>
          {visible.map((row) => (
            <li key={getRowId(row)} className="px-4 py-3.5 sm:px-5">
              {mobileCard(row)}
            </li>
          ))}
        </ul>
      )}
      <div className={cn('vo-scrollbar overflow-x-auto', mobileCard && 'hidden md:block')}>
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-line bg-surface-2/60">
              {columns.map((column) => {
                const active = sort?.key === column.key
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                    className={cn(
                      'px-4 py-3 text-xs font-semibold tracking-wide text-muted uppercase first:pl-5 last:pr-5',
                      alignClass[column.align ?? 'left'],
                      column.hideBelow && hideClass[column.hideBelow],
                    )}
                  >
                    {column.sortValue ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        className={cn('inline-flex items-center gap-1 uppercase hover:text-fg', active && 'text-fg')}
                      >
                        {column.header}
                        {active && (sort.direction === 'asc' ? <ArrowUp className="size-3" aria-hidden /> : <ArrowDown className="size-3" aria-hidden />)}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((row) => (
              <tr key={getRowId(row)} className={cn('transition-colors hover:bg-surface-2/50', rowClassName?.(row))}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      'px-4 py-3.5 align-middle text-fg-soft first:pl-5 last:pr-5',
                      alignClass[column.align ?? 'left'],
                      column.hideBelow && hideClass[column.hideBelow],
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pageCount > 1 && (
        <nav className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm sm:px-5" aria-label="Paginação">
          <p className="text-muted">
            <span className="vo-tabular">
              {currentPage * pageSize + 1}–{Math.min(sorted.length, (currentPage + 1) * pageSize)}
            </span>{' '}
            de <span className="vo-tabular">{sorted.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 0}
              aria-label="Página anterior"
              className="flex size-9 items-center justify-center rounded-lg border border-line text-fg-soft hover:bg-surface-2 disabled:opacity-40"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="vo-tabular px-2 text-muted">
              {currentPage + 1}/{pageCount}
            </span>
            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= pageCount - 1}
              aria-label="Próxima página"
              className="flex size-9 items-center justify-center rounded-lg border border-line text-fg-soft hover:bg-surface-2 disabled:opacity-40"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </nav>
      )}
    </div>
  )
}

import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type OnChangeFn,
} from '@tanstack/react-table';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  isLoading?: boolean;
  pageCount?: number;
  pageIndex?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  title?: string;
  description?: string;
}

export default function DataTable<TData extends { id: number | string }>({
  columns,
  data,
  isLoading = false,
  pageCount = 0,
  pageIndex = 0,
  onPageChange,
  emptyMessage = 'Tidak ada data',
  sorting,
  onSortingChange,
  title,
  description,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount,
    state: {
      pagination: { pageIndex, pageSize: 15 },
      sorting: sorting || [],
    },
    onSortingChange: onSortingChange,
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      {(title || description) && (
        <div className="px-5 py-4 border-b border-slate-100">
          {title && <h3 className="font-display font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/80 ${
                      header.column.getCanSort() ? 'cursor-pointer select-none hover:text-slate-700' : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <div className="flex flex-col -space-y-1">
                          <ChevronUp
                            className={`w-3 h-3 ${
                              header.column.getIsSorted() === 'asc'
                                ? 'text-primary-600'
                                : 'text-slate-300'
                            }`}
                          />
                          <ChevronDown
                            className={`w-3 h-3 ${
                              header.column.getIsSorted() === 'desc'
                                ? 'text-primary-600'
                                : 'text-slate-300'
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Memuat data...</p>
                  </div>
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p className="text-sm text-slate-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row, idx) => (
                <tr
                  key={row.original.id}
                  className="hover:bg-slate-50/80 transition-colors"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm text-slate-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Halaman {pageIndex + 1} dari {pageCount}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange?.(pageIndex)}
              disabled={pageIndex === 0}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Sebelumnya
            </button>
            <button
              onClick={() => onPageChange?.(pageIndex + 2)}
              disabled={pageIndex >= pageCount - 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search } from 'lucide-react';
import useDebounce from '../../hooks/useDebounce';

const Table = ({
  columns,
  data = [],
  serverSide = false,
  fetchData,
  totalCount = 0,
  initialPageSize = 10,
  pageSizeOptions = [10, 20, 50],
  className = ''
}) => {
  const [globalFilter, setGlobalFilter] = useState('');
  const debouncedFilter = useDebounce(globalFilter, 350);

  const [remoteRows, setRemoteRows] = useState([]); 
  const [loading, setLoading] = useState(false);

  const table = useReactTable({
    data: serverSide ? remoteRows : data,
    columns,
    state: {
      globalFilter: debouncedFilter
    },
    globalFilterFn: 'includesString', 
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: serverSide,
    pageCount: serverSide ? Math.ceil(totalCount / initialPageSize) : undefined,
  });

  // Server-side data fetch
  useEffect(() => {
    if (!serverSide) return;

    const fetchPage = async () => {
      setLoading(true);
      const state = table.getState();
      const pageIndex = state.pagination.pageIndex ?? 0;
      const pageSize = state.pagination.pageSize ?? initialPageSize;
      const sortBy = state.sorting.map(s => ({ id: s.id, desc: s.desc }));

      try {
        if (typeof fetchData === 'function') {
          const res = await fetchData({ pageIndex, pageSize, globalFilter: debouncedFilter, sortBy });
          setRemoteRows(res.rows || []);
        } else {
          console.warn('serverSide is true but fetchData is not provided');
        }
      } catch (err) {
        console.error('fetchData error', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [serverSide, debouncedFilter, table.getState().pagination.pageIndex, table.getState().pagination.pageSize, table.getState().sorting]);

  const renderCell = (cell) => cell.getValue?.() ?? cell.row.original[cell.column.id];

  return (
    <div className={`bg-white rounded-md shadow-sm overflow-hidden ${className}`}>
      <div className="flex items-center justify-between p-4 border-b gap-3 flex-col sm:flex-row">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
              <Search size={16} />
            </span>
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="pl-10 pr-3 py-2 border rounded-md w-72 text-sm focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Rows:</label>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={table.getState().pagination.pageSize ?? initialPageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {pageSizeOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="text-left px-4 py-3 font-medium text-gray-600"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          onClick: header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined,
                          className: header.column.getCanSort() ? 'cursor-pointer select-none flex items-center gap-2' : ''
                        }}
                      >
                        {header.renderHeader ? header.renderHeader() : header.column.columnDef.header}
                        {header.column.getIsSorted() ? (
                          header.column.getIsSorted() === 'desc' ? ' ▼' : ' ▲'
                        ) : null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="animate-spin mb-2" width="36" height="36" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.08)" strokeWidth="3"/>
                      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <div className="text-sm text-gray-600">Loading...</div>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="border-t last:border-b">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-4 py-3 align-top text-gray-700">
                        {renderCell(cell)}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="p-6 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: pagination */}
      <div className="flex items-center justify-between p-3 border-t bg-gray-50">
        <div className="text-sm text-gray-600">
          {serverSide
            ? `Showing ${table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 || 0} - ${Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalCount)} of ${totalCount}`
            : `Showing ${table.getRowModel().rows.length} rows`
          }
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded disabled:opacity-40"
            aria-label="first"
          >
            <ChevronsLeft size={16}/>
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded disabled:opacity-40"
            aria-label="previous"
          >
            <ChevronLeft size={16}/>
          </button>

          <div className="hidden sm:flex items-center gap-1 px-2">
            {Array.from({ length: table.getPageCount() }).slice(Math.max(0, table.getState().pagination.pageIndex - 2), Math.min(table.getPageCount(), table.getState().pagination.pageIndex + 3)).map((_, i) => {
              const pageIndex = i + Math.max(0, table.getState().pagination.pageIndex - 2);
              return (
                <button
                  key={pageIndex}
                  onClick={() => table.setPageIndex(pageIndex)}
                  className={`px-2 py-1 rounded ${table.getState().pagination.pageIndex === pageIndex ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  {pageIndex + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded disabled:opacity-40"
            aria-label="next"
          >
            <ChevronRight size={16}/>
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded disabled:opacity-40"
            aria-label="last"
          >
            <ChevronsRight size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;

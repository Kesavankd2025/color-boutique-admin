import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

export default function ReactTableComponent({
  data,
  columns,
  filterableColumns = [],
  pageIndex,
  totalPages,
  onNextPage,
  onPreviousPage,
  filters = {},
  setFilters,
  totalRecords,
  pageSize = 10,
   showRecordCount = true, // ✅ NEW PROP
}) {
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters: Object.entries(filters).map(([id, value]) => ({ id, value })),
    },
    onColumnFiltersChange: updater => {
      const newFilters =
        typeof updater === 'function'
          ? updater(table.getState().columnFilters)
          : updater;
      setFilters(Object.fromEntries(newFilters.map(({ id, value }) => [id, value])));
    },
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleFilterChange = (columnId, value) => {
    setFilters(prev => ({
      ...prev,
      [columnId]: value,
    }));
  };

  const visibleRows = useMemo(() => table.getRowModel().rows, [table, data]);

  const fromRecord = pageIndex * pageSize + 1;
  const toRecord = pageIndex * pageSize + data.length;
  console.log(data,'data----------')

  return (
    <div className="container-fluid mt-4" style={{ position: 'relative' }}>
      {/* Filters (Disabled here) */}
      {/* <div className="row mb-3">
        <div className="col-12">
          <div className="d-flex flex-wrap gap-3 align-items-center p-2 bg-light rounded">
            {filterableColumns.map(columnId => {
              const column = table.getColumn(columnId);
              if (!column) return null;

              return (
                <div key={columnId} className="d-flex align-items-center">
                  <label className="me-2 fw-medium text-start">
                    {typeof column.columnDef.header === 'string'
                      ? column.columnDef.header
                      : 'Filter'}:
                  </label>
                  <input
                    type="text"
                    value={filters[columnId] || ''}
                    onChange={e => handleFilterChange(columnId, e.target.value)}
                    placeholder={`Filter...`}
                    className="form-control form-control-sm text-start"
                    style={{ width: '160px' }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div> */}

      {/* Record count */}
      {showRecordCount && (
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="text-muted text-start">
          <b>
            {totalRecords !== undefined
              ? `Showing ${fromRecord}-${toRecord} of ${totalRecords} records`
              : `Showing ${data.length} records`}
          </b>
        </div>
      </div>
    )}


      {/* Table */}
      <div className="table-responsive" style={{ border: '1px solid #dee2e6' }}>
        <table className="table table-striped table-nowrap mb-0" style={{ minWidth: '100%' }}>
          <thead className="table-light">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(columnHeader => {
                  const size = columnHeader.column.columnDef.size;
                  const align =
                    columnHeader.column.columnDef.accessorKey === 'actions' ? 'center' : 'left';
                  return (
                    <th
                      key={columnHeader.id}
                      style={{
                        width: size ? `${size}px` : 'auto',
                        minWidth: size ? `${size}px` : '120px',
                        textAlign: align,
                        padding: '10px 12px',
                        verticalAlign: 'middle',
                      }}
                    >
                      <div className="text-nowrap">
                        {flexRender(
                          columnHeader.column.columnDef.header,
                          columnHeader.getContext()
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {visibleRows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllLeafColumns().length}
                  className="py-4 text-muted text-center"
                >
                  No matching data found
                </td>
              </tr>
            ) : (
              visibleRows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    const size = cell.column.columnDef.size;
                    const align =
                      cell.column.columnDef.className ||
                      cell.column.columnDef.accessorKey === 'actions' ? 'center' : 'left';
                    // const marginLeft = cell.column.columnDef.accessorKey === 'actions' ? '0' : '20px';
                    return (
                      <td
                        key={cell.id}
                        style={{
                          width: size ? `${size}px` : undefined,
                          minWidth: size ? `${size}px` : '120px',
                          textAlign: align,
                          padding: '10px 12px',
                          verticalAlign: 'middle',
                        }}
                      >
                        <div
                          className="cell-content"
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            padding: '5px 10px',
                          }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pageIndex !== undefined &&
        totalPages !== undefined &&
        typeof onNextPage === 'function' &&
        typeof onPreviousPage === 'function' && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-start">
              Page <strong>{pageIndex + 1}</strong> of <strong>{totalPages}</strong>
            </div>
            <div className="btn-group">
              <button
                className="btn btn-sm btn-outline-primary text-start"
                onClick={onPreviousPage}
                disabled={pageIndex === 0}
              >
                Previous
              </button>
              <button
                className="btn btn-sm btn-outline-primary text-start"
                onClick={onNextPage}
                disabled={pageIndex + 1 >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

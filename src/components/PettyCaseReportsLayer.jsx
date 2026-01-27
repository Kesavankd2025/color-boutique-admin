import React, { useState, useMemo } from "react";
import pettyCashApi from '../apiProvider/pettyCashapi';
import ReactTableComponent from '../table/ReactTableComponent';

export default function PettyCaseReportsLayer() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const fetchReport = async (page = 0) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        startDate,
        endDate,
        transactionType,
        page: page + 1, // API expects 1-based page
        limit: pageSize,
      };
      const res = await pettyCashApi.getSummary(params);
      console.log(res,"res...");
      
      if (res.status && Array.isArray(res.response?.data)) {
        setData(res.response.data);
        setTotalPages(res.response.totalPages || Math.ceil((res.response.totalCount || res.response.data.length) / pageSize) || 1);
      } else if (res.status && Array.isArray(res.response)) {
        setData(res.response);
        setTotalPages(1);
      } else {
        setData([]);
        setTotalPages(1);
        setError('No data found');
      }
    } catch (e) {
      setData([]);
      setTotalPages(1);
      setError('Failed to fetch data');
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPageIndex(0);
    fetchReport(0);
  };

  const columns = useMemo(() => [
    { header: 'S.No', id: 'sno', cell: info => pageIndex * pageSize + info.row.index + 1 },
    { header: 'Date', accessorKey: 'date', cell: info => info.row.original.date ? new Date(info.row.original.date).toLocaleDateString() : '-' },
    { header: 'Amount', accessorKey: 'amount' },
    { header: 'Receiver', accessorKey: 'receiver' },
    { header: 'Employee', accessorKey: 'employeeId.name' },
    { header: 'Description', accessorKey: 'description', cell: info => <span title={info.row.original.description}>{info.row.original.description?.slice(0, 30) + (info.row.original.description?.length > 30 ? '...' : '')}</span> },
    { header: 'Payment Mode', accessorKey: 'paymentMode' },
    { header: 'Reference Number', accessorKey: 'referenceNumber' },
    // Add more columns as needed
  ], [pageIndex, pageSize]);

  // Handle pagination
  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) {
      setPageIndex(pageIndex + 1);
      fetchReport(pageIndex + 1);
    }
  };
  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
      fetchReport(pageIndex - 1);
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        {/* Centered filter form */}
        <div className="row justify-content-center">
          <div className="col-xl-6">
            <div className="card">
              <div className="card-body">
                <div className="">
                  <h5 className="mb-4 fs-1 card-title">Petty cash report</h5>
                </div>
                <form className="mb-4" onSubmit={handleSubmit}>
                  <div className="mb-3 text-center">
                    <label className="form-label">From Date</label>
                    <input type="date" className="form-control mx-auto" style={{ maxWidth: 350 }} value={startDate} onChange={e => setStartDate(e.target.value)} required />
                  </div>
                  <div className="mb-3 text-center">
                    <label className="form-label">To Date</label>
                    <input type="date" className="form-control mx-auto" style={{ maxWidth: 350 }} value={endDate} onChange={e => setEndDate(e.target.value)} required />
                  </div>
                  <div className="mb-3 text-center">
                    <label className="form-label">Transaction Type</label>
                    <select className="form-select mx-auto" style={{ maxWidth: 350 }} value={transactionType} onChange={e => setTransactionType(e.target.value)}>
                      <option value="">All</option>
                      <option value="expense">Expense</option>
                      <option value="deposit">Deposit</option>
                      <option value="withdrawal">Withdrawal</option>
                    </select>
                  </div>
                  <div className="mb-3 text-center">
                    <button type="submit" className="btn btn-primary px-5">Filter</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* Full-width table */}
        <div className="row">
          <div className="col-xl-12">
            <div className="card">
              <div className="card-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <ReactTableComponent
                  data={data}
                  columns={columns}
                  pageIndex={pageIndex}
                  totalPages={totalPages}
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  filterableColumns={[]}
                  filters={{}}
                  setFilters={() => {}}
                  sorting={[]}
                  setSorting={() => {}}
                />
                {loading && <div className="text-center py-3">Loading...</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

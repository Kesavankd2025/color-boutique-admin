import React, { useState, useEffect } from 'react';
import salesApi from '../apiProvider/salesapi';
import ReactTableComponent from '../table/ReactTableComponent';

const SalesmanPerformance = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    useEffect(() => {
        fetchPerformance();
        // eslint-disable-next-line
    }, [pageIndex]);

    const fetchPerformance = async () => {
        setLoading(true);
        // const params = { page: pageIndex + 1, limit: pageSize };
        const res = await salesApi.getSalesPerformance();
        if (res.status && res.response?.data) {
            setData(res.response.data);
            setTotalPages(res.response.totalPages || 1);
        } else {
            setData([]);
            setTotalPages(1);
        }
        setLoading(false);
    };

    const columns = [
        { header: 'S.No', accessorKey: 'sno', cell: info => info.row.index + 1 + pageIndex * pageSize },
        { header: 'Salesman Name', accessorKey: 'salesmanName' },
        { header: 'Total Orders Managed', accessorKey: 'totalOrdersManaged' },
        { header: 'Total Sales Value', accessorKey: 'totalSalesValue', cell: info => `₹${info.getValue()}` },
        { header: 'New Clients Added', accessorKey: 'newClientsAdded' },
        { header: 'Last Order Date', accessorKey: 'lastOrderDate', cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '-' },
        { header: 'Sales Target Achieved', accessorKey: 'salesTargetAchieved' },
        { header: 'Incentives Earned', accessorKey: 'incentivesEarned', cell: info => `₹${info.getValue()}` },
        { header: 'Performance Rating', accessorKey: 'performanceRating', cell: info => (
            <span className={`badge badge-pill ${info.getValue() === 'Good' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} font-size-12`}>{info.getValue()}</span>
        ) },
    ];

    return (
        <div className="card h-100 p-20 radius-12">
            <div className="card-body h-100 p-0 radius-12">
                <div className="d-flex flex-wrap align-items-center mb-3">
                    <h5 className="card-title me-2"> Salesman Performance </h5>
                </div>
                <div className="table-responsive scroll-sm">
                    {loading ? (
                        <div className="text-center py-4">Loading...</div>
                    ) : (
                        <ReactTableComponent
                            data={data}
                            columns={columns}
                            pageIndex={pageIndex}
                            totalPages={totalPages}
                            onNextPage={() => setPageIndex(p => Math.min(p + 1, totalPages - 1))}
                            onPreviousPage={() => setPageIndex(p => Math.max(p - 1, 0))}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesmanPerformance;
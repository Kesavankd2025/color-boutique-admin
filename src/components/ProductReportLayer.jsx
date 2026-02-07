import React, { useState, useEffect } from "react";
import ReportApi from "../apiProvider/reportApi";
import ReactTableComponent from "../table/ReactTableComponent";
import { Icon } from '@iconify/react';

function ProductReportLayer() {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState([]);
    const [sorting, setSorting] = useState([]);
    const attributeFilter = ["productName", "productCode"];

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, filters]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Note: The backend API currently fetched all products for the report. 
            // Pagination might need to be handled client-side or backend update needed.
            // For now, assuming backend returns full list and we paginate or backend returns paginated.
            // The current backend implementation 'getProductPerformance' returns an array.
            // We will handle client side pagination if needed, but let's assume valid response.

            const result = await ReportApi.getProductPerformance({});

            if (result?.status && result?.response) {
                // Since the generic API returns a list, we might need to paginate effectively.
                // Assuming result.response is the array of report items.

                let data = result.response;

                // Simple client-side search/filter
                if (filters.length > 0) {
                    const searchTerm = filters[0]?.value?.toLowerCase() || "";
                    if (searchTerm) {
                        data = data.filter(p =>
                            p.productName?.toLowerCase().includes(searchTerm) ||
                            p.productCode?.toLowerCase().includes(searchTerm)
                        );
                    }
                }

                setProducts(data);
                setTotalPages(Math.ceil(data.length / pageSize));
            }
        } catch (error) {
            console.error("Error fetching product report:", error);
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Product Name',
            accessorKey: 'productName',
            cell: info => (
                <div className="d-flex align-items-center">
                    {info.row.original.productImage ? (
                        <img
                            src={`http://localhost:5000/${info.row.original.productImage.imagePath}/${info.row.original.productImage.filename}`} // Adjust URL base if needed
                            alt=""
                            className="avatar-sm rounded-circle me-2"
                        />
                    ) : null}
                    <div>
                        <h6 className="mb-0">{info.getValue()}</h6>
                        <span className="text-muted font-size-12">{info.row.original.productCode}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Purchased Qty',
            accessorKey: 'purchasedQty',
        },
        {
            header: 'Purchased Cost',
            accessorKey: 'purchasedCost',
            cell: info => `₹${info.getValue().toFixed(2)}`
        },
        {
            header: 'Sold Qty',
            accessorKey: 'soldQty',
        },
        {
            header: 'Revenue',
            accessorKey: 'soldRevenue',
            cell: info => `₹${info.getValue().toFixed(2)}`
        },
        {
            header: 'Profit',
            accessorKey: 'profit',
            cell: info => {
                const profit = info.getValue();
                return (
                    <span className={profit >= 0 ? "text-success" : "text-danger"}>
                        ₹{profit.toFixed(2)}
                    </span>
                )
            }
        }
    ];

    // Client-side pagination slice
    const currentTableData = React.useMemo(() => {
        const firstPageIndex = pageIndex * pageSize;
        const lastPageIndex = firstPageIndex + pageSize;
        return products.slice(firstPageIndex, lastPageIndex);
    }, [pageIndex, pageSize, products]);


    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex flex-wrap align-items-center mb-3">
                                <h5 className="card-title me-2">Product Performance Report</h5>
                                <div className="ms-auto">
                                    {/* Optional controls */}
                                </div>
                            </div>

                            <div className="table-responsive">
                                <ReactTableComponent
                                    data={currentTableData}
                                    columns={columns}
                                    filterableColumns={attributeFilter}
                                    pageIndex={pageIndex}
                                    totalPages={totalPages}
                                    onNextPage={() => setPageIndex(p => Math.min(p + 1, totalPages - 1))}
                                    onPreviousPage={() => setPageIndex(p => Math.max(p - 1, 0))}
                                    filters={filters}
                                    setFilters={setFilters}
                                    sorting={sorting}
                                    setSorting={setSorting}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductReportLayer;

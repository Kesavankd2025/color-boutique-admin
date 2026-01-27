import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect, useMemo, useCallback } from "react";
import CustomerApi from "../apiProvider/userapi";
import ReactTableComponent from "../table/ReactTableComponent";

const CustomerListLayer = () => {
    const [customers, setCustomers] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'N/A';

        const date = new Date(dateString);

        return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        }).replace('am', 'AM')
            .replace('pm', 'PM');;
    }, []);


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const input = {
                search,
                page,
                limit,
            };

            const response = await CustomerApi.getCustomerList(input);

            if (response?.response?.data) {
                setCustomers(response.response.data);
                setTotalPages(response.response.totalPages);
                setTotal(response.response.total || 0);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setIsLoading(false);
        }
    }, [search, page, limit]);

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(debounce);
    }, [fetchData]);

    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearch(value);
        setPage(0);
    }, []);

    const columns = useMemo(
        () => [
            {
                header: 'S.No',
                id: 'sno',
                cell: info => page * limit + info.row.index + 1
            },
            {
                header: 'Full Name',
                accessorKey: 'name',
                cell: info => (
                    <span className="text-md mb-0 fw-normal text-secondary-light">
                        {info.getValue() || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Email',
                accessorKey: 'email',
                cell: info => (
                    <span className="text-md mb-0 fw-normal text-secondary-light">
                        {info.getValue() || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Phone',
                accessorKey: 'phone',
                cell: info => (
                    <span className="text-md mb-0 fw-normal text-secondary-light">
                        {info.getValue() || 'N/A'}
                    </span>
                ),
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: info => {
                    const isActive = info.getValue();
                    return (
                        <span
                            className={`${isActive
                                ? 'bg-success-focus text-success-600 border border-success-border'
                                : 'bg-danger-focus text-danger-600 border border-danger-main'
                                } px-24 py-4 radius-4 fw-medium text-sm`}
                        >
                            {isActive ? 'Active' : 'Inactive'}
                        </span>
                    );
                },
            },
            {
                header: 'Last Login',
                accessorKey: 'lastLogin',
                cell: info => (
                    <span className="text-md mb-0 fw-normal text-secondary-light">
                        {formatDate(info.getValue())}
                    </span>
                ),
            },
        ],
        [page, limit, formatDate]
    );

    const handleNextPage = useCallback(() => {
        if (page + 1 < totalPages) setPage(prev => prev + 1);
    }, [page, totalPages]);

    const handlePreviousPage = useCallback(() => {
        if (page > 0) setPage(prev => prev - 1);
    }, [page]);

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xxl-12">
                        <div className="card h-100 p-0 radius-12">
                            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                                <div style={{ position: "relative" }}>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                        style={{ maxWidth: 350 }}
                                        value={search}
                                        onChange={handleSearchChange}
                                    />
                                    <Icon
                                        icon="ic:baseline-search"
                                        style={{
                                            position: "absolute",
                                            right: 10,
                                            top: 10,
                                            fontSize: 20,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="card-body p-24">
                                <div className="table-responsive scroll-sm">
                                    <ReactTableComponent
                                        data={customers}
                                        columns={columns}
                                        pageIndex={page}
                                        totalPages={totalPages}
                                        onNextPage={handleNextPage}
                                        onPreviousPage={handlePreviousPage}
                                        totalRecords={total}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerListLayer;
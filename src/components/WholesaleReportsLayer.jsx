import React, { useEffect, useState } from 'react';
import wholesaleOrderApi from '../apiProvider/wholesaleorderapi';
import wholesalerApi from '../apiProvider/wholesalerapi';
import ReactTableComponent from '../table/ReactTableComponent';


const WholesalerReport = () => {
    // Order related states
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderpageIndex, setOrderpageIndex] = useState(0);
    const [ordertotalPages, setOrdertotalPages] = useState(1);
    const [orderpageSize, setOrderpageSize] = useState(10);
    const [orderfilters, setOrderfilters] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true);

    // Credit related states
    const [loadingCredit, setLoadingCredit] = useState(true);
    const [wholesalersCredit, setWholesalersCredit] = useState([]);
    const [totalCredit, setTotalCredit] = useState(0);
    const [creditpageIndex, setcreditPageIndex] = useState(0);
    const [credittotalPages, setcreditTotalPages] = useState(1);
    const [creditpageSize, setcreditPageSize] = useState(10);
    const [creditfilters, setcreditFilters] = useState([]);
    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchData();
            await fetchDataCredit();
            setInitialLoad(false);
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!initialLoad) {
            fetchData();
        }
    }, [creditfilters, creditpageIndex, creditpageSize, initialLoad]);

    useEffect(() => {
        const fetchCreditData = async () => {
            if (!initialLoad) {
                await fetchDataCredit();
            }
        };
        fetchCreditData();
    }, [creditfilters, creditpageIndex, creditpageSize, initialLoad]);
    const wholesalerCreditColumns = [
        {
            header: 'S.No',
            accessorKey: '_id', // Using _id as a unique identifier
            cell: ({ row }) => (row.index + 1 + (creditpageIndex * creditpageSize)) + '.',
            width: 30,
        },
        {
            header: 'Wholesaler Name',
            accessorKey: 'name',
            cell: ({ getValue }) => getValue() || 'N/A',
        },
        {
            header: 'Credit Limit',
            accessorKey: 'creditLimit',
            cell: ({ getValue }) => formatCurrency(getValue()),
        },
        {
            header: 'Credit Used',
            accessorKey: 'usedCreditAmount',
            cell: ({ getValue }) => formatCurrency(getValue()),
        },
        {
            header: 'Available Credit',
            accessorKey: 'availableCreditAmount',
            cell: ({ getValue }) => formatCurrency(getValue()),
        },
        {
            header: 'Last Payment Date',
            accessorKey: 'lastPaidedDate',
            cell: ({ getValue }) => formatDate(getValue()),
        },
    ];
    const handleNextPage = () => {
        if (creditpageIndex + 1 < credittotalPages) setcreditPageIndex(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (creditpageIndex > 0) setcreditPageIndex(prev => prev - 1);
    };
    const fetchData = async () => {
        try {
            setLoading(true);
            let input = {
                page: creditpageIndex,
                limit: creditpageSize,
                filters: creditfilters,
                type: "wholesaler",
            };
            const result = await wholesaleOrderApi.getWholesaleOrder(input);
            console.log('Wholesale order response:', result);

            if (result?.status && result?.response?.data) {
                const transformedOrders = result.response.data.map((order) => ({
                    id: order.orderCode || order._id,
                    _id: order._id,
                    name: order.name || "N/A",
                    datetime: formatDateTime(order.createdAt),
                    status: order.paymentStatus || "pending",
                    amount: `₹ ${order.total?.toLocaleString("en-IN") || "0"}`,
                    delivery: order.paymentMode || "COD",
                    stage: normalizeStatus(order.status),
                    badgeClass: getBadgeClass(order.paymentStatus),
                    originalData: order,
                }));

                setOrders(transformedOrders);
                setOrdertotalPages(result.response.totalPages);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString("en-IN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const normalizeStatus = (status) => {
        if (!status) return "Pending";

        const statusMap = {
            pending: "Pending",
            processing: "Packed",
            packed: "Packed",
            in_transit: "Shipped",
            shipped: "Shipped",
            out_for_delivery: "Shipped",
            completed: "Delivered",
            delivered: "Delivered",
            returned: "Return-initiated",
            refunded: "Return-initiated",
            cancelled: "Cancelled",
            failed: "Cancelled",
        };

        return statusMap[status.toLowerCase().trim()] || "Pending";
    };

    const getBadgeClass = (status) => {
        if (!status) return "bg-info-subtle text-info";

        const lowerStatus = status.toLowerCase();
        switch (lowerStatus) {
            case "paid":
                return "bg-success-subtle text-success";
            case "pending":
                return "bg-danger-subtle text-danger";
            case "partiallypaid":
                return "bg-warning-subtle text-warning";
            case "refunded":
                return "bg-secondary-subtle text-muted";
            case "cancelled":
                return "bg-danger-subtle text-danger";
            default:
                return "bg-info-subtle text-info";
        }
    };

    const fetchDataCredit = async () => {
        try {
            setLoadingCredit(true);
            let input = {
                page: creditpageIndex,
                limit: creditpageSize,
                filters: creditfilters,
                type: "Wholesaler"
            };
            console.log('Fetching wholesaler credit with params:', input);
            const result = await wholesalerApi.getWholesalerCredit(input);
            console.log('Wholesaler credit response:', result);

            if (result?.status && result?.response?.data) {
                setWholesalersCredit(result.response.data);
                setTotalCredit(result.response.total || result.response.data.length);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoadingCredit(false);
        }
    };


    const formatCurrency = (amount) => {
        if (!amount) return '₹ 0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount).replace('₹', '₹ ');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit'
        });
    };

    if (loading && initialLoad) {
        return <div className="text-center py-5">Loading orders...</div>;
    }
    const orderColumns = [
        {
            header: 'S.No',
            accessorKey: 'id',
            cell: ({ row }) => row.index + 1 + (orderpageIndex * orderpageSize),
            width: 60,
        },
        {
            header: 'Order ID',
            accessorKey: 'id',
        },
        {
            header: 'Wholesaler Name',
            accessorKey: 'name',
        },
        {
            header: 'Order Date & Time',
            accessorKey: 'datetime',
        },
        {
            header: 'Payment Status',
            accessorKey: 'status',
            cell: ({ row }) => (
                <span className={`badge badge-pill font-size-12 ${row.original.badgeClass}`}>
                    {row.original.status}
                </span>
            ),
        },
        {
            header: 'Total Amount',
            accessorKey: 'amount',
        },
        {
            header: 'Payment Mode',
            accessorKey: 'delivery',
        },
    ];
 const orderhandleNextPage = () => {
        if (orderpageIndex + 1 < ordertotalPages) setOrderpageIndex(prev => prev + 1);
    };

    const orderhandlePreviousPage = () => {
        if (orderpageIndex > 0) setOrderpageIndex(prev => prev - 1);
    };
    // Usage with React Table

    return (


        <div>



            <div className="col-xxl-12">
                <div className="card p-0 overflow-hidden position-relative radius-12 h-100">
                    {/* <div className="card-header py-16 px-24 bg-base border border-end-0 border-start-0 border-top-0">
                <h6 className="text-lg mb-0">Focus Tabs </h6>
            </div> */}
                    <div className="card-body p-24 pt-10">
                        <ul
                            className="nav focus-tab nav-pills nav-justified mb-16"
                            id="pills-tab-two"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link fw-semibold text-primary-light radius-4 px-16 py-10 active"
                                    id="pills-focus-home-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-focus-home"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-focus-home"
                                    aria-selected="true"
                                >
                                    Wholesaler Order Report
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link fw-semibold text-primary-light radius-4 px-16 py-10"
                                    id="pills-focus-details-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-focus-details"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-focus-details"
                                    aria-selected="false"
                                >
                                    Outstanding Credit Report
                                </button>
                            </li>

                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link fw-semibold text-primary-light radius-4 px-16 py-10"
                                    id="pills-focus-last-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-focus-last"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-focus-last"
                                    aria-selected="false"
                                >
                                    Top Wholesalers Report
                                </button>
                            </li>

                        </ul>
                        <div className="tab-content" id="pills-tab-twoContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-focus-home"
                                role="tabpanel"
                                aria-labelledby="pills-focus-home-tab"
                                tabIndex={0}
                            >
                                <div>

                                    <div className="card h-100 p-0 radius-12">
                                        <div className="card-header border-bottom bg-base py-16 px-24 d-flex  flex-wrap gap-3 justify-content-start">
                                            <div className="paymenthistorytitlee">
                                                <h5>Order Report</h5>
                                            </div>

                                        </div>

                                        {/* <div className="card-body p-24"> */}
                                        {/* <div className="tab-content p-3 text-muted"> */}
                                        <div className="tab-pane fade show active">
                                            <div className="card">
                                                <div className="card-body">
                                                    <ReactTableComponent
                                                        data={orders}
                                                        columns={orderColumns}
                                                        // filterableColumns={attributeFilter}
                                                        pageIndex={orderpageIndex}
                                                        totalPages={ordertotalPages}
                                                        onNextPage={orderhandleNextPage}
                                                        onPreviousPage={orderhandlePreviousPage}
                                                        filters={creditfilters}
                                                        setFilters={setcreditFilters}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="pills-focus-details"
                                role="tabpanel"
                                aria-labelledby="pills-focus-details-tab"
                                tabIndex={0}
                            >

                                <div className="card h-100 p-0 radius-12">
                                    <div className="card-header border-bottom bg-base py-16 px-24 d-flex  flex-wrap gap-3 justify-content-start">
                                        <div className="paymenthistorytitlee">
                                            <h5>Credit Report</h5>
                                        </div>

                                    </div>

                                    <div className="card-body p-24">
                                        {/* <div className="card-body"> */}
                                        <div className="table-responsive">
                                            <ReactTableComponent
                                                data={wholesalersCredit}
                                                columns={wholesalerCreditColumns}
                                                // filterableColumns={attributeFilter}
                                                pageIndex={creditpageIndex}
                                                totalPages={credittotalPages}
                                                onNextPage={handleNextPage}
                                                onPreviousPage={handlePreviousPage}
                                                filters={creditfilters}
                                                setFilters={setcreditFilters}
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div
                                className="tab-pane fade"
                                id="pills-focus-last"
                                role="tabpanel"
                                aria-labelledby="pills-focus-last-tab"
                                tabIndex={0}
                            >

                                <div className="card h-100 p-0 radius-12">
                                    <div className="card-header border-bottom bg-base py-16 px-24 d-flex  flex-wrap gap-3 justify-content-start">
                                        <div className="paymenthistorytitlee">
                                            <h5>Wholesalers Report</h5>
                                        </div>

                                    </div>

                                    <div className="card-body p-24">

                                    </div>




                                </div>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default WholesalerReport;
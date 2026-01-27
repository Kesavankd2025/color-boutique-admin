import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { IMAGE_URL } from '../../src/network/apiClient';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import apiProvider from '../apiProvider/wholesaleorderapi';
import ReactTableComponent from '../table/ReactTableComponent';

const ItemsPerPage = 10; // Number of items per page

const PaymentCreditreportLayer = () => {
    // Unpaid Orderssss
    const [unPaidOrders, setUnPaidOrders] = useState([]);
    const [unpaidpageIndex, setunpaidPageIndex] = useState(0);
    const [unpaidtotalPages, setunpaidTotalPages] = useState(1);
    const [unpaidpageSize, setunpaidPageSize] = useState(10);
    const [unpaidfilters, setunpaidFilters] = useState([]);
    const [unpaidsorting, setunpaidSorting] = useState([]);
    // daily payment reports
    const [dailyPaymentOrders, setdailyPaymentOrders] = useState([]);
    const [dailyPaymentpageIndex, setdailyPaymentPageIndex] = useState(0);
    const [dailyPaymenttotalPages, setdailyPaymentTotalPages] = useState(1);
    const [dailyPaymentpageSize, setdailyPaymentPageSize] = useState(10);
    const [dailyPaymentfilters, setdailyPaymentFilters] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    // unpaidOrders
    useEffect(() => {
        fetchUnpaidOrderData();
    }, [unpaidpageIndex, unpaidpageSize, unpaidfilters]);
    const fetchUnpaidOrderData = async () => {
        try {
            const input = {
                page: unpaidpageIndex,
                limit: unpaidpageSize,
                filters: unpaidfilters,
            };

            const response = await apiProvider.getUnpaidOrderList(input);
            if (response.status) {
                setUnPaidOrders(response.response.data || []);
                setunpaidTotalPages(response.response.totalPages || 0);
            }
        } catch (error) {
            console.error("Error fetching order list:", error);
        }
    };
    const orderColumns = useMemo(() => [
        {
            header: 'S.No',
            cell: info => info.row.index + 1,
        },
        {
            header: 'Order Code',
            accessorKey: 'orderCode',
        },
        {
            header: 'Vendor',
            accessorKey: 'vendorName',
        },
        {
            header: 'Total Amount',
            accessorKey: 'totalAmount',
            cell: info => `₹${info.getValue().toFixed(2)}`,
        },
        {
            header: 'Payment Mode',
            accessorKey: 'paymentMode',
            cell: info => info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1).toLowerCase(),
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: info => (
                <span className={`status-badge ${info.getValue().toLowerCase()}`}>
                    {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1).toLowerCase()}
                </span>
            ),
        },
        {
            header: 'Payment Status',
            accessorKey: 'paymentStatus',
            cell: info => (
                <span className={`payment-status ${info.getValue().toLowerCase().replace('-', '')}`}>
                    {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1).toLowerCase()}
                </span>
            ),
        },
        {
            header: 'Date',
            accessorKey: 'createdAt',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        },

    ], []);
    const unpaidhandleNextPage = () => {
        if (unpaidpageIndex + 1 < unpaidtotalPages) setunpaidPageIndex(prev => prev + 1);
    };

    const unpaidhandlePreviousPage = () => {
        if (unpaidpageIndex > 0) setunpaidPageIndex(prev => prev - 1);
    };

    //    Daily Payment reports 
    useEffect(() => {
        fetchDailyPaymentData();
    }, [dailyPaymentpageIndex, dailyPaymentpageSize, dailyPaymentfilters]);

    const fetchDailyPaymentData = async () => {
        try {
            const input = {
                page: unpaidpageIndex,
                limit: unpaidpageSize,
                filters: unpaidfilters,
            };

            const response = await apiProvider.getDailypaymentList(input);
            if (response.status) {
                setdailyPaymentOrders(response.response.data || []);
                setdailyPaymentTotalPages(response.response.totalPages || 0);
            }
        } catch (error) {
            console.error("Error fetching order list:", error);
        }
    };

    const dailyPaymenthandleNextPage = () => {
        if (dailyPaymentpageIndex + 1 < dailyPaymenttotalPages) setdailyPaymentPageIndex(prev => prev + 1);
    };

    const dailyPaymentPreviousPage = () => {
        if (dailyPaymentpageIndex > 0) setdailyPaymentPageIndex(prev => prev - 1);
    };
  const DailyPaymentReportcolumns = [
    {
        accessorKey: 'index',
        header: 'S.No',
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: 'orderId',
        header: 'Purchase Number',
    },
    {
        accessorKey: 'createdAt',
        header: 'Purchase Date',
        cell: ({ getValue }) => formatDate(getValue()),
    },
    {
        accessorKey: 'vendorName',
        header: 'Vendor Name',
    },
    {
        accessorKey: 'totalPrice',
        header: 'Total Amount',
        cell: ({ getValue }) => `₹${(getValue() || 0).toLocaleString('en-IN')}`,
    },
    {
        accessorKey: 'amountPaid',
        header: 'Amount Paid',
        cell: ({ row }) => `₹${(row.original.amountPaid || 0).toLocaleString('en-IN')}`,
    },
    {
        id: 'pendingAmount',
        header: 'Pending Amount',
        cell: ({ row }) => {
            const pending = row.original.totalPrice - (row.original.amountPaid || 0);
            return `₹${pending.toLocaleString('en-IN')}`;
        },
    },
    {
        id: 'paymentStatus',
        header: 'Payment Status',
        cell: ({ row }) => {
            // Changed from paymentStatus() to getPaymentStatus() to avoid naming conflict
            const status = getPaymentStatus(row.original);

            if (status === 'Paid') {
                return (
                    <button type="button" className="btn btn-subtle-success btn-sm waves-effect waves-light">
                        Paid
                    </button>
                );
            } else if (status === 'Partially Paid') {
                return (
                    <button type="button" className="btn btn-subtle-warning btn-sm waves-effect waves-light">
                        Partially Paid
                    </button>
                );
            } else {
                return (
                    <button type="button" className="btn btn-subtle-danger btn-sm waves-effect waves-light">
                        Pending
                    </button>
                );
            }
        },
    },
];
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    // Payment status determination function
    const getPaymentStatus = (payment) => {
        if (!payment.amountPaid) return 'Pending';
        if (payment.amountPaid >= payment.totalPrice) return 'Paid';
        return 'Partially Paid';
    };


    return (
        <div className="col-xxl-12">
            <div className="card p-0 overflow-hidden position-relative radius-12 h-100">
                <div className="card-body p-24 pt-10">
                    <ul className="nav focus-tab nav-pills nav-justified mb-16" id="pills-tab-two" role="tablist">
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
                                Daily Payment Report
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
                                Unpaid Orders Report
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
                            <div className="card h-100 p-0 radius-12">
                                <div className="card-header border-bottom bg-base py-16 px-24 d-flex flex-wrap gap-3 justify-content-start">
                                    <div className="paymenthistorytitlee">
                                        <h5>Payment Report</h5>
                                    </div>
                                </div>
                                <div className="card-body p-24">
                                    <div className="table-responsive scroll-sm">
                                        <ReactTableComponent
                                            data={dailyPaymentOrders}
                                            columns={DailyPaymentReportcolumns}
                                            // filterableColumns={attributeFilter}
                                            pageIndex={dailyPaymentpageIndex}
                                            totalPages={dailyPaymenttotalPages}
                                            onNextPage={dailyPaymenthandleNextPage}
                                            onPreviousPage={dailyPaymentPreviousPage}
                                            filters={dailyPaymentfilters}
                                            setFilters={setdailyPaymentFilters}
                                        />
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
                                <div className="card-header border-bottom bg-base py-16 px-24 d-flex flex-wrap gap-3 justify-content-start">
                                    <div className="paymenthistorytitlee">
                                        <h5>Orders Report</h5>
                                    </div>
                                </div>
                                <div className="card-body p-24">
                                    <div className="table-responsive scroll-sm">
                                        <ReactTableComponent
                                            data={unPaidOrders}
                                            columns={orderColumns}
                                            // filterableColumns={attributeFilter}
                                            pageIndex={unpaidpageIndex}
                                            totalPages={unpaidtotalPages}
                                            onNextPage={unpaidhandleNextPage}
                                            onPreviousPage={unpaidhandlePreviousPage}
                                            filters={unpaidfilters}
                                            setFilters={setunpaidFilters}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentCreditreportLayer;

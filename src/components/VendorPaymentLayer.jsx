import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/vendor';
import { IMAGE_URL } from '../network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import ReactTableComponent from '../table/ReactTableComponent';

const VendorPayment = () => {
    const [vendorPayments, setVendorPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0)

    const handleAddPayment = (payment) => {
        setSelectedPayment(payment);
        console.log(payment, "paymentpayment");

        setPaymentAmount(0);
        setPaymentMethod('');
    };

    const handlePaymentSubmit = async () => {
        if (paymentAmount <= 0 || !paymentMethod) {
            toast.error('Please enter valid payment details');
            return;
        }

        try {
            const input = {
                // orderId: selectedPayment._id,
                amount: parseFloat(paymentAmount),
                paymentMode: paymentMethod
            };

            const result = await apiProvider.updateVendorPayment(input, selectedPayment._id);

            if (result && result.status) {
                // toast.success('Payment added successfully');
                fetchData();
                // Close modal
                document.getElementById('paymentModal').classList.remove('show');
                document.querySelector('.modal-backdrop').remove();
                document.body.classList.remove('modal-open');
                document.body.style = '';
            } else {
                // toast.error(result?.message || 'Failed to add payment');
            }
        } catch (error) {
            // toast.error('An error occurred while processing payment');
            console.error(error);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const getPaymentStatus = (payment) => {
        if (!payment.amountPaid) return 'Pending';
        if (payment.amountPaid >= payment.totalPrice) return 'Paid';
        return 'Partially Paid';
    };

    const getProductsQty = (payment) => {
        // This would need to be updated based on your actual data structure
        // Currently returning a placeholder value
        return payment.items?.length || 0;
    };

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    const fetchData = async () => {
        try {
            const input = {
                page: page,
                limit: limit,
            };
            const result = await apiProvider.getVendordOrdePaymentList(input);

            if (result && result?.status) {
                const resultData = result?.response?.data || [];
                console.log(resultData, "resultData")
                setVendorPayments(resultData);
                setTotalPages(result?.response?.totalPages);
            }
        } catch (error) {
            console.error("Error fetching vendor payments:", error);
            toast.error('Failed to fetch vendor payments');
        }
    };
    const columns = [
        {
            accessorKey: 'index',
            header: 'S.No',
            cell: ({ row }) =>(page*limit)+ row.index + 1,
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
                const paymentStatus = getPaymentStatus(row.original);

                if (paymentStatus === 'Paid') {
                    return (
                        <button type="button" className="btn btn-subtle-success btn-sm waves-effect waves-light">
                            Paid
                        </button>
                    );
                } else if (paymentStatus === 'Partially Paid') {
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
        {
            id: 'actions',
            header: 'Action',
            cell: ({ row }) => (
                <ul className="list-inline mb-0">
                    <li className="list-inline-item dropdown">
                        <a
                            className="text-muted font-size-18 px-2"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                        >
                            <Icon icon="entypo:dots-three-horizontal" className="menu-icon" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                            <a
                                className="dropdown-item"
                                href="#"
                                data-bs-toggle="modal"
                                data-bs-target="#paymentModal"
                                onClick={() => handleAddPayment(row.original)}
                            >
                                Add Payment
                            </a>
                        </div>
                    </li>
                </ul>
            ),
        },
    ];
    const handleNextPage = () => {
        if (page + 1 < totalPages) setPage(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (page > 0) setPage(prev => prev - 1);
    };
    return (
        <div>
            <div className="card h-100 p-20 radius-12">
                <div className="card-body h-100 p-0 radius-12">
                    <div className="table-responsive scroll-sm">
                        <ReactTableComponent
                            data={vendorPayments}
                            columns={columns}
                            // filterableColumns={attributeFilter}
                            pageIndex={page}
                            totalPages={totalPages}
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                        // filters={filters}
                        // setFilters={setFilters}
                        />
                    </div>

                </div>
            </div>

            {/* Payment Modal */}
            <div className="modal fade" id="paymentModal" tabIndex="-1" aria-labelledby="paymentModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content radius-16 bg-base">
                        <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                            <h5 className="modal-title" id="paymentModalLabel">Add Payment</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body p-4">
                            {selectedPayment && (
                                <>
                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Vendor Name:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">{selectedPayment.vendorName}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Purchase Number:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">{selectedPayment.orderId}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Total Amount:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">₹{selectedPayment.totalPrice?.toLocaleString('en-IN') || '0'}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Amount Paid:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">₹{(selectedPayment.amountPaid || 0)?.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Pending Amount:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">₹{(selectedPayment.totalPrice - (selectedPayment.amountPaid || 0))?.toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Payment Amount</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            max={selectedPayment.totalPrice - (selectedPayment.amountPaid || 0)}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Payment Method</label>
                                        <select
                                            className="form-select"
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        >
                                            <option value="">Select Payment Method</option>
                                            <option value="Cash">Cash</option>
                                            <option value="Bank Transfer">Bank Transfer</option>
                                            <option value="UPI">UPI</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Credit Card">Credit Card</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handlePaymentSubmit}
                            >
                                Submit Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* <ToastContainer /> */}
        </div>
    );
};

export default VendorPayment;
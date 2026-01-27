import React, { useState, useEffect } from 'react';
import './styles/customerOrderLayer.css';
import { PlusCircle } from '@phosphor-icons/react';
import apiProvider from '../apiProvider/wholesaleorderapi';

function CustomerOrderPageLayer() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    const fetchData = async () => {
        try {
            setLoading(true);

            let input = {
                page: page,
                limit: limit,
                type: "customer"
            }
            const result = await apiProvider.getWholesaleOrder(input);

            if (result?.status && result?.response?.data) {
                const formattedOrders = result.response.data.map(order => ({
                    id: order.orderCode,
                    _id: order._id,
                    name: order.name || 'N/A',
                    date: formatDate(order.createdAt),
                    amount: `₹ ${order.totalAmount?.toLocaleString('en-IN') || '0'}`,
                    type: order.paymentMode || 'COD',
                    status: order.status || 'pending',
                    originalData: order
                }));

                setOrders(formattedOrders);
                setTotal(result.response.total || result.response.data.length);
            }

        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            pending: { class: 'warning', label: 'Pending' },
            processed: { class: 'info', label: 'Processed' },
            shipped: { class: 'primary', label: 'Shipped' },
            delivered: { class: 'success', label: 'Delivered' },
            returned: { class: 'danger', label: 'Returned' },
            cancelled: { class: 'secondary', label: 'Cancelled' }
        };

        const statusInfo = statusMap[status.toLowerCase()] || statusMap.pending;
        return (
            <span className={`badge bg-${statusInfo.class}`}>
                {statusInfo.label}
            </span>
        );
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="col text-end mb-3">
                                <a href="create-order">
                                    {/* <button type="button" className="btn btn-success d-flex align-items-center waves-effect waves-light">
                    <PlusCircle size={18} weight="fill" className="me-2" />
                    Create Order
                  </button> */}
                                </a>
                            </div>

                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-wrap align-items-center mb-3">
                                        <h5 className="card-title me-2">All Orders</h5>
                                        {loading && <div className="spinner-border spinner-border-sm ms-2" role="status"></div>}
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: 30 }}>S.No</th>
                                                    <th>Order ID</th>
                                                    <th>Customer Name</th>
                                                    <th>Order Date &amp; Time</th>
                                                    <th>Total Amount</th>
                                                    <th>Payment Mode</th>
                                                    <th>Order Status</th>
                                                    {/* <th>Action</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan="8" className="text-center">
                                                            <div className="spinner-border text-primary" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    <>
                                                        {orders.map((order, index) => (
                                                            <tr key={order._id}>
                                                                <td>{index + 1 + (page * limit)}.</td>
                                                                <td>{order.id}</td>
                                                                <td>{order.name}</td>
                                                                <td>{order.date}</td>
                                                                <td>{order.amount}</td>
                                                                <td>{order.type}</td>
                                                                <td>{getStatusBadge(order.status)}</td>
                                                                {/* <td>
                                                                    <ul className="list-inline mb-0">
                                                                        <li className="list-inline-item dropdown">
                                                                            <a
                                                                                className="text-muted font-size-18 px-2"
                                                                                href="#"
                                                                                role="button"
                                                                                data-bs-toggle="dropdown"
                                                                                aria-haspopup="true"
                                                                            >
                                                                                <i className="bx bx-dots-vertical-rounded"></i>
                                                                            </a>
                                                                            <div className="dropdown-menu dropdown-menu-end">
                                                                                <a className="dropdown-item" href={`order-invoices-detail`}>
                                                                                    View
                                                                                </a>
                                                                                <a
                                                                                    className="dropdown-item"
                                                                                    data-bs-toggle="modal"
                                                                                    data-bs-target="#addInvoiceModalone"
                                                                                >
                                                                                    Download Invoice
                                                                                </a>
                                                                            </div>
                                                                        </li>
                                                                    </ul>
                                                                </td> */}
                                                            </tr>
                                                        ))}
                                                        {orders.length === 0 && !loading && (
                                                            <tr>
                                                                <td colSpan="8" className="text-center text-muted">
                                                                    No orders found.
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination controls */}
                                    <div className="d-flex align-items-center mt-4 gap-3">
                                        <button
                                            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                            disabled={page === 0}
                                            className="btn btn-primary"
                                        >
                                            Previous
                                        </button>

                                        <div className="d-flex align-items-center gap-2">
                                            <div>
                                                <span>Page {page + 1}</span>
                                            </div>
                                            <div>
                                                <select
                                                    className="form-select"
                                                    value={limit}
                                                    onChange={(e) => {
                                                        setLimit(Number(e.target.value));
                                                        setPage(0); // Reset page when limit changes
                                                    }}
                                                >
                                                    <option value={10}>10</option>
                                                    <option value={25}>25</option>
                                                    <option value={50}>50</option>
                                                </select>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setPage((prev) => prev + 1)}
                                            disabled={(page + 1) * limit >= total}
                                            className="btn btn-primary"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CustomerOrderPageLayer;
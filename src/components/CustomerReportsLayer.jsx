import React, { useEffect, useState } from "react";
import PosdApi from "../apiProvider/posapi";
import { toast, ToastContainer } from "react-toastify";
import { Icon } from "@iconify/react/dist/iconify.js";
import ReactTableComponent from "../table/ReactTableComponent";
import { IMAGE_URL } from "../network/apiClient";
const CustomerReportsLayer = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerSearchTerm, setCustomerSearchTerm] = useState('');
    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [newCustomerModal, setNewCustomerModal] = useState(false);
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(5)
    const [orderType, setOrderType] = useState('customer');
    const [totalOrders, setTotalOrders] = useState([])
    const [orders, setOrders] = useState([]);
    const [filters, setFilters] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [totalPages, setTotalPages] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const searchCustomers = async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 3) {
            setCustomers([]);
            return;
        }

        setLoadingCustomers(true);
        try {
            console.log(searchTerm, "searchTerm");
            const response = await PosdApi.searchCustomers(searchTerm);
            console.log(response, "response--");

            if (response && response.status) {
                // Transform API response to match your customer format if needed
                const apiCustomers = response.response.data.map(customer => ({
                    id: customer._id || `C${Math.random().toString(36).substr(2, 8)}`,
                    name: customer.name,
                    mobile: customer.phone,
                    address: customer.address,
                    pincode: customer.pincode
                }));
                console.log(apiCustomers, "apiCustomers");

                setCustomers(apiCustomers);
            }
        } catch (error) {
            toast.error('Failed to search customers');
            console.error('Customer search error:', error);
        } finally {
            setLoadingCustomers(false);
        }
    };
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.mobile.includes(customerSearchTerm)
    );
    // Debounce the search to avoid too many API calls
    useEffect(() => {
        const timer = setTimeout(() => {
            searchCustomers(customerSearchTerm);
        }, 500); // 500ms debounce delay

        return () => clearTimeout(timer);
    }, [customerSearchTerm]);
    useEffect(() => {
        getCustomerOrders(selectedCustomer)
    }, [page, limit, customerSearchTerm]);

    const getCustomerOrders = async (id) => {
        try {
            const input = {
                page: page,
                limit: 5,
                type: 'customer',
                userId: selectedCustomer?.id
            };

            const response = await PosdApi.getCustomerOrders(input);
            if (response && response.status) {
                console.log(response, "response");
                setOrders(response.response.data || []);
                setTotalPages(response.response.totalPages || 0);
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
            console.error('Order fetch error:', error);
        }
    };
    const columns = React.useMemo(() => [
        {
            header: 'Order Code',
            accessorKey: 'orderCode',
        },
        {
            header: 'Date',
            accessorKey: 'createdAt',
            cell: info => new Date(info.getValue()).toLocaleDateString(),
        },
        {
            header: 'Products',
            accessorKey: 'products',
            cell: info => {
                const products = info.getValue();
                return products?.map(p => p.productName).join(', ') || 'N/A';
            },
        },
        {
            header: 'Total Amount',
            accessorKey: 'total',
            cell: info => `₹${info.getValue().toFixed(2)}`,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: info => (
                <span className={`badge ${getStatusBadgeClass(info.getValue())} text-light-600  d-inline-block`} style={{ fontSize: "13px", fontWeight: "600", padding: "13px 18px" }}>
                    {info.getValue()}
                </span>
            ),
        },
        {
            header: 'Action',
            accessorKey: '_id', // Using _id as the accessor since we don't have a 'View' field
            cell: info => (
                <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleViewClick(info.row.original)}
                >
                    View
                </button>
            ),
        }
    ], []);
    const getStatusBadgeClass = (status) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'bg-warning text-dark';
            case 'approved': return 'bg-success';
            case 'cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    };
    const handleViewClick = (data) => {
        console.log(data, "data");
        setSelectedOrder(data)
        setShowModal(true);
    }
    console.log(selectedOrder, "selectedOrder");
    const handleNextPage = () => {
        if (page + 1 < totalPages) setPage(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (page > 0) setPage(prev => prev - 1);
    };
    return (
        <div className="container">
            <div className="row align-items-center justify-content-center mt-3">
                <div className="col-md-10">
                    <div className="row justify-content-between align-items-start mb-3">
                        <div className="col-6">
                            <div className="search-box">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control bg-light border-light rounded"
                                        placeholder="Search customer by name or mobile..."
                                        value={customerSearchTerm}
                                        onChange={(e) => setCustomerSearchTerm(e.target.value)}
                                    />
                                    <Icon icon="mdi:search" className="menu-icon posicon search-icon position-absolute top-50 end-0 translate-middle-y me-3" />
                                </div>

                                {customerSearchTerm && (
                                    <div className="customer-dropdown bg-white border rounded mt-1 p-2">
                                        {loadingCustomers ? (
                                            <div className="p-2 text-center text-muted">
                                                <Icon icon="eos-icons:loading" className="me-2" />
                                                Searching...
                                            </div>
                                        ) : filteredCustomers.length > 0 ? (
                                            filteredCustomers.map(customer => (
                                                <div
                                                    key={customer.id}
                                                    className="p-2 hover-bg cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedCustomer(customer);
                                                        setCustomerSearchTerm('');
                                                        getCustomerOrders(customer)
                                                    }}
                                                >
                                                    {customer.name} ({customer.mobile})
                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                className="p-2 hover-bg cursor-pointer text-primary"
                                            >
                                                No user data found ...
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="mb-0">
                                {selectedCustomer ? (
                                    <div className="customer-info bg-light p-2 rounded">
                                        <strong><strong>Name:</strong>{selectedCustomer.name}</strong>
                                        <div><strong>Mobile:</strong>{selectedCustomer.mobile}</div>
                                        <div className=""><strong>Address:</strong>{selectedCustomer.address}</div>
                                        <div className=""><strong>Pincode:</strong>{selectedCustomer.pincode}</div>
                                    </div>
                                ) : (
                                    <div className="text-muted">No customer selected</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedCustomer && orders.length > 0 ?
                <>
                    <div className="my-5">
                        <ReactTableComponent data={orders} columns={columns}
                            pageIndex={page}
                            totalPages={totalPages}        // should be a number like 5, 10, etc.
                            onNextPage={handleNextPage}
                            onPreviousPage={handlePreviousPage}
                            filters={filters}
                            setFilters={setFilters}
                            sorting={sorting}
                            setSorting={setSorting} />
                    </div>
                </>
                :
                <></>}
            {showModal && selectedOrder && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Order #{selectedOrder.orderCode}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* Order Summary */}
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <p><strong>Customer:</strong> {selectedOrder.userName}</p>
                                        <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                        <p><strong>Mobile:</strong>{selectedOrder.contactNumber}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Status:</strong>
                                            <span className={`badge ${getStatusBadgeClass(selectedOrder.status)} text-light-600  d-inline-block`} style={{ padding: "13px 20px", fontSize: "15px", fontWeight: "600", margin: "0px 20px" }}>
                                                {selectedOrder.status}
                                            </span>
                                        </p>
                                        <p><strong>Total:</strong> ₹{selectedOrder.total.toFixed(2)}</p>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                {selectedOrder.shippingAddress && (
                                    <div className="mb-4 p-3 bg-light rounded">
                                        <p><strong>Shipping Address:</strong></p>
                                        <p>
                                            <strong>
                                                {selectedOrder.shippingAddress.street},<br />
                                                {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                                                {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
                                            </strong>

                                        </p>
                                    </div>
                                )}

                                {/* Products Gallery */}
                                <h4 className="mb-3">Ordered Products</h4>
                                <div className="row justify-content-between align-items-center">
                                    {selectedOrder.products.map((product, index) => (
                                        <div className="col-2" key={index}>
                                            <div className="card h-100 border-0 shadow-sm">
                                                {/* Product Image */}
                                                <div className="ratio ratio-1x1 bg-light">
                                                    {product.productImage?.length > 0 ? (
                                                        <img
                                                            src={`${IMAGE_URL}${product.productImage[0].docPath}/${product.productImage[0].docName}`}
                                                            alt={product.productName}
                                                            className="img-fluid object-fit-contain p-2"
                                                            style={{ height: "150px", width: "150px" }}
                                                        />
                                                    ) : (
                                                        <div className="d-flex align-items-center justify-content-center text-muted">
                                                            <Icon icon="mdi:image-off" fontSize={24} />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="card-body text-center p-2">
                                                    <h6 className="card-title mb-1">{product.productName}</h6>
                                                    <div className="d-flex justify-content-between small">
                                                        <span>Qty: {product.quantity}</span>
                                                        <span>₹{product.unitPrice.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Totals */}
                                <div className="mt-4 pt-3 border-top">
                                    <div className="row">
                                        <div className="col-md-6 offset-md-6">
                                            <table className="table table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td>Subtotal:</td>
                                                        <td className="text-end">₹{selectedOrder.subTotal.toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Tax:</td>
                                                        <td className="text-end">₹{(selectedOrder.total - selectedOrder.subTotal).toFixed(2)}</td>
                                                    </tr>
                                                    <tr className="fw-bold">
                                                        <td>Total:</td>
                                                        <td className="text-end">₹{selectedOrder.total.toFixed(2)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => window.print()}
                                >
                                    <Icon icon="mdi:printer" className="me-1" /> Print
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    )
}
export default CustomerReportsLayer;
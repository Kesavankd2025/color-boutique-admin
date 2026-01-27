import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import apiProvider from "../apiProvider/wholesaleorderapi";
import ReactTableComponent from "../table/ReactTableComponent";

const DeliveryListLayer = () => {
  // State
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("Customer");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tabCounts, setTabCounts] = useState({});
  const [filters, setFilters] = useState([]);

  const tabs = ["Customer", "Wholesaler", "Retailer", "Pos"];
  const orderFilter = ["orderCode", "name", "deliveryman", "status"];

  const statusClasses = {
    pending: "btn-subtle-warning",
    processed: "btn-subtle-info",
    shipped: "btn-subtle-secondary",
    delivered: "btn-subtle-success",
    returned: "btn-subtle-danger",
    cancelled: "btn-subtle-dark",
    approved: "btn-subtle-success",
    rejected: "btn-subtle-danger",
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleViewClick = (order) => {
    setSelectedOrderDetails(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrderDetails(null);
  };

  const handleNextPage = () => {
    if (pageIndex + 1 < Math.ceil(total / pageSize)) {
      setPageIndex(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(prev => prev - 1);
    }
  };

  const fetchTabCounts = async () => {
    try {
      const counts = {};
      for (const tab of tabs) {
        const input = {
          page: 0,
          limit: 10,
          type: tab.toLowerCase()
        };
        const result = await apiProvider.getWholesaleDeliveryOrder(input);
        counts[tab] = result?.status ? result.response?.total || 0 : 0;
      }
      setTabCounts(counts);
    } catch (error) {
      console.error("Error fetching tab counts:", error);
      const zeroCounts = tabs.reduce((acc, tab) => ({ ...acc, [tab]: 0 }), {});
      setTabCounts(zeroCounts);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const input = {
        page: pageIndex,
        limit: pageSize,
        type: activeTab.toLowerCase(),
        filters
      };

      const result = await apiProvider.getWholesaleDeliveryOrder(input);
      if (result?.status && result?.response?.data) {
        setOrders(result.response.data);
        setTotal(result.response.total || result.response.data.length);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabCounts();
    fetchData();
  }, [pageIndex, pageSize, activeTab, filters]);

  const columns = useMemo(
  () => [
    {
      id: 'sno',
      header: 'S.No',
      accessorFn: (_, index) => (pageIndex * pageSize) + index + 1,
      cell: info => info.getValue(),
    },
    {
      id: 'orderId',
      header: 'Order ID',
      accessorKey: 'orderCode',
      cell: info => info.getValue() || 'N/A',
    },
    {
      id: 'customerName',
      header: 'Customer Name',
      accessorKey: 'name',
      cell: info => info.getValue() || 'N/A',
    },
    {
      id: 'contactNumber',
      header: 'Contact Number',
      accessorKey: 'shippingAddress.contactNumber',
      cell: info => info.getValue() || 'N/A',
    },
    {
      id: 'deliveryMan',
      header: 'Delivery Man',
      accessorKey: 'deliveryman',
      cell: info => info.getValue() || 'N/A',
    },
    {
      id: 'totalAmount',
      header: 'Total Amount',
      accessorKey: 'totalAmount',
      cell: info => `₹${info.getValue()}`,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: info => {
        const value = info.getValue();
        const displayStatus = value === 'approved'
          ? 'Return-Approved'
          : value === 'rejected'
            ? 'Rejected'
            : value.charAt(0).toUpperCase() + value.slice(1);
        return (
          <button
            type="button"
            className={`btn ${statusClasses[value] || "btn-subtle-secondary"} btn-sm`}
          >
            {displayStatus}
          </button>
        );
      },
    },
    {
      id: 'deliveryDate',
      header: 'Delivery Date',
      cell: () => '-',
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <ul className="list-inline mb-0">
          <li className="list-inline-item dropdown">
            <a
              className="text-muted dropdown-toggle font-size-18 px-2"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
            >
              <i className="bx bx-dots-vertical-rounded"></i>
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <a
                className="dropdown-item"
                href="#"
                onClick={() => handleViewClick(row.original)}
              >
                View
              </a>
              <a className="dropdown-item" href="#">Assign Delivery</a>
              <a className="dropdown-item" href="#">Update Status</a>
            </div>
          </li>
        </ul>
      ),
    },
  ],
  [pageIndex, pageSize, statusClasses]
);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <h5 className="card-title mb-0">Delivery List</h5>
        <div className="d-flex align-items-center gap-3">
          <div className="dropdown">
            <a
              className="dropdown-toggle text-reset"
              href="#"
              data-bs-toggle="dropdown"
            >
              <span className="text-muted font-size-12">Filter: </span>
              <span className="fw-medium">
                Today<i className="mdi mdi-chevron-down ms-1" />
              </span>
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <a className="dropdown-item" href="#">This week</a>
              <a className="dropdown-item" href="#">This month</a>
              <a className="dropdown-item" href="#">This year</a>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-24">
        {/* Tabs */}
        <ul className="nav nav-pills red-tabs nav-justified mb-3" role="tablist">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setPageIndex(0);
                }}
              >
                <span className="d-none d-sm-block">
                  {tab}
                  {tabCounts[tab] !== undefined && (
                    <span className="badge bg-danger rounded-pill ms-1">
                      {tabCounts[tab]}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Table */}
        <div className="table-responsive scroll-sm">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <ReactTableComponent
              data={orders}
              columns={columns}
              // filterableColumns={orderFilter}
              pageIndex={pageIndex}
              totalPages={Math.ceil(total / pageSize)}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              filters={filters}
              setFilters={setFilters}
            />
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrderDetails && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1040,
              backgroundColor: "#000",
              opacity: 0.5,
            }}
            onClick={handleCloseModal}
          ></div>

          <div
            className="modal fade show"
            style={{
              display: "block",
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1050,
            }}
            aria-modal="true"
            role="dialog"
          >
            <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Order Details - {selectedOrderDetails.orderCode}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row mb-4">
                    <div className="col-md-6">
                      <h6>Customer Information</h6>
                      <p>
                        <strong>Name:</strong> {selectedOrderDetails.shippingAddress?.contactName || selectedOrderDetails.name || "N/A"}<br />
                        <strong>Phone:</strong> {selectedOrderDetails.shippingAddress?.contactNumber || "N/A"}<br />
                        <strong>Address:</strong> {selectedOrderDetails.shippingAddress?.street}, {selectedOrderDetails.shippingAddress?.city}, {selectedOrderDetails.shippingAddress?.state} - {selectedOrderDetails.shippingAddress?.postalCode}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h6>Order Information</h6>
                      <p>
                        <strong>Order Date:</strong> {formatDate(selectedOrderDetails.createdAt)}<br />
                        <strong>Status:</strong> <span className={`badge ${statusClasses[selectedOrderDetails.status] || "bg-secondary"}`}>
                          {selectedOrderDetails.status.charAt(0).toUpperCase() + selectedOrderDetails.status.slice(1)}
                        </span><br />
                        <strong>Payment:</strong> {selectedOrderDetails.paymentMode} ({selectedOrderDetails.paymentStatus})
                      </p>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Quantity</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrderDetails.items?.map((item, index) => (
                          <tr key={index}>
                            <td>Product ID: {item.productId}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.unitPrice}</td>
                            <td>₹{item.quantity * item.unitPrice}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="3" className="text-end"><strong>Total Amount:</strong></td>
                          <td><strong>₹{selectedOrderDetails.totalAmount}</strong></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                  >
                    Print Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryListLayer;
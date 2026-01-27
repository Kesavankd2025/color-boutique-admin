import React, { useState, useEffect } from "react";
import "./styles/customerOrderLayer.css";
import { PlusCircle } from "@phosphor-icons/react";
import apiProvider from "../apiProvider/wholesaleorderapi";
import { Link } from "react-router-dom";

function PosOrderStage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pages, setPages] = useState({
    delivery: 0,
    takeaway: 0,
    "dine-in": 0,
  });
  const [statusPages, setStatusPages] = useState(0); // For status-based pagination
  const [limit, setLimit] = useState(10);
  const [totals, setTotals] = useState({
    delivery: 0,
    takeaway: 0,
    "dine-in": 0,
  });
  const [activeTab, setActiveTab] = useState("delivery");
  const [activeStatusTab, setActiveStatusTab] = useState("Pending");
  const [counts, setCounts] = useState({
    delivery: 0,
    takeaway: 0,
    "dine-in": 0,
  });
  const [statusCounts, setStatusCounts] = useState({
    Pending: 0,
    Packed: 0,
    Shipped: 0,
    Delivered: 0,
    "Return-initiated": 0,
    Cancelled: 0,
  });

  const orderTypeTabs = [
    { key: "takeaway", label: "Takeaway Orders" },
    { key: "delivery", label: "Delivery Orders" },
    // { key: 'dine-in', label: 'Dine-in Orders' }
  ];

  const statusTabs = [
    "Pending",
    "Packed",
    "Shipped",
    "Delivered",
    // "Return-initiated",
    "Cancelled",
  ];

  useEffect(() => {
    fetchData();
    fetchOrderCounts();
    fetchStatusCounts();
  }, [pages, statusPages, limit, activeTab, activeStatusTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      let input = {
        page: activeTab === "delivery" ? statusPages : pages[activeTab],
        limit: limit,
        type: "pos",
        orderType: activeTab,
      };

      // Add status filter only for delivery tab
      if (activeTab === "delivery") {
        input.status = activeStatusTab.toLowerCase();
      }

      const result = await apiProvider.getWholesaleOrder(input);
      console.log(result, "resul---fdfdifodjgot");

      if (result?.status && result?.response?.data) {
        setOrders(result.response.data);

        // Update totals based on whether we're showing status tabs or not
        if (activeTab === "delivery") {
          setTotals((prev) => ({
            ...prev,
            [activeTab]: result.response.total || result.response.data.length,
          }));
        } else {
          setTotals((prev) => ({
            ...prev,
            [activeTab]: result.response.total || result.response.data.length,
          }));
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderCounts = async () => {
    try {
      const deliveryResult = await apiProvider.getWholesaleOrder({
        type: "pos",
        orderType: "delivery",
      });

      const takeawayResult = await apiProvider.getWholesaleOrder({
        type: "pos",
        orderType: "takeaway",
      });

      if (deliveryResult?.status && takeawayResult?.status) {
        setCounts({
          delivery: deliveryResult.response.count || 0,
          takeaway: takeawayResult.response.count || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  const fetchStatusCounts = async () => {
    if (activeTab !== "delivery") return;

    try {
      const counts = {};

      for (const status of statusTabs) {
        const result = await apiProvider.getWholesaleOrder({
          type: "pos",
          orderType: "delivery",
          status: status.toLowerCase(),
          countOnly: true,
        });

        counts[status] = result?.response?.count || 0;
      }

      setStatusCounts(counts);
    } catch (error) {
      console.error("Error fetching status counts:", error);
    }
  };

  const handlePageChange = (newPage) => {
    if (activeTab === "delivery") {
      setStatusPages(newPage);
    } else {
      setPages((prev) => ({
        ...prev,
        [activeTab]: newPage,
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              <div className="col text-end mb-3">
                <a href="create-order">{/* Create Order button if needed */}</a>
              </div>

              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-wrap align-items-center mb-3">
                    <h5 className="card-title me-2">All Orders</h5>
                    {loading && (
                      <div
                        className="spinner-border spinner-border-sm ms-2"
                        role="status"
                      ></div>
                    )}
                  </div>

                  {/* Main Order Type Tabs */}
                  <ul
                    className="nav nav-pills red-tabs nav-justified"
                    role="tablist"
                  >
                    {orderTypeTabs.map((tab) => (
                      <li className="nav-item" key={tab.key}>
                        <button
                          className={`nav-link ${activeTab === tab.key ? "active" : ""
                            }`}
                          onClick={() => {
                            setActiveTab(tab.key);
                            setActiveStatusTab("Pending"); // Reset status tab when changing order type
                          }}
                        >
                          <span className="d-none d-sm-block">{tab.label}</span>
                          {counts[tab.key] > 0 && (
                            <span className="badge bg-danger ms-1">
                              {counts[tab.key]}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Status Tabs - Only shown for Delivery */}
                  {activeTab === "delivery" && (
                    <ul
                      className="nav nav-pills red-tabs mt-2"
                      role="tablist"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {statusTabs.map((status) => (
                        <li className="nav-item" key={status}>
                          <button
                            className={`nav-link ${activeStatusTab === status ? "active" : ""
                              }`}
                            onClick={() => {
                              setActiveStatusTab(status);
                              setStatusPages(0); // Reset to first page when changing status
                            }}
                          >
                            <span className="d-none d-sm-block">{status}</span>
                            {statusCounts[status] > 0 && (
                              <span className="badge bg-danger ms-1">
                                {statusCounts[status]}
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tab Content */}
                  <div className="tab-content mt-3">
                    <div className="tab-pane active">
                      <div className="table-responsive">
                        <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                          <thead>
                            <tr>
                              <th style={{ width: 30 }}>S.No</th>
                              <th>Order ID</th>
                              <th>Customer Name</th>
                              <th>Order Date &amp; Time</th>
                              <th>Status</th>
                              <th>Total Amount</th>
                              <th>Payment Mode</th>
                              <th>Order Type</th>
                              {activeTab === "delivery" && <th>Action</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan="8" className="text-center">
                                  <div
                                    className="spinner-border text-primary"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              <>
                                {orders?.map((order, index) => (
                                  <tr key={order._id}>
                                    <td>
                                      {index +
                                        1 +
                                        (activeTab === "delivery"
                                          ? statusPages
                                          : pages[activeTab]) *
                                        limit}
                                      .
                                    </td>
                                    <td>{order.orderCode}</td>
                                    <td>{order.name || "N/A"}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                      <span
                                        className={`badge bg-${getStatusBadgeColor(
                                          order.status
                                        )}`}
                                      >
                                        {formatStatus(order.status)}
                                      </span>
                                    </td>
                                    <td>
                                      ₹{" "}
                                      {order.totalAmount?.toLocaleString(
                                        "en-IN"
                                      ) || "0"}
                                    </td>
                                    <td>{(order.paymentMode || "COD").charAt(0).toUpperCase() + (order.paymentMode || "COD").slice(1)}</td>
                                    <td>{(order.orderType || "N/A").charAt(0).toUpperCase() + (order.orderType || "N/A").slice(1)}</td>
                                    {activeTab === "delivery" && (
                                      <td>
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
                                              <Link
                                                className="dropdown-item"
                                                to={`/order-invoice-details-pos/${order._id}`}
                                              >
                                                View
                                              </Link>
                                              <a
                                                className="dropdown-item"
                                                href="#download"
                                              >
                                                Download Invoice
                                              </a>
                                            </div>
                                          </li>
                                        </ul>
                                      </td>
                                    )}
                                  </tr>
                                ))}
                                {(!orders || orders.length === 0) &&
                                  !loading && (
                                    <tr>
                                      <td
                                        colSpan="8"
                                        className="text-center text-muted"
                                      >
                                        No {activeTab} orders found
                                        {activeTab === "delivery"
                                          ? ` with status ${activeStatusTab}`
                                          : ""}
                                        .
                                      </td>
                                    </tr>
                                  )}
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                      {/* Pagination controls */}
                      {orders && orders.length > 0 && (
                        <div className="d-flex align-items-center mt-4 gap-3">
                          <button
                            onClick={() =>
                              handlePageChange(
                                Math.max(
                                  activeTab === "delivery"
                                    ? statusPages - 1
                                    : pages[activeTab] - 1,
                                  0
                                )
                              )
                            }
                            disabled={
                              (activeTab === "delivery"
                                ? statusPages
                                : pages[activeTab]) === 0
                            }
                            className="btn btn-primary"
                          >
                            Previous
                          </button>

                          <div className="d-flex align-items-center gap-2">
                            <div>
                              <span>
                                Page{" "}
                                {(activeTab === "delivery"
                                  ? statusPages
                                  : pages[activeTab]) + 1}
                              </span>
                            </div>
                            <div>
                              <select
                                className="form-select"
                                value={limit}
                                onChange={(e) => {
                                  setLimit(Number(e.target.value));
                                  handlePageChange(0); // Reset to first page when changing limit
                                }}
                              >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                              </select>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              handlePageChange(
                                (activeTab === "delivery"
                                  ? statusPages
                                  : pages[activeTab]) + 1
                              )
                            }
                            disabled={
                              ((activeTab === "delivery"
                                ? statusPages
                                : pages[activeTab]) +
                                1) *
                              limit >=
                              totals[activeTab]
                            }
                            className="btn btn-primary"
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </div>
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

// Helper function to get badge color based on status
function getStatusBadgeColor(status) {
  if (!status) return "secondary";

  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case "pending":
      return "warning";
    case "packed":
      return "info";
    case "shipped":
      return "primary";
    case "delivered":
      return "success";
    case "return-initiated":
      return "danger";
    case "cancelled":
      return "dark";
    default:
      return "secondary";
  }
}

export default PosOrderStage;

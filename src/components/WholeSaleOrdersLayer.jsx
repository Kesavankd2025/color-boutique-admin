import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import customerapiProvider from "../apiProvider/customerorderapi";
import InvoiceTemplate from "./InvoiceTemplate";
import "../components/styles/WholeSaleOrdersLayer.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PlusCircle } from "@phosphor-icons/react";
import apiProvider from "../apiProvider/wholesaleorderapi";
import { Link } from "react-router-dom";

const WholeSaleOrdersLayer = () => {
  const [orders, setOrders] = useState([]);
  const [downloadingOrder, setDownloadingOrder] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const invoiceTemplateRef = useRef(null);
  const [tabs] = useState([
    "Pending",
    "Packed",
    "Shipped",
    "Delivered",
    // "Return-initiated",
    "Cancelled",
  ]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [tabCounts, setTabCounts] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchTabCounts();
      await fetchData();
      setInitialLoad(false);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!initialLoad) {
      fetchData();
    }
  }, [page, limit, activeTab]);
  const fetchTabCounts = async () => {
    try {
      const counts = {};
      for (const tab of tabs) {
        const input = {
          page: 0,
          limit: 1,
          type: "customer",
          status: tab.toLowerCase(),
        };
        const result = await apiProvider.getWholesaleOrder(input);
        counts[tab] = result?.response?.total || 0;
      }
      setTabCounts(counts);
    } catch (error) {
      console.error("Error fetching tab counts:", error);
    }
  };
  const fetchData = async () => {
    try {
      setLoading(true);
      let input = {
        page: page,
        limit: limit,
        type: "wholesaler",
        status: activeTab.toLowerCase(),
      };
      const result = await apiProvider.getWholesaleOrder(input);

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
        setTotal(result.response.total || result.response.data.length);
        setTabCounts(prev => ({
          ...prev,
          [activeTab]: result.response.total
        }));
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


  const handleDownload = async (orderId) => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const result = await customerapiProvider.orderDetails(orderId);
      if (result?.status) {
        setDownloadingOrder(result.response.data);
      } else {
        console.error("Failed to fetch order details for download");
        setIsDownloading(false);
      }
    } catch (error) {
      console.error("API Error:", error);
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (downloadingOrder && invoiceTemplateRef.current) {
      html2canvas(invoiceTemplateRef.current, {
        useCORS: true,
        scale: 2,
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 0;
          pdf.addImage(
            imgData,
            "PNG",
            imgX,
            imgY,
            imgWidth * ratio,
            imgHeight * ratio
          );
          pdf.save(`invoice-${downloadingOrder.orderCode}.pdf`);
        })
        .catch((err) => {
          console.error("Error generating PDF:", err);
        })
        .finally(() => {
          setDownloadingOrder(null); // Reset after download
          setIsDownloading(false);
        });
    }
  }, [downloadingOrder]);

  if (loading && initialLoad) {
    return <div className="text-center py-5">Loading orders...</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="col text-end mb-3">
          {/* Optional: Add create order button if needed */}
        </div>

        <ul className="nav nav-pills red-tabs nav-justified" role="tablist">
          {tabs.map((tab) => (
            <li className="nav-item" key={tab}>
              <button
                className={`nav-link ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setPage(0);
                }}
              >
                <span className="d-none d-sm-block">{tab}</span>
                <span className="d-none d-sm-block">{tabCounts[tab] || 0}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="tab-content p-3 text-muted">
          <div className="tab-pane fade show active">
            <div className="card">
              <div className="card-body">
                <OrderTable
                  title={`${activeTab} Orders`}
                  data={orders}
                  pageS={page}
                  limitS={limit}
                  onDownload={handleDownload}
                  isDownloading={isDownloading}
                />
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          {downloadingOrder && (
            <InvoiceTemplate
              ref={invoiceTemplateRef}
              orderData={downloadingOrder}
              paymentStatus={downloadingOrder.paymentStatus}
            />
          )}
        </div>
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
                  setPage(0);
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
  );
};

const OrderTable = ({ title, data, pageS, limitS, onDownload, isDownloading }) => {
  return (
    <>
      <h5 className="card-title me-2 mb-3">{title}</h5>
      <div>
        <table className="table table-striped table-centered align-middle table-nowrap mb-0">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Order ID</th>
              <th>Wholesaler Name</th>
              <th>Order Date & Time</th>
              <th>Payment Status</th>
              <th>Total Amount</th>
              <th>Payment Mode</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((order, idx) => (
                <tr key={order.id}>
                  <td>{idx + 1 + pageS * limitS}</td>
                  <td>{order.id}</td>
                  <td>{order.name}</td>
                  <td>{order.datetime}</td>
                  <td>
                    <span
                      className={`badge badge-pill font-size-12 ${order.badgeClass}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.amount}</td>
                  <td>{order.delivery}</td>
                  <td>
                    <div className="dropdown" style={{ cursor: "pointer" }}>
                      <Icon
                        icon="entypo:dots-three-vertical"
                        className="menu-icon"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      />
                      <div className="dropdown-menu">
                        <Link
                          to={`/order-invoices-detail/${order._id}`}
                          className="dropdown-item"
                        >
                          View
                        </Link>
                        <a className="dropdown-item" onClick={() => onDownload(order._id)}
                          disabled={isDownloading}>
                          {isDownloading ? "Downloading..." : "Download Invoice"}
                        </a>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default WholeSaleOrdersLayer;
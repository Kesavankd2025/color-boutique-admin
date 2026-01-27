import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import AsyncSelect from 'react-select/async';
import apiProvider from "../apiProvider/wholesaleorderapi";
import customerapiProvider from "../apiProvider/customerorderapi";
import ReactTableComponent from "../table/ReactTableComponent";
import userApi from "../apiProvider/wholesalerapi";

const WholesaleOrderHistory = () => {

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [wholesalers, setWholesalers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [viewedOrder, setViewedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedWholesaler, setSelectedWholesaler] = useState("all");
  const [error, setError] = useState(null);

  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMode: "cash",
    orderId: null,
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [wholesalerOptions, setWholesalerOptions] = useState([
    { value: 'all', label: 'All Wholesalers' }
  ]);

  useEffect(() => {
    fetchData();
  }, [page, limit, selectedWholesaler]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("₹", "Rs. ");
  };

  const handleWholesalerChange = (selectedOption) => {
    setSelectedWholesaler(selectedOption.value);
    setPage(0);
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoading(true);
      const result = await customerapiProvider.orderDetails(orderId);

      if (result?.status) {
        let orderDetails = result.response.data;
        let balanceAmount = orderDetails.total - orderDetails.amountPaid;

        setViewedOrder({
          ...orderDetails,
          balanceAmount: balanceAmount,
        });

        setShowOrderModal(true);
      } else {
        toast.error("Failed to fetch order details");
      }
    } catch (error) {
      toast.error("Error fetching order details");
    } finally {
      setLoading(false);
    }
  };

  const openPaymentModal = (order) => {
    const remainingBalance = order.total - order.paidAmount;

    if (order.delivery.toLowerCase() !== "credit" && remainingBalance > 0) {
      toast.info("Full payment required for non-CREDIT orders");
      setPaymentData({
        amount: remainingBalance.toString(),
        paymentMode: order.delivery,
        orderId: order._id,
        remaining: remainingBalance,
      });
    } else {
      setPaymentData({
        amount: "",
        paymentMode: order.delivery,
        orderId: order._id,
        remaining: remainingBalance,
      });
    }

    setShowPaymentModal(true);
    setShowOrderModal(false);
  };

  const handlePaymentSubmit = async () => {
    const paymentAmount = parseFloat(paymentData.amount);

    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }

    const order = orders.find(o => o._id === paymentData.orderId);

    if (
      order.delivery.toLowerCase() !== "credit" &&
      paymentAmount < paymentData.remaining
    ) {
      toast.error(
        `Full payment of ${formatCurrency(paymentData.remaining)} required for non-CREDIT orders`
      );
      return;
    }

    if (paymentAmount > paymentData.remaining) {
      toast.error(`Payment amount cannot exceed Rs ${paymentData.remaining}`);
      return;
    }

    try {
      setLoading(true);
      const result = await customerapiProvider.updateOrderPayment(
        paymentData.orderId,
        paymentData.paymentMode,
        paymentAmount
      );

      if (result?.status) {
        setOrders((prevOrders) =>
          prevOrders.map((order) => {
            if (order._id === paymentData.orderId) {
              const newPaidAmount = order.paidAmount + paymentAmount;
              const newPaymentStatus =
                newPaidAmount >= order.total
                  ? "Paid"
                  : newPaidAmount > 0
                  ? "Partial Paid"
                  : "Unpaid";

              return {
                ...order,
                paidAmount: newPaidAmount,
                paymentStatus: newPaymentStatus,
              };
            }
            return order;
          })
        );
        setShowPaymentModal(false);
      } else {
        toast.error("Failed to record payment");
      }
    } catch (error) {
      toast.error("Error recording payment");
    } finally {
      setLoading(false);
    }
  };

  const getPaymentStatusClass = (paymentStatus) => {
    switch (paymentStatus?.toLowerCase()) {
      case "paid":
        return "bg-success-subtle text-success";
      case "partial paid":
      case "partiallypaid":
        return "bg-warning-subtle text-warning";
      case "unpaid":
        return "bg-danger-subtle text-danger";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  const viewOrderDetails = (order) => {
    fetchOrderDetails(order._id);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setViewedOrder(null);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
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
      processed: "Processed",
      shipped: "Shipped",
      delivered: "Delivered",
      returned: "Returned",
      cancelled: "Cancelled",
    };

    return statusMap[status.toLowerCase().trim()] || "Pending";
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      let input = {
        page,
        limit,
        type: "wholesaler",
      };

      if (selectedWholesaler !== "all") {
        input.Id = selectedWholesaler;
      }

      const result = await apiProvider.getWholesaleOrder(input);

      if (result?.status && result?.response?.data) {
        const ordersData = result.response.data;

        const transformedOrders = ordersData.map((order) => ({
          id: order.invoiceId || order.orderCode,
          _id: order._id,
          name: order.name || "N/A",
          datetime: formatDateTime(order.createdAt),
          paymentStatus: order.paymentStatus || "Unpaid",
          totalAmount: order.totalAmount || 0,
          paidAmount: order.amountPaid || 0,
          delivery: order.paymentMode || "COD",
          createdByUserInfo: order.createdByUserInfo || "Admin",
          stage: normalizeStatus(order.status),
          badgeClass: getPaymentStatusClass(order.paymentStatus),
          originalData: order,
          total: order.total
        }));

        setOrders(transformedOrders);
        setTotal(result.response.total || ordersData.length);
      }
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const loadWholesalerOptions = async (inputValue) => {
    try {
      if (inputValue.length < 1) {
        return wholesalerOptions;
      }

      const response = await userApi.getWholesalerList({
        search: inputValue,
        limit: 20
      });

      if (response?.status) {
        const options = response.response.data.map(wholesaler => ({
          value: wholesaler._id,
          label: wholesaler.companyName
        }));

        const updatedOptions = [
          { value: "all", label: "All Wholesalers" },
          ...options
        ];

        setWholesalerOptions(updatedOptions);   // 🔥 FIXED

        return updatedOptions;
      }

      return wholesalerOptions;
    } catch (error) {
      return wholesalerOptions;
    }
  };

  const fetchUsers = async () => {
    try {
      let input = {
        page: 0,
        limit: 100,
        type: "Wholesaler",
        from: "admin"
      };

      const response = await userApi.getWholesalerList(input);

      if (response?.response?.data) {
        const transformedProducts = response.response.data.map(product => {
          return {
            id: product._id,
            name: product.name,
          };
        });

        setWholesalers(transformedProducts);

        const options = transformedProducts.map(wholesaler => ({
          value: wholesaler.id,
          label: wholesaler.name
        }));

        setWholesalerOptions([
          { value: 'all', label: 'All Wholesalers' },
          ...options
        ]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: '44px',
      borderRadius: '8px',
      borderColor: '#ced4da',
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
  };

  const orderColumns = useMemo(
    () => [
      {
        header: 'S.No',
        id: 'sno',
        size: 60,
        cell: info => page * limit + info.row.index + 1,
      },
      {
        header: 'Order ID',
        accessorKey: 'id',
      },
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Order By',
        accessorKey: 'createdByUserInfo.name',
        cell: info => info.getValue() || '-',
      },
      {
        header: 'Date',
        accessorKey: 'datetime',
      },
      {
        header: 'Total Amount',
        accessorKey: 'originalData.totalAmount',
        cell: info => `Rs.${info.getValue() || 0}`,
      },
      {
        header: 'Paid Amount',
        accessorKey: 'paidAmount',
        cell: info => `Rs.${info.getValue() || 0}`,
      },
      {
        header: 'Balance',
        id: 'balance',
        cell: info => {
          const data = info.row.original;
          const balance = (data.originalData?.totalAmount || 0) - (data.paidAmount || 0);
          return (
            <span className={balance > 0 ? 'text-danger' : 'text-success'}>
              Rs.{balance}
            </span>
          );
        },
      },
      {
        header: 'Payment Status',
        accessorKey: 'paymentStatus',
        cell: info => {
          const order = info.row.original;
          const balance = (order.originalData?.totalAmount || 0) - (order.paidAmount || 0);
          const percentage = order.originalData?.totalAmount
            ? Math.round((order.paidAmount / order.originalData.totalAmount) * 100)
            : 0;

          return (
            <div className={`badge ${order.badgeClass} font-size-12`}>
              {order.paymentStatus}
              {order.paymentStatus === 'Partial Paid' && ` (${percentage}%)`}
            </div>
          );
        },
      },
      {
        header: 'Payment Mode',
        accessorKey: 'delivery',
      },
      {
        header: 'Order Status',
        accessorKey: 'stage',
        cell: info => {
          const stage = info.getValue();
          const btnClass =
            stage === 'Delivered'
              ? 'btn-subtle-success'
              : stage === 'Processing'
              ? 'btn-subtle-warning'
              : 'btn-subtle-danger';

          return (
            <button
              type="button"
              className={`btn btn-sm waves-effect waves-light ${btnClass}`}
            >
              {stage}
            </button>
          );
        },
      },
      {
        header: 'Actions',
        cell: info => {
          const order = info.row.original;
          return (
            <div className="d-flex justify-content-start align-items-center gap-2">

              <button
                type="button"
                className="d-flex justify-content-center align-items-center bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px rounded-circle"
                onClick={() => viewOrderDetails(order)}
              >
                <Icon icon="majesticons:eye-line" className="text-xl" />
              </button>
 {/* Add Payment */}
              {/* {balance > 0 && order.stage !== 'Cancelled' && (
                <button
                  type="button"
                  className="d-flex justify-content-center align-items-center bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px rounded-circle"
                  onClick={() => openPaymentModal(order)}
                >
                  <Icon icon="mdi:currency-inr" className="text-xl" />
                </button>
              )} */}
            </div>
          );
        },
      },
    ],
    [page, limit]
  );

  return (
    <div>
      <div className="card mb-4 p-20 radius-12">
        <div className="card-body">

          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Filter by Wholesaler:</label>

              <AsyncSelect
                id="wholesaler"
                name="wholesaler"
                defaultOptions={wholesalerOptions}
                loadOptions={loadWholesalerOptions}
                value={wholesalerOptions.find(option => option.value === selectedWholesaler)}
                onChange={handleWholesalerChange}
                isSearchable={true}
                placeholder="Type to search wholesaler..."
                noOptionsMessage={() => 'No wholesaler found'}
                loadingMessage={() => 'Searching...'}
                styles={customStyles}
                cacheOptions
                debounceTimeout={500}
              />

            </div>
          </div>

          <div className="table-responsive mt-4">
            <ReactTableComponent
              data={orders}
              columns={orderColumns}
              filterableColumns={[]}
              pageIndex={page}
              totalPages={Math.ceil(total / limit)}
              onNextPage={() => setPage(prev => prev + 1)}
              onPreviousPage={() => setPage(prev => Math.max(prev - 1, 0))}
              totalRecords={total}
              loading={loading}
            />
          </div>

        </div>
      </div>

      {/* ---------------- PAYMENT MODAL ---------------------- */}
      {showPaymentModal && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content radius-16 bg-base p-20">
              <div className="modal-header">
                <h5 className="modal-title">Record Payment</h5>
                <button type="button" className="btn-close" onClick={closePaymentModal}></button>
              </div>

              <div className="modal-body">

                <div className="mb-3">
                  <label className="form-label">
                    Amount (Balance:{" "}
                    {formatCurrency(Number(paymentData?.remaining || 0))})
                    {paymentData?.paymentMode?.toLowerCase() !== "credit" && (
                      <span className="text-danger ms-2">
                        Full payment required
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="amount"
                    min={1}
                    onChange={handlePaymentInputChange}
                    max={Number(paymentData?.remaining || 0)}
                    value={
                      paymentData?.paymentMode?.toLowerCase() !== "credit"
                        ? Number(paymentData?.remaining || 0)
                        : paymentData?.amount || ""
                    }
                    readOnly={paymentData?.paymentMode?.toLowerCase() !== "credit"}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Payment Mode</label>
                  <select
                    className="form-select"
                    name="paymentMode"
                    value={paymentData?.paymentMode}
                    onChange={handlePaymentInputChange}
                  >
                    <option value="cash">Cash</option>
                    <option value="upi">UPI</option>
                    <option value="credit">Credit</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>

              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closePaymentModal}>
                  Cancel
                </button>

                <button
                  className="btn btn-primary"
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit Payment"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {showOrderModal && viewedOrder && (
        <div className="modal" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content radius-16 bg-base p-20">

              <div className="modal-header">
                <h5 className="modal-title">Order Details</h5>
                <button type="button" className="btn-close" onClick={closeOrderModal}></button>
              </div>

              <div className="modal-body p-4">
 <div className="card-body">
                  {/* Order Info */}
                  {[
                    ['Order ID', viewedOrder.orderCode],
                    ['Name', viewedOrder.userName],
                    ['Date & Time', formatDateTime(viewedOrder.createdAt)],
                    ['Order Status', viewedOrder.status.charAt(0).toUpperCase() + viewedOrder.status.slice(1).toLowerCase()],
                  ].map(([label, value], i) => (
                    <div className="mb-3 row" key={i}>
                      <div className="col-md-6">
                        <h5 className="font-size-14 py-2">{label}:</h5>
                      </div>
                      <div className="col-md-6">
                        <span className="fw-normal text-body">{value || '-'}</span>
                      </div>
                    </div>
                  ))}

                  {/* Delivery Address */}
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Delivery Address:</h5>
                    </div>
                    <div className="col-md-6">
                      <span className="fw-normal text-body">
                        {[
                          viewedOrder.shippingAddress?.street,
                          viewedOrder.shippingAddress?.city,
                          viewedOrder.shippingAddress?.state,
                          viewedOrder.shippingAddress?.postalCode,
                          viewedOrder.shippingAddress?.country,
                        ]
                          .filter(Boolean)
                          .join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Products */}
                  <div className="mb-4">
                    <h5 className="font-size-14 py-2">Products:</h5>
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Product Name</th>
                          <th>Quantity</th>
                          <th>Price (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(viewedOrder.products || viewedOrder.items || []).map((product, idx) => (
                          <tr key={idx}>
                            <td>{product.productName || product.productId} {product.packageVolume}</td>
                            <td>{product.quantity}</td>
                            <td>₹ {(product.unitPrice * product.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Payment Status */}
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Payment Status:</h5>
                    </div>
                    <div className="col-md-6">
                      <span className={`badge ${getPaymentStatusClass(viewedOrder.paymentStatus)} font-size-12`}>
                        {viewedOrder.paymentStatus}
                        {viewedOrder.paymentStatus === "Partial Paid" && viewedOrder.amountPaid > 0 && (
                          <span> ({Math.round((viewedOrder.amountPaid / (viewedOrder.total || viewedOrder.breakdown?.total || 0)) * 100)}%)</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Amount Calculations */}
                  {(() => {
                    const total = Number(viewedOrder.total || viewedOrder.breakdown?.total || 0);
                    const paid = Number(viewedOrder.amountPaid || 0);
                    const balance = total - paid;

                    return [
                      ['Total Amount', total, 'text-body'],
                      ['Paid Amount', paid, 'text-success'],
                      ['Balance Amount', balance, balance > 0 ? 'text-danger' : 'text-success'],
                    ].map(([label, value, className], i) => (
                      <div className="mb-3 row" key={i}>
                        <div className="col-md-6">
                          <h5 className="font-size-14 py-2">{label}:</h5>
                        </div>
                        <div className="col-md-6">
                          <span className={`fw-normal ${className}`}>₹ {value.toFixed(2)}</span>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary waves-effect"
                  onClick={closeOrderModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default WholesaleOrderHistory;

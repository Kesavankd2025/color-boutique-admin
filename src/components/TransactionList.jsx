import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import PaymentApi from "../apiProvider/paymentapi";
import ReactTableComponent from "../table/ReactTableComponent";

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState([]);
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, [pageIndex, pageSize]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await PaymentApi.paymentOrderList({ pageIndex, pageSize });
      console.log(response,"response")
      if (response.status && response.response) {
        setTransactions(response.response.data);
        setTotalPages(response.response.totalPages);
      } else {
        toast.error("Failed to fetch transactions");
      }
    } catch (error) {
      toast.error("An error occurred while fetching transactions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-success-subtle text-success";
      case "partially paid":
      case "partially-paid":
        return "bg-warning-subtle text-warning";
      case "unpaid":
        return "bg-danger-subtle text-danger";
      case "refunded":
        return "bg-info-subtle text-info";
      default:
        return "bg-secondary-subtle text-secondary";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("en-GB") +
      " " +
      date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  const columns = useMemo(
    () => [
      {
        id: 'sno',
        header: 'S.No',
        cell: info => (pageIndex * pageSize) + info.row.index + 1,
      },
      {
        id: 'transactionId',
        header: 'Transaction ID',
        accessorKey: '_id',
        cell: info => info.getValue(),
      },
      {
        id: 'orderId',
        header: 'Order ID',
        accessorKey: 'orderCode',
        cell: info => info.getValue(),
      },
      {
        id: 'vendorName',
        header: 'Name',
        accessorKey: 'vendorName',
        cell: info => info.getValue(),
      },
      {
        id: 'paymentDate',
        header: 'Payment Date & Time',
        accessorKey: 'createdAt',
        cell: info => formatDate(info.getValue()),
      },
      {
        id: 'paymentMethod',
        header: 'Payment Method',
        accessorKey: 'paymentMode',
        cell: info => info.getValue(),
      },
      {
        id: 'amountPaid',
        header: 'Amount Paid',
        accessorKey: 'amountPaid',
        cell: info => formatCurrency(info.getValue()),
      },
      {
        id: 'paymentStatus',
        header: 'Payment Status',
        accessorKey: 'paymentStatus',
        cell: info => (
          <span className={`badge badge-pill ${getStatusClass(info.getValue())} font-size-12`}>
            {info.getValue()}
          </span>
        ),
      },
      {
        id: 'source',
        header: 'Source',
        accessorKey: 'source',
        cell: info => info.getValue(),
      },
      {
        id: 'invoiceNumber',
        header: 'Invoice Number',
        accessorKey: 'invoiceId',
        cell: info => info.getValue() || 'N/A',
        size:500
      },
      // Uncomment if you want to include actions
      // {
      //   id: 'actions',
      //   header: 'Actions',
      //   cell: info => (
      //     <div className="dropdown">
      //       <button
      //         className="btn btn-sm btn-light dropdown-toggle"
      //         type="button"
      //         id={`dropdownMenuButton-${info.row.id}`}
      //         data-bs-toggle="dropdown"
      //         aria-expanded="false"
      //       >
      //         <Icon icon="entypo:dots-three-vertical" />
      //       </button>
      //       <ul
      //         className="dropdown-menu dropdown-menu-end"
      //         aria-labelledby={`dropdownMenuButton-${info.row.id}`}
      //       >
      //         <li>
      //           <Link
      //             to="/order-invoices-detail"
      //             className="dropdown-item d-flex align-items-center gap-2"
      //           >
      //             View
      //           </Link>
      //         </li>
      //         <li>
      //           <Link
      //             to="/order-invoices-detail"
      //             className="dropdown-item d-flex align-items-center gap-2"
      //           >
      //             Edit
      //           </Link>
      //         </li>
      //         <li>
      //           <Link
      //             to="/order-invoices-detail"
      //             className="dropdown-item d-flex align-items-center gap-2 text-danger"
      //           >
      //             Refund
      //           </Link>
      //         </li>
      //       </ul>
      //     </div>
      //   ),
      // },
    ],
    [pageIndex, pageSize, filters, sorting]
  );
  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex(prev => prev - 1);
  };
  if (loading) {
    return <div className="text-center py-5">Loading transactions...</div>;
  }

  return (
    <div>
      <div className="card h-100 p-20 radius-12">
        <div className="card-body h-100 p-0 radius-12">
          <div className="table-responsive scroll-sm">
            <ReactTableComponent
              data={transactions}
              columns={columns}
              // filterableColumns={attributeFilter}
              pageIndex={pageIndex}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              filters={filters}
              setFilters={setFilters}
            />
          </div>

        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModalView"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                Payment Transaction Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <div class="card-body">
                <div class="mb-3 row">
                  <div class="col-md-6">
                    <h5 class="font-size-14 py-2">Transaction ID : </h5>
                  </div>

                  <div class="col-md-6">
                    <span class="fw-normal text-body">#562353</span>
                  </div>
                </div>
                <div class="mb-3 row">
                  <div class="col-md-6">
                    <h5 class="font-size-14 py-2">Order ID : </h5>
                  </div>

                  <div class="col-md-6">
                    <span class="fw-normal text-body">562354</span>
                  </div>
                </div>
                <div class="mb-3 row">
                  <div class="col-md-6">
                    <h5 class="font-size-14 py-2">
                      Customer/Wholesaler Name :{" "}
                    </h5>
                  </div>

                  <div class="col-md-6">
                    <span class="fw-normal text-body">Ravikumar G</span>
                  </div>
                </div>

                <div class="mb-3 row">
                  <div class="col-md-6">
                    <h5 class="font-size-14 py-2">
                      Payment Date &amp; Time :{" "}
                    </h5>
                  </div>

                  <div class="col-md-6">
                    <span class="fw-normal text-body">10/12/2024 05:20</span>
                  </div>
                </div>

                <div class="mb-3 row">
                  <div class="col-md-6">
                    <h5 class="font-size-14 py-2">Payment Method : </h5>
                  </div>

                  <div class="col-md-6">
                    <span class="fw-normal text-body">Mastercard</span>
                  </div>
                </div>

                <div class="mb-3 row">
                  <div class="col-md-6">
                    <h5 class="font-size-14 py-2">Amount Paid : </h5>
                  </div>

                  <div class="col-md-6">
                    <span class="fw-normal text-body"> ₹ 67,000</span>
                  </div>
                </div>

                <div class="mb-3 row">
                  <div class="col-md-6">
                    <h5 class="font-size-14 py-2">Payment Status : </h5>
                  </div>

                  <div class="col-md-6">
                    <span class="fw-normal text-body"> Paid</span>
                  </div>
                </div>

                <div class="mb-3 row">
                  <div class="col-md-6">
                    <h5 class="font-size-14 py-2">Invoice Number : </h5>
                  </div>

                  <div class="col-md-6">
                    <span class="fw-normal text-body"> IG6789</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModalEdit"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                Edit Transaction List
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div class="modal-body p-20">
              <form>
                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Transaction ID
                      </label>
                      <input
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>

                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="manufacturername">
                        Order ID
                      </label>
                      <input
                        name="Contact Person"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="manufacturerbrand">
                        Customer/Wholesaler Name
                      </label>
                      <input
                        name="Phone Number"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="price">
                        Payment Date &amp; Time
                      </label>
                      <input name="price" type="text" class="form-control" />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="manufacturername">
                        Payment Method
                      </label>
                      <select class="form-control" name="payment-method">
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="upi">UPI</option>
                        <option value="wallet">Wallet</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="credit_account">Credit Account</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-lg-6">
                    <div class="mb-6">
                      <label class="form-label" for="manufacturerbrand">
                        Amount Paid
                      </label>
                      <input
                        name="GST Number"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="choices-single-default" class="form-label">
                        Payment Status
                      </label>
                      <select
                        class="form-control"
                        data-trigger=""
                        name="choices-single-category"
                        id="choices-single-category"
                      >
                        <option value="">Select</option>
                        <option value="EL">Paid</option>
                        <option value="FA">Unpaid</option>
                        <option value="FI">Partially Paid</option>
                        <option value="FI">Refund</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label
                        for="choices-single-specifications"
                        class="form-label"
                      >
                        Invoice Number
                      </label>
                      <input
                        name="GST Number"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>
              </form>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-success waves-effect"
                  data-bs-dismiss="modal"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="btn btn-danger waves-effect waves-light"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModalRefund"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                Process Refund
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div class="modal-body p-20">
              <form>
                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Customer/Wholesaler Name
                      </label>
                      <input
                        value="Radhakrishnan"
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Transaction ID
                      </label>
                      <input
                        value="TS345678"
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Order ID
                      </label>
                      <input
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>

                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Refund Amount
                      </label>
                      <input
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="choices-single-default" class="form-label">
                        Refund Method
                      </label>
                      <select class="form-select">
                        <option selected="">Select option</option>
                        <option>Bank Transfer</option>
                        <option>UPI</option>
                        <option>Wallet</option>
                        <option>Credit Adjustment</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label
                        for="choices-single-specifications"
                        class="form-label"
                      >
                        Refund Reason
                      </label>
                      <select class="form-select">
                        <option selected="">Select option</option>
                        <option>Order Cancellation</option>
                        <option>Product Return</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary waves-effect"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary waves-effect waves-light"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;

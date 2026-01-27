import React, { useEffect, useMemo, useState } from 'react';
import wholesaleOrderApi from '../apiProvider/wholesaleorderapi';
import wholesalerApi from '../apiProvider/wholesalerapi';
import ReactTableComponent from '../table/ReactTableComponent';


const RetailerReportsLayer = () => {
  // Order related states
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Credit related states
  const [loadingCredit, setLoadingCredit] = useState(true);
  const [retailersCredit, setRetailersCredit] = useState([]);
  const [pageIndexCredit, setPageIndexCredit] = useState(0);
  const [pageSizeCredit] = useState(10);
  const [totalPagesCredit, setTotalPagesCredit] = useState(0);

  // Top performer states
  const [topRetailer, setTopRetailer] = useState([]);
  const [loadingTopRetailer, setLoadingTopRetailer] = useState(true);
  const [pageIndexTopRetailer, setPageIndexTopRetailer] = useState(0);
  const [pageSizeTopRetailer] = useState(10);
  const [totalPagesTopRetailer, setTotalPagesTopRetailer] = useState(0);
  // const [totalTopRetailer, setTotalTopRetailer] = useState(0);


  useEffect(() => {
    fetchData();
    fetchTopRetailer();
  }, [pageIndex, pageSize]);

  useEffect(() => {
    fetchDataCredit();
  }, [pageIndexCredit, pageSizeCredit]);

  useEffect(() => {
    fetchTopRetailer();
  }, [pageIndexTopRetailer, pageSizeTopRetailer]);

  const fetchTopRetailer = async () => {
    try {
      setLoadingTopRetailer(true);
      let input = {
        page: pageIndexTopRetailer,
        limit: pageSizeTopRetailer,
        type: "retailer",
        placedByModel: "Retailer"
      };

      const result = await wholesalerApi.getTopWholesaler(input);

      if (result?.status && result?.response?.data) {
        const transformedOrders = result.response.data.map((order, index) => ({
          id: order.orderId,
          _id: order.wholesalerId,
          name: order.wholesalerName || "N/A",
          datetime: formatDateTime(order.createdAt || order.orderDate),
          status: order.paymentStatus || "pending",
          totalAmount: order.totalAmountSum || 0,
          paidAmount: order.paidAmountSum || 0,
          balance: order.balance || 0,
          delivery: order.paymentMode || "COD",
          stage: normalizeStatus(order.orderStatus),
          badgeClass: getBadgeClass(order.paymentStatus),
          originalData: order,
        }));

        setTopRetailer(transformedOrders);
        console.log(transformedOrders,"transformedOrders")
        setTotalPagesTopRetailer(Math.ceil(transformedOrders.length / pageSizeTopRetailer) || 1);
      }
    } catch (error) {
      console.error("Error fetching top retailers:", error);
    } finally {
      setLoadingTopRetailer(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      let input = {
        page: pageIndex,
        limit: pageSize,
        type: "retailer",
      };
      const result = await wholesaleOrderApi.getWholesaleOrder(input);

      if (result?.status && result?.response?.data) {
        const transformedOrders = result.response.data.map((order) => ({
          id: order.orderCode || order._id,
          _id: order._id,
          name: order.name || "N/A",
          datetime: formatDateTime(order.createdAt),
          status: order.paymentStatus || "pending",
          amount: order.total || 0,
          delivery: order.paymentMode || "COD",
          stage: normalizeStatus(order.status),
          badgeClass: getBadgeClass(order.paymentStatus),
          originalData: order,
        }));

        setOrders(transformedOrders);
        setTotalPages(Math.ceil(result.response.total / pageSize) || 1);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  const orderhandleNextPage = () => {
    if (pageIndex + 1 < totalPagesCredit) setPageIndex(prev => prev + 1);
  };

  const orderhandlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex(prev => prev - 1);
  };
  const fetchDataCredit = async () => {
    try {
      setLoadingCredit(true);
      let input = {
        page: pageIndexCredit,
        limit: pageSizeCredit,
        type: "retailer"
      };
      const result = await wholesalerApi.getWholesalerCredit(input);

      if (result?.status && result?.response?.data) {
        setRetailersCredit(result.response.data);
        setTotalPagesCredit(Math.ceil(result.response.total / pageSizeCredit) || 1);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoadingCredit(false);
    }
  };
  const credithandleNextPage = () => {
    if (pageIndexCredit + 1 < totalPages) setPageIndexCredit(prev => prev + 1);
  };

  const credithandlePreviousPage = () => {
    if (pageIndexCredit > 0) setPageIndexCredit(prev => prev - 1);
  };
  const topratedhandleNextPage = () => {
    if (pageIndexTopRetailer + 1 < totalPagesTopRetailer) setPageIndexTopRetailer(prev => prev + 1);
  };

  const topratedhandlePreviousPage = () => {
    if (pageIndexTopRetailer > 0) setPageIndexTopRetailer(prev => prev - 1);
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
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

  const formatCurrency = (amount) => {
    if (!amount) return '₹ 0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount).replace('₹', '₹ ');
  };
  const ordercolumns = [
    {
      id: 'serialNo',
      header: 'S.No',
      cell: ({ row }) => row.index + 1 + (pageIndex * pageSize),
    },
    {
      accessorKey: 'id',
      header: 'Order ID',
    },
    {
      accessorKey: 'name',
      header: 'Retailer Name',
    },
    {
      accessorKey: 'datetime',
      header: 'Order Date & Time',
    },
    {
      accessorKey: 'status',
      header: 'Payment Status',
      cell: info => (
        <span className={`badge badge-pill font-size-12 ${getBadgeClass(info.getValue())}`}>
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Total Amount',
      cell: info => `₹ ${info.getValue().toLocaleString('en-IN')}`,
    },
    {
      accessorKey: 'delivery',
      header: 'Payment Mode',
    },
  ];
  const creditcolumns = useMemo(() => [
    {
      id: 'serialNo',
      header: 'S.No',
      cell: ({ row }) => row.index + 1 + (pageIndexCredit * pageSizeCredit),
      size: 50,
    },
    {
      accessorKey: 'name',
      header: 'Retailer Name',
    },
    {
      accessorKey: 'creditLimit',
      header: 'Credit Limit',
      cell: info => formatCurrency(info.getValue()),
    },
    {
      accessorKey: 'usedCreditAmount',
      header: 'Credit Used',
      cell: info => formatCurrency(info.getValue()),
    },
    {
      accessorKey: 'availableCreditAmount',
      header: 'Available Credit',
      cell: info => formatCurrency(info.getValue()),
    },
    {
      accessorKey: 'lastPaidedDate',
      header: 'Last Payment Date',
      cell: info => formatDate(info.getValue()),
    },
  ], [pageIndexCredit, pageSizeCredit]);
  const Topratedcolumns = useMemo(() => [
    {
      id: 'serialNo',
      header: 'S.No',
      cell: ({ row }) => row.index + 1 + (pageIndexTopRetailer * pageSizeTopRetailer),
      size: 50,
    },
    {
      accessorKey: 'id',
      header: 'Order ID',
    },
    {
      accessorKey: 'name',
      header: 'Retailer Name',
    },
    {
      accessorKey: 'datetime',
      header: 'Order Date & Time',
    },
    {
      accessorKey: 'stage',
      header: 'Order Status',
      cell: info => (
        <span className={`badge badge-pill font-size-12 ${getBadgeClass(info.getValue())}`}>
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: info => formatCurrency(info.getValue()),
    },
    {
      accessorKey: 'paidAmount',
      header: 'Paid Amount',
      cell: info => formatCurrency(info.getValue()),
    },
    {
      accessorKey: 'balance',
      header: 'Balance Amount',
      cell: info => formatCurrency(info.getValue()),
    },
    {
      accessorKey: 'delivery',
      header: 'Delivery',
    },
  ], [pageIndexTopRetailer, pageSizeTopRetailer]);


  if (loading && pageIndex === 0) {
    return <div className="text-center py-5">Loading orders...</div>;
  }


  return (
    <div>
      <div className="col-xxl-12">
        <div className="card p-0 overflow-hidden position-relative radius-12 h-100">
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
                  Retailer Order Report
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
                  Top Retailers Report
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
                    <div className="tab-pane fade show active">
                      <div className="card">
                        <div className="card-body">
                          <div className="table-responsive">
                            <ReactTableComponent
                              data={orders}
                              columns={ordercolumns}
                              pageIndex={pageIndex}
                              totalPages={totalPages}
                              onNextPage={orderhandleNextPage}
                              onPreviousPage={orderhandlePreviousPage}
                            // filters={filters}
                            // setFilters={setFilters}
                            />
                          </div>
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
                        data={retailersCredit}
                        columns={creditcolumns}
                        pageIndex={pageIndexCredit}
                        totalPages={totalPagesCredit}
                        onNextPage={credithandleNextPage}
                        onPreviousPage={credithandlePreviousPage}
                      // filters={filters}
                      // setFilters={setFilters}
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

                <div>

                  <div className="card h-100 p-0 radius-12">
                    <div className="card-header border-bottom bg-base py-16 px-24 d-flex  flex-wrap gap-3 justify-content-start">
                      <div className="paymenthistorytitlee">
                        <h5>Top Retailers Report</h5>
                      </div>

                    </div>

                    {/* <div className="card-body p-24"> */}
                    {/* <div className="tab-content p-3 text-muted"> */}
                    <div className="tab-pane fade show active">
                      <div className="card">
                        <div className="card-body p-24">
                          {/* <div className="card-body"> */}
                          <div className="table-responsive">
                            <ReactTableComponent
                              data={topRetailer}
                              columns={Topratedcolumns}
                              pageIndex={pageIndexTopRetailer}
                              totalPages={totalPagesTopRetailer}
                              onNextPage={topratedhandleNextPage}
                              onPreviousPage={topratedhandlePreviousPage}
                            // filters={filters}
                            // setFilters={setFilters}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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

export default RetailerReportsLayer;
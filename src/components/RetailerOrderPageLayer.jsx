import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import "../components/styles/WholeSaleOrdersLayer.css";
import { Icon } from "@iconify/react/dist/iconify.js";
import { PlusCircle } from "@phosphor-icons/react";
import apiProvider from "../apiProvider/wholesaleorderapi";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ReactTableComponent from "../table/ReactTableComponent";
import Select from "react-select";
import customerapiProvider from "../apiProvider/customerorderapi";
import vehicleApis from "../apiProvider/vehicleapi";
import Swal from "sweetalert2";
import BulkInvoiceTemplate from "./BulkInvoiceTemplate";
import LooseInvoiceTemplate from "./LooseInvoiceTemplate";
import InvoiceTemplate2 from "./InvoiceTemplate2";
import InvoiceTemplate from "./InvoiceTemplate";

const RetailerOrdersLayer = () => {
  const [orders, setOrders] = useState([]);
  const [tabs] = useState([
    "Pending",
    "Packed",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Pending");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [tabCounts, setTabCounts] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showAssignWorkerModal, setShowAssignWorkerModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectedOrderMap, setSelectedOrderMap] = useState({});
  const [deliveryman, setDeliveryman] = useState([]);
  const [loadmen, setLoadmen] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [workerData, setWorkerData] = useState({
    deliveryman: null,
    loadman: [],
    vehicleId: null,
    kilometer: "",
    incharge: null,
  });
  const [errors, setErrors] = useState({});

  const [showPendingBillSearch, setShowPendingBillSearch] = useState(false);
  const [searchPendingBill, setSearchPendingBill] = useState("");
  const [pendingBills, setPendingBills] = useState([]);
  const [selectedPendingBills, setSelectedPendingBills] = useState([]);
  const [loadingPendingBills, setLoadingPendingBills] = useState(false);
  const [loadingWorkersVehicles, setLoadingWorkersVehicles] = useState(false);

  // Print functionality states
  const [isPrinting, setIsPrinting] = useState(false);
  const [printingOrders, setPrintingOrders] = useState(null);
  const printTemplateRef = useRef(null);

  const totalPages = Math.ceil(total / pageSize) || 1;

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    } else {
      setSearchParams({ tab: "Pending" });
    }
  }, []);

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
  }, [pageIndex, pageSize, activeTab]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (showPendingBillSearch && searchPendingBill.trim()) {
        fetchPendingBills(searchPendingBill);
      } else {
        setPendingBills([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchPendingBill, showPendingBillSearch]);

  const fetchTabCounts = async () => {
    try {
      const counts = {};
      for (const tab of tabs) {
        const input = {
          page: 0,
          limit: 1,
          type: "retailer",
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
        page: pageIndex,
        limit: pageSize,
        type: "retailer",
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
        setTabCounts((prev) => ({
          ...prev,
          [activeTab]: result.response.total,
        }));
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkersAndVehicles = async () => {
    try {
      setLoadingWorkersVehicles(true);

      setWorkerData({
        deliveryman: null,
        loadman: [],
        vehicleId: null,
        kilometer: "",
        incharge: null,
      });
      setErrors({});
      const [deliveryResult, userResult, vehicleResult] = await Promise.all([
        fetchDelivery(),
        fetchUser(),
        fetchVehicle()
      ]);

      setDeliveryman(deliveryResult || []);
      setLoadmen(userResult || []);
      setVehicles(vehicleResult || []);

    } catch (error) {
      console.error("Error fetching workers and vehicles:", error);
    } finally {
      setLoadingWorkersVehicles(false);
    }
  };

  const fetchVehicle = async () => {
    try {
      const input = {
        page: 0,
        limit: 1000,
      };

      const result = await vehicleApis.getVehicles(input);
      if (result && result.status) {
        return result.response?.data || [];
      } else if (result && result.response?.message === "Invalid token") {
        console.warn("Token invalid. Redirecting to login...");
        return [];
      }
    } catch (error) {
      console.error("Error fetching vehicle data:", error);
      return [];
    }
  };

  const fetchDelivery = async () => {
    try {
      const input = {
        role: 'Delivery',
      };

      const result = await customerapiProvider.getUserList(input);
      if (result && result.status) {
        return result.response?.data || [];
      } else if (result && result.response?.message === "Invalid token") {
        console.warn("Token invalid. Redirecting to login...");
        return [];
      }
    } catch (error) {
      console.error("Error fetching delivery data:", error);
      return [];
    }
  };

  const fetchUser = async () => {
    try {
      const input = {
        role: 'LOAD MAN',
      };
      const result = await customerapiProvider.getUserList(input);

      if (result && result.status) {
        const items = result.response?.data || [];
        const filterLoadMan = items?.filter((item) => {
          return item.role?.roleName === "LOAD MAN"
        });
        return filterLoadMan || [];
      } else if (result && result.response?.message === "Invalid token") {
        console.warn("Token invalid. Redirecting to login...");
        return [];
      }
      return [];
    } catch (error) {
      console.error("Error fetching user data:", error);
      return [];
    }
  };

  const fetchPendingBills = async (searchTerm = "") => {
    if (!searchTerm || searchTerm.length < 2) {
      setPendingBills([]);
      return;
    }

    setLoadingPendingBills(true);
    try {
      let input = {
        page: 0,
        limit: 10,
        type: "retailer",
        search: searchTerm.trim(),
      };
      const response = await apiProvider.getWholesaleOrder(input);
      if (response?.status && response.response?.data) {
        setPendingBills(response.response.data);
      } else {
        setPendingBills([]);
      }
    } catch (error) {
      console.error("Error fetching pending bills:", error);
      setPendingBills([]);
    } finally {
      setLoadingPendingBills(false);
    }
  };

  const handlePrint = async () => {
    if (selectedOrders.length === 0 || isPrinting) return;

    setIsPrinting(true);
    try {
      const orderDetailsPromises = selectedOrders.map(orderId =>
        customerapiProvider.orderDetails(orderId)
      );
      const results = await Promise.all(orderDetailsPromises);

      const validOrders = results
        .filter(result => result?.status)
        .map(result => result.response.data);

      if (validOrders.length > 0) {
        setPrintingOrders(validOrders);
      }
    } catch (error) {
      console.error("Error preparing orders for printing:", error);
      setIsPrinting(false);
    }
  };

  useEffect(() => {
    if (!printingOrders || !printTemplateRef.current) return;

    const printContent = printTemplateRef.current;
    const printWindow = window.open('', '_blank');

    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Orders</title>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
      setPrintingOrders(null);
      setIsPrinting(false);
    }, 500);

  }, [printingOrders]);

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

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const toggleOrderSelection = useCallback((orderId) => {
    setSelectedOrders(prev => {
      if (prev.includes(orderId)) {
        const newSelected = prev.filter(id => id !== orderId);
        setSelectedOrderMap(prevMap => {
          const newMap = { ...prevMap };
          delete newMap[orderId];
          return newMap;
        });
        return newSelected;
      } else {
        const orderToAdd = orders.find(order => order._id === orderId);
        if (orderToAdd) {
          setSelectedOrderMap(prevMap => ({
            ...prevMap,
            [orderId]: orderToAdd
          }));
        }
        return [...prev, orderId];
      }
    });
  }, [orders]);

  const selectAllOrders = useCallback(() => {
    if (selectedOrders.length === orders.length && orders.length > 0) {
      setSelectedOrders([]);
      setSelectedOrderMap({});
    } else {
      const allOrderIds = orders.map(order => order._id);
      const orderMap = {};
      orders.forEach(order => {
        orderMap[order._id] = order;
      });
      setSelectedOrders(allOrderIds);
      setSelectedOrderMap(orderMap);
    }
  }, [orders, selectedOrders.length]);

  const resetForm = () => {
    setWorkerData({
      deliveryman: null,
      loadman: [],
      vehicleId: null,
      kilometer: "",
      incharge: null,
    });
    setErrors({});
    setSelectedPendingBills([]);
    setShowPendingBillSearch(false);
    setSearchPendingBill("");
    setPendingBills([]);
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setWorkerData(prev => ({ ...prev, loadman: selectedOptions || [] }));
    if (selectedOptions && selectedOptions.length > 0) {
      setErrors(prev => ({ ...prev, loadman: undefined }));
    }
  };

  const handleAssignWorkerSubmit = async () => {
    let newErrors = {};

    if (!workerData.deliveryman) {
      newErrors.deliveryman = "Deliveryman is required";
    }
    if (!workerData.vehicleId) {
      newErrors.vehicleId = "Vehicle is required";
    }
    if (!workerData.kilometer) {
      newErrors.kilometer = "Kilo Meter is required";
    }
    if (!workerData.loadman || workerData.loadman.length === 0) {
      newErrors.loadman = "At least one Loadman is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      const payload = {
        ...workerData,
        deliveryman: workerData.deliveryman?.value || null,
        incharge: workerData.deliveryman?.value || null,
        loadman: workerData.loadman.map(lm => lm.value),
        vehicleId: workerData.vehicleId?.value || null,
        kilometer: workerData.kilometer || null,
        orderIds: selectedOrders,
        pendingBillIds: selectedPendingBills,
        hasPendingBills: showPendingBillSearch && selectedPendingBills.length > 0
      };

      const result = await customerapiProvider.assignWorkers(selectedOrders, payload);

      if (result?.status) {
        console.log("Workers assigned successfully:", result);
        setShowAssignWorkerModal(false);
        resetForm();
        fetchData();
        setSelectedOrders([]);
        setSelectedOrderMap({});

        Swal.fire(
          'Success!',
          'Workers assigned successfully.',
          'success'
        );
      } else {
        console.error("Failed to assign workers:", result?.message);
        Swal.fire(
          'Error!',
          result?.message || 'Failed to assign workers.',
          'error'
        );
      }
    } catch (error) {
      console.error("Error assigning workers:", error);
      Swal.fire(
        'Error!',
        'An error occurred while assigning workers.',
        'error'
      );
    }
  };

  const handleAssignWorkerClick = () => {
    if (selectedOrders.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Orders Selected',
        text: 'Please select at least one order to assign workers.',
        confirmButtonColor: '#3085d6',
      });
    } else {
      setShowPreviewModal(true);
    }
  };

  const handleProceedToAssignWorker = () => {
    setShowPreviewModal(false);
    fetchWorkersAndVehicles();
    setShowAssignWorkerModal(true);
  };

  const handleCloseAssignWorkerModal = () => {
    resetForm();
    setShowAssignWorkerModal(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPageIndex(0);
    setSelectedOrders([]);
    setSelectedOrderMap({});
    setSearchParams({ tab: tab });
  };

  const columns = useMemo(() => [
    {
      id: 'select',
      header: () => (
        <input
          type="checkbox"
          checked={selectedOrders.length > 0 && selectedOrders.length === orders.length}
          onChange={selectAllOrders}
          disabled={orders.length === 0}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedOrders.includes(row.original._id)}
          onChange={() => toggleOrderSelection(row.original._id)}
          className="custom-checkbox"
        />
      ),
      size: 50,
    },
    {
      header: 'S.No',
      className: 'text-center',
      size: 70,
      cell: info => (pageIndex * pageSize) + info.row.index + 1,
    },
    {
      accessorKey: 'id',
      header: 'Order ID',
      size: 90,
    },
    {
      accessorKey: 'name',
      header: ' Name',
    },
    {
      accessorKey: 'datetime',
      header: 'Date & Time',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        const formattedStatus = status
          ? status
            .split(/[-_\s]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
          : '';
        return (
          <span className={`badge badge-pill font-size-12 ${info.row.original.badgeClass}`} style={{ textTransform: 'none' }}>
            {formattedStatus}
          </span>
        );
      }
    },
    {
      accessorKey: 'amount',
      header: 'Total Amount',
    },
    {
      accessorKey: 'delivery',
      header: 'Payment Mode',
    },
    {
      header: 'Actions',
      size: 160,
      cell: (info) => {
        const order = info.row.original;
        return (
          <div className="d-flex justify-content-start align-items-center gap-2">
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => navigate(`/order-invoice-details-retailer/${order._id}`)}
            >
              <Icon icon="majesticons:eye-line" className="text-xl" />
            </button>
          </div>
        );
      },
    }
  ], [pageIndex, pageSize, navigate, selectedOrders, orders.length, selectAllOrders, toggleOrderSelection]);

  if (loading && initialLoad) {
    return <div className="text-center py-5">Loading orders...</div>;
  }

  return (
    <>
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
                  onClick={() => handleTabChange(tab)}
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
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="form-control"
                      style={{ maxWidth: 350, minWidth: 200 }}
                      placeholder="Search..."
                      value={searchText}
                      onChange={handleSearch}
                    />
                    <div
                      className="search-icon"
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "8px",
                        color: "#6c757d",
                      }}
                    >
                      <Icon
                        icon="ic:baseline-search"
                        className="icon text-xl line-height-1"
                      />
                    </div>
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    {selectedOrders.length > 0 && (
                      <span className="badge bg-primary rounded-pill">
                        {selectedOrders.length} selected
                      </span>
                    )}
                    <button
                      className="btn btn-primary"
                      onClick={handlePrint}
                      disabled={selectedOrders.length === 0 || isPrinting}
                    >
                      <Icon icon="mdi:printer" width={20} />
                      {isPrinting
                        ? 'Printing...'
                        : `Print Selected${selectedOrders.length > 0 ? ` (${selectedOrders.length})` : ''}`}

                    </button>
                    {activeTab === "Packed" && (
                      <button
                        type="button"
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={handleAssignWorkerClick}
                        disabled={selectedOrders.length === 0}
                      >
                        <Icon icon="mdi:account-group-outline" width={20} />
                        Assign Worker
                      </button>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <ReactTableComponent
                    data={orders}
                    columns={columns}
                    pageIndex={pageIndex}
                    totalPages={totalPages}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    totalRecords={tabCounts[activeTab] || 0}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
          {printingOrders && (
            <div ref={printTemplateRef} style={{ display: 'none' }}>
              {printingOrders.map((order, index) => (
                <div
                  key={index}
                  className="invoice-container"
                  style={{
                    marginBottom: "10px",
                    pageBreakAfter: "always",
                  }}
                >
                  {order.status === "pending" ?
                    <>
                      {order.products?.some(p => p.fullPacks > 0) && (
                        <div style={{ marginBottom: "60px", pageBreakAfter: "always" }}>
                          <BulkInvoiceTemplate orderData={order} />
                        </div>
                      )}

                      {order.products?.some(p => p.looseKg > 0) && (
                        <div style={{ marginBottom: "60px", pageBreakAfter: "always" }}>
                          <LooseInvoiceTemplate orderData={order} />
                        </div>
                      )}

                      <div style={{ marginBottom: "60px", pageBreakAfter: "always" }}>
                        <InvoiceTemplate orderData={order} paymentStatus={order.paymentStatus} />
                      </div>
                    </> :
                    <>
                      <InvoiceTemplate2
                        orderData={order}
                        paymentStatus={order.paymentStatus}
                      />
                    </>
                  }

                </div>
              ))}
            </div>
          )}
        </div>
      {/* Assign Worker Modal */}
      <div className={`modal fade ${showAssignWorkerModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Assign Worker
                {loadingWorkersVehicles && (
                  <span className="ms-2 spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                )}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseAssignWorkerModal}
                disabled={loadingWorkersVehicles}
              ></button>
            </div>
            <div className="modal-body">
              {loadingWorkersVehicles ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading workers and vehicles...</span>
                  </div>
                  <p className="mt-2">Loading workers and vehicles data...</p>
                </div>
              ) : (
                <>
                  {/* Deliveryman */}
                  <div className="mb-3">
                    <label className="form-label">Deliveryman *</label>
                    <Select
                      name="deliveryman"
                      options={deliveryman.map(dm => ({ value: dm._id, label: dm.name }))}
                      value={workerData.deliveryman}
                      onChange={(selected) =>
                        setWorkerData(prev => ({ ...prev, deliveryman: selected, incharge: selected }))
                      }
                      classNamePrefix="select"
                      placeholder="Select deliveryman"
                      isDisabled={deliveryman.length === 0}
                    />
                    {deliveryman.length === 0 && (
                      <div className="text-warning small">No deliverymen available</div>
                    )}
                    {errors.deliveryman && <div className="text-danger small">{errors.deliveryman}</div>}
                  </div>

                  {/* Load Man (Multi-Select) */}
                  <div className="mb-3">
                    <label className="form-label">Load Man *</label>
                    <Select
                      isMulti
                      name="loadman"
                      options={loadmen.map(lm => ({ value: lm._id, label: lm.name }))}
                      value={workerData.loadman}
                      onChange={handleMultiSelectChange}
                      classNamePrefix="select"
                      placeholder="Select loadman(s)"
                      isDisabled={loadmen.length === 0}
                    />
                    {loadmen.length === 0 && (
                      <div className="text-warning small">No loadmen available</div>
                    )}
                    {errors.loadman && <div className="text-danger small">{errors.loadman}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Vehicle *</label>
                    <Select
                      name="vehicleId"
                      options={vehicles.map(vl => ({ value: vl._id, label: vl.vehicleNumber }))}
                      value={workerData.vehicleId}
                      onChange={(selected) =>
                        setWorkerData(prev => ({ ...prev, vehicleId: selected }))
                      }
                      classNamePrefix="select"
                      placeholder="Select vehicle"
                      isDisabled={vehicles.length === 0}
                    />
                    {vehicles.length === 0 && (
                      <div className="text-warning small">No vehicles available</div>
                    )}
                    {errors.vehicleId && <div className="text-danger small">{errors.vehicleId}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Kilo Meter *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="kilometer"
                      value={workerData.kilometer || ''}
                      onChange={(e) =>
                        setWorkerData(prev => ({ ...prev, kilometer: e.target.value }))
                      }
                      placeholder="Enter kilometers"
                      min="0"
                      step="0.1"
                    />
                    {errors.kilometer && <div className="text-danger small">{errors.kilometer}</div>}
                  </div>

                  {/* Pending Bill Checkbox */}
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={showPendingBillSearch}
                        onChange={(e) => {
                          setShowPendingBillSearch(e.target.checked);
                          if (!e.target.checked) {
                            setSearchPendingBill("");
                            setPendingBills([]);
                            setSelectedPendingBills([]);
                          }
                        }}
                        id="pendingBillCheck"
                      />
                      <label className="form-check-label" htmlFor="pendingBillCheck">
                        Include Pending Bills
                      </label>
                    </div>
                  </div>

                  {/* Pending Bill Search - Conditionally Rendered */}
                  {showPendingBillSearch && (
                    <div className="border p-3 rounded mb-3">
                      <h6 className="mb-3">Search Pending Bills</h6>
                      <div className="mb-3">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by order ID, name (minimum 2 characters)..."
                          value={searchPendingBill}
                          onChange={(e) => setSearchPendingBill(e.target.value)}
                        />
                      </div>

                      {loadingPendingBills && (
                        <div className="text-center py-2">
                          <div className="spinner-border spinner-border-sm" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}

                      {!loadingPendingBills && pendingBills.length > 0 && (
                        <div className="table-responsive mt-3">
                          <table className="table table-bordered table-sm">
                            <thead>
                              <tr>
                                <th style={{ width: '30px' }}>Select</th>
                                <th>Order ID</th>
                                <th>Name</th>
                                <th>Total Amount</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pendingBills.map((bill) => (
                                <tr key={bill._id}>
                                  <td>
                                    <input
                                      type="checkbox"
                                      checked={selectedPendingBills.includes(bill._id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedPendingBills(prev => [...prev, bill._id]);
                                        } else {
                                          setSelectedPendingBills(prev => prev.filter(id => id !== bill._id));
                                        }
                                      }}
                                    />
                                  </td>
                                  <td>{bill.orderCode || bill._id}</td>
                                  <td>{bill.name || "N/A"}</td>
                                  <td>₹ {(bill.total || 0)?.toLocaleString("en-IN")}</td>
                                  <td>
                                    <span className={`badge ${bill.paymentStatus === 'pending' ? 'bg-warning' : 'bg-primary'}`}>
                                      {bill.paymentStatus || 'pending'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {!loadingPendingBills && searchPendingBill.length >= 2 && pendingBills.length === 0 && (
                        <div className="alert alert-info py-2">
                          No pending bills found for "{searchPendingBill}"
                        </div>
                      )}

                      {!loadingPendingBills && searchPendingBill.length < 2 && (
                        <div className="alert alert-warning py-2">
                          Please enter at least 2 characters to search
                        </div>
                      )}

                      {selectedPendingBills.length > 0 && (
                        <div className="alert alert-success py-2 mt-2">
                          {selectedPendingBills.length} bill(s) selected
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected Orders Summary */}
                  <div className="border p-3 rounded mb-3">
                    <h6 className="mb-3">Orders to Assign ({selectedOrders.length})</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered table-sm">
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Name</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.values(selectedOrderMap).slice(0, 5).map(order => (
                            <tr key={order._id}>
                              <td>{order.id}</td>
                              <td>{order.name}</td>
                              <td>{order.amount}</td>
                            </tr>
                          ))}

                          {selectedOrders.length > 5 && (
                            <tr>
                              <td colSpan="3" className="text-center">
                                + {selectedOrders.length - 5} more orders
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseAssignWorkerModal}
                disabled={loadingWorkersVehicles}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAssignWorkerSubmit}
                disabled={loadingWorkersVehicles ||
                  deliveryman.length === 0 ||
                  loadmen.length === 0 ||
                  vehicles.length === 0}
              >
                Submit Assignment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Selected Orders Modal */}
      <div className={`modal fade ${showPreviewModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Selected Orders Preview ({selectedOrders.length})</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowPreviewModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Name</th>
                      <th>Total Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(selectedOrderMap).map(order => (
                      <tr key={order._id}>
                        <td>{order.id}</td>
                        <td>{order.name}</td>
                        <td>{order.amount}</td>
                        <td>{order.stage}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => toggleOrderSelection(order._id)}
                          >
                            <Icon icon="mdi:close" width={16} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {Object.values(selectedOrderMap).length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">
                          No orders selected
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowPreviewModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleProceedToAssignWorker}
                disabled={selectedOrders.length === 0}
              >
                Proceed to Assign Worker
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RetailerOrdersLayer;
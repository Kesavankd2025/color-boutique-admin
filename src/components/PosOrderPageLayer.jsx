import React, { useState, useEffect, useRef } from 'react';
import './styles/customerOrderLayer.css';
import { PlusCircle } from '@phosphor-icons/react';
import apiProvider from '../apiProvider/wholesaleorderapi';
import ReactTableComponent from '../table/ReactTableComponent';
import customerapiProvider from '../apiProvider/customerorderapi';
import InvoiceTemplate from './InvoiceTemplate'; // Import the invoice component
import { Icon } from '@iconify/react';

function PosOrderLayer() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const searchFilter = ["name", "paymentMode"]
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const invoiceTemplateRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, filters, totalPages]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const input = {
        page: pageIndex,
        limit: pageSize,
        filters: filters,
        type: "pos"
      };
      const result = await apiProvider.getWholesaleOrder(input);
      console.log(result, "result")
      if (result?.status && result?.response?.data) {
        setOrders(result.response.data);
        setTotalPages(result.response.totalPages);
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

  const formatStatus = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex(prev => prev - 1);
  };
  const columns = [
    {
      header: 'S.No',
      id: 'sno',
      cell: info => info.row.index + (page * limit) + 1,
      size: 60,
    },
    {
      header: 'Order ID',
      accessorKey: 'invoiceId',
    },
    {
      header: 'Customer Name',
      accessorKey: 'name',
      cell: ({ getValue }) => getValue() || 'N/A',
    },
    {
      header: 'Order Date & Time',
      accessorKey: 'createdAt',
      cell: ({ getValue }) => formatDate(getValue()),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => (
        <span className={`badge bg-${getStatusBadgeColor(getValue())}`}>
          {formatStatus(getValue())}
        </span>
      ),
    },
    {
      header: 'Total Amount',
      accessorKey: 'totalAmount',
      cell: ({ getValue }) => `₹ ${Number(getValue() || 0).toLocaleString('en-IN')}`,
    },
    {
      header: 'Payment Mode',
      accessorKey: 'paymentMode',
      cell: ({ getValue }) => getValue() || 'COD',
    },
    {
      header: 'Invoice',
      accessorKey: '_id',
      cell: ({ row }) => (
        <button
          type="button"
          className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
          onClick={() => fetchDetails(row.original._id)}
        >
          <Icon icon="majesticons:eye-line" className="icon text-xl" />
        </button>
      ),
      size: 80,
    }
  ];
  const fetchDetails = async (input) => {
    try {
      setLoading(true);
      const result = await customerapiProvider.orderDetails(input);
      if (result?.status && result?.response?.data) {
        setSelectedOrder(result.response.data);
        // setPaymentStatus(result.response.data.paymentStatus);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
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

              {/* <div className="card"> */}
              {/* <div className="card-body"> */}
              <div className="d-flex flex-wrap align-items-center mb-3">
                <h5 className="card-title me-2">All Orders</h5>
                {loading && <div className="spinner-border spinner-border-sm ms-2" role="status"></div>}
              </div>
              <div className="table-responsive">
                <ReactTableComponent
                  data={orders}
                  columns={columns}
                  filterableColumns={searchFilter}
                  pageIndex={pageIndex}          // should be a number like 0, 1, 2...
                  totalPages={totalPages}        // should be a number like 5, 10, etc.
                  onNextPage={handleNextPage}
                  onPreviousPage={handlePreviousPage}
                  filters={filters}
                  setFilters={setFilters}
                />
              </div>
            </div>
          </div>
          {/* </div> */}
          {/* </div> */}
        </div>
      </div>
      {selectedOrder && (
        <div className="modal-backdrop"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1050,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
            padding: '20px'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '5px',
              maxWidth: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "20px 0",
              }}
            >
              <div id="invoice-section" style={{ gap: "20px" }}>

                <div id="total-invoice-section" style={{ display: "flex", justifyContent: "center", pageBreakAfter: "always" }}>
                  <InvoiceTemplate
                    ref={invoiceTemplateRef}
                    orderData={selectedOrder}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              position: 'sticky',
              bottom: '0',
              left: '0',
              right: '0',
              display: 'flex',
              justifyContent: 'center',
              gap: '15px',
              zIndex: 1000,
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
            }}>
              <button
                onClick={() => setSelectedOrder(null)}
                className="btn btn-danger"
                style={{
                  padding: '6px 12px',
                  fontSize: '12px',
                  borderRadius: '3px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: '#dc3545',
                  color: 'white'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get badge color based on status
function getStatusBadgeColor(status) {
  if (!status) return 'secondary';

  const lowerStatus = status.toLowerCase();
  switch (lowerStatus) {
    case 'pending':
      return 'warning';
    case 'packed':
      return 'info';
    case 'shipped':
      return 'primary';
    case 'delivered':
      return 'success';
    case 'returned':
      return 'danger';
    case 'reorder':
      return 'danger';
    case 'cancelled':
      return 'dark';
    default:
      return 'secondary';
  }
}

export default PosOrderLayer;
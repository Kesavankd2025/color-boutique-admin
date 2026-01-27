import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import ReactTableComponent from '../table/ReactTableComponent';
import deliveryApi from '../apiProvider/deliveryapi';
import { useEffect } from 'react';

export default function DeliveryTrackingUpdateLayer() {
  const [orderId, setOrderId] = useState('');
  const [orderData, setOrderData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const transformOrderData = (apiData) => {
    return apiData.map(order => ({
      orderId: order.orderCode,
      customerName: order.shippingAddress?.contactName || 'N/A',
      shippingAddress: `${order.shippingAddress?.street || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.postalCode || ''}`,
      orderStatus: order.status,
      paymentStatus: order.paymentStatus,
      orderQuantity: order.items.reduce((total, item) => total + item.quantity, 0),
      products: order.items.map(item => ({
        name: `Product ID: ${item.productId}`,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      })),
      originalData: order // Keep original data for reference
    }));
  };

  const columns = [
    {
      header: 'Order ID',
      accessorKey: 'orderId',
      cell: info => <span className="text-md fw-normal">{info.getValue()}</span>
    },
    {
      header: 'Customer Name',
      accessorKey: 'customerName',
      cell: info => <span className="text-md fw-normal">{info.getValue()}</span>
    },
    {
      header: 'Shipping Address',
      accessorKey: 'shippingAddress',
      cell: info => <span className="text-md fw-normal">{info.getValue()}</span>
    },
    {
      header: 'Order Status',
      accessorKey: 'orderStatus',
      cell: info => (
        <span className={`badge ${
          info.getValue() === 'delivered' ? 'bg-success' : 
          info.getValue() === 'pending' ? 'bg-warning' : 
          'bg-secondary'
        }`}>
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      )
    },
    {
      header: 'Payment Status',
      accessorKey: 'paymentStatus',
      cell: info => (
        <span className={`badge ${
          info.getValue() === 'paid' ? 'bg-success' : 
          info.getValue() === 'pending' ? 'bg-danger' : 
          'bg-secondary'
        }`}>
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      )
    },
    {
      header: 'Quantity',
      accessorKey: 'orderQuantity',
      cell: info => <span className="text-md fw-normal">{info.getValue()}</span>
    },
    {
      header: 'Products',
      cell: info => (
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            setSelectedOrder(info.row.original);
            setShowProductsModal(true);
          }}
        >
          View Products
        </button>
      )
    }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const input = {
        orderCode: orderId
      }
      const result = await deliveryApi.DeliveryTrack(input);

      if (result.response && result.response.data && result.response.data.length > 0) {
        const transformedData = transformOrderData(result.response.data);
        setOrderData(transformedData);
      } else {
        setOrderData([]);
        // You might want to show a "No results found" message here
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrderData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header bg-base py-3">
              <h5 className="mb-0">Order Tracking Update</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSearch}>
                <div className="row">
                  {/* Order ID Search */}
                  <div className="col-lg-6">
                    <div className="mb-3">
                      <label htmlFor="orderId" className="form-label">Order ID</label>
                      <input
                        type="text"
                        className="form-control"
                        id="orderId"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter Order ID"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-lg-6 d-flex align-items-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Searching...' : 'Search Order'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Order Results Table */}
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              {orderData.length > 0 ? (
                <ReactTableComponent
                  data={orderData}
                  columns={columns}
                  isLoading={isLoading}
                />
              ) : (
                <div className="text-center py-4">
                  {isLoading ? (
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <p>No orders found. Try searching with an order ID.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Modal */}
      {selectedOrder && (
        <div
          className={`modal fade ${showProductsModal ? 'show d-block' : ''}`}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Products for Order: {selectedOrder.orderId}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowProductsModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((product, index) => (
                        <tr key={index}>
                          <td>{product.name}</td>
                          <td>{product.quantity}</td>
                          <td>₹{product.unitPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3">
                  <h6>Order Summary</h6>
                  <p>Subtotal: ₹{selectedOrder.originalData?.subTotal || 'N/A'}</p>
                  <p>Delivery Charge: ₹{selectedOrder.originalData?.deliveryCharge || 'N/A'}</p>
                  <p>Tax: ₹{selectedOrder.originalData?.customerTotalTax || 'N/A'}</p>
                  <p><strong>Total: ₹{selectedOrder.originalData?.total || 'N/A'}</strong></p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowProductsModal(false)}
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
}
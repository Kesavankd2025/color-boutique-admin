import React, { useState } from 'react';

const UpdateStockModal = ({ show, onClose }) => {
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [products, setProducts] = useState([
    {
      name: 'Premium Basmati Rice',
      productId: 'PRD001',
      inventoryId: 'INV001',
      sku: 'BAS001',
      currentQty: 120,
      updatedQty: '',
    },
    {
      name: 'Cold-Pressed Groundnut Oil',
      productId: 'PRD002',
      inventoryId: 'INV002',
      sku: 'OIL045',
      currentQty: 80,
      updatedQty: '',
    },
    {
      name: 'Farm Fresh Eggs - Pack of 6',
      productId: 'PRD003',
      inventoryId: 'INV003',
      sku: 'EGG006',
      currentQty: 200,
      updatedQty: '',
    },
  ]);

  const handleQtyChange = (index, value) => {
    const updated = [...products];
    updated[index].updatedQty = value;
    setProducts(updated);
  };

  const handleRemove = (index) => {
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);
  };

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}>
      <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Stock</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            <form>
              <div className="row">
                <div className="col-xl-12">
                  <div className="card">
                    <div className="card-body">

                      {/* Dropdowns */}
                      <div className="row g-3 align-items-center mb-3">
                        <div className="col-md-6">
                          <select
                            className="form-select"
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                          >
                            <option value="" disabled>Select Warehouse</option>
                            <option value="wh_chennai">Chennai Warehouse</option>
                            <option value="wh_madurai">Madurai Storage</option>
                            <option value="wh_hyderabad">Hyderabad Storage</option>
                            <option value="wh_delhi">Delhi Warehouse</option>
                            <option value="wh_bangalore">Bangalore Facility</option>
                            <option value="wh_mumbai">Mumbai Warehouse</option>
                          </select>
                        </div>

                        {/* Simulated Product Search */}
                        <div className="col-md-6">
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Search or Select Product"
                            disabled
                          />
                        </div>
                      </div>

                      {/* Table */}
                      <div className="table-responsive mb-3">
                        <table className="table table-bordered align-middle table-nowrap">
                          <thead className="table-light">
                            <tr>
                              <th>Product Name</th>
                              <th>Product ID</th>
                              <th>Inventory ID</th>
                              <th>SKU</th>
                              <th>Current Stock Quantity</th>
                              <th>Updated Stock Quantity</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map((product, index) => (
                              <tr key={index}>
                                <td><input type="text" className="form-control-plaintext" value={product.name} readOnly /></td>
                                <td><input type="text" className="form-control-plaintext" value={product.productId} readOnly /></td>
                                <td><input type="text" className="form-control-plaintext" value={product.inventoryId} readOnly /></td>
                                <td><input type="text" className="form-control-plaintext" value={product.sku} readOnly /></td>
                                <td><input type="text" className="form-control-plaintext" value={product.currentQty} readOnly /></td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter Quantity"
                                    value={product.updatedQty}
                                    onChange={(e) => handleQtyChange(index, e.target.value)}
                                  />
                                </td>
                                <td>
                                  <button type="button" className="btn btn-link text-danger p-0" onClick={() => handleRemove(index)}>
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-success" onClick={onClose}>Save</button>
            <button type="button" className="btn btn-danger" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateStockModal;

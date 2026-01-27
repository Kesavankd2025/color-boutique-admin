import { PlusCircle } from '@phosphor-icons/react';
import React, { useState } from 'react';

export default function StackTransferManagementLayer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const transferData = [
    {
      id: '#TRF001',
      date: '2025-03-12',
      source: 'Central Warehouse',
      destination: 'South Depot',
      product: 'Rice (Basmati)',
      quantity: '5000',
      handler: 'Rajesh Kumar',
      status: 'Pending',
      statusClass: 'btn-subtle-warning',
    },
    {
      id: '#TRF002',
      date: '2025-03-10',
      source: 'East Storage Hub',
      destination: 'West Logistics',
      product: 'Wheat Flour (Atta)',
      quantity: '3200',
      handler: 'Priya Sharma',
      status: 'In Transit',
      statusClass: 'btn-subtle-info',
    },
    {
      id: '#TRF003',
      date: '2025-03-08',
      source: 'South Depot',
      destination: 'Central Warehouse',
      product: 'Sugar (Refined)',
      quantity: '2500',
      handler: 'Anil Mehta',
      status: 'Completed',
      statusClass: 'btn-subtle-success',
    },
    {
      id: '#TRF004',
      date: '2025-03-06',
      source: 'West Logistics',
      destination: 'East Storage Hub',
      product: 'Cooking Oil (Sunflower)',
      quantity: '4000',
      handler: 'Sunita Rao',
      status: 'Pending',
      statusClass: 'btn-subtle-warning',
    },
  ];

  const handleEdit = (data) => {
    setEditData(data);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="row">
        <div className="col-xxl-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center mb-3">
                <h5 className="card-title me-2">Stock Transfer Management</h5>
                <div className="ms-auto">
                  <button
                    type="button"
                    className="btn btn-success waves-effect waves-light d-inline-flex justify-content-center align-items-center"
                    onClick={() => handleEdit(null)}
                  >
                    {/* <i className="fa fa-plus-circle font-size-16 align-middle me-2"></i> */}
                    <PlusCircle size={18} weight="fill" className="me-2" />
                    Stock Transfer
                  </button>
                </div>
              </div>

              <div style={{ maxHeight: '332px', overflowY: 'auto' }}>
                <div className="table-responsive">
                  <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Transfer ID</th>
                        <th>Date</th>
                        <th>Source Warehouse</th>
                        <th>Destination Warehouse</th>
                        <th>Product Name</th>
                        <th>Transfer Quantity</th>
                        <th>Handled By</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transferData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}.</td>
                          <td>{item.id}</td>
                          <td>{item.date}</td>
                          <td>{item.source}</td>
                          <td>{item.destination}</td>
                          <td>{item.product}</td>
                          <td>{item.quantity}</td>
                          <td>{item.handler}</td>
                          <td>
                            <button type="button" className={`btn ${item.statusClass} btn-sm`}>
                              {item.status}
                            </button>
                          </td>
                          <td>
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
                                  <button className="dropdown-item" onClick={() => handleEdit(item)}>
                                    Edit
                                  </button>
                                  <a className="dropdown-item" href="#">
                                    Delete
                                  </a>
                                </div>
                              </li>
                            </ul>
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: '#00000066' }}>
          <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Stock Transfer</h5>
                <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)}></button>
              </div>
              <div className="modal-body p-10">
                <form>
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Transfer ID</label>
                      <input type="text" className="form-control" value={editData?.id || ''} readOnly />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Date</label>
                      <input type="date" className="form-control" value={editData?.date || ''} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Source Warehouse</label>
                      <input type="text" className="form-control" value={editData?.source || ''} />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Destination Warehouse</label>
                      <input type="text" className="form-control" value={editData?.destination || ''} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Product</label>
                      <input type="text" className="form-control" value={editData?.product || ''} />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Quantity</label>
                      <input type="number" className="form-control" value={editData?.quantity || ''} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Handled By</label>
                      <input type="text" className="form-control" value={editData?.handler || ''} />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Status</label>
                      <select className="form-select" value={editData?.status?.toLowerCase().replace(' ', '_') || ''}>
                        <option value="">Select Option</option>
                        <option value="pending">Pending</option>
                        <option value="in_transit">In Transit</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button className="btn btn-success" onClick={() => setIsModalOpen(false)}>Save</button>
                <button className="btn btn-danger" onClick={() => setIsModalOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

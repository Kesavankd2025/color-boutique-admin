import { PlusCircle } from '@phosphor-icons/react';
import React, { useState } from 'react';

export default function WarehouseListLayer() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  const warehouseData = [
    {
      id: 'WH001',
      type: 'Warehouse',
      name: 'Nalsuvai Main WH',
      location: 'Chennai',
      manager: 'Ramesh Kumar',
      phone: '9845123456',
      totalCapacity: '10,000 sq.ft',
      available: '3,500 sq.ft',
      status: 'Active',
    },
    {
      id: 'WH002',
      type: 'Warehouse',
      name: 'X1 Godown',
      location: 'Coimbatore',
      manager: 'Aarthi M',
      phone: '9845009876',
      totalCapacity: '8,000 sq.ft',
      available: '0 sq.ft',
      status: 'Full',
    },
    {
      id: 'R001',
      type: 'Retail Store',
      name: 'Nalsuvai Store 1',
      location: 'Chennai (Anna Nagar)',
      manager: 'Priya D',
      phone: '9845001234',
      totalCapacity: '-',
      available: '-',
      status: 'Active',
    },
    {
      id: 'WH004',
      type: 'Warehouse',
      name: 'X2 Sub-Warehouse',
      location: 'Madurai',
      manager: 'Murugan',
      phone: '9845888888',
      totalCapacity: '6,000 sq.ft',
      available: '1,200 sq.ft',
      status: 'Active',
    },
    {
      id: 'R002',
      type: 'Retail Store',
      name: 'Nalsuvai Store 2',
      location: 'Salem',
      manager: 'Vishnu V',
      phone: '9845777777',
      totalCapacity: '-',
      available: '-',
      status: 'Inactive',
    },
    {
      id: 'WH006',
      type: 'Warehouse',
      name: 'X3 Backup Storage',
      location: 'Trichy',
      manager: 'Sanjana S',
      phone: '9845999999',
      totalCapacity: '5,000 sq.ft',
      available: '5,000 sq.ft',
      status: 'Inactive',
    },
  ];

  const handleView = (item) => setSelectedWarehouse(item);

  return (
    <>
      <div className="row">
        <div className="col-xxl-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center mb-3">
                <h5 className="card-title me-2">Warehouse List</h5>
                <div className="ms-auto">
                  <a href="add-warehouse">
                    <button type="button" className="btn btn-success waves-effect waves-light d-inline-flex justify-content-center align-items-center">
                      {/* <i className="fa fa-plus-circle font-size-16 align-middle me-2"></i> */}
                      <PlusCircle size={18} weight="fill" className="me-2" />
                      Add Warehouse
                    </button>
                  </a>
                </div>
              </div>

              <div style={{ maxHeight: '332px', overflowY: 'auto' }}>
                <div className="table-responsive">
                  <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Warehouse/Store ID</th>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Manager</th>
                        <th>Phone Number</th>
                        <th>Total Storage Capacity</th>
                        <th>Available Space</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warehouseData.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>{item.id}</td>
                          <td>{item.type}</td>
                          <td>{item.name}</td>
                          <td>{item.location}</td>
                          <td>{item.manager}</td>
                          <td>{item.phone}</td>
                          <td>{item.totalCapacity}</td>
                          <td>{item.available}</td>
                          <td>{item.status}</td>
                          <td>
                            <ul className="list-inline mb-0">
                              <li className="list-inline-item dropdown">
                                <a
                                  className="text-muted dropdown-toggle font-size-18 px-2"
                                  href="#"
                                  role="button"
                                  data-bs-toggle="dropdown"
                                  aria-haspopup="true"
                                >
                                  <i className="bx bx-dots-vertical-rounded"></i>
                                </a>
                                <div className="dropdown-menu dropdown-menu-end">
                                  <button
                                    className="dropdown-item"
                                    data-bs-toggle="modal"
                                    data-bs-target="#viewWarehouseModal"
                                    onClick={() => handleView(item)}
                                  >
                                    View
                                  </button>
                                  <a className="dropdown-item" href="add-warehouse">
                                    Edit
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

      {/* View Modal */}
      <div className="modal fade" id="viewWarehouseModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Warehouse Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-4">
              {selectedWarehouse && (
                <div className="card-body p-10">
                  {[
                    ['Warehouse Name', selectedWarehouse.name],
                    ['Location', selectedWarehouse.location],
                    ['Contact Person', selectedWarehouse.manager],
                    ['Phone Number', selectedWarehouse.phone],
                    ['Storage Capacity', selectedWarehouse.totalCapacity],
                    ['Available Space', selectedWarehouse.available],
                    ['Warehouse Type', selectedWarehouse.type],
                    ['Status', selectedWarehouse.status],
                  ].map(([label, value], i) => (
                    <div className="mb-3 row" key={i}>
                      <div className="col-md-6">
                        <h5 className="font-size-14 py-2">{label}:</h5>
                      </div>
                      <div className="col-md-6">
                        <span className="fw-normal text-body">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary waves-effect" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary waves-effect waves-light">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import "./styles/damagedGoodsManagementLayer.css"
import { PlusCircle } from '@phosphor-icons/react';

const damageReports = [
  {
    id: '#DR001',
    date: '2025-03-12',
    warehouse: 'Central Warehouse',
    type: 'Broken',
    quantity: '100 units',
    reporter: 'Rajesh Kumar',
  },
  {
    id: '#DR002',
    date: '2025-03-15',
    warehouse: 'East Depot',
    type: 'Expired',
    quantity: '50 units',
    reporter: 'Suresh Reddy',
  },
  {
    id: '#DR003',
    date: '2025-03-18',
    warehouse: 'South Warehouse',
    type: 'Spoiled',
    quantity: '120 units',
    reporter: 'Meena Devi',
  },
];

export default function DamagedGoodsManagementLayer() {
  const [selectedReport, setSelectedReport] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  const openViewModal = (report) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const openEditModal = (report) => {
    setSelectedReport(report);
    setIsEditModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <>
      {/* Table */}
      <div className="row">
        <div className="col-xxl-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center mb-3">
                <h5 className="card-title me-2">Damaged Goods Management</h5>
                <div className="ms-auto">
                  <button className="btn btn-success d-flex align-items-center waves-effect waves-light" onClick={() => setIsAddModalOpen(true)}>
                    {/* <i className="fa fa-plus-circle font-size-16 align-middle me-2"></i> */}

                    <PlusCircle size={18} weight="fill" className="me-2" />
                    Damage Goods
                  </button>
                </div>
              </div>
              <div className="mx-n4 simplebar-scrollable-y" data-simplebar style={{ maxHeight: '332px' }}>
                <div className="table-responsive">
                  <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Damage Report ID</th>
                        <th>Date</th>
                        <th>Warehouse Name</th>
                        <th>Damage Type</th>
                        <th>Quantity Affected</th>
                        <th>Reported By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {damageReports.map((report, index) => (
                        <tr key={report.id}>
                          <td>{index + 1}.</td>
                          <td>{report.id}</td>
                          <td>{report.date}</td>
                          <td>{report.warehouse}</td>
                          <td>{report.type}</td>
                          <td>{report.quantity}</td>
                          <td>{report.reporter}</td>
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
                                  <button className="dropdown-item" onClick={() => openViewModal(report)}>View</button>
                                  <button className="dropdown-item" onClick={() => openEditModal(report)}>Edit</button>
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
      {isAddModalOpen && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: '#00000066' }} tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Damaged Goods</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body p-4">
                <div className="card-body">
                  <form>
                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Damage Report ID</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Warehouse Name</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-lg-6 mb-3">
                        <label className="form-label">Damage Type</label>
                        <select className="form-select">
                          <option value="">Select Option</option>
                          <option value="Broken">Broken</option>
                          <option value="Expired">Expired</option>
                          <option value="Spoiled">Spoiled</option>
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Quantity Affected</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Reported By</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>
                  </form>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-success waves-effect" onClick={closeModal}>Save</button>
                  <button type="button" className="btn btn-danger waves-effect" onClick={closeModal}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* View Modal */}
      {isViewModalOpen && selectedReport && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: '#00000066' }} tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Damaged Goods Management Details</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body p-4">
                <div className="card-body">
                  {[
                    { label: 'Damage Report ID', value: selectedReport.id },
                    { label: 'Date', value: selectedReport.date },
                    { label: 'Warehouse Name', value: selectedReport.warehouse },
                    { label: 'Damage Type', value: selectedReport.type },
                    { label: 'Quantity Affected', value: selectedReport.quantity },
                    { label: 'Reported By', value: selectedReport.reporter },
                  ].map((item, i) => (
                    <div className="mb-3 row" key={i}>
                      <div className="col-md-6">
                        <h5 className="font-size-14 py-2">{item.label}:</h5>
                      </div>
                      <div className="col-md-6">
                        <span className="fw-normal text-body">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary waves-effect" onClick={closeModal}>Close</button>
                <button className="btn btn-primary waves-effect waves-light">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedReport && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: '#00000066' }} tabIndex="-1" role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Damaged Goods</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <form className=''>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Damage Report ID</label>
                        <input type="text" className="form-control" defaultValue={selectedReport.id} />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" defaultValue={selectedReport.date} />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Warehouse Name</label>
                        <input type="text" className="form-control" defaultValue={selectedReport.warehouse} />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label">Damage Type</label>
                        <select className="form-select" defaultValue={selectedReport.type}>
                          <option>Select Option</option>
                          <option value="Broken">Broken</option>
                          <option value="Expired">Expired</option>
                          <option value="Spoiled">Spoiled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Quantity Affected</label>
                        <input type="text" className="form-control" defaultValue={selectedReport.quantity} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="form-label">Reported By</label>
                        <input type="text" className="form-control" defaultValue={selectedReport.reporter} />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success waves-effect" onClick={closeModal}>Save</button>
                <button type="button" className="btn btn-danger waves-effect" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

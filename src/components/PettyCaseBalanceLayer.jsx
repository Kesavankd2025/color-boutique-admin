import React from 'react';

export default function PettyCaseBalanceLayer() {
  return (
    <>
      <div className="row">
        <div className="col-xxl-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center mb-3">
                <h5 className="card-title me-2">Petty Cash Balance</h5>
              </div>

              <div
                className="mx-n4 simplebar-scrollable-y"
                data-simplebar="init"
                style={{ maxHeight: '332px' }}
              >
                <div className="simplebar-wrapper" style={{ margin: '0px' }}>
                  <div className="simplebar-height-auto-observer-wrapper">
                    <div className="simplebar-height-auto-observer"></div>
                  </div>
                  <div className="simplebar-mask">
                    <div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}>
                      <div
                        className="simplebar-content-wrapper"
                        tabIndex={0}
                        role="region"
                        aria-label="scrollable content"
                        style={{ height: 'auto', overflow: 'hidden scroll' }}
                      >
                        <div className="simplebar-content" style={{ padding: '0px' }}>
                          <div className="table-responsive">
                            <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                              <thead>
                                <tr>
                                  <th>S.No</th>
                                  <th>Opening Balance</th>
                                  <th>Total Deposits</th>
                                  <th>Total Expenses</th>
                                  <th>Total Withdrawals</th>
                                  <th>Closing Balance</th>
                                  <th>Reconciliation Status</th>
                                  <th>Reconciliation Date</th>
                                  <th>Remarks</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>1.</td>
                                  <td>₹10,000</td>
                                  <td>₹5,000</td>
                                  <td>₹6,000</td>
                                  <td>₹3,000</td>
                                  <td>₹6,000</td>
                                  <td>Matched</td>
                                  <td>12/06/2024</td>
                                  <td>xxx</td>
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
                                          <a
                                            className="dropdown-item"
                                            data-bs-toggle="modal"
                                            data-bs-target="#addInvoiceModalone"
                                          >
                                            Edit
                                          </a>
                                        </div>
                                      </li>
                                    </ul>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="simplebar-placeholder"
                    style={{ width: '1902px', height: '99px' }}
                  ></div>
                </div>
                <div
                  className="simplebar-track simplebar-horizontal"
                  style={{ visibility: 'hidden' }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{ width: '0px', display: 'none' }}
                  ></div>
                </div>
                <div
                  className="simplebar-track simplebar-vertical"
                  style={{ visibility: 'visible' }}
                >
                  <div
                    className="simplebar-scrollbar"
                    style={{
                      height: '99px',
                      transform: 'translate3d(0px, 0px, 0px)',
                      display: 'block',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <div
        className="modal fade"
        id="addInvoiceModalone"
        tabIndex="-1"
        aria-labelledby="addInvoiceModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addInvoiceModalLabel">Petty Cash Balance</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div className="modal-body p-4">
              <div className="card-body">
                <form>
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Opening Balance</label>
                      <input type="text" className="form-control" placeholder="" />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Total Deposits</label>
                      <input type="text" className="form-control" placeholder="" />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Total Expenses</label>
                      <input type="text" className="form-control" placeholder="" />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Total Withdrawals</label>
                      <input type="text" className="form-control" placeholder="" />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Closing Balance</label>
                      <input type="text" className="form-control" placeholder="" />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Reconciliation Status</label>
                      <select className="form-select">
                        <option>Select Option</option>
                        <option>Matched</option>
                        <option>Mismatched</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Reconciliation Date</label>
                      <input type="date" className="form-control" />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Remarks</label>
                      <input type="text" className="form-control" placeholder="" />
                    </div>
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-success waves-effect" data-bs-dismiss="modal">Save</button>
                <button type="button" className="btn btn-danger waves-effect" data-bs-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

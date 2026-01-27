import React from 'react'
import "./styles/orderReportLayer.css"

export default function OrderReportLayer() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              {/* Nav tabs */}
              <ul className="nav nav-pills rep nav-justified" role="tablist">
                <li className="nav-item waves-effect waves-light" role="presentation">
                  <a
                    className="nav-link active"
                    data-bs-toggle="tab"
                    href="#updateorder-1"
                    role="tab"
                    aria-selected="true"
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Daily Sales Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#updatepayment-1"
                    role="tab"
                    aria-selected="false"
                    tabIndex="-1"
                  >
                    <span className="d-block d-sm-none">
                      <i className="far fa-user"></i>
                    </span>
                    <span className="d-none d-sm-block">Order Status Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#assign-1"
                    role="tab"
                    aria-selected="false"
                    tabIndex="-1"
                  >
                    <span className="d-block d-sm-none">
                      <i className="far fa-envelope"></i>
                    </span>
                    <span className="d-none d-sm-block">Customer Order Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#generate-1"
                    role="tab"
                    aria-selected="false"
                    tabIndex="-1"
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-cog"></i>
                    </span>
                    <span className="d-none d-sm-block">Product Sales Report</span>
                  </a>
                </li>

                {/* Optional Refund Tab */}
                {/* 
                <li className="nav-item waves-effect waves-light">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#cancelorder-1"
                    role="tab"
                  >
                    <span className="d-block d-sm-none">
                      <i className="fas fa-cog"></i>
                    </span>
                    <span className="d-none d-sm-block">Refund Report</span>
                  </a>
                </li> 
                */}
              </ul>

              {/* Tab panes */}
              <div className="tab-content p-3 text-muted">
                {/* Daily Sales Report */}
                <div className="tab-pane active" id="updateorder-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Sales Report</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a
                              className="dropdown-toggle text-reset"
                              href="#"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span className="text-muted font-size-12">Sort By: </span>
                              <span className="fw-medium">
                                Weekly<i className="mdi mdi-chevron-down ms-1"></i>
                              </span>
                            </a>
                            <div
                              className="dropdown-menu dropdown-menu-end"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              <a className="dropdown-item" href="#">Monthly</a>
                              <a className="dropdown-item" href="#">Yearly</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Status Report */}
                <div className="tab-pane" id="updatepayment-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Status Report</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a
                              className="dropdown-toggle text-reset"
                              href="#"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span className="text-muted font-size-12">Sort By: </span>
                              <span className="fw-medium">
                                Weekly<i className="mdi mdi-chevron-down ms-1"></i>
                              </span>
                            </a>
                            <div
                              className="dropdown-menu dropdown-menu-end"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              <a className="dropdown-item" href="#">Monthly</a>
                              <a className="dropdown-item" href="#">Yearly</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Order Report */}
                <div className="tab-pane" id="assign-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Order Report</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a
                              className="dropdown-toggle text-reset"
                              href="#"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span className="text-muted font-size-12">Sort By: </span>
                              <span className="fw-medium">
                                Weekly<i className="mdi mdi-chevron-down ms-1"></i>
                              </span>
                            </a>
                            <div
                              className="dropdown-menu dropdown-menu-end"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              <a className="dropdown-item" href="#">Monthly</a>
                              <a className="dropdown-item" href="#">Yearly</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Sales Report */}
                <div className="tab-pane" id="generate-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Product Sales Report</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a
                              className="dropdown-toggle text-reset"
                              href="#"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                            >
                              <span className="text-muted font-size-12">Sort By: </span>
                              <span className="fw-medium">
                                Weekly<i className="mdi mdi-chevron-down ms-1"></i>
                              </span>
                            </a>
                            <div
                              className="dropdown-menu dropdown-menu-end"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              <a className="dropdown-item" href="#">Monthly</a>
                              <a className="dropdown-item" href="#">Yearly</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Refund Report (optional) */}
                <div className="tab-pane" id="cancelorder-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Refund Report</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a
                              className="dropdown-toggle text-reset"
                              href="#"
                              id="dropdownMenuButton1"
                              data-bs-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                              
                            >
                              <span className="text-muted font-size-12">Sort By: </span>
                              <span className="fw-medium">
                                Weekly<i className="mdi mdi-chevron-down ms-1"></i>
                              </span>
                            </a>
                            <div
                              className="dropdown-menu dropdown-menu-end"
                              aria-labelledby="dropdownMenuButton1"
                            >
                              <a className="dropdown-item" href="#">Monthly</a>
                              <a className="dropdown-item" href="#">Yearly</a>
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
    </div>
  )
}

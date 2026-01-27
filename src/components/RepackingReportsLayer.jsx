import React from 'react';

export default function RepackingReportsLayer() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-body">
              {/* Nav tabs */}
              <ul className="nav nav-pills rep nav-justified" role="tablist">
                <li className="nav-item waves-effect waves-light" role="presentation"  style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a className="nav-link active" data-bs-toggle="tab" href="#updateorder-1" role="tab" aria-selected="true">
                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                    <span className="d-none d-sm-block">Repacking Summary Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation" style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a className="nav-link" data-bs-toggle="tab" href="#updatepayment-1" role="tab" aria-selected="false">
                    <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                    <span className="d-none d-sm-block">Wastage Analysis Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation" style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a className="nav-link" data-bs-toggle="tab" href="#assign-1" role="tab" aria-selected="false">
                    <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                    <span className="d-none d-sm-block">Repacking Efficiency Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation" style={{ backgroundColor: 'gainsboro', borderRadius: '5px' }}>
                  <a className="nav-link" data-bs-toggle="tab" href="#generate-1" role="tab" aria-selected="false">
                    <span className="d-block d-sm-none"><i className="fas fa-cog"></i></span>
                    <span className="d-none d-sm-block">Inventory Impact Report</span>
                  </a>
                </li>
              </ul>

              {/* Tab panes */}
              <div className="tab-content p-3 text-muted">
                <div className="tab-pane active" id="updateorder-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Summary Overview</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a className="dropdown-toggle text-reset" href="#" id="filterDropdown1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <span className="text-muted font-size-12">Filter :</span> <span className="fw-medium">Select<i className="mdi mdi-chevron-down ms-1"></i></span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="filterDropdown1">
                              <a className="dropdown-item" href="#">Date Range</a>
                              <a className="dropdown-item" href="#">Product</a>
                              <a className="dropdown-item" href="#">Batch Number</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Content goes here */}
                    </div>
                  </div>
                </div>

                <div className="tab-pane" id="updatepayment-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Wastage percentage by product</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a className="dropdown-toggle text-reset" href="#" id="sortDropdown1" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <span className="text-muted font-size-12">Sort By: </span> <span className="fw-medium">Weekly<i className="mdi mdi-chevron-down ms-1"></i></span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="sortDropdown1">
                              <a className="dropdown-item" href="#">Monthly</a>
                              <a className="dropdown-item" href="#">Yearly</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Content goes here */}
                    </div>
                  </div>
                </div>

                <div className="tab-pane" id="assign-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Successful packing vs. wastage</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a className="dropdown-toggle text-reset" href="#" id="sortDropdown2" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <span className="text-muted font-size-12">Sort By: </span> <span className="fw-medium">Weekly<i className="mdi mdi-chevron-down ms-1"></i></span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="sortDropdown2">
                              <a className="dropdown-item" href="#">Monthly</a>
                              <a className="dropdown-item" href="#">Yearly</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Content goes here */}
                    </div>
                  </div>
                </div>

                <div className="tab-pane" id="generate-1" role="tabpanel">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Effect of repacking on bulk & retail stock levels</h5>
                        <div className="ms-auto">
                          <div className="dropdown">
                            <a className="dropdown-toggle text-reset" href="#" id="sortDropdown3" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <span className="text-muted font-size-12">Sort By: </span> <span className="fw-medium">Weekly<i className="mdi mdi-chevron-down ms-1"></i></span>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end" aria-labelledby="sortDropdown3">
                              <a className="dropdown-item" href="#">Monthly</a>
                              <a className="dropdown-item" href="#">Yearly</a>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Content goes here */}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div> 
        </div> 
      </div> 
    </div>
  );
}

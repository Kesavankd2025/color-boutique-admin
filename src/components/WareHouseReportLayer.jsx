import React from 'react';

export default function WareHouseReportLayer() {
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
                    <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                    <span className="d-none d-sm-block">Warehouse Utilization Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#updatepayment-1"
                    role="tab"
                    aria-selected="false"
                  >
                    <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                    <span className="d-none d-sm-block">Stock Transfer Report</span>
                  </a>
                </li>
                <li className="nav-item waves-effect waves-light" role="presentation">
                  <a
                    className="nav-link"
                    data-bs-toggle="tab"
                    href="#assign-1"
                    role="tab"
                    aria-selected="false"
                  >
                    <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                    <span className="d-none d-sm-block">Damage Report Summary</span>
                  </a>
                </li>
              </ul>

              {/* Tab panes */}
              <div className="tab-content p-3 text-muted">
                <TabPane
                  id="updateorder-1"
                  active
                  title="Storage capacity and usage"
                />
                <TabPane
                  id="updatepayment-1"
                  title="Details of stock movements between warehouses"
                />
                <TabPane
                  id="assign-1"
                  title="Overview of damaged goods"
                />
                <TabPane
                  id="generate-1"
                  title="Product Sales Report"
                />
                <TabPane
                  id="cancelorder-1"
                  title="Top Vendors Report"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabPane({ id, title, active = false }) {
  return (
    <div className={`tab-pane${active ? ' active' : ''}`} id={id} role="tabpanel">
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-center mb-3">
            <h5 className="card-title me-2">{title}</h5>
            <div className="ms-auto">
              <div className="dropdown">
                <a
                  className="dropdown-toggle text-reset"
                  href="#"
                  id={`dropdown-${id}`}
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <span className="text-muted font-size-12">Filter: </span>
                  <span className="fw-medium">
                    Select<i className="mdi mdi-chevron-down ms-1"></i>
                  </span>
                </a>
                <div className="dropdown-menu dropdown-menu-end" aria-labelledby={`dropdown-${id}`}>
                  <a className="dropdown-item" href="#">Warehouse A</a>
                  <a className="dropdown-item" href="#">Warehouse B</a>
                  <a className="dropdown-item" href="#">Warehouse C</a>
                </div>
              </div>
            </div>
          </div>
          {/* You can inject additional tab content here */}
        </div>
      </div>
    </div>
  );
}

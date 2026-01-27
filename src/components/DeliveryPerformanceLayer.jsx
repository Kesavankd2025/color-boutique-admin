import React from 'react';

export default function DeliveryPerformanceLayer() {
  return (
    <div className="page-content">
      <div className="container-fluid">

        <div className="row">
          <div className="col-xxl-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-wrap align-items-center mb-3">
                  <h5 className="card-title me-2">Delivery Performance</h5>
                </div>

                <div className="mx-n4 simplebar-scrollable-y" style={{ maxHeight: '332px', overflowY: 'auto' }}>
                  <div className="table-responsive">
                    <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Delivery Person Name</th>
                          <th>Total Deliveries Completed</th>
                          <th>On-Time Delivery Rate</th>
                          <th>Customer Feedback Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1.</td>
                          <td>Anbu</td>
                          <td>50</td>
                          <td>85%</td>
                          <td>
                            <button type="button" className="btn btn-subtle-danger btn-sm waves-effect waves-light">
                              Poor
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>2.</td>
                          <td>Yuva</td>
                          <td>60</td>
                          <td>92%</td>
                          <td>
                            <button type="button" className="btn btn-subtle-success btn-sm waves-effect waves-light">
                              Excellent
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>3.</td>
                          <td>Ram</td>
                          <td>55</td>
                          <td>78%</td>
                          <td>
                            <button type="button" className="btn btn-subtle-warning btn-sm waves-effect waves-light">
                              Average
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>4.</td>
                          <td>Mike</td>
                          <td>70</td>
                          <td>88%</td>
                          <td>
                            <button type="button" className="btn btn-subtle-success btn-sm waves-effect waves-light">
                              Good
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

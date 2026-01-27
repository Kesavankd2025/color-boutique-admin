import React from 'react';

export default function AssignSalesmansLayer() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit logic here
    console.log('Assign clicked');
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="p-4 border-top">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="wholesalerSelect" className="form-label">
                          Wholesaler Name
                        </label>
                        <select className="form-select" id="wholesalerSelect" name="wholesaler">
                          <option value="">Select option</option>
                          <option value="wh1">Wholesaler 1</option>
                          <option value="wh2">Wholesaler 2</option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="salesmanSelect" className="form-label">
                          Assigned Salesman
                        </label>
                        <select className="form-select" id="salesmanSelect" name="salesman">
                          <option value="">Select option</option>
                          <option value="sm1">Salesman 1</option>
                          <option value="sm2">Salesman 2</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="salesmanContact" className="form-label">
                          Salesman Contact
                        </label>
                        <input
                          id="salesmanContact"
                          name="salesmanContact"
                          type="text"
                          className="form-control"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col text-end">
                      <button type="button" className="btn btn-danger me-2 m-2">
                        <i className="bx bx-x me-1"></i> Cancel
                      </button>
                      <button type="submit" className="btn btn-success">
                        <i className="bx bx-file me-1"></i> Assign
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* end row */}
      </div>
      {/* container-fluid */}
    </div>
  );
}

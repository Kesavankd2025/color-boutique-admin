import React from 'react'

export default function AddWarehouseLayer() {
  return (
    <div className="container-fluid">
      <div className="row mb-4">
        <div className="col-lg-12">
          <div id="addproduct-accordion" className="custom-accordion">
            <div className="card">
              <div id="addproduct-productinfo-collapse" className="collapse show" data-bs-parent="#addproduct-accordion">
                <div className="p-4 border-top ">
                  <form className='m-4'>
                    <div className="row">
                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label className="form-label">Type</label>
                          <select className="form-select">
                            <option>Select Option</option>
                            <option>Warehouse</option>
                            <option>Retail</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-lg-4">
                        <div className="mb-3">
                          <label className="form-label">Location</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Contact Person</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Phone Number</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Email Address</label>
                          <input type="email" className="form-control" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Storage Capacity</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Available Space</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Warehouse Type</label>
                          <select className="form-select">
                            <option>Select Option</option>
                            <option>Cold</option>
                            <option>Dry</option>
                            <option>General</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Assigned Manager</label>
                          <select className="form-select">
                            <option>Select Option</option>
                          </select>
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Manager Contact</label>
                          <input type="text" className="form-control" placeholder="Read-only" readOnly />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <div className="mb-3">
                          <label className="form-label">Status</label>
                          <select className="form-select">
                            <option>Select Option</option>
                            <option>Active</option>
                            <option>Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="row mt-6">
        <div className="col text-end">
          <button className="btn btn-success">
            <i className="fa fa-check-circle me-1"></i> Submit
          </button>
        </div>
      </div>
    </div>
  )
}

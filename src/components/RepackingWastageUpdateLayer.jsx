import React from 'react';

export default function RepackingWastageUpdateLayer() {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div id="addproduct-accordion" className="custom-accordion">
              <div className="card mb-2">
                <div id="addproduct-productinfo-collapse" className="collapse show" data-bs-parent="#addproduct-accordion">
                  <div className="p-4 border-top">
                    <form>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="productname">Product Name</label>
                            <input id="productname" name="productname" type="text" className="form-control" />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="manufacturername">Batch Number</label>
                            <input id="manufacturername" name="Date" type="text" className="form-control" />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="repackingId">Repacking ID</label>
                            <select className="form-select select2">
                              <option value="">Search</option>
                              <option value="RPK001">RPK001</option>
                              <option value="RPK002">RPK002</option>
                              <option value="RPK003">RPK003</option>
                              <option value="RPK004">RPK004</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="manufacturerbrand1">Total Bulk Quantity Used</label>
                            <input id="manufacturerbrand1" name="bulkQuantity" type="text" className="form-control" />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="manufacturerbrand2">Total Packed Quantity</label>
                            <input id="manufacturerbrand2" name="packedQuantity" type="text" className="form-control" />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="manufacturerbrand3">Total Wastage Quantity</label>
                            <input id="manufacturerbrand3" name="wastageQuantity" type="text" className="form-control" />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-4">
                          <div className="mb-3">
                            <label htmlFor="wastageReason" className="form-label">Wastage Reason</label>
                            <select className="form-select" id="wastageReason">
                              <option>Select</option>
                              <option>Spillage</option>
                              <option>Damage</option>
                              <option>Measurement Error</option>
                              <option>Other</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="remarks">Remarks</label>
                            <input id="remarks" name="remarks" type="text" className="form-control" />
                          </div>
                        </div>

                        <div className="col-md-4">
                          <div className="mb-3">
                            <label htmlFor="statusUpdate" className="form-label">Status Update</label>
                            <select className="form-select" id="statusUpdate">
                              <option>Select</option>
                              <option>Pending</option>
                              <option>In Progress</option>
                              <option>Completed</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* End card */}
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col text-end">
            <a href="#" className="btn btn-success"> <i className="fa fa-check" /> Submit </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function AssignDeliveryPersonLayer() {
  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div id="addproduct-accordion" className="custom-accordion">
              <div className="card">
                <div
                  id="addproduct-productinfo-collapse"
                  className="collapse show"
                  data-bs-parent="#addproduct-accordion"
                >
                  <div className="p-4 border-top">
                    <form>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label" htmlFor="orderId">
                              Order ID
                            </label>
                            <input
                              id="orderId"
                              name="orderId"
                              // placeholder="ID"
                              type="text"
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="customerName"
                            >
                              Customer/Wholesaler Name
                            </label>
                            <input
                              id="customerName"
                              name="customerName"
                              // placeholder="Auto-fetched"
                              type="text"
                              className="form-control"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label
                              className="form-label"
                              htmlFor="deliveryAddress"
                            >
                              Delivery Address
                            </label>
                            <input
                              id="deliveryAddress"
                              name="deliveryAddress"
                              // placeholder="Auto-fetched"
                              type="text"
                              className="form-control"
                            />
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label
                              htmlFor="deliveryPerson"
                              className="form-label"
                            >
                              Available Delivery Persons
                            </label>
                            <select
                              className="form-select"
                              id="deliveryPerson"
                              name="deliveryPerson"
                            >
                              <option>Select</option>
                              {/* Add options dynamically here */}
                            </select>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="mb-3">
                            <label
                              htmlFor="vehicleType"
                              className="form-label"
                            >
                              Vehicle Type
                            </label>
                            <select
                              className="form-select"
                              id="vehicleType"
                              name="vehicleType"
                            >
                              <option>Select</option>
                              {/* Add options dynamically here */}
                            </select>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              {/* End of card */}
            </div>
          </div>
        </div>

        {/* Submit Row */}
        <div className="row mb-4">
          <div className="col text-end">
            <button className="btn btn-success m-2">
              <i className="fas fa-user-check"></i> Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

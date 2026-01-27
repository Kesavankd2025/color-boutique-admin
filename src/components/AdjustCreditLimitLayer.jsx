import React, { useState } from 'react';

export default function AdjustCreditLimitLayer() {


  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    retailerName: '',
    currentCreditLimit: '',
    newCreditLimit: '',
    reasonForAdjustment: '',

  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const formValidation = () => {

    const newErrors = {};
    if (!formData.retailerName) newErrors.retailerName = "Retailer name is required ";
    if (!formData.currentCreditLimit) newErrors.currentCreditLimit = "Current credit limit is required";
    if (!formData.newCreditLimit) newErrors.newCreditLimit = " New credit limit is required";
    if (!formData.reasonForAdjustment) newErrors.reasonForAdjustment = " Reason for adjustment is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  }

  const handleCancel = () => {
    setErrors({});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formValidation()) return;
    console.log("formData", formData);
  }

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12">
            <div className="card">
              <div className="p-4 border-top">
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="retailerSelect" className="form-label">
                          Retailer Name
                        </label>
                        <select className="form-select" id="retailerSelect" name='retailerName' value={formData.retailerName} onChange={handleChange}>
                          <option selected>Select Retailer</option>
                          <option value='ABC Foods'>ABC Foods</option>
                          <option value='Quality Foods'>Quality Foods</option>
                        </select>
                        {errors.retailerName && <div className='text-danger'>{errors.retailerName}</div>}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="currentCreditLimit" className="form-label" >
                          Current Credit Limit
                        </label>
                        <input
                          id="currentCredit"
                          name="currentCreditLimit"
                          type="text"
                          className="form-control"
                          value={formData.currentCreditLimit}
                          onChange={handleChange}
                        />
                        {errors.currentCreditLimit && <div className='text-danger'>{errors.currentCreditLimit}</div>}

                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="newCreditLimit" className="form-label">
                          New Credit Limit
                        </label>
                        <input
                          id="newCreditLimit"
                          name="newCreditLimit"
                          type="text"
                          className="form-control"
                          value={formData.newCreditLimit}
                          onChange={handleChange}
                        />
                        {errors.newCreditLimit && <div className='text-danger'>{errors.newCreditLimit}</div>}

                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="adjustReason" className="form-label">
                          Reason for Adjustment
                        </label>
                        <input
                          id="reasonForAdjustment"
                          name="reasonForAdjustment"
                          type="text"
                          className="form-control"
                          value={formData.reasonForAdjustment}
                          onChange={handleChange}
                        />
                        {errors.reasonForAdjustment && <div className='text-danger'>{errors.reasonForAdjustment}</div>}

                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="row mb-4">
          <div className="col text-end">
            <a href="#" className="btn btn-danger m-2" onClick={handleCancel}>
              <i className="bx bx-x me-1"></i> Cancel
            </a>
            <a href="#" className="btn btn-success" onClick={handleSubmit}>
              <i className="bx bx-file me-1"></i> Update Credit Limit
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';

export default function AssignSalesmanLayer() {

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    retailerName: '',
    assignedSalesman: '',
    salesmanContact: '',

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
    if (!formData.assignedSalesman) newErrors.assignedSalesman = "Assigned salesman is required";
    if (!formData.salesmanContact) newErrors.salesmanContact = " salesman contact is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;

  }
  const handleCancel = () => {
    setErrors({});

  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if(formValidation()) return;

    console.log("formData", formData);
  }


  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-lg-12">
            <div className="card">
              <div className="p-4 border-top">
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="retailer-select" className="form-label">
                          Retailer Name
                        </label>
                        <select id="retailer-select" className="form-select" name='retailerName' value={formData.retailerName} onChange={handleChange}>
                          <option value="" selected>
                            Select option
                          </option>
                          <option value="Retailer 1">Retailer 1</option>
                          <option value="Retailer 2">Retailer 2</option>
                        </select>
                        {errors.retailerName && <div className='text-danger'>{errors.retailerName}</div>}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <label htmlFor="salesman-select" className="form-label">
                          Assigned Salesman
                        </label>
                        <select id="assignedSalesman" className="form-select" name='assignedSalesman' value={formData.assignedSalesman} onChange={handleChange}>
                          <option value="" selected>
                            Select option
                          </option>
                          <option value="Salesman 1">Salesman 1</option>
                          <option value="Salesman 2">Salesman 2</option>
                        </select>
                        {errors.assignedSalesman && <div className='text-danger'>{errors.assignedSalesman}</div>}

                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label htmlFor="salesman-contact" className="form-label">
                          Salesman Contact
                        </label>
                        <input
                          id="salesmanContact"
                          name="salesmanContact"
                          type="text"
                          className="form-control"
                          value={formData.salesmanContact}
                          onChange={handleChange}
                        />
                        {errors.salesmanContact && <div className='text-danger'>{errors.salesmanContact}</div>}

                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col text-end">
            <button type="button" className="btn btn-danger m-2"  onClick={handleCancel}>
              <i className="bx bx-x me-1"></i> Cancel
            </button>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleSubmit}
            >
              <i className="bx bx-file me-1"></i> Assign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { PlusCircle } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import productApis from "../apiProvider/product";
import ReactTableComponent from "../table/ReactTableComponent";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function TaxListLayer() {
  const [taxes, setTaxes] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({});
  const [viewTax, setViewTax] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    rate: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
  }, [pageIndex]);

  const fetchData = async () => {
    const productResult = await productApis.getTax();
    if (productResult.status) {
      const all = productResult.response.data;
      setTotal(all.length);
      const start = pageIndex * limit;
      setTaxes(all.slice(start, start + limit));
    }
  };

  const handleView = (tax) => {
    setViewTax({
      name: tax.taxName,
      type: tax.taxType,
      rate: tax.taxRate + "%",
      status: tax.isActive ? "Active" : "Inactive",
    });
  };

  const handleEdit = (tax) => {
    setEditId(tax._id);
    setFormData({
      name: tax.taxName ?? "",
      type: tax.taxType ?? "",
      rate: tax.taxRate ?? "", // <-- preserves 0
      status: tax.isActive ? "Active" : "Inactive",
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (tax) => {
    const productResult = await productApis.deleteTax(tax._id);
    if (productResult.status) {
      toast("Tax Deleted Successfully");
      fetchData();
    }
  };

  const handleCloseModals = () => {
    setEditModalVisible(false);
    setViewTax(null);
    setEditId(null);
    setFormData({
      name: "",
      type: "",
      rate: "",
      status: "",
    });
  };

  const handleChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors); // ⬅️ update state

    if (Object.keys(validationErrors).length > 0) {
      return; // stop submit
    }

    const input = {
      taxName: formData.name.trim(),
      taxType: formData.type,
      taxRate: Number(formData.rate),
      isActive: formData.status === "Active",
    };

    let productResult;
    if (editId) {
      productResult = await productApis.updateTax(input, editId);
    } else {
      productResult = await productApis.createTax(input);
    }

    if (productResult.status) {
      toast.success(
        editId ? "Tax Updated Successfully" : "Tax Created Successfully"
      );
      handleCloseModals();
      fetchData();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleNextPage = () => {
    if ((pageIndex + 1) * limit < total) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) {
      setPageIndex((prev) => prev - 1);
    }
  };

  const columns = [
    {
      header: "S.No",
      accessorKey: "index",
      cell: ({ row }) => pageIndex * limit + row.index + 1,
    },
    { header: "Tax Name", accessorKey: "taxName" },
    { header: "Tax Type", accessorKey: "taxType" },
    {
      header: "Tax Rate (%)",
      accessorKey: "taxRate",
      cell: ({ row }) => `${row.original.taxRate}%`,
    },
    {
      header: "Status",
      accessorKey: "isActive",
      cell: ({ row }) => (
        <button
          className={`btn btn-subtle-${
            row.original.isActive ? "success" : "danger"
          } btn-sm`}
        >
          {row.original.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      header: "Actions",
      size: 160,
      cell: (info) => {
        const childCategory = info.row.original;
        return (
          <div className="d-flex justify-content-start align-items-center gap-2">
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleView(childCategory)}
            >
              <Icon icon="majesticons:eye-line" className="text-xl" />
            </button>
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleEdit(childCategory)}
            >
              <Icon icon="lucide:edit" />
            </button>
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleDelete(childCategory)}
            >
              <Icon icon="fluent:delete-24-regular" />
            </button>
          </div>
        );
      },
    },
    // {
    //   header: "Actions",
    //   cell: ({ row }) => (
    //     <div className="dropdown">
    //       <button className="btn btn-link dropdown-toggle" data-bs-toggle="dropdown">
    //         <i className="mdi mdi-dots-horizontal"></i>
    //       </button>
    //       <div className="dropdown-menu dropdown-menu-end">
    //         <button className="dropdown-item" onClick={() => handleView(row.original)}>View</button>
    //         <button className="dropdown-item" onClick={() => handleEdit(row.original)}>Edit</button>
    //         <button className="dropdown-item" onClick={() => handleDelete(row.original)}>Delete</button>
    //       </div>
    //     </div>
    //   ),
    // },
  ];
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Tax Name is required";
    }

    if (!formData.type) {
      errors.type = "Tax Type is required";
    }

    if (
      formData.rate === "" ||
      formData.rate === null ||
      isNaN(formData.rate)
    ) {
      errors.rate = "Tax Rate is required";
    } else if (Number(formData.rate) < 0) {
      errors.rate = "Tax Rate must be a positive number";
    }

    if (!formData.status) {
      errors.status = "Status is required";
    }

    return errors;
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-end align-items-center">
              <button
                className="btn btn-success d-inline-flex align-items-center"
                onClick={() => {
                  setEditId(null);
                  setFormData({ name: "", type: "", rate: "", status: "" });
                  setEditModalVisible(true);
                }}
              >
                <PlusCircle size={18} weight="fill" className="me-2" />
                Create Tax
              </button>
            </div>

            <ReactTableComponent
              data={taxes}
              columns={columns}
              pageIndex={pageIndex}
              totalPages={Math.ceil(total / limit)}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              totalRecords={total}
            />

            {/* View Modal */}
            {viewTax && !editModalVisible && (
              <div
                className="modal fade show d-block"
                role="dialog"
                style={{ backgroundColor: "rgb(0 0 0 / 60%)" }}
              >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Tax Details</h5>
                      {/* <button type="button" className="btn-close" onClick={handleCloseModals}></button> */}
                    </div>
                    <div className="modal-body p-4">
                      {Object.entries(viewTax).map(([label, value], idx) => (
                        <div className="mb-3 row" key={idx}>
                          <div className="col-md-6">
                            <strong>
                              {label.charAt(0).toUpperCase() + label.slice(1)}:
                            </strong>
                          </div>
                          <div className="col-md-6">{value}</div>
                        </div>
                      ))}
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={handleCloseModals}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Create/Edit Modal */}
            {editModalVisible && (
                <div className="modal fade show d-block" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                <div className="modal-dialog modal-dialog modal-dialog-centered">
                  <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                      <h5 className="modal-title">
                        {editId ? "Edit Tax" : "Create Tax"}
                      </h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={handleCloseModals}
                      ></button>
                    </div>
                    <div className="modal-body p-4">
                      <form>
                        <div className="row">
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Tax Name</label>
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              className="form-control"
                            />
                            {errors.name && (
                              <p className="text-danger">{errors.name}</p>
                            )}
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Tax Type</label>
                            <select
                              name="type"
                              value={formData.type}
                              onChange={handleChange}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              <option value="Percentage">Percentage</option>
                              <option value="Fixed">Fixed Amount</option>
                            </select>
                            {errors.type && (
                              <p className="text-danger">{errors.type}</p>
                            )}
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Tax Rate</label>
                            <input
                              type="number"
                              name="rate"
                              value={formData.rate}
                              onChange={(e) => {
                                setErrors({});
                                const value = e.target.value;
                                if (value === "" || Number(value) >= 0) {
                                  setFormData({ ...formData, rate: value });
                                }
                              }}
                              className="form-control"
                              // min="0"
                            />
                            {errors.rate && (
                              <p className="text-danger">{errors.rate}</p>
                            )}
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Status</label>
                            <select
                              name="status"
                              value={formData.status}
                              onChange={handleChange}
                              className="form-select"
                            >
                              <option value="">Select</option>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                            {errors.status && (
                              <p className="text-danger">{errors.status}</p>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-success"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary text-sm ms-2"
                        onClick={handleCloseModals}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useRef } from "react";
import { PlusCircle } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import bankApis from "../apiProvider/bankapi.jsx";
import ReactTableComponent from "../table/ReactTableComponent";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";

export default function BankDetailForAdminPageLayer() {
  const [banks, setBanks] = useState([]);
  const [search, setSearch] = useState("");
  const searchDebounceRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({});
  const [viewBank, setViewBank] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountType: "",
    branch: "",
  });

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize]);

  const fetchData = async () => {
    try {
      const input = {
        search: search,
        page: pageIndex,
        limit: pageSize,
      };

      const result = await bankApis.getBanks(input);
      if (result && result.status) {
        const items = result.response?.data || [];
        setBanks(items);
        setTotalPages(result.response?.totalPages || 1);
        setTotal(result.response?.total || 0);
      } else if (result && result.response?.message === "Invalid token") {
        console.warn("Token invalid. Redirecting to login...");
      }
    } catch (error) {
      console.error("Error fetching bank data:", error);
    }
  };
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPageIndex(0); // reset to first page

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      fetchData(); // call API after debounce
    }, 300); // 300ms debounce
  };
  const handleView = (bank) => {
    setViewBank({
      bankName: bank.bankName,
      accountNumber: bank.accountNumber,
      ifscCode: bank.ifscCode,
      accountType: bank.accountType,
      branch: bank.branch,
    });
  };

  const handleEdit = (bank) => {
    setEditId(bank._id);
    console.log("Editing bank:", bank);
    console.log("editId set to:", bank._id);
    setFormData({
      bankName: bank.bankName ?? "",
      accountNumber: bank.accountNumber ?? "",
      ifscCode: bank.ifscCode ?? "",
      accountType: bank.accountType ?? "",
      branch: bank.branch ?? "",
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (bank) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will delete the bank account permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await bankApis.deleteBank(bank._id);
        if (response.status) {
          toast.success("Bank account deleted successfully");
          fetchData();
        } else {
          toast.error("Failed to delete bank account");
        }
      }
    } catch (error) {
      console.error("Error deleting bank account:", error);
      toast.error("Something went wrong");
    }
  };

  const handleCloseModals = () => {
    setEditModalVisible(false);
    setViewBank(null);
    setEditId(null);
    setFormData({
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountType: "",
      branch: "",
    });
  };

  const handleChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    let updatedValue = value;

    if (name === "bankName") {
      updatedValue = value.toUpperCase();
    } else if (name === "ifscCode") {
      updatedValue = value.toUpperCase();
    } else if (name === "accountNumber") {
      // Only allow numbers for account number
      updatedValue = value.replace(/\D/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const input = {
      bankName: formData.bankName.trim(),
      accountNumber: formData.accountNumber.trim(),
      ifscCode: formData.ifscCode.trim(),
      accountType: formData.accountType,
      branch: formData.branch.trim(),
    };

    console.log("Input for submission:", input, "Edit ID:", editId);
    let result;
    if (editId) {
      result = await bankApis.updateBank(editId, input);
    } else {
      result = await bankApis.createBank(input);
    }

    if (result.status) {
      toast.success(
        editId
          ? "Bank Account Updated Successfully"
          : "Bank Account Created Successfully"
      );
      handleCloseModals();
      fetchData();
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  const columns = [
    {
      header: "S.No",
      accessorKey: "index",
      cell: (info) => pageIndex * pageSize + info.row.index + 1,
    },
    { header: "Bank Name", accessorKey: "bankName" },
    { header: "Account Number", accessorKey: "accountNumber" },
    { header: "IFSC Code", accessorKey: "ifscCode" },
    { header: "Account Type", accessorKey: "accountType" },
    { header: "Branch", accessorKey: "branch" },
    {
      header: "Actions",
      size: 160,
      cell: (info) => {
        const bank = info.row.original;
        return (
          <div className="d-flex justify-content-start align-items-center gap-2">
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-info-focus text-info-600 bg-hover-info-200 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleView(bank)}
            >
              <Icon icon="majesticons:eye-line" className="text-xl" />
            </button>
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleEdit(bank)}
            >
              <Icon icon="lucide:edit" />
            </button>
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleDelete(bank)}
            >
              <Icon icon="fluent:delete-24-regular" />
            </button>
          </div>
        );
      },
    },
  ];

  const validateForm = () => {
    const errors = {};
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;

    if (!formData.bankName.trim()) {
      errors.bankName = "Bank Name is required";
    }

    if (!formData.accountNumber.trim()) {
      errors.accountNumber = "Account Number is required";
    } else if (
      formData.accountNumber.length < 9 ||
      formData.accountNumber.length > 18
    ) {
      errors.accountNumber = "Account Number must be between 9 and 18 digits";
    }

    if (!formData.ifscCode.trim()) {
      errors.ifscCode = "IFSC Code is required";
    } else if (!ifscRegex.test(formData.ifscCode.trim())) {
      errors.ifscCode = "Invalid IFSC Code format";
    }

    if (!formData.accountType) {
      errors.accountType = "Account Type is required";
    }

    if (!formData.branch.trim()) {
      errors.branch = "Branch is required";
    }

    return errors;
  };

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  style={{ maxWidth: 350 }}
                  value={search}
                  onChange={handleSearchChange}
                />
                <Icon
                  icon="ic:baseline-search"
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                    fontSize: 20,
                  }}
                />
              </div>
              <button
                className="btn btn-success d-inline-flex align-items-center"
                onClick={() => {
                  setEditId(null);
                  setFormData({
                    bankName: "",
                    accountNumber: "",
                    ifscCode: "",
                    accountType: "",
                    branch: "",
                  });
                  setEditModalVisible(true);
                }}
              >
                <Icon
                  icon="ic:baseline-plus"
                  className="icon text-xl line-height-1"
                />
                Add Bank Account
              </button>
            </div>

            <ReactTableComponent
              data={banks}
              columns={columns}
              pageIndex={pageIndex}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              totalRecords={total}
            />

            {/* View Modal */}
            {viewBank && !editModalVisible && (
               <div className="modal fade show d-block" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                <div className="modal-dialog modal-dialog modal-dialog-centered">
                  <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                      <h5 className="modal-title">Bank Account Details</h5>
                    </div>
                    <div className="modal-body p-4">
                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Bank Name:</strong>
                        </div>
                        <div className="col-md-6">{viewBank.bankName}</div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Account Number:</strong>
                        </div>
                        <div className="col-md-6">{viewBank.accountNumber}</div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>IFSC Code:</strong>
                        </div>
                        <div className="col-md-6">{viewBank.ifscCode}</div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Account Type:</strong>
                        </div>
                        <div className="col-md-6">{viewBank.accountType}</div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Branch:</strong>
                        </div>
                        <div className="col-md-6">{viewBank.branch}</div>
                      </div>
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
                        {editId ? "Edit Bank Account" : "Add Bank Account"}
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
                            <label className="form-label">Bank Name</label>
                            <input
                              type="text"
                              name="bankName"
                              value={formData.bankName}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter bank name"
                            />
                            {errors.bankName && (
                              <p className="text-danger">{errors.bankName}</p>
                            )}
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Account Number</label>
                            <input
                              type="text"
                              name="accountNumber"
                              value={formData.accountNumber}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter account number"
                              maxLength={18}
                            />
                            {errors.accountNumber && (
                              <p className="text-danger">
                                {errors.accountNumber}
                              </p>
                            )}
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">IFSC Code</label>
                            <input
                              type="text"
                              name="ifscCode"
                              value={formData.ifscCode}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter IFSC code"
                              maxLength={11}
                            />
                            {errors.ifscCode && (
                              <p className="text-danger">{errors.ifscCode}</p>
                            )}
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Account Type</label>
                            <select
                              name="accountType"
                              value={formData.accountType}
                              onChange={handleChange}
                              className="form-control"
                            >
                              <option value="">Select Account Type</option>
                              <option value="SAVING">SAVING</option>
                              <option value="CURRENT">CURRENT</option>
                            </select>
                            {errors.accountType && (
                              <p className="text-danger">
                                {errors.accountType}
                              </p>
                            )}
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Branch</label>
                            <input
                              type="text"
                              name="branch"
                              value={formData.branch}
                              onChange={handleChange}
                              className="form-control"
                              placeholder="Enter branch name"
                            />
                            {errors.branch && (
                              <p className="text-danger">{errors.branch}</p>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
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

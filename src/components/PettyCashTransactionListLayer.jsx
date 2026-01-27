import { PlusCircle } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import Select from "react-select"; // Import react-select
import apiProvider from "../apiProvider/adminuserapi";
import pettyCashApi from "../apiProvider/pettyCashapi";
import ReactTableComponent from "../table/ReactTableComponent";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";

export default function PettyCashTransactionListLayer() {
  // State for form fields
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0], // auto current date
    amount: "",
    receiver: "",
    employeeId: "",
    description: "",
    paymentMode: "",
    transactionType: "expense",
    referenceNumber: "",
    documents: null,
  });
  const [employees, setEmployees] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]); // Options for react-select
  const [selectedEmployees, setSelectedEmployees] = useState([]); // For multi-select
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pettyCashList, setPettyCashList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [employeeType, setEmployeeType] = useState("employee"); // 'employee' or 'notEmployee'
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [pettyCashSummary, setPettyCashSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);

  // Fetch employees for dropdown
  useEffect(() => {
    fetchEmployees();
    fetchPettyCashList();
    fetchPettyCashSummary();
  }, [pageIndex, pageSize, selectedDate]);

  const fetchEmployees = async () => {
    try {
      const result = await apiProvider.getUserList();
      let employeeList = [];

      if (result.status && Array.isArray(result.response?.data)) {
        employeeList = result.response.data;
        setTotalRecords(result.response.totalCount || 0);
      } else if (result.status && Array.isArray(result.response)) {
        employeeList = result.response;
      }

      setEmployees(employeeList);

      // Format employees for react-select
      const options = employeeList.map((emp) => ({
        value: emp._id || emp.id,
        label: emp.name || emp.fullName || "Unknown",
        ...emp,
      }));
      setEmployeeOptions(options);
    } catch (e) {
      setEmployees([]);
      setEmployeeOptions([]);
    }
  };

  // Get select props based on transaction type
  // const getSelectProps = () => {
  //     if (form.transactionType === 'expense') {
  //         return {
  //             isMulti: false,
  //             placeholder: "Select employees...",
  //         };
  //     } else {
  //         return {
  //             isMulti: false,
  //             placeholder: "Select employee...",
  //         };
  //     }
  // };

  // Handle employee selection change
  const handleEmployeeChange = (selectedOptions) => {
    setSelectedEmployees(selectedOptions);

    // if (form.transactionType === 'expense') {
    //     // For multi-select, store array of employee IDs
    //     const employeeIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    //     setForm(f => ({ ...f, employeeId: employeeIds }));
    // } else {
    //     // For single select, store single employee ID
    //     const employeeId = selectedOptions ? selectedOptions.value : '';
    //     setForm(f => ({ ...f, employeeId }));
    // }
    if (selectedOptions) {
      const employeeId = selectedOptions ? selectedOptions.value : "";
      setForm((f) => ({ ...f, employeeId }));
    }

    // Clear employee error when selection is made
    if (errors.employeeId) {
      setErrors((errors) => ({ ...errors, employeeId: "" }));
    }
  };

  // Check if employee selection should be shown
  const shouldShowEmployeeSelection = () => {
    return employeeType === "employee";
  };

  // Check if receiver input should be shown
  const shouldShowReceiverInput = () => {
    return employeeType === "notEmployee";
  };

  const fetchPettyCashList = async () => {
    setLoadingList(true);
    try {
      const res = await pettyCashApi.getPettyCashList({
        page: pageIndex,
        limit: pageSize,
        startDate: selectedDate,
      });
      console.log(res, "rrrrrrrrrr");

      if (res.status && Array.isArray(res.response?.data)) {
        setPettyCashList(res.response.data);
        setTotalPages(
          res.response.totalPages ||
            Math.ceil(
              (res.response.totalCount || res.response.data.length) / pageSize
            ) ||
            1
        );
        setPettyCashSummary(res.response?.overallTotals);
        setTotalRecords(res.response.totalCount || 0);
      } else if (res.status && Array.isArray(res.response)) {
        setPettyCashList(res.response);
        setTotalRecords(res.response.totalCount || 0);

        setTotalPages(1);
      } else {
        setPettyCashList([]);
        setTotalPages(1);
      }
    } catch (e) {
      setPettyCashList([]);
      setTotalPages(1);
    }
    setLoadingList(false);
  };

  const fetchPettyCashSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await pettyCashApi.getAllTransactions({
        startDate: selectedDate,
      });
      if (res.status && res.response?.pettyCashManagement) {
        setPettyCashSummary(res.response.pettyCashManagement);
      } else {
        setPettyCashSummary(null);
      }
    } catch (e) {
      setPettyCashSummary(null);
    }
    setLoadingSummary(false);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((f) => ({ ...f, documents: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((errors) => ({ ...errors, [name]: "" }));
    }
  };

  // Handle date filter change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Validate required fields
  const validate = () => {
    const newErrors = {};
    if (!form.amount || isNaN(form.amount))
      newErrors.amount = "Valid amount is required";
    if (employeeType === "employee") {
      if (
        !form.employeeId ||
        (Array.isArray(form.employeeId) && form.employeeId.length === 0)
      ) {
        newErrors.employeeId = "Employee is required";
      }
    } else {
      if (!form.receiver) newErrors.receiver = "Receiver is required";
    }
    if (!form.description) newErrors.description = "Description is required";
    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    console.log("Form submitted ✅", form);
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("date", new Date().toISOString().split("T")[0]);
      formData.append("amount", form.amount);

      if (employeeType === "employee") {
        if (Array.isArray(form.employeeId)) {
          // For multiple employees (expense type)
          form.employeeId.forEach((id) => {
            formData.append("employeeId", id);
          });
        } else {
          // For single employee
          formData.append("employeeId", form.employeeId);
        }
      } else {
        formData.append("receiver", form.receiver);
      }

      formData.append("description", form.description);
      formData.append("paymentMode", "cash");
      formData.append("transactionType", form.transactionType);

      const res = await pettyCashApi.createPettyCash(formData);
      if (res.status) {
        toast.success("Expense entry created successfully");
        // Reset form
        setForm({
          date: new Date().toISOString().split("T")[0],
          amount: "",
          receiver: "",
          employeeId: "",
          description: "",
          paymentMode: "",
          transactionType: "expense",
          referenceNumber: "",
          documents: null,
        });
        setSelectedEmployees([]); // Reset react-select
        fetchPettyCashList();
        fetchPettyCashSummary();
        // Close modal
        document.getElementById("closeModal")?.click();
      } else {
        console.error("Error creating expense entry:", res);
        toast.error(res.response?.message || "Failed to create expense entry");
      }
    } catch (err) {
      toast.error(err?.response?.message || "Failed to create expense entry");
    }
    setSubmitting(false);
  };

  // Get difference type badge color
  const getDifferenceTypeColor = (type) => {
    switch (type) {
      case "balanced":
        return "success";
      case "excess":
        return "warning";
      case "shortage":
        return "danger";
      case "pending":
        return "secondary";
      default:
        return "light";
    }
  };

  // Get difference type display text
  const getDifferenceTypeText = (type) => {
    switch (type) {
      case "balanced":
        return "Balanced";
      case "excess":
        return "Excess";
      case "shortage":
        return "Shortage";
      case "pending":
        return "Pending";
      default:
        return "Not Calculated";
    }
  };

  // Table columns for petty cash
  const columns = React.useMemo(
    () => [
      {
        header: "S.No",
        size: 70,
        id: "sno",
        cell: (info) => pageIndex * pageSize + info.row.index + 1,
      },
      {
        header: "CreatedBy",
        accessorFn: (row) => row.createdBy?.name || row.createdBy.name || "N/A",
      },
      {
        header: "Time",
        accessorKey: "createdAt",
        cell: (info) =>
          info.row.original.createdAt
            ? new Date(info.row.original.createdAt).toLocaleTimeString()
            : "-",
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (info) => `₹${info.row.original.amount || "0"}`,
      },
      {
        header: "Receiver",
        accessorFn: (row) => row.receiver?.name || row.receiver || "N/A",
      },
      {
        header: "Employee",
        accessorFn: (row) => row.employeeId?.name || "N/A",
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: (info) => (
          <span title={info.row.original.description}>
            {info.row.original.description?.slice(0, 30) +
              (info.row.original.description?.length > 30 ? "..." : "")}
          </span>
        ),
      },
    ],
    [pageIndex, pageSize]
  );

  return (
    <div className="row" style={{ borderBottom: "none", paddingBottom: 0 }}>
      <div className="col-xxl-12">
        <div className="card">
          <div className="card-body">
            {/* Header Section with Date Filter */}
            <div className="row align-items-center mb-4">
              <div className="col-md-6">
                {/* <h5 className="card-title mb-0">Petty Cash Transaction List</h5> */}
              </div>
              <div className="col-md-6">
                <div className="d-flex justify-content-end align-items-center gap-3">
                  {/* Date Filter */}
                  <div className="d-flex align-items-center gap-2">
                    <label className="form-label fw-semibold mb-0">
                      Select Date:
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      style={{ width: "180px" }}
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </div>

                  {/* Add Transaction Button */}
                  <button
                    type="button"
                    className="btn btn-success d-inline-flex justify-content-center align-items-center waves-effect waves-light"
                    data-bs-toggle="modal"
                    data-bs-target="#addInvoiceModalone"
                  >
                    <PlusCircle size={18} weight="fill" className="me-2" />
                    Add Transaction
                  </button>
                </div>
              </div>
            </div>

            {/* Petty Cash Summary Cards */}
            {loadingSummary ? (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="text-center py-3">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0">Loading summary...</p>
                  </div>
                </div>
              </div>
            ) : pettyCashSummary ? (
              <div className="row mb-4">
                {/* All cards with equal height */}{" "}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon
                          icon="mdi:cash-lock"
                          className="text-primary fs-2"
                        /> */}
                      </div>
                      <h6 className="text-muted mb-1 text-14">
                        Opening Balance
                      </h6>
                      <h4 className="fw-bold mb-0">
                        ₹{pettyCashSummary.initialAmount || "0"}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card  shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon icon="mdi:sale" className="text-success fs-2" /> */}
                      </div>
                      <h6 className="text-muted mb-1 text-14">Sales Cash</h6>
                      <h4 className="fw-bold mb-0">
                        ₹{pettyCashSummary.salesAmount || "0"}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon
                          icon="mdi:cash-remove"
                          className="text-danger fs-2"
                        /> */}
                      </div>
                      <h6 className="text-muted mb-1 text-14">Expenses</h6>
                      <h4 className="fw-bold mb-0">
                        ₹{pettyCashSummary.expensesAmount || "0"}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon
                          icon="mdi:cash-check"
                          className="text-info fs-2"
                        /> */}
                      </div>
                      <h6 className="text-muted mb-1 text-14">
                        Closing Amount
                      </h6>
                      <h4 className="fw-bold mb-0">
                        ₹{pettyCashSummary.closingAmount || "0"}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div
                    className={`card shadow-sm bg-${getDifferenceTypeColor(
                      pettyCashSummary.differenceType
                    )} bg-opacity-10 w-100`}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon
                          icon={
                            pettyCashSummary.differenceType === "balanced"
                              ? "mdi:check-circle"
                              : pettyCashSummary.differenceType === "excess"
                              ? "mdi:arrow-up-circle"
                              : pettyCashSummary.differenceType === "shortage"
                              ? "mdi:arrow-down-circle"
                              : "mdi:clock-outline"
                          }
                          className={`text-${getDifferenceTypeColor(
                            pettyCashSummary.differenceType
                          )} fs-2`}
                        /> */}
                      </div>
                      <h6 className="card-title text-muted mb-1">Status</h6>
                      <h4
                        className={`fw-bold mb-0`}
                      >
                        {getDifferenceTypeText(pettyCashSummary.differenceType)}
                      </h4>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div
                    className={`card shadow-sm bg-${getDifferenceTypeColor(
                      pettyCashSummary.differenceType
                    )} bg-opacity-10 w-100`}
                  >
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon
                          icon="mdi:calculator"
                          className={`text-${getDifferenceTypeColor(
                            pettyCashSummary.differenceType
                          )} fs-2`}
                        /> */}
                      </div>
                      <h6 className="card-title text-muted mb-1">Difference</h6>
                      <h4
                        className={`fw-bold mb-0`}
                      >
                        ₹{pettyCashSummary.differenceAmount || "0"}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row mb-4">
                <div className="col-12">
                  <div className="alert alert-warning text-center">
                    <Icon
                      icon="mdi:alert-circle-outline"
                      className="fs-4 me-2"
                    />
                    No petty cash data found for the selected date.
                  </div>
                </div>
              </div>
            )}

            {/* Transactions Table */}
            <div className="table-responsive"></div>
            <ReactTableComponent
              data={pettyCashList}
              columns={columns}
              pageIndex={pageIndex}
              totalPages={totalPages}
              onNextPage={() =>
                setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
              }
              onPreviousPage={() =>
                setPageIndex((prev) => Math.max(prev - 1, 0))
              }
              totalRecords={totalRecords}
              loading={loadingList}
            />
          </div>
        </div>
      </div>

      {/* Add Transaction Modal */}
      <div
        className="modal fade"
        id="addInvoiceModalone"
        tabIndex="-1"
        aria-labelledby="addInvoiceModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addInvoiceModalLabel">
                Add Expense Entry
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="card-body">
                <form
                  id="expense-form"
                  onSubmit={handleSubmit}
                  encType="multipart/form-data"
                >
                  <div className="row mb-3">
                    <div className="col-lg-6">
                      <label className="form-label">
                        Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        value={employeeType}
                        onChange={(e) => setEmployeeType(e.target.value)}
                      >
                        <option value="employee">Employee</option>
                        <option value="notEmployee">Not Employee</option>
                      </select>
                    </div>

                    <div className="col-lg-6">
                      <label className="form-label">
                        Transaction Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select"
                        name="transactionType"
                        value={form.transactionType}
                        onChange={handleChange}
                        required
                      >
                        <option value="expense">Expense</option>
                        <option value="purchase">Purchase</option>
                      </select>
                      {errors.transactionType && (
                        <div className="text-danger small">
                          {errors.transactionType}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3">
                    {/* Employee Selection - Show when employee type is selected */}
                    {shouldShowEmployeeSelection() && (
                      <div className="col-lg-6">
                        <label className="form-label">
                          Select Employee
                          {/* {form.transactionType === 'expense' ? ' (Multiple)' : ' (Single)'} */}
                          <span className="text-danger">*</span>
                        </label>
                        <Select
                          options={employeeOptions}
                          // {...getSelectProps()}
                          value={selectedEmployees}
                          onChange={handleEmployeeChange}
                          className={`basic-multi-select ${
                            errors.employeeId ? "is-invalid" : ""
                          }`}
                          classNamePrefix="select"
                        />
                        {errors.employeeId && (
                          <div className="text-danger small">
                            {errors.employeeId}
                          </div>
                        )}
                        {/* <div className="form-text">
                                                    {form.transactionType === 'expense' && 'Select one or multiple employees for expense distribution'}
                                                    {form.transactionType === 'purchase' && 'Select the employee who made the purchase'}
                                                </div> */}
                      </div>
                    )}

                    {/* Receiver Input - Show when non-employee type is selected */}
                    {shouldShowReceiverInput() && (
                      <div className="col-lg-6">
                        <label className="form-label">
                          Receiver <span className="text-danger">*</span>
                        </label>
                        <input
                          className={`form-control ${
                            errors.receiver ? "is-invalid" : ""
                          }`}
                          type="text"
                          name="receiver"
                          value={form.receiver}
                          onChange={handleChange}
                          placeholder="Enter receiver name"
                          required
                        />
                        {errors.receiver && (
                          <div className="text-danger small">
                            {errors.receiver}
                          </div>
                        )}
                        <div className="form-text">
                          Enter the name of the external receiver/vendor
                        </div>
                      </div>
                    )}

                    <div className="col-lg-6">
                      <label className="form-label">
                        Amount <span className="text-danger">*</span>
                      </label>
                      <input
                        className={`form-control ${
                          errors.amount ? "is-invalid" : ""
                        }`}
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        required
                        min="0"
                        step="0.01"
                      />
                      {errors.amount && (
                        <div className="text-danger small">{errors.amount}</div>
                      )}
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-lg-12">
                      <label className="form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <input
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        type="text"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        placeholder="Enter description"
                      />
                      {errors.description && (
                        <div className="text-danger small">
                          {errors.description}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="submit"
                      className="btn btn-success text-sm"
                      disabled={submitting}
                    >
                      {submitting ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary text-sm"
                      data-bs-dismiss="modal"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

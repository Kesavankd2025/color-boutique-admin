import React, { useState, useEffect, useMemo } from "react";
import { PencilSimple } from "@phosphor-icons/react";
import Select from "react-select";
import apiProvider from "../apiProvider/adminuserapi";
import pettyCashApi from "../apiProvider/pettyCashapi";
import ReactTableComponent from "../table/ReactTableComponent";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import adminUserApi from "../apiProvider/adminuserapi";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function PettyCashManagementLayer() {
  /** ------------------ State ------------------ **/
  const [form, setForm] = useState({
    date: "",
    initialAmount: "",
    giver: "",
    closingAmount: "",
    handover: "",
  });
  const [employees, setEmployees] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedReceiver, setSelectedReceiver] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [pettyCashList, setPettyCashList] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [misMatchAmount, setmisMactchAmount] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const { token, user } = useSelector((state) => state.auth);
  const [loginUserId, setLoginUserId] = useState(null);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [loginUser, setLoginUser] = useState();

  console.log(total,'total')

  // Date filter state
  const [dateFilter, setDateFilter] = useState({
    startDate: "",
    endDate: "",
  });

  // Denomination state
  const [denominations, setDenominations] = useState([
    { value: 500, count: 0, total: 0 },
    { value: 200, count: 0, total: 0 },
    { value: 100, count: 0, total: 0 },
    { value: 50, count: 0, total: 0 },
    { value: 20, count: 0, total: 0 },
    { value: 10, count: 0, total: 0 },
  ]);
  const [coinsAmount, setCoinsAmount] = useState(0);

  /** ------------------ Effects ------------------ **/

  // Set default dates on component mount
  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    setDateFilter({
      startDate: firstDayOfMonth.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
  }, []);

  // Fetch data when pageIndex, pageSize, or date filters change
  useEffect(() => {
    if (dateFilter.startDate && dateFilter.endDate) {
      fetchPettyCashList();
    }
  }, [pageIndex, pageSize, dateFilter.startDate, dateFilter.endDate]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      const options = employees.map((emp) => ({
        value: emp._id || emp.id,
        label: emp.name || emp.fullName,
      }));
      setEmployeeOptions(options);
    }
  }, [employees]);

  useEffect(() => {
    if (showModal) {
      const modalBackdrop = document.createElement("div");
      modalBackdrop.className = "modal-backdrop fade show";
      document.body.appendChild(modalBackdrop);
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";

      return () => {
        document.body.removeChild(modalBackdrop);
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "";
        document.body.style.paddingRight = "";
      };
    }
  }, [showModal]);

  // Calculate total amount from denominations and coins
  useEffect(() => {
    const notesTotal = denominations.reduce(
      (sum, denom) => sum + denom.total,
      0
    );
    const total = notesTotal + parseFloat(coinsAmount || 0);
    setForm((prev) => ({ ...prev, closingAmount: total }));
  }, [denominations, coinsAmount]);

  /** ------------------ API Calls ------------------ **/
  const fetchEmployees = async () => {
    try {
      const result = await apiProvider.getUserList();
      if (result.status && Array.isArray(result.response?.data)) {
        setEmployees(result.response.data);
      } else if (result.status && Array.isArray(result.response)) {
        setEmployees(result.response);
      } else {
        setEmployees([]);
      }
    } catch (e) {
      setEmployees([]);
    }
  };

  useEffect(() => {
    const fetchUserOnRefresh = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          if (userId) {
            setLoginUserId(userId);
            const userData = await adminUserApi.Userbyid(userId);
            console.log(userData, "userData-admin check");
            if (userData) {
              setLoginUser(userData?.response?.data);
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserOnRefresh();
  }, [token]);

  const fetchPettyCashList = async () => {
    try {
      const params = {
        page: pageIndex,
        limit: pageSize,
      };

      // Add date filters if they exist
      if (dateFilter.startDate) {
        params.startDate = dateFilter.startDate;
      }
      if (dateFilter.endDate) {
        params.endDate = dateFilter.endDate;
      }

      const res = await pettyCashApi.getAllPettyCashManagementList(params);
      if (res.status && Array.isArray(res.response?.data)) {
        setPettyCashList(res.response.data);
        setTotalPages(
          res.response.totalPages ||
            Math.ceil(
              (res.response.totalCount || res.response.data.length) / pageSize
            ) ||
            1
        );
        // setTotal(all.length);
         setTotal(res.response?.totalCount || 0);
      } else if (res.status && Array.isArray(res.response)) {
        setPettyCashList(res.response);
        setTotalPages(1);
      } else {
        setPettyCashList([]);
        setTotalPages(1);
      }
    } catch (e) {
      setPettyCashList([]);
      setTotalPages(1);
    }
  };

  /** ------------------ Date Filter Handlers ------------------ **/
  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateFilterSubmit = (e) => {
    e.preventDefault();
    setPageIndex(0); // Reset to first page when filter changes
    fetchPettyCashList();
  };

  const resetDateFilter = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    setDateFilter({
      startDate: firstDayOfMonth.toISOString().split("T")[0],
      endDate: today.toISOString().split("T")[0],
    });
    setPageIndex(0);
  };

  /** ------------------ Other Handlers ------------------ **/
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setErrors({});
    setmisMactchAmount("");
    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleReceiverChange = (selectedOption) => {
    setSelectedReceiver(selectedOption);
    setForm((prev) => ({
      ...prev,
      handover: selectedOption ? selectedOption.value : "",
    }));
    setErrors((prev) => ({ ...prev, handover: "" }));
  };

  const handleDenominationChange = (index, count) => {
    const newDenominations = [...denominations];
    newDenominations[index].count = parseInt(count) || 0;
    newDenominations[index].total =
      newDenominations[index].value * newDenominations[index].count;
    setDenominations(newDenominations);
  };

  const handleCoinsChange = (value) => {
    setCoinsAmount(parseFloat(value) || 0);
  };

  // Check if record is from today's date
  const isTodayRecord = (recordDate) => {
    const today = new Date().toISOString().split("T")[0];
    const recordDateStr = new Date(recordDate).toISOString().split("T")[0];
    return today === recordDateStr;
  };

  // Calculate expected closing amount and difference
  const calculateDifference = () => {
    if (!currentRecord)
      return { expectedClosing: 0, difference: 0, type: "balanced" };

    const initialAmount = parseFloat(currentRecord.initialAmount) || 0;
    const salesAmount = parseFloat(currentRecord.salesAmount) || 0;
    const expensesAmount = parseFloat(currentRecord.expensesAmount) || 0;
    const actualClosing = parseFloat(form.closingAmount) || 0;

    const expectedClosing = initialAmount + salesAmount - expensesAmount;
    const difference = actualClosing - expectedClosing;

    let type = "balanced";
    if (difference > 0) {
      type = "excess";
    } else if (difference < 0) {
      type = "shortage";
    }

    return {
      expectedClosing,
      difference: Math.abs(difference),
      type,
      initialAmount,
      salesAmount,
      expensesAmount,
      actualClosing,
    };
  };

  const validate = () => {
    const newErrors = {};
    if (!form.handover) {
      newErrors.handover = "Please select a handover";
    }
    if (!form.closingAmount || isNaN(form.closingAmount)) {
      newErrors.closingAmount = "Valid closing amount is required";
    }
    return newErrors;
  };

  const showConfirmationAlert = () => {
    const calculation = calculateDifference();

    let title, iconType, statusColor, statusIcon;

    if (calculation.type === "excess") {
      title = "Excess Amount Detected";
      iconType = "warning";
      statusColor = "warning";
      statusIcon = "⚠️";
    } else if (calculation.type === "shortage") {
      title = "Shortage Amount Detected";
      iconType = "error";
      statusColor = "danger";
      statusIcon = "❗";
    } else {
      title = "Amount Balanced";
      iconType = "success";
      statusColor = "success";
      statusIcon = "✅";
    }

    const html = `
      <div class="confirmation-alert">
        <!-- Status Header -->
        <div class="status-header text-center mb-4">
          <div class="status-icon mb-2 fs-1">${statusIcon}</div>
          <h4 class="fw-bold text-${statusColor}">${title}</h4>
        </div>

        <!-- Calculation Card -->
        <div class="calculation-card bg-white border rounded-3 p-4 mb-4 shadow-sm">
          <h6 class="fw-bold text-dark mb-3 text-center border-bottom pb-2">Calculation Breakdown</h6>
          
          <div class="calculation-grid">
            <!-- Opening Balance -->
            <div class="calc-row d-flex justify-content-between align-items-center py-2 border-bottom">
              <span class="text-muted">Opening Balance</span>
              <span class="fw-bold">₹${calculation.initialAmount}</span>
            </div>
            
            <!-- Sales Amount -->
            <div class="calc-row d-flex justify-content-between align-items-center py-2 border-bottom">
              <span class="text-muted">
                <i class="fas fa-plus text-success me-2"></i>
                Sales Amount
              </span>
              <span class="fw-bold text-success">+ ₹${
                calculation.salesAmount
              }</span>
            </div>
            
            <!-- Expenses Amount -->
            <div class="calc-row d-flex justify-content-between align-items-center py-2 border-bottom">
              <span class="text-muted">
                <i class="fas fa-minus text-danger me-2"></i>
                Expenses Amount
              </span>
              <span class="fw-bold text-danger">- ₹${
                calculation.expensesAmount
              }</span>
            </div>
            
            <!-- Separator -->
            <div class="calc-row py-2">
              <hr class="my-1 border-secondary">
            </div>
            
            <!-- Expected Closing -->
            <div class="calc-row d-flex justify-content-between align-items-center py-2 border-bottom">
              <span class="fw-semibold text-dark">Expected Closing</span>
              <span class="fw-bold text-primary">₹${
                calculation.expectedClosing
              }</span>
            </div>
            
            <!-- Actual Closing -->
            <div class="calc-row d-flex justify-content-between align-items-center py-2 border-bottom">
              <span class="fw-semibold text-dark">Actual Closing</span>
              <span class="fw-bold text-primary">₹${
                calculation.actualClosing
              }</span>
            </div>
            
            <!-- Separator -->
            <div class="calc-row py-2">
              <hr class="my-1 border-secondary">
            </div>
            
            <!-- Difference -->
            <div class="calc-row d-flex justify-content-between align-items-center py-2">
              <span class="fw-semibold text-dark">Difference</span>
              <span class="fw-bold fs-5 text-${statusColor}">
                ${
                  calculation.type === "excess"
                    ? "+"
                    : calculation.type === "shortage"
                    ? "-"
                    : ""
                }
                ₹${calculation.difference}
              </span>
            </div>
          </div>
        </div>

        <!-- Status Message -->
        <div class="status-message text-center">
          <div class="alert alert-${statusColor} bg-${statusColor} bg-opacity-10 border-0">
            <div class="fw-semibold">
              ${
                calculation.type === "excess"
                  ? "You have more cash than expected. Please verify the amounts."
                  : calculation.type === "shortage"
                  ? "You have less cash than expected. Please double-check your entries."
                  : "Perfect! All amounts are balanced correctly."
              }
            </div>
          </div>
        </div>

        <!-- Info Note -->
        <div class="info-note text-center mt-3">
          <small class="text-muted">
            <i class="fas fa-info-circle me-1"></i>
            Review the calculations before proceeding with submission.
          </small>
        </div>
      </div>
    `;

    return Swal.fire({
      title: "",
      html: html,
      icon: iconType,
      showCancelButton: true,
      confirmButtonText: "Yes, Continue to Submit",
      cancelButtonText: "Back to Edit",
      confirmButtonColor: "#198754",
      cancelButtonColor: "#6c757d",
      customClass: {
        popup: "rounded-4 border-0 shadow-lg",
        header: "border-0 pb-0",
        title: "d-none",
        confirmButton: "btn btn-success px-4 py-2 fw-semibold rounded-2",
        cancelButton:
          "btn btn-outline-secondary px-4 py-2 fw-semibold rounded-2",
        actions: "mt-2 gap-3",
      },
      buttonsStyling: false,
      width: "480px",
      padding: "1.5rem",
      showCloseButton: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Show confirmation alert
    const result = await showConfirmationAlert();
    if (!result.isConfirmed) {
      return; // User cancelled, don't proceed
    }

    // Proceed with submission
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("handover", form.handover);
      formData.append("initialAmount", form.initialAmount || 0);
      formData.append("closingAmount", form.closingAmount || 0);

      // Add denominations data with coins
      const denominationsWithCoins = [
        ...denominations,
        { value: "Coins", count: null, total: coinsAmount },
      ];
      formData.append("denominations", JSON.stringify(denominationsWithCoins));
      formData.append(
        "isAdmin",
        loginUser && loginUser?.type === "admin" ? true : false || false
      );

      console.log(...formData, "formDate");
      console.log(editId, "editId");

      let res;
      if (isEdit && editId) {
        res = await pettyCashApi.updatePettyCashManagement(editId, formData);
      }

      if (res.status) {
        toast.success("Petty cash updated successfully!");
        resetForm();
        fetchPettyCashList();
        setShowModal(false);

        // Show success alert
        Swal.fire({
          title: "Success!",
          text: "Petty cash has been updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#3085d6",
          customClass: {
            popup: "rounded-3",
          },
        });
      } else {
        setErrorMsg(res.response?.message || "Failed to update petty cash");
        if (res.response?.message?.includes("Sales amount mismatch")) {
          setmisMactchAmount(res.response?.message);
        } else {
          setmisMactchAmount("");
        }
      }
    } catch (err) {
      setmisMactchAmount(err?.response?.message);
      setErrorMsg("Failed to update petty cash");

      // Show error alert
      Swal.fire({
        title: "Error!",
        text: "Failed to update petty cash. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        customClass: {
          popup: "rounded-3",
        },
      });
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setForm({
      date: "",
      initialAmount: "",
      giver: "",
      closingAmount: "",
      handover: "",
    });
    setSelectedReceiver(null);
    setDenominations(denominations.map((d) => ({ ...d, count: 0, total: 0 })));
    setCoinsAmount(0);
    setIsEdit(false);
    setEditId(null);
    setCurrentRecord(null);
  };

  const handleEdit = (row) => {
    // Check if record is from today's date
    if (!isTodayRecord(row.date) && loginUser && loginUser?.type !== "admin") {
      toast.error("You can only edit records from today's date");
      return;
    }

    const currentReceiverId = row.receiver?._id || row.receiver;
    const currentReceiverOption = employeeOptions.find(
      (opt) => opt.value === currentReceiverId
    );
    console.log(currentReceiverOption, "cccccc");

    // Find giver name
    const giverEmployee = employees.find(
      (emp) => emp._id === (row.giver?._id || row.giver)
    );
    const giverName = giverEmployee?.name || row.giver?.name || "Unknown";
    console.log(giverName, "gi");

    setForm({
      date: row.date ? new Date(row.date).toISOString().split("T")[0] : "",
      initialAmount: row.initialAmount || "",
      giver: giverName,
      closingAmount: row.closingAmount || "",
      handover: "",
      receiver: currentReceiverOption
        ? currentReceiverOption.label
        : row.receiver?.name || row.receiver || "",
    });

    setSelectedReceiver(null);
    setCurrentRecord(row); // Store the current record for calculations

    // Load denominations data
    if (row.denominations && Array.isArray(row.denominations)) {
      const updatedDenominations = denominations.map((denom) => {
        const existing = row.denominations.find((d) => d.value === denom.value);
        return existing
          ? {
              ...denom,
              count: existing.count,
              total: existing.value * existing.count,
            }
          : denom;
      });
      setDenominations(updatedDenominations);

      // Load coins amount
      const coinsEntry = row.denominations.find((d) => d.value === "Coins");
      if (coinsEntry) {
        setCoinsAmount(coinsEntry.total || 0);
      } else {
        setCoinsAmount(0);
      }
    } else {
      setDenominations(
        denominations.map((d) => ({ ...d, count: 0, total: 0 }))
      );
      setCoinsAmount(0);
    }

    setIsEdit(true);
    setEditId(row._id);
    setErrors({});
    setSuccessMsg("");
    setErrorMsg("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  /** ------------------ Table Columns ------------------ **/
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "S.No",
        id: "sno",
        cell: (info) => pageIndex * pageSize + info.row.index + 1,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (info) =>
          info.row.original.date
            ? new Date(info.row.original.date).toLocaleDateString()
            : "-",
      },
      {
        header: "Opening Balance",
        accessorKey: "initialAmount",
        cell: (info) => `₹${info.row.original.initialAmount || 0}`,
      },
      {
        header: "Giver",
        accessorKey: "giver",
        cell: (info) => {
          const giver = info.row.original.giver;
          if (typeof giver === "object" && giver !== null) {
            return giver.name || "-";
          }
          const giverEmployee = employees.find((emp) => emp._id === giver);
          return giverEmployee?.name || giver || "-";
        },
      },
      {
        header: "Sales Amount",
        accessorKey: "salesAmount",
        cell: (info) => `₹${info.row.original.salesAmount || 0}`,
      },
      {
        header: "Expence Amount",
        accessorKey: "expensesAmount",
        cell: (info) => `₹${info.row.original.expensesAmount || 0}`,
      },
      {
        header: "Closing Amount",
        accessorKey: "closingAmount",
        cell: (info) => `₹${info.row.original.closingAmount || 0}`,
      },
      {
        header: "Receiver",
        accessorKey: "receiver",
        cell: (info) => {
          const receiver = info.row.original.receiver;
          if (typeof receiver === "object" && receiver !== null) {
            return receiver.name || "-";
          }
          const receiverEmployee = employees.find(
            (emp) => emp._id === receiver
          );
          return receiverEmployee?.name || receiver || "-";
        },
      },
    ];

    baseColumns.push({
      header: "Action",
      id: "action",
      cell: (info) => {
        const isToday = isTodayRecord(info.row.original.date);

        // Get receiver ID from the row data
        const receiver = info.row.original.receiver;
        const receiverId =
          typeof receiver === "object" && receiver !== null
            ? receiver._id || receiver.id
            : receiver;

        // Check if loginUserId matches receiver ID
        const isReceiver = loginUserId === receiverId;

        // Only show action button if user is the receiver AND it's today's record
        if (isReceiver && isToday) {
          return (
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleEdit(info.row.original)}
              title="Edit record"
            >
              <Icon icon="lucide:edit" />
            </button>
          );
        } else if (loginUser && loginUser?.type === "admin") {
          return (
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleEdit(info.row.original)}
              title="Edit record"
            >
              <Icon icon="lucide:edit" />
            </button>
          );
        }

        return null;
      },
    });

    return baseColumns;
  }, [
    pageIndex,
    pageSize,
    employeeOptions,
    employees,
    loginUserId,
    pettyCashList,
  ]);

  /** ------------------ UI ------------------ **/
  return (
    <div className="row">
      <div className="col-xxl-12">
        <div className="card">
          <div className="card-body">
            {/* Header Row */}
            {/* <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold text-dark mb-1">Petty Cash Management</h4>
            <p className="text-muted mb-0">Date Range Filter</p>
          </div>
          <div className="badge bg-light text-dark border px-3 py-2">
            <i className="fas fa-clock me-1"></i>
            Today's records are editable
          </div>
        </div> */}

            {/* Date Filter - Side by Side */}
            <div className="row mb-4">
              <div className="col-12 d-flex justify-content-end">
                <div className="date-range-wrapper">
                  <div className="row align-items-center g-2">
                    <div className="col-auto">
                      <label className="form-label fw-medium mb-0">
                        Date Filter
                      </label>
                    </div>

                    <div className="col-auto">
                      <input
                        type="date"
                        className="form-control"
                        name="startDate"
                        value={dateFilter.startDate}
                        onChange={handleDateFilterChange}
                        max={dateFilter.endDate}
                      />
                    </div>

                    <div className="col-auto text-center">
                      <span className="text-muted">to</span>
                    </div>

                    <div className="col-auto">
                      <input
                        type="date"
                        className="form-control"
                        name="endDate"
                        value={dateFilter.endDate}
                        onChange={handleDateFilterChange}
                        min={dateFilter.startDate}
                        max={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}

            <ReactTableComponent
              data={pettyCashList}
              columns={columns}
              pageIndex={pageIndex}
              totalPages={totalPages}
              totalRecords={total}
              onNextPage={() =>
                setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))
              }
              onPreviousPage={() =>
                setPageIndex((prev) => Math.max(prev - 1, 0))
              }
            />
          </div>
        </div>
      </div>

      {/* Modal - Clean Layout */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-500">
                  Update Petty Cash - {form.date}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Info Cards in Row */}
                  <div className="row mb-4">
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3 text-center">
                        <p className="text-muted small mb-1">Date</p>
                        <p className="fw-500 mb-0">{form.date}</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3 text-center">
                        <p className="text-muted small mb-1">Opening Balance</p>
                        <p className="fw-500 mb-0">₹{form.initialAmount}</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3 text-center">
                        <p className="text-muted small mb-1">Giver</p>
                        <p className="fw-500 mb-0">{form.giver}</p>
                      </div>
                    </div>
                    <div className="col-md-3 mb-3">
                      <div className="border rounded p-3 text-center">
                        <p className="text-muted small mb-1">
                          Current Receiver
                        </p>
                        <p className="fw-500 mb-0">
                          {form.receiver || "Not assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Handover Section */}
                  <div className="mb-4">
                    <h6 className="fw-500 mb-3">Handover To</h6>
                    <div className="row">
                      <div className="col-md-8">
                        <Select
                          options={employeeOptions}
                          value={selectedReceiver}
                          onChange={handleReceiverChange}
                          placeholder="Select new receiver..."
                          isClearable
                          className="basic-single"
                          classNamePrefix="select"
                        />
                        {errors.handover && (
                          <div className="text-danger small mt-1">
                            {errors.handover}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Denomination Table */}
                  <div className="mb-4">
                    <h6 className="fw-500 mb-3">Denomination Breakdown</h6>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Denomination</th>
                            <th>Count</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {denominations.map((denom, index) => (
                            <tr key={index}>
                              <td>₹{denom.value}</td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control"
                                  min="0"
                                  value={denom.count}
                                  onChange={(e) =>
                                    handleDenominationChange(
                                      index,
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td>₹{denom.total}</td>
                            </tr>
                          ))}
                          <tr>
                            <td>Coins</td>
                            <td colSpan="2">
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                step="0.01"
                                value={coinsAmount}
                                onChange={(e) =>
                                  handleCoinsChange(e.target.value)
                                }
                              />
                            </td>
                          </tr>
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="2" className="text-end fw-bold">
                              Total Closing Amount:
                            </td>
                            <td className="fw-bold">₹{form.closingAmount}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

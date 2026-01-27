import { PlusCircle } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import apiProvider from "../apiProvider/adminuserapi";
import pettyCashApi from "../apiProvider/boxCashapi";
import ReactTableComponent from "../table/ReactTableComponent";
import { Icon } from "@iconify/react/dist/iconify.js";
import { toast } from "react-toastify";
import Select from "react-select";
import Swal from "sweetalert2";
import boxCashManagementApi from "../apiProvider/boxCashManagementApi";
import ExpenseApis from "../apiProvider/expenseApi"; // Import expense APIs

export default function AddTransactionPageLayer() {
  // State for form fields
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    receiver: "",
    employeeId: "",
    description: "",
    paymentMode: "",
    transactionType: "",
    referenceNumber: "",
    documents: null,
    expenseType: "", // Add expense type field
  });
  const [employees, setEmployees] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [pettyCashList, setPettyCashList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [employeeType, setEmployeeType] = useState("employee");
  const [totalRecords, setTotalRecords] = useState(0);
  const [filterTransactionType, setFilterTransactionType] = useState("all");
  const [viewModalData, setViewModalData] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editDenominations, setEditDenominations] = useState([]);
  const [editCoinsAmount, setEditCoinsAmount] = useState(0);
  const [editReceiver, setEditReceiver] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [overallTotals, setOverallTotals] = useState(null);
  const [showClosingModal, setShowClosingModal] = useState(false);
  const [closingForm, setClosingForm] = useState({
    denominations: [],
    coinsAmount: 0,
    description: "",
  });
  const [expenseTypes, setExpenseTypes] = useState([]); // Add expense types state
  const [loadingExpenseTypes, setLoadingExpenseTypes] = useState(false); // Add loading state
  // const [filterTransactionType, setFilterTransactionType] = useState('pettycash');

  // Fetch employees for dropdown
  useEffect(() => {
    fetchEmployees();
    fetchPettyCashList();
    fetchExpenseTypes(); // Fetch expense types
  }, [pageIndex, pageSize, filterTransactionType, selectedDate]);

  useEffect(() => {
    if (employees.length > 0) {
      const options = employees.map((emp) => ({
        value: emp._id || emp.id,
        label: emp.name || emp.fullName,
      }));
      setEmployeeOptions(options);
    }
  }, [employees]);

  const fetchEmployees = async () => {
    try {
      const result = await apiProvider.getUserList();
      if (result.status && Array.isArray(result.response?.data)) {
        setEmployees(result.response.data);
        setTotalRecords(result.response.totalCount || 0);
      } else if (result.status && Array.isArray(result.response)) {
        setEmployees(result.response);
      } else {
        setEmployees([]);
      }
    } catch (e) {
      setEmployees([]);
    }
  };

  const fetchPettyCashList = async () => {
    setLoadingList(true);
    try {
      const params = {
        page: pageIndex + 1,
        limit: pageSize,
        // transactionType: filterTransactionType || undefined,
        startDate: selectedDate,
        endDate: selectedDate,
      };
      // Only add transactionType filter if not "all"
      if (filterTransactionType !== "all") {
        params.transactionType = filterTransactionType;
      }
      const res = await pettyCashApi.getBoxCashList(params);
      if (res.status && Array.isArray(res.response?.data)) {
        setPettyCashList(res.response.data);
        setTotalPages(
          res.response.totalPages ||
            Math.ceil(
              (res.response.totalCount || res.response.data.length) / pageSize
            ) ||
            1
        );
        setTotalRecords(res.response.totalCount || res.response.data.length);
        setOverallTotals(res.response.overallTotals);
      } else if (res.status && Array.isArray(res.response)) {
        setPettyCashList(res.response);
        setTotalPages(1);
        setTotalRecords(res.response.length);
      } else {
        setPettyCashList([]);
        setTotalPages(1);
        setTotalRecords(0);
      }
    } catch (e) {
      setPettyCashList([]);
      setTotalPages(1);
      setTotalRecords(0);
    }
    setLoadingList(false);
  };

  const fetchExpenseTypes = async () => {
    setLoadingExpenseTypes(true);
    try {
      const result = await ExpenseApis.expenseTypeList({
        page: 0,
        limit: 1000, // Fetch all expense types
        filters: {},
      });

      if (result.status && Array.isArray(result.response?.data)) {
        setExpenseTypes(result.response.data);
      } else {
        setExpenseTypes([]);
      }
    } catch (error) {
      console.error("Error fetching expense types:", error);
      setExpenseTypes([]);
    } finally {
      setLoadingExpenseTypes(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setForm((f) => ({ ...f, documents: files[0] }));
    } else {
      if (name === "date") {
        const today = new Date();
        const selected = new Date(value);

        // Calculate 3 days ago
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(today.getDate() - 3);

        // Convert to date-only format for easy comparison
        const todayDate = today.toISOString().split("T")[0];
        const minDate = threeDaysAgo.toISOString().split("T")[0];

        // Validate selected date
        if (value < minDate) {
          setErrors((prev) => ({
            ...prev,
            date: `You can only select today, future dates, or past 3 days (from ${minDate}).`,
          }));
          return;
        } else {
          setErrors((prev) => ({
            ...prev,
            date: "",
          }));
        }
      }

      setForm((f) => ({ ...f, [name]: value }));

      if (name === "transactionType") {
        setSelectedEmployees([]);
        setEmployeeType("employee");
        setForm((f) => ({
          ...f,
          employeeId: "",
          receiver: "",
          description: "",
          expenseType: "", // Reset expense type when transaction type changes
        }));
      }
    }
  };

  // Handle employee selection change
  const handleEmployeeChange = (selectedOptions) => {
    setSelectedEmployees(selectedOptions);

    if (
      form.transactionType === "expense" &&
      selectedOptions &&
      selectedOptions.length > 0
    ) {
      const employeeIds = selectedOptions.map((option) => option.value);
      setForm((f) => ({ ...f, employeeId: employeeIds }));
    } else if (selectedOptions) {
      setForm((f) => ({ ...f, employeeId: [selectedOptions.value] }));
    } else {
      setForm((f) => ({ ...f, employeeId: [] }));
    }
  };

  // Check if transaction type requires employee selection
  const requiresEmployeeSelection = () => {
    const noEmployeeTypes = ["deposit", "withdraw"];
    return !noEmployeeTypes.includes(form.transactionType);
  };

  // Check if transaction type requires user type selection
  const requiresUserTypeSelection = () => {
    const userTypeRequired = ["expense", "purchase"];
    return userTypeRequired.includes(form.transactionType);
  };

  // Check if should show employee selection
  const shouldShowEmployeeSelection = () => {
    if (!requiresEmployeeSelection()) return false;

    if (requiresUserTypeSelection()) {
      return employeeType === "employee";
    }

    return true;
  };

  // Check if should show receiver input
  const shouldShowReceiverInput = () => {
    return requiresUserTypeSelection() && employeeType === "notEmployee";
  };

  // Validate required fields
  const validate = () => {
    const newErrors = {};

    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (!form.transactionType)
      newErrors.transactionType = "Transaction type is required";
    // Add expense type validation for expense transactions
    if (form.transactionType === "expense" && !form.expenseType) {
      newErrors.expenseType =
        "Expense type is required for expense transactions";
    }

    if (requiresEmployeeSelection()) {
      if (requiresUserTypeSelection() && employeeType === "notEmployee") {
        if (!form.receiver || form.receiver.trim() === "") {
          newErrors.receiver = "Receiver is required";
        }
      } else {
        if (!form.employeeId || form.employeeId.length === 0) {
          newErrors.employeeId = "Employee is required";
        }
      }
    }

    if (
      form.transactionType === "purchase" &&
      (!form.description || form.description.trim() === "")
    ) {
      newErrors.description = "Description is required for purchase";
    }

    if (!form.date) newErrors.date = "Date is required";

    return newErrors;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const requestBody = {
        transactionType: form.transactionType,
        date: form.date,
        amount: parseFloat(form.amount),
        userType: requiresUserTypeSelection() ? employeeType : "employee",
        employeeId:
          form.employeeId && form.employeeId.length > 0
            ? form.employeeId
            : undefined,
        receiver:
          requiresUserTypeSelection() && employeeType === "notEmployee"
            ? form.receiver
            : undefined,
        description: form.description || undefined,
        expenseType: form.expenseType || undefined, // Add expense type to request
      };

      if (!requiresEmployeeSelection()) {
        delete requestBody.employeeId;
        delete requestBody.userType;
        delete requestBody.receiver;
      }
      // Remove expenseType for non-expense transactions
      if (form.transactionType !== "expense") {
        delete requestBody.expenseType;
      }

      Object.keys(requestBody).forEach((key) => {
        if (requestBody[key] === undefined) {
          delete requestBody[key];
        }
      });

      console.log("Request Body:", requestBody);

      const res = await pettyCashApi.createBoxCash(requestBody);

      console.log(res, "resss");

      if (res.status) {
        toast.success("Transaction created successfully");
        resetForm();
        fetchPettyCashList();
        document.getElementById("closeModal").click();
      } else {
        console.error("Error creating transaction:", res);
        toast.error(res.response?.message || "Failed to create transaction");
      }
    } catch (err) {
      console.error("Submission error:", err);
      toast.error(err?.response?.message || "Failed to create transaction");
    }
    setSubmitting(false);
  };

  const resetForm = () => {
    setForm({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      receiver: "",
      employeeId: "",
      description: "",
      paymentMode: "",
      transactionType: "",
      referenceNumber: "",
      documents: null,
      expenseType: "", // Reset expense type
    });
    setSelectedEmployees([]);
    setEmployeeType("employee");
    setErrors({});
  };

  // Check if modal content should be editable
  const isModalEditable = () => {
    if (!viewModalData?.pettyCashManagementId) return false;

    const isDifferenceTypePending =
      viewModalData.pettyCashManagementId.differenceType === "pending";
    const hasDenominations =
      viewModalData.pettyCashManagementId.denominations &&
      viewModalData.pettyCashManagementId.denominations.length > 0;

    return !isDifferenceTypePending && hasDenominations;
  };

  // View transaction details
  const handleViewTransaction = (transaction) => {
    setViewModalData(transaction);

    if (
      transaction.pettyCashManagementId &&
      transaction.pettyCashManagementId.denominations
    ) {
      const denominations = transaction.pettyCashManagementId.denominations;
      setEditDenominations(denominations.filter((d) => d.value !== "Coins"));

      const coinsEntry = denominations.find((d) => d.value === "Coins");
      setEditCoinsAmount(coinsEntry ? coinsEntry.total : 0);
    } else {
      setEditDenominations([]);
      setEditCoinsAmount(0);
    }

    setEditReceiver("");
    setShowViewModal(true);
  };

  // Handle denomination changes in view modal
  const handleDenominationChange = (index, count) => {
    const newDenominations = [...editDenominations];
    newDenominations[index].count = parseInt(count) || 0;
    newDenominations[index].total =
      newDenominations[index].value * newDenominations[index].count;
    setEditDenominations(newDenominations);
  };

  // Handle coins amount change
  const handleCoinsChange = (value) => {
    setEditCoinsAmount(parseFloat(value) || 0);
  };

  // Calculate total from denominations and coins
  const calculateTotalAmount = () => {
    const notesTotal = editDenominations.reduce(
      (sum, denom) => sum + denom.total,
      0
    );
    return notesTotal + editCoinsAmount;
  };

  // Handle update petty cash management
  const handleUpdatePettyCash = async () => {
    try {
      if (!viewModalData.pettyCashManagementId) {
        toast.error("No petty cash management record found");
        return;
      }

      const denominationsWithCoins = [
        ...editDenominations,
        { value: "Coins", count: null, total: editCoinsAmount },
      ];

      const updateData = {
        closingAmount: calculateTotalAmount(),
        denominations: denominationsWithCoins,
      };

      const res = await pettyCashApi.updatePettyCashManagementForAdmin(
        viewModalData.pettyCashManagementId._id,
        updateData
      );

      if (res.status) {
        toast.success("Petty cash updated successfully");
        setShowViewModal(false);
        fetchPettyCashList();
      } else {
        toast.error(res.response?.message || "Failed to update petty cash");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update petty cash");
    }
  };

  // Get select props based on transaction type
  const getSelectProps = () => {
    if (form.transactionType === "expense") {
      return {
        isMulti: true,
        placeholder: "Search and select employees...",
      };
    } else {
      return {
        isMulti: false,
        placeholder: "Select an employee...",
      };
    }
  };

  // Handle closing amount modal
  const handleOpenClosingModal = () => {
    setShowClosingModal(true);
    // Initialize denominations with common currency values
    if (
      overallTotals &&
      overallTotals.denamination &&
      Array.isArray(overallTotals.denamination) &&
      overallTotals.denamination.length > 0
    ) {
      const denaminationData = overallTotals.denamination;
      const otherDenominations = denaminationData.filter(
        (item) => item.value !== "Coins" && item.value !== "coins"
      );
      setClosingForm((prev) => ({
        ...prev,
        denominations: otherDenominations,
        coinsAmount:
          overallTotals.denamination.find(
            (item) => item.value === "Coins" || item.value === "coins"
          )?.total || 0,
      }));
      return;
    } else {
      const defaultDenominations = [
        // { value: 2000, count: 0, total: 0 },
        { value: 500, count: 0, total: 0 },
        { value: 200, count: 0, total: 0 },
        { value: 100, count: 0, total: 0 },
        { value: 50, count: 0, total: 0 },
        { value: 20, count: 0, total: 0 },
        { value: 10, count: 0, total: 0 },
        // { value: 5, count: 0, total: 0 },
        // { value: 2, count: 0, total: 0 },
        // { value: 1, count: 0, total: 0 }
      ];
      setClosingForm({
        denominations: defaultDenominations,
        coinsAmount: 0,
        description: "",
      });
    }
  };

  // Handle denomination changes in closing modal
  const handleClosingDenominationChange = (index, count) => {
    const newDenominations = [...closingForm.denominations];
    newDenominations[index].count = parseInt(count) || 0;
    newDenominations[index].total =
      newDenominations[index].value * newDenominations[index].count;
    setClosingForm((prev) => ({
      ...prev,
      denominations: newDenominations,
    }));
  };

  // Handle coins amount change in closing modal
  const handleClosingCoinsChange = (value) => {
    setClosingForm((prev) => ({
      ...prev,
      coinsAmount: parseFloat(value) || 0,
    }));
  };

  // Calculate total closing amount
  const calculateClosingTotal = () => {
    const notesTotal = closingForm.denominations.reduce(
      (sum, denom) => sum + denom.total,
      0
    );
    return notesTotal + closingForm.coinsAmount;
  };

  const handleSubmitClosingAmount = async () => {
    try {
      const denominationsWithCoins = [
        ...closingForm.denominations,
        { value: "Coins", count: null, total: closingForm.coinsAmount },
      ];

      const calculatedClosingAmount = calculateClosingTotal();
      const closingData = {
        date: selectedDate,
        closingAmount: calculatedClosingAmount,
        denominations: denominationsWithCoins,
        description: closingForm.description,
      };

      console.log(closingData, "cccccccccccc");

      // Check if overallTotals exists and has currentBalance
      if (!overallTotals || overallTotals.currentBalance === undefined) {
        toast.error("Unable to verify current balance. Please try again.");
        return;
      }

      const currentBalance = overallTotals.currentBalance;
      const difference = calculatedClosingAmount - currentBalance;
      const absoluteDifference = Math.abs(difference);
      const differenceType =
        difference > 0 ? "excess" : difference < 0 ? "shortage" : "balanced";

      // Get calculation breakdown from overallTotals
      const calculation = {
        initialAmount: overallTotals.totalOpeningBalance || 0,
        salesAmount: overallTotals.totalCollection || 0, // Assuming collection represents sales
        expensesAmount:
          (overallTotals.totalExpense || 0) +
          (overallTotals.totalPurchase || 0) +
          (overallTotals.totalWithdraw || 0),
        expectedClosing: currentBalance,
        actualClosing: calculatedClosingAmount,
        difference: absoluteDifference,
        type: differenceType,
      };

      // If amounts are equal, proceed directly
      if (differenceType === "balanced") {
        const res = await boxCashManagementApi.createBoxCashManagement(
          closingData
        );
        if (res.status) {
          toast.success("Closing amount submitted successfully");
          setShowClosingModal(false);
          fetchPettyCashList();
        } else {
          toast.error(
            res.response?.message || "Failed to submit closing amount"
          );
        }
        return;
      }

      // Show beautiful confirmation alert
      const { isConfirmed } = await showConfirmationAlert(calculation);

      if (isConfirmed) {
        // Add difference information to closing data
        const closingDataWithDifference = {
          ...closingData,
          differenceAmount: absoluteDifference,
          differenceType: differenceType,
        };
        console.log(closingDataWithDifference, "cccccccccccccc");

        const res = await boxCashManagementApi.createBoxCashManagement(
          closingDataWithDifference
        );
        if (res.status) {
          toast.success(
            `Closing amount submitted successfully with ${differenceType} of ₹${absoluteDifference}`
          );
          setShowClosingModal(false);
          fetchPettyCashList();
        } else {
          toast.error(
            res.response?.message || "Failed to submit closing amount"
          );
        }
      } else {
        // User chose to review again
        toast.info("Please review your closing amount entries.");
      }
    } catch (error) {
      console.error("Closing amount submission error:", error);
      toast.error("Failed to submit closing amount");
    }
  };

  // Beautiful confirmation alert function
  const showConfirmationAlert = (calculation) => {
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
          <h4 class="fw-bold text-${statusColor}" style="color: ${
      statusColor === "warning"
        ? "#f59e0b"
        : statusColor === "danger"
        ? "#dc2626"
        : statusColor === "success"
        ? "#16a34a"
        : "#6b7280"
    };">${title}</h4>
        </div>

        <!-- Calculation Card -->
        <div class="calculation-card bg-white border rounded-3 p-4 mb-4 shadow-sm" style="border-color: #e5e7eb !important;">
          <h6 class="fw-bold text-dark mb-3 text-center border-bottom pb-2" style="border-color: #e5e7eb !important;">Calculation Breakdown</h6>
          
          <div class="calculation-grid">

            <!-- Separator -->
            <div class="calc-row py-2">
              <hr class="my-1" style="border-color: #d1d5db !important;">
            </div>
            
            <!-- Expected Closing -->
            <div class="calc-row d-flex justify-content-between align-items-center py-2 border-bottom" style="border-color: #f3f4f6 !important;">
              <span class="fw-semibold text-dark">Expected Closing</span>
              <span class="fw-bold" style="color: #2563eb;">₹${calculation.expectedClosing.toLocaleString()}</span>
            </div>
            
            <!-- Actual Closing -->
            <div class="calc-row d-flex justify-content-between align-items-center py-2 border-bottom" style="border-color: #f3f4f6 !important;">
              <span class="fw-semibold text-dark">Actual Closing</span>
              <span class="fw-bold" style="color: #2563eb;">₹${calculation.actualClosing.toLocaleString()}</span>
            </div>
            
            <!-- Separator -->
            <div class="calc-row py-2">
              <hr class="my-1" style="border-color: #d1d5db !important;">
            </div>
            
            <!-- Difference -->
            <div class="calc-row d-flex justify-content-between align-items-center py-2">
              <span class="fw-semibold text-dark">Difference</span>
              <span class="fw-bold fs-5" style="color: ${
                calculation.type === "excess"
                  ? "#16a34a"
                  : calculation.type === "shortage"
                  ? "#dc2626"
                  : "#16a34a"
              };">
                ${
                  calculation.type === "excess"
                    ? "+"
                    : calculation.type === "shortage"
                    ? "-"
                    : ""
                }
                ₹${calculation.difference.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <!-- Status Message -->
        <div class="status-message text-center">
          <div class="alert border-0 rounded-3" style="background-color: ${
            statusColor === "warning"
              ? "#fef3c7"
              : statusColor === "danger"
              ? "#fef2f2"
              : statusColor === "success"
              ? "#f0fdf4"
              : "#f9fafb"
          }; color: ${
      statusColor === "warning"
        ? "#92400e"
        : statusColor === "danger"
        ? "#991b1b"
        : statusColor === "success"
        ? "#166534"
        : "#374151"
    };">
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
            <span style="margin-right: 0.25rem;">ℹ️</span>
            Review the calculations before proceeding with submission.
          </small>
        </div>
      </div>
    `;

    return Swal.fire({
      title: "",
      html: html,
      icon: iconType || "info",
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
      width: "500px",
      padding: "1.5rem",
      showCloseButton: true,
    });
  };

  // Table columns configuration
  // Table columns configuration
  const getColumns = () => {
    const baseColumns = [
      {
        header: "S.No",
        size: 70,
        id: "sno",
        cell: (info) => pageIndex * pageSize + info.row.index + 1,
      },
      {
        header: "CreatedBy",
        accessorFn: (row) =>
          row.createdBy?.name || row.createdBy?.name || "N/A",
      },
      {
        header: "Time",
        accessorKey: "createdAt",
        cell: (info) =>
          info.row.original.createdAt
            ? new Date(info.row.original.createdAt).toLocaleString()
            : "-",
      },
      {
        header: "Transaction Type",
        accessorKey: "transactionType",
        cell: (info) => {
          const type = info.row.original.transactionType || "";
          return type.charAt(0).toUpperCase() + type.slice(1);
        },
      },
      // Add Expense Type column
      {
        header: "Employee/Receiver",
        accessorFn: (row) => {
          if (row.employeeId && row.employeeId.length > 0) {
            if (Array.isArray(row.employeeId)) {
              return row.employeeId
                .map((emp) => emp.name || emp.fullName)
                .join(", ");
            }
            return row.employeeId.name || row.employeeId.fullName || "N/A";
          }
          return row.receiver || "N/A";
        },
      },
      {
        header: "Description",
        accessorKey: "description",
        cell: (info) => info.row.original.description || "-",
      },
    ];
    if (
      filterTransactionType === "expense" ||
      filterTransactionType === "all"
    ) {
      baseColumns.push({
        header: "Expense Type",
        accessorFn: (row) => {
          if (row.transactionType === "expense" && row.expenseType) {
            return row.expenseType.name || "N/A";
          }
          return "-";
        },
        cell: (info) => {
          if (
            info.row.original.transactionType === "expense" &&
            info.row.original.expenseType
          ) {
            return info.row.original.expenseType.name || "N/A";
          }
          return "-";
        },
      });
    }
    // Add amount column
    baseColumns.splice(
      4,
      0, // Insert after Expense Type column
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (info) => `₹${info.row.original.amount || "0"}`,
      }
    );

    // Add actions column only for pettycash
    if (
      filterTransactionType === "pettycash" ||
      filterTransactionType === "all"
    ) {
      baseColumns.push({
        header: "Actions",
        accessorKey: "actions",
        cell: (info) => {
          // Only show view button for pettycash transactions
          if (info.row.original.transactionType === "pettycash") {
            return (
              <button
                type="button"
                className="d-flex justify-content-center align-items-center bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px rounded-circle"
                onClick={() => handleViewTransaction(info.row.original)}
                title="View Details"
              >
                <Icon icon="majesticons:eye-line" className="text-xl" />
              </button>
            );
          }
          return "-";
        },
      });
    }

    return baseColumns;
  };

  const columns = React.useMemo(
    () => getColumns(),
    [pageIndex, pageSize, filterTransactionType]
  );
  console.log(closingForm, "closingForm");

  return (
    <div className="row" style={{ borderBottom: "none", paddingBottom: 0 }}>
      <div className="col-xxl-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              {/* LEFT SIDE – FILTERS */}
              <div className="d-flex align-items-center gap-2">
                <select
                  className="form-select"
                  style={{ width: "200px" }}
                  value={filterTransactionType}
                  onChange={(e) => setFilterTransactionType(e.target.value)}
                >
                  <option value="all">All Transactions</option>
                  <option value="pettycash">Petty Cash</option>
                  <option value="expense">Expense</option>
                  <option value="purchase">Purchase</option>
                  <option value="withdraw">Withdraw</option>
                  <option value="deposit">Deposit</option>
                  <option value="collection">Collection</option>
                </select>

                <input
                  type="date"
                  className="form-control"
                  style={{ width: "170px" }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {/* RIGHT SIDE – BUTTONS */}
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={handleOpenClosingModal}
                >
                  Closing Amount
                </button>

                <button
                  type="button"
                  className="btn btn-success d-inline-flex align-items-center"
                  data-bs-toggle="modal"
                  data-bs-target="#addPaymentModal"
                >
                  <PlusCircle size={18} weight="fill" className="me-2" />
                  Add Transaction
                </button>
              </div>
            </div>

            {/* Overall Totals Cards */}
            {overallTotals && (
              <div className="row mb-4">
                {/* Opening Balance - Teal Color */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon icon="mdi:bank-outline" className="fs-2" style={{ color: '#14b8a6' }} /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">
                        Opening Balance
                      </p>
                      <h4 className="fw-bold mb-0" >
                        ₹{overallTotals.openingBalance || "0"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Pettycash Opening Amounts - Blue */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card  shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon icon="mdi:cash-lock" className=" fs-2" /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">
                        Pettycash Opening
                      </p>
                      <h4 className="fw-bold  mb-0">
                        ₹{overallTotals.totalOpeningBalance || "0"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Total Expense - Red */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon icon="mdi:cash-remove" className="text-danger fs-2" /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">
                        Total Expense
                      </p>
                      <h4 className="fw-bold mb-0">
                        ₹{overallTotals.totalExpense || "0"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Total Purchase - Orange */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon icon="mdi:shopping" className="text-warning fs-2" /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">
                        Total Purchase
                      </p>
                      <h4 className="fw-bold  mb-0">
                        ₹{overallTotals.totalPurchase || "0"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Total Deposit - Green */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon icon="mdi:cash-plus" className="text-success fs-2" /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">
                        Total Deposit
                      </p>
                      <h4 className="fw-bold  mb-0">
                        ₹{overallTotals.totalDeposit || "0"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Total Withdraw - Cyan */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon icon="mdi:cash-minus" className="text-info fs-2" /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">
                        Total Withdraw
                      </p>
                      <h4 className="fw-bold  mb-0">
                        ₹{overallTotals.totalWithdraw || "0"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Total Collection - Gray */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon icon="mdi:cash-multiple" className="text-secondary fs-2" /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">
                        Total Collection
                      </p>
                      <h4 className="fw-bold  mb-0">
                        ₹{overallTotals.totalCollection || "0"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Pettycash Closing Amounts - Blue */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon icon="mdi:cash-check" className=" fs-2" /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">
                        Pettycash Closing
                      </p>
                      <h4 className="fw-bold  mb-0">
                        ₹{overallTotals.totalClosingAmount || "0"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* Closing Balance - Purple */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                    <div
                        className="card shadow-sm bg-secondary bg-opacity-10  w-100"
                       
                    >
                        <div className="card-body text-center d-flex flex-column justify-content-center">
                        <p className="text-muted mb-1 text-14">
                            Closing Balance
                        </p>
                        <h4 className="fw-bold mb-0">
                            ₹{overallTotals.closingBalance || "0"}
                        </h4>
                        </div>
                    </div>
                    </div>


                {/* ✅ NEW: Status Card */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon
                                                    icon={overallTotals.differenceType === 'balanced' ? 'mdi:check-circle' :
                                                        overallTotals.differenceType === 'excess' ? 'mdi:arrow-up-circle' :
                                                            overallTotals.differenceType === 'shortage' ? 'mdi:arrow-down-circle' :
                                                                'mdi:clock-outline'}
                                                    className="fs-2"
                                                    style={{
                                                        color: overallTotals.differenceType === 'balanced' ? '#22c55e' :
                                                            overallTotals.differenceType === 'excess' ? '#f59e0b' :
                                                                overallTotals.differenceType === 'shortage' ? '#ef4444' :
                                                                    '#9ca3af'
                                                    }}
                                                /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">Status</p>
                      <h4
                        className="fw-bold mb-0"
                        // style={{
                        //   color:
                        //     overallTotals.differenceType === "balanced"
                        //       ? "#22c55e"
                        //       : overallTotals.differenceType === "excess"
                        //       ? "#f59e0b"
                        //       : overallTotals.differenceType === "shortage"
                        //       ? "#ef4444"
                        //       : "#9ca3af",
                        // }}
                      >
                        {overallTotals.differenceType
                          ? overallTotals.differenceType
                              .charAt(0)
                              .toUpperCase() +
                            overallTotals.differenceType.slice(1)
                          : "Pending"}
                      </h4>
                    </div>
                  </div>
                </div>

                {/* ✅ NEW: Difference Amount Card */}
                <div className="col-xl-2 col-lg-4 col-md-6 mb-3 d-flex">
                  <div className="card shadow-sm bg-secondary bg-opacity-10 w-100">
                    <div className="card-body text-center d-flex flex-column justify-content-center">
                      <div className="d-flex align-items-center justify-content-center mb-2">
                        {/* <Icon
                                                    icon={overallTotals.differenceType === 'balanced' ? 'mdi:equal' :
                                                        overallTotals.differenceType === 'excess' ? 'mdi:plus-circle' :
                                                            overallTotals.differenceType === 'shortage' ? 'mdi:minus-circle' :
                                                                'mdi:help-circle'}
                                                    className="fs-2"
                                                    style={{
                                                        color: overallTotals.differenceType === 'balanced' ? '#22c55e' :
                                                            overallTotals.differenceType === 'excess' ? '#f59e0b' :
                                                                overallTotals.differenceType === 'shortage' ? '#ef4444' :
                                                                    '#9ca3af'
                                                    }}
                                                /> */}
                      </div>
                      <p className="text-muted mb-1 text-14">
                        Difference Amount
                      </p>
                      <h4
                        className="fw-bold mb-0"
                        // style={{
                        //   color:
                        //     overallTotals.differenceType === "balanced"
                        //       ? "#22c55e"
                        //       : overallTotals.differenceType === "excess"
                        //       ? "#f59e0b"
                        //       : overallTotals.differenceType === "shortage"
                        //       ? "#ef4444"
                        //       : "#9ca3af",
                        // }}
                      >
                        ₹{overallTotals.differenceAmount || "0"}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Section */}
            {/* <div className="row mb-3">
              <div className="col-md-3">
                <label className="form-label">Filter by Transaction Type</label>
                <select
                  className="form-select"
                  value={filterTransactionType}
                  onChange={(e) => setFilterTransactionType(e.target.value)}
                >
                  <option value="all">All Transactions</option>

                  <option value="pettycash">Petty Cash</option>
                  <option value="expense">Expense</option>
                  <option value="purchase">Purchase</option>
                  <option value="withdraw">Withdraw</option>
                  <option value="deposit">Deposit</option>
                  <option value="collection">Collection</option>
                </select>
              </div>
            </div> */}

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

      {/* Add Payment Modal */}
      <div
        className="modal fade"
        id="addPaymentModal"
        tabIndex="-1"
        aria-labelledby="addPaymentModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addPaymentModalLabel">
                Add Transaction
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
                <form id="payment-form" onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-lg-6">
                      <label className="form-label">
                        Transaction Type <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select ${
                          errors.transactionType ? "is-invalid" : ""
                        }`}
                        name="transactionType"
                        value={form.transactionType}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Transaction Type</option>
                        <option value="pettycash">Petty Cash</option>
                        <option value="expense">Expense</option>
                        <option value="purchase">Purchase</option>
                        <option value="withdraw">Withdraw</option>
                        <option value="deposit">Deposit</option>
                        <option value="collection">Collection</option>
                      </select>
                      {errors.transactionType && (
                        <div className="text-danger small">
                          {errors.transactionType}
                        </div>
                      )}
                    </div>
                    <div className="col-lg-6">
                      <label className="form-label">
                        Date <span className="text-danger">*</span>
                      </label>
                      <input
                        className={`form-control ${
                          errors.date ? "is-invalid" : ""
                        }`}
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        min={
                          new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split("T")[0]
                        }
                      />
                      {errors.date && (
                        <div className="text-danger small">{errors.date}</div>
                      )}
                    </div>
                  </div>

                  {/* Expense Type Selection (only for expense transactions) */}
                  {form.transactionType === "expense" && (
                    <div className="row mb-3">
                      <div className="col-lg-12">
                        <label className="form-label">
                          Expense Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-select ${
                            errors.expenseType ? "is-invalid" : ""
                          }`}
                          name="expenseType"
                          value={form.expenseType}
                          onChange={handleChange}
                          required
                          disabled={loadingExpenseTypes}
                        >
                          <option value="">Select Expense Type</option>
                          {expenseTypes.map((expenseType) => (
                            <option
                              key={expenseType._id}
                              value={expenseType._id}
                            >
                              {expenseType.name}
                            </option>
                          ))}
                        </select>
                        {errors.expenseType && (
                          <div className="text-danger small">
                            {errors.expenseType}
                          </div>
                        )}
                        {loadingExpenseTypes && (
                          <div className="form-text text-muted">
                            <small>Loading expense types...</small>
                          </div>
                        )}
                        {!loadingExpenseTypes && expenseTypes.length === 0 && (
                          <div className="form-text text-warning">
                            <small>
                              No expense types found. Please add expense types
                              first.
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* User Type Selection (only for expense, purchase) */}
                  {requiresUserTypeSelection() && (
                    <div className="row mb-3">
                      <div className="col-lg-12">
                        <label className="form-label">
                          User Type <span className="text-danger">*</span>
                        </label>
                        <div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="userType"
                              id="employeeRadio"
                              value="employee"
                              checked={employeeType === "employee"}
                              onChange={() => setEmployeeType("employee")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="employeeRadio"
                            >
                              Employee
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="userType"
                              id="notEmployeeRadio"
                              value="notEmployee"
                              checked={employeeType === "notEmployee"}
                              onChange={() => setEmployeeType("notEmployee")}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="notEmployeeRadio"
                            >
                              Not Employee
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="row mb-3">
                    {/* Employee Selection - Show for transaction types that require employee AND user type is employee */}
                    {shouldShowEmployeeSelection() && (
                      <div className="col-lg-6">
                        <label className="form-label">
                          Select Employee
                          {form.transactionType === "expense"
                            ? " (Multiple)"
                            : " (Single)"}
                          <span className="text-danger">*</span>
                        </label>
                        <Select
                          options={employeeOptions}
                          {...getSelectProps()}
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
                        <div className="form-text">
                          {form.transactionType === "pettycash" &&
                            "Select the employee responsible for petty cash"}
                          {form.transactionType === "expense" &&
                            "Select one or multiple employees for expense distribution"}
                          {form.transactionType === "purchase" &&
                            "Select the employee who made the purchase"}
                          {form.transactionType === "collection" &&
                            "Select the employee who collected the amount"}
                        </div>
                      </div>
                    )}

                    {/* Receiver Input - Show for transaction types that require user type selection AND user type is not employee */}
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

                  {/* Description (required for purchase) */}
                  <div className="row mb-3">
                    <div className="col-lg-12">
                      <label className="form-label">
                        Description
                        {form.transactionType === "purchase" && (
                          <span className="text-danger">*</span>
                        )}
                      </label>
                      <textarea
                        className={`form-control ${
                          errors.description ? "is-invalid" : ""
                        }`}
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Enter transaction description"
                        required={form.transactionType === "purchase"}
                      ></textarea>
                      {errors.description && (
                        <div className="text-danger small">
                          {errors.description}
                        </div>
                      )}
                      <div className="form-text">
                        {form.transactionType === "purchase" &&
                          "Detailed description of the purchase is required"}
                        {form.transactionType === "expense" &&
                          "Optional description for the expense"}
                        {form.transactionType !== "purchase" &&
                          form.transactionType !== "expense" &&
                          "Optional description for the transaction"}
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="submit"
                      className="btn btn-success text-sm"
                      disabled={submitting}
                    >
                      {submitting ? "Saving..." : "Save Transaction"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary text-sm"
                      data-bs-dismiss="modal"
                      onClick={resetForm}
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

      {/* Closing Amount Modal */}
      {showClosingModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Add Closing Amount - {selectedDate}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowClosingModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-12">
                    <div className="card border-primary">
                      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Cash Denomination Breakdown</h6>
                        <span className="fw-bold">
                          Total: ₹{calculateClosingTotal()}
                        </span>
                      </div>
                      <div className="card-body">
                        <div className="alert alert-info mb-3">
                          <Icon icon="mdi:information" className="me-2" />
                          <strong>Note:</strong> Enter the denomination counts
                          and coins amount below. The total will be
                          automatically calculated as the closing amount.
                        </div>

                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead className="table-light">
                              <tr>
                                <th>Denomination</th>
                                <th>Count</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {closingForm.denominations.map((denom, index) => (
                                <tr key={index}>
                                  <td className="fw-semibold">
                                    ₹{denom.value}
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control"
                                      style={{ width: "120px" }}
                                      min="0"
                                      value={denom.count}
                                      onChange={(e) =>
                                        handleClosingDenominationChange(
                                          index,
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td className="fw-semibold">
                                    ₹{denom.total}
                                  </td>
                                </tr>
                              ))}
                              {/* Coins row */}
                              <tr>
                                <td className="fw-semibold">Coins</td>
                                <td colSpan="2">
                                  <input
                                    type="number"
                                    className="form-control"
                                    min="0"
                                    step="0.01"
                                    value={closingForm.coinsAmount}
                                    onChange={(e) =>
                                      handleClosingCoinsChange(e.target.value)
                                    }
                                    placeholder="Enter coins amount"
                                  />
                                </td>
                              </tr>
                              {/* Total row */}
                              <tr className="table-primary">
                                <td className="fw-bold">
                                  Grand Total (Closing Amount)
                                </td>
                                <td></td>
                                <td className="fw-bold fs-5">
                                  ₹{calculateClosingTotal()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Description field */}
                        <div className="mb-3">
                          <label className="form-label">
                            Description (Optional)
                          </label>
                          <textarea
                            className="form-control"
                            rows="3"
                            value={closingForm.description}
                            onChange={(e) =>
                              setClosingForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                              }))
                            }
                            placeholder="Enter any additional notes or description"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSubmitClosingAmount}
                >
                  <Icon icon="mdi:check-circle" className="me-2" />
                  Submit Closing Amount
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowClosingModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing View Modal */}
      {showViewModal && viewModalData && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Petty Cash Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Check if paymentType is IN (Opening Balance) */}
                {viewModalData.paymentType === "IN" ? (
                  // Non-editable content for Opening Balance (IN)
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <Icon
                        icon="mdi:lock-check"
                        className="text-info"
                        style={{ fontSize: "4rem" }}
                      />
                    </div>
                    <h4 className="text-info mb-3">
                      Clossing Balance - View Only
                    </h4>
                    <p className="text-muted mb-4">
                      This is an Clossing balance transaction. Clossing balances
                      cannot be edited as they represent the initial cash amount
                      at the start of the shift.
                    </p>
                    {/* <div className="alert alert-info">
                                            <strong>Note:</strong> To modify Clossing balance, please create a new petty cash transaction or adjust through system administration.
                                        </div> */}

                    {/* Display basic information */}
                    <div className="row mt-4">
                      <div className="col-md-6 mb-3">
                        <div className="card bg-light border-0 p-3">
                          <h6 className="text-muted mb-2">Clossing Balance</h6>
                          <p className="mb-0 fw-bold ">
                            ₹{viewModalData.amount || "0"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="card bg-light border-0 p-3">
                          <h6 className="text-muted mb-2">Date</h6>
                          <p className="mb-0 fw-bold">
                            {viewModalData.date
                              ? new Date(
                                  viewModalData.date
                                ).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                      </div>
                      {viewModalData.employeeId &&
                        viewModalData.employeeId.length > 0 && (
                          <div className="col-md-6 mb-3">
                            <div className="card bg-light border-0 p-3">
                              <h6 className="text-muted mb-2">
                                Assigned Employee
                              </h6>
                              <p className="mb-0 fw-bold">
                                {Array.isArray(viewModalData.employeeId)
                                  ? viewModalData.employeeId
                                      .map((emp) => emp.name || emp.fullName)
                                      .join(", ")
                                  : viewModalData.employeeId.name ||
                                    viewModalData.employeeId.fullName ||
                                    "N/A"}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                ) : !isModalEditable() ? (
                  // Non-editable content for OUT transactions - when differenceType is pending or denominations empty
                  <div className="text-center py-5">
                    <div className="mb-4">
                      <Icon
                        icon="eos-icons:loading"
                        className="text-warning"
                        style={{ fontSize: "4rem" }}
                      />
                    </div>
                    <h4 className="text-warning mb-3">Work in Progress</h4>
                    <p className="text-muted mb-4">
                      {viewModalData.pettyCashManagementId?.differenceType ===
                      "pending"
                        ? "This biller is currently working on closing this transaction. Please check back later."
                        : "This transaction is not ready for editing yet. Please wait for the biller to complete their work."}
                    </p>
                    <div className="alert alert-info">
                      <strong>Status:</strong>{" "}
                      {viewModalData.pettyCashManagementId?.differenceType ===
                      "pending"
                        ? "Pending Closure"
                        : "Processing"}
                    </div>
                  </div>
                ) : (
                  // Editable content for OUT transactions - when differenceType is not pending and denominations exist
                  <>
                    {/* Basic Information */}
                    <div className="row mb-4">
                      <div className="col-md-6 mb-3">
                        <div className="card bg-light border-0 p-3">
                          <h6 className="text-muted mb-2">Date</h6>
                          <p className="mb-0 fw-bold">
                            {viewModalData.date
                              ? new Date(
                                  viewModalData.date
                                ).toLocaleDateString()
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="card bg-light border-0 p-3">
                          <h6 className="text-muted mb-2">Transaction Type</h6>
                          <p className="mb-0 fw-bold">
                            {viewModalData.transactionType
                              ? viewModalData.transactionType
                                  .charAt(0)
                                  .toUpperCase() +
                                viewModalData.transactionType.slice(1)
                              : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <div className="card bg-light border-0 p-3">
                          <h6 className="text-muted mb-2">Opening Balance</h6>
                          <p className="mb-0 fw-bold">
                            ₹{viewModalData.amount || "0"}
                          </p>
                        </div>
                      </div>
                      {viewModalData.pettyCashManagementId && (
                        <>
                          <div className="col-md-6 mb-3">
                            <div className="card bg-light border-0 p-3">
                              <h6 className="text-muted mb-2">Sales Amount</h6>
                              <p className="mb-0 fw-bold">
                                ₹
                                {viewModalData.pettyCashManagementId
                                  .salesAmount || "0"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="card bg-light border-0 p-3">
                              <h6 className="text-muted mb-2">
                                Expenses Amount
                              </h6>
                              <p className="mb-0 fw-bold">
                                ₹
                                {viewModalData.pettyCashManagementId
                                  .expensesAmount || "0"}
                              </p>
                            </div>
                          </div>
                          {/* Difference Type and Amount */}
                          <div className="col-md-6 mb-3">
                            <div
                              className={`card border-0 p-3 ${
                                viewModalData.pettyCashManagementId
                                  .differenceType === "balanced"
                                  ? "bg-success bg-opacity-10"
                                  : viewModalData.pettyCashManagementId
                                      .differenceType === "excess"
                                  ? "bg-warning bg-opacity-10"
                                  : "bg-danger bg-opacity-10"
                              }`}
                            >
                              <h6 className="text-muted mb-2">
                                Difference Type
                              </h6>
                              <p className="mb-0 fw-bold">
                                {viewModalData.pettyCashManagementId
                                  .differenceType
                                  ? viewModalData.pettyCashManagementId.differenceType
                                      .charAt(0)
                                      .toUpperCase() +
                                    viewModalData.pettyCashManagementId.differenceType.slice(
                                      1
                                    )
                                  : "Not Calculated"}
                              </p>
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div
                              className={`card border-0 p-3 ${
                                viewModalData.pettyCashManagementId
                                  .differenceType === "balanced"
                                  ? "bg-success bg-opacity-10"
                                  : viewModalData.pettyCashManagementId
                                      .differenceType === "excess"
                                  ? "bg-warning bg-opacity-10"
                                  : "bg-danger bg-opacity-10"
                              }`}
                            >
                              <h6 className="text-muted mb-2">
                                Difference Amount
                              </h6>
                              <p className="mb-0 fw-bold">
                                ₹
                                {viewModalData.pettyCashManagementId
                                  .differenceAmount || "0"}
                              </p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Denominations Section - Only show for OUT transactions */}
                    <div className="row">
                      <div className="col-12">
                        <div className="card border-warning">
                          <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">
                              Cash Denomination Breakdown
                            </h6>
                            <span className="fw-bold">
                              Total: ₹{calculateTotalAmount()}
                            </span>
                          </div>
                          <div className="card-body">
                            <div className="alert alert-info mb-3">
                              <Icon icon="mdi:information" className="me-2" />
                              <strong>Note:</strong> Update the denomination
                              counts and coins amount below. The total will be
                              automatically calculated and used as the closing
                              amount.
                            </div>
                            <div className="table-responsive">
                              <table className="table table-bordered">
                                <thead className="table-light">
                                  <tr>
                                    <th>Denomination</th>
                                    <th>Count</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {editDenominations.map((denom, index) => (
                                    <tr key={index}>
                                      <td className="fw-semibold">
                                        ₹{denom.value}
                                      </td>
                                      <td>
                                        <input
                                          type="number"
                                          className="form-control"
                                          style={{ width: "120px" }}
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
                                      <td className="fw-semibold">
                                        ₹{denom.total}
                                      </td>
                                    </tr>
                                  ))}
                                  {/* Coins row */}
                                  <tr>
                                    <td className="fw-semibold">Coins</td>
                                    <td colSpan="2">
                                      <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        step="0.01"
                                        value={editCoinsAmount}
                                        onChange={(e) =>
                                          handleCoinsChange(e.target.value)
                                        }
                                        placeholder="Enter coins amount"
                                      />
                                    </td>
                                  </tr>
                                  {/* Total row */}
                                  <tr className="table-primary">
                                    <td className="fw-bold">
                                      Grand Total (Closing Amount)
                                    </td>
                                    <td></td>
                                    <td className="fw-bold fs-5">
                                      ₹{calculateTotalAmount()}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                {/* Show update button only for OUT transactions that are editable */}
                {viewModalData.paymentType === "OUT" && isModalEditable() && (
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handleUpdatePettyCash}
                  >
                    <Icon icon="mdi:check-circle" className="me-2" />
                    Update and Approve Closing
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

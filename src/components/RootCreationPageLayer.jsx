import { PlusCircle } from "@phosphor-icons/react";
import React, { useState, useEffect, useRef } from "react";
import apiProvider from "../apiProvider/adminuserapi";
import rootProvider from "../apiProvider/rootapi";
import { Icon } from "@iconify/react/dist/iconify.js";
import ReactTableComponent from "../table/ReactTableComponent";
import Attribute from "../apiProvider/attribute";

export default function RootCreationListLayer() {
  const [salesmen, setSalesmen] = useState([]);
  const [crm, setCrm] = useState([]);
  const [deliverymen, setDeliverymen] = useState([]);
  const [roots, setRootes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [currentRootId, setCurrentRootId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [existingPincodes, setExistingPincodes] = useState([]);
  const [formData, setFormData] = useState({
    rootName: "",
    pincode: [""],
    salesman: "",
    crm: "",
    deliveryCharges: [{ from: "", to: "", price: "" }],
    deliveryman: "",
    pincodeCharge: "",
  });

  const [errors, setErrors] = useState({
    rootName: "",
    pincode: [""],
    salesman: "",
    crm: "",
    deliveryCharges: [{ from: "", to: "", price: "" }],
    deliveryman: "",
    form: "",
    pincodeCharge: "",
  });

  const [attributeOptions, setAttributeOptions] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});
  const [canAddNewCharge, setCanAddNewCharge] = useState(false);
  const [canAddNewPincode, setCanAddNewPincode] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState("");
  const searchRef = useRef();

  useEffect(() => {
    fetchData();
    fetchRootData();
    fetchAllPincodes();
  }, [pageSize, pageIndex, search]);

  useEffect(() => {
    const lastCharge =
      formData.deliveryCharges[formData.deliveryCharges.length - 1];
    const isLastComplete = lastCharge.from && lastCharge.to && lastCharge.price;
    const isLastValid =
      !isNaN(lastCharge.from) &&
      !isNaN(lastCharge.to) &&
      !isNaN(lastCharge.price);
    const isLastToGreater = Number(lastCharge.to) > Number(lastCharge.from);
    const isLastNonZero =
      Number(lastCharge.from) > 0 &&
      Number(lastCharge.to) > 0 &&
      Number(lastCharge.price) > 0;

    // Check if there's a previous charge and if current from is greater than previous to
    let isFromGreaterThanPrevTo = true;
    if (formData.deliveryCharges.length > 1) {
      const prevCharge =
        formData.deliveryCharges[formData.deliveryCharges.length - 2];
      if (prevCharge.to && lastCharge.from) {
        isFromGreaterThanPrevTo =
          Number(lastCharge.from) > Number(prevCharge.to);
      }
    }

    setCanAddNewCharge(
      isLastComplete &&
        isLastValid &&
        isLastToGreater &&
        isLastNonZero &&
        isFromGreaterThanPrevTo
    );
  }, [formData.deliveryCharges]);

  // Effect to check if last pincode field is complete
  useEffect(() => {
    const lastPincode = formData.pincode[formData.pincode.length - 1];
    const isPincodeComplete = lastPincode && /^\d{6}$/.test(lastPincode);
    const isPincodeUnique = !checkPincodeExists(lastPincode);

    setCanAddNewPincode(isPincodeComplete && isPincodeUnique);
  }, [formData.pincode]);

  const fetchAllPincodes = async () => {
    try {
      const result = await rootProvider.getAllPincodes();
      if (result && result.status) {
        setExistingPincodes(result.response?.data || []);
      }
    } catch (error) {
      console.error("Error fetching pincodes:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  useEffect(() => {
    const fetchAttributeOptions = async () => {
      try {
        const input = { page: 0, limit: 100, filters: {} };
        const response = await Attribute.attributeList(input);
        if (
          response.status &&
          response.response &&
          Array.isArray(response.response.data)
        ) {
          const options = response.response.data.map((attribute) => ({
            value: attribute._id,
            label: attribute.name,
            values: attribute.value || [],
          }));

          const valuesMap = {};
          options.forEach((attr) => {
            valuesMap[attr.value] = attr.values;
          });
          setAttributeValues(valuesMap);

          setAttributeOptions(options);
        }
      } catch (error) {
        console.error("Error fetching attribute list:", error);
      }
    };
    fetchAttributeOptions();
  }, []);

  const addDeliveryChargeField = () => {
    setFormData((prev) => ({
      ...prev,
      deliveryCharges: [
        ...prev.deliveryCharges,
        { from: "", to: "", price: "" },
      ],
    }));
    setErrors((prev) => ({
      ...prev,
      deliveryCharges: [
        ...prev.deliveryCharges,
        { from: "", to: "", price: "" },
      ],
    }));
  };

  const removeDeliveryChargeField = (index) => {
    const newCharges = [...formData.deliveryCharges];
    newCharges.splice(index, 1);

    const newErrors = [...errors.deliveryCharges];
    newErrors.splice(index, 1);

    setFormData((prev) => ({ ...prev, deliveryCharges: newCharges }));
    setErrors((prev) => ({ ...prev, deliveryCharges: newErrors }));
  };

  const handleDeliveryChargeChange = (index, field, value) => {
    const newCharges = [...formData.deliveryCharges];
    newCharges[index] = { ...newCharges[index], [field]: value };

    const newErrors = [...errors.deliveryCharges];
    newErrors[index] = newErrors[index] || {};

    if (field === "from") {
      newErrors[index].from = value ? "" : "From value is required";

      if (index > 0 && value) {
        const prevTo = newCharges[index - 1].to;
        if (prevTo && Number(value) <= Number(prevTo)) {
          newErrors[
            index
          ].from = `From value must be greater than previous range's To value (${prevTo})`;
        }
      }

      if (
        index < newCharges.length - 1 &&
        newErrors[index + 1]?.from?.includes("previous range's To value")
      ) {
        const nextFrom = newCharges[index + 1].from;
        if (nextFrom && Number(nextFrom) > Number(value)) {
          newErrors[index + 1].from = "";
        }
      }
    } else if (field === "to") {
      newErrors[index].to = value ? "" : "To value is required";

      if (index < newCharges.length - 1 && value) {
        const nextFrom = newCharges[index + 1].from;
        if (nextFrom && Number(nextFrom) <= Number(value)) {
          newErrors[
            index + 1
          ].from = `From value must be greater than previous range's To value (${value})`;
        }
      }

      if (
        newCharges[index].from &&
        value &&
        Number(value) <= Number(newCharges[index].from)
      ) {
        newErrors[index].to = "To value must be greater than From value";
      }
    } else if (field === "price") {
      newErrors[index].price = value >= 0 ? "" : "Price must be positive";
    }

    setFormData((prev) => ({ ...prev, deliveryCharges: newCharges }));
    setErrors((prev) => ({ ...prev, deliveryCharges: newErrors }));
  };

  const checkPincodeExists = (pincode) => {
    if (!editMode) {
      return existingPincodes.some((pin) => pin.code === pincode);
    }
    // During edit mode, exclude the current route's pincodes
    return false;
  };

  const handlePincodeChange = (index, value) => {
    const newPincodes = [...formData.pincode];
    newPincodes[index] = value;

    const newErrors = [...errors.pincode];
    if (!value) {
      newErrors[index] = "Pincode is required";
    } else if (!/^\d{6}$/.test(value)) {
      newErrors[index] = "Pincode must be 6 digits";
    } else if (checkPincodeExists(value)) {
      newErrors[index] = "Pincode already exists in another route";
    } else {
      newErrors[index] = "";
    }

    setFormData((prev) => ({ ...prev, pincode: newPincodes }));
    setErrors((prev) => ({ ...prev, pincode: newErrors }));
  };

  const addPincodeField = () => {
    setFormData((prev) => ({
      ...prev,
      pincode: [...prev.pincode, ""],
    }));
    setErrors((prev) => ({
      ...prev,
      pincode: [...prev.pincode, "Pincode is required"],
    }));
  };

  const removePincodeField = (index) => {
    const newPincodes = [...formData.pincode];
    newPincodes.splice(index, 1);

    const newErrors = [...errors.pincode];
    newErrors.splice(index, 1);

    setFormData((prev) => ({ ...prev, pincode: newPincodes }));
    setErrors((prev) => ({ ...prev, pincode: newErrors }));
  };

  const handleclose = () => {
    setShowModal(false);
    resetForm();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      rootName: formData.rootName ? "" : "Route name is required",
      pincode: [...errors.pincode],
      salesman: formData.salesman ? "" : "Salesman is required",
      crm: formData.crm ? "" : "CRM is required",
      deliveryCharges: [...errors.deliveryCharges],
      deliveryman: formData.deliveryman ? "" : "Deliveryman is required",
      form: "",
      pincodeCharge:
        formData.pincodeCharge === "" || formData.pincodeCharge < 0
          ? "Pincode charge must be positive"
          : "",
    };

    // Validate pincodes
    formData.pincode.forEach((pin, index) => {
      if (!pin) {
        newErrors.pincode[index] = "Pincode is required";
        isValid = false;
      } else if (!/^\d{6}$/.test(pin)) {
        newErrors.pincode[index] = "Pincode must be 6 digits";
        isValid = false;
      } else if (checkPincodeExists(pin)) {
        newErrors.pincode[index] = "Pincode already exists in another route";
        isValid = false;
      }
    });

    // Validate delivery charges - check for overlapping ranges and valid numbers
    formData.deliveryCharges.forEach((charge, index) => {
      newErrors.deliveryCharges[index] = newErrors.deliveryCharges[index] || {};

      // Validate all fields are filled
      if (!charge.from || !charge.to || !charge.price) {
        isValid = false;
        if (!charge.from)
          newErrors.deliveryCharges[index].from = "From value is required";
        if (!charge.to)
          newErrors.deliveryCharges[index].to = "To value is required";
        if (!charge.price)
          newErrors.deliveryCharges[index].price = "Price is required";
      }

      // Validate from value
      if (charge.from && isNaN(charge.from)) {
        newErrors.deliveryCharges[index].from = "From value must be a number";
        isValid = false;
      } else if (charge.from && Number(charge.from) <= 0) {
        newErrors.deliveryCharges[index].from =
          "From value must be greater than 0";
        isValid = false;
      }

      // Validate to value
      if (charge.to && isNaN(charge.to)) {
        newErrors.deliveryCharges[index].to = "To value must be a number";
        isValid = false;
      } else if (charge.to && Number(charge.to) <= 0) {
        newErrors.deliveryCharges[index].to = "To value must be greater than 0";
        isValid = false;
      }

      // Validate that "to" is greater than "from"
      if (
        charge.from &&
        charge.to &&
        Number(charge.to) <= Number(charge.from)
      ) {
        newErrors.deliveryCharges[index].to =
          "To value must be greater than From value";
        isValid = false;
      }

      // Validate price
      if (
        charge.price !== "" &&
        (isNaN(charge.price) || Number(charge.price) < 0)
      ) {
        newErrors.deliveryCharges[index].price =
          "Price must be a positive number";
        isValid = false;
      }

      if (index > 0) {
        const prevCharge = formData.deliveryCharges[index - 1];
        const prevTo = Number(prevCharge.to);
        const currentFrom = Number(charge.from);

        if (prevCharge.to && charge.from && currentFrom <= prevTo) {
          newErrors.deliveryCharges[
            index
          ].from = `From value must be greater than previous range's To value (${prevTo})`;
          isValid = false;
        }
      }
    });

    // Check for overlapping ranges (this is still needed for non-adjacent ranges)
    for (let i = 0; i < formData.deliveryCharges.length; i++) {
      for (let j = i + 1; j < formData.deliveryCharges.length; j++) {
        const range1 = formData.deliveryCharges[i];
        const range2 = formData.deliveryCharges[j];

        if (range1.from && range1.to && range2.from && range2.to) {
          const from1 = Number(range1.from);
          const to1 = Number(range1.to);
          const from2 = Number(range2.from);
          const to2 = Number(range2.to);

          if (
            (from1 >= from2 && from1 <= to2) ||
            (to1 >= from2 && to1 <= to2) ||
            (from2 >= from1 && from2 <= to1) ||
            (to2 >= from1 && to2 <= to1)
          ) {
            newErrors.deliveryCharges[i].from = "Ranges cannot overlap";
            newErrors.deliveryCharges[j].from = "Ranges cannot overlap";
            isValid = false;
          }
        }
      }
    }

    // Check all required fields
    if (
      !formData.rootName ||
      !formData.salesman ||
      !formData.deliveryman ||
      !formData.crm ||
      newErrors.pincodeCharge ||
      !formData.pincode.some((pin) => pin)
    ) {
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload = {
      rootName: formData.rootName,
      pincode: formData.pincode,
      salesman: formData.salesman,
      crmUser: formData.crm,
      variants: formData.deliveryCharges.map((charge) => ({
        from: Number(charge.from),
        to: Number(charge.to),
        price: Number(charge.price),
      })),
      deliveryman: formData.deliveryman,
      deliveryCharge: Number(formData.pincodeCharge),
    };

    try {
      let result;
      if (editMode) {
        payload.id = currentRootId;
        result = await rootProvider.updateRoot(payload);
      } else {
        result = await rootProvider.addRoot(payload);
      }

      if (result && result.status) {
        resetForm();
        setShowModal(false);
        fetchRootData();
        fetchAllPincodes();
      } else {
        setErrors((prev) => ({
          ...prev,
          form: result?.response?.message || "Failed to save root",
        }));
      }
    } catch (error) {
      console.error("Error saving root:", error);
      setErrors((prev) => ({
        ...prev,
        form: error.response?.data?.message || "An error occurred",
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      rootName: "",
      pincode: [""],
      salesman: "",
      crm: "",
      deliveryCharges: [{ from: "", to: "", price: "" }],
      deliveryman: "",
      pincodeCharge: "",
    });
    setErrors({
      rootName: "",
      pincode: [""],
      salesman: "",
      crm: "",
      deliveryCharges: [{ from: "", to: "", price: "" }],
      deliveryman: "",
      form: "",
      pincodeCharge: "",
    });
    setEditMode(false);
    setCurrentRootId(null);
    setCanAddNewCharge(false);
    setCanAddNewPincode(false);
  };

  const fetchData = async () => {
    try {
      const result = await apiProvider.getUserList();
      if (result && result.status) {
        const items = result.response?.data || [];
        if (items) {
          let sales = [];
          let delivery = [];
          let CRM = [];
          items.forEach((ival) => {
            if (ival.role?.roleName === "Salesman") sales.push(ival);
            if (ival.role?.roleName === "Delivery") delivery.push(ival);
            if (ival.role?.roleName === "CRM") CRM.push(ival);
          });
          setSalesmen(sales);
          setDeliverymen(delivery);
          setCrm(CRM);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchRootData = async () => {
    try {
      setLoading(true);
      const input = {
        page: pageIndex,
        limit: pageSize,
        search: search.trim(),
      };
      const result = await rootProvider.getRoot(input);
      console.log("Root data fetched:", result);
      if (result && result.status) {
        const items = result.response?.data || [];
        setRootes(items?.data || []);
        setTotalPages(items?.totalPages || 0);
        setTotal(items?.total || 0);
      }
    } catch (error) {
      console.error("Error fetching root data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPageIndex(0);
  };

  const editGetData = async (data) => {
    console.log("Editing root data:", data);
    try {
      const result = await rootProvider.getRootById(data._id);
      if (result && result.status && result.response?.data?.data) {
        const rootData = result.response.data.data;
        setCurrentRootId(rootData._id);
        setEditMode(true);

        // Map pincodes
        const pincodes = rootData.pincode.map((pin) => pin.code);

        // Map variants to deliveryCharges
        const charges = rootData.variants?.length
          ? rootData.variants.map((variant) => ({
              from: variant.from,
              to: variant.to,
              price: variant.price,
            }))
          : [{ from: "", to: "", price: "" }];

        setFormData({
          rootName: rootData.rootName,
          pincode: pincodes.length ? pincodes : [""],
          salesman: rootData.salesman,
          crm: rootData.crmUser,
          deliveryCharges: charges,
          deliveryman: rootData.deliveryman,
          pincodeCharge: rootData.deliveryCharge || "",
        });

        // Initialize errors for pincodes
        const pincodeErrors = pincodes.length
          ? pincodes.map((pin) => (pin ? "" : "Pincode is required"))
          : [""];

        setErrors({
          rootName: "",
          pincode: pincodeErrors,
          salesman: "",
          crm: "",
          deliveryCharges: charges.map((charge) => ({
            from: "",
            to: "",
            price: "",
          })),
          deliveryman: "",
          form: "",
          pincodeCharge: "",
        });

        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching root data:", error);
    }
  };

  const deleteData = async (data) => {
    if (window.confirm("Are you sure you want to delete this root?")) {
      try {
        const result = await rootProvider.deleteRoot(data._id);
        if (result && result.status) {
          fetchRootData();
          fetchAllPincodes();
        }
      } catch (error) {
        console.error("Error deleting root:", error);
      }
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
      accessorKey: "sno",
      cell: ({ row }) => row.index + 1 + pageIndex * limit,
      size: 60,
    },
    {
      header: "Name",
      accessorKey: "rootName",
    },
    {
      header: "Pincode",
      accessorKey: "pincode",
      cell: ({ getValue }) => {
        const pincodes = getValue() || [];
        const isTwoColumn = pincodes.length >= 5;

        return (
          <div
            className={isTwoColumn ? "d-grid" : "d-flex flex-column"}
            style={
              isTwoColumn
                ? { gridTemplateColumns: "1fr 1fr", gap: "0.5rem 1rem" }
                : { width: "50px", gap: "0.5rem" }
            }
          >
            {pincodes.map((pin, i) => (
              <span
                key={i}
                className="badge bg-primary d-block text-white"
                style={{ borderRadius: "8px", fontWeight: "600" }}
              >
                {pin.code}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      header: "Salesman",
      accessorKey: "salesman",
    },
    {
      header: "Deliveryman",
      accessorKey: "deliveryman",
    },
    {
      header: "Delivery Charges (₹)",
      accessorKey: "variants",
      cell: ({ row }) => {
        const variants = row.original.variants || [];
        const deliveryCharge = row.original.deliveryCharge || 0;

        if (!variants.length) return "N/A";

        return (
          <div>
            {variants.map((variant, i) => (
              <div key={i}>
                ₹{variant.price} (Range: {variant.from} - {variant.to})
              </div>
            ))}
            <div className="mt-1">
              <small className="text-muted">
                Base charge: ₹{deliveryCharge}
              </small>
            </div>
          </div>
        );
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        const root = row.original;
        return (
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              onClick={() => editGetData(root)}
            >
              <Icon icon="lucide:edit" className="menu-icon" />
            </button>
            <button
              type="button"
              onClick={() => deleteData(root)}
              className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            >
              <Icon icon="fluent:delete-24-regular" className="menu-icon" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <div className="row">
          <div className="col-xxl-12">
            <div className="card h-100 p-0 radius-12">
              <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    className="form-control"
                    style={{ maxWidth: 350, minWidth: 200 }}
                    placeholder="Search..."
                    value={search}
                    onChange={handleSearchChange}
                  />
                  <div
                    className="search-icon"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "8px",
                      color: "#6c757d",
                    }}
                  >
                    <Icon
                      icon="ic:baseline-search"
                      className="icon text-xl line-height-1"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-success d-flex align-items-center gap-2"
                    onClick={() => {
                      setEditMode(false);
                      setShowModal(true);
                      resetForm();
                    }}
                  >
                    <Icon
                      icon="ic:baseline-plus"
                      className="icon text-xl line-height-1"
                    />
                    Add Route
                  </button>
                </div>
              </div>
              <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                  <ReactTableComponent
                    data={roots}
                    columns={columns}
                    pageIndex={pageIndex}
                    totalPages={totalPages}
                    onNextPage={handleNextPage}
                    onPreviousPage={handlePreviousPage}
                    totalRecords={total}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Root Modal */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            tabIndex="-1"
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editMode ? "Edit Route" : "Add New Route"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleclose}
                  ></button>
                </div>
                <div className="modal-body">
                  {errors.form && (
                    <div className="alert alert-danger">{errors.form}</div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Route Name</label>
                        <input
                          type="text"
                          className={`form-control ${
                            errors.rootName ? "is-invalid" : ""
                          }`}
                          name="rootName"
                          value={formData.rootName}
                          onChange={handleInputChange}
                          placeholder="Enter route name"
                        />
                        {errors.rootName && (
                          <div className="invalid-feedback">
                            {errors.rootName}
                          </div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">
                          Pincode Charges (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          className={`form-control ${
                            errors.pincodeCharge ? "is-invalid" : ""
                          }`}
                          name="pincodeCharge"
                          value={formData.pincodeCharge}
                          onChange={handleInputChange}
                          placeholder="Enter base charge"
                        />
                        {errors.pincodeCharge && (
                          <div className="invalid-feedback">
                            {errors.pincodeCharge}
                          </div>
                        )}
                        <small className="text-muted">
                          Base delivery charge for this route
                        </small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Add Pincode</label>
                      {formData.pincode.map((pincode, index) => (
                        <div key={index} className="mb-2">
                          <div className="input-group">
                            <input
                              type="text"
                              className={`form-control ${
                                errors.pincode[index] ? "is-invalid" : ""
                              }`}
                              value={pincode}
                              onChange={(e) =>
                                handlePincodeChange(index, e.target.value)
                              }
                              maxLength="6"
                              pattern="\d{6}"
                              placeholder="Enter 6-digit pincode"
                            />
                            {index > 0 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removePincodeField(index)}
                              >
                                Remove
                              </button>
                            )}
                            {index === formData.pincode.length - 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={addPincodeField}
                                disabled={!canAddNewPincode}
                                title={
                                  !canAddNewPincode
                                    ? "Complete current pincode first"
                                    : "Add new pincode"
                                }
                              >
                                Add
                              </button>
                            )}
                          </div>
                          {errors.pincode[index] && (
                            <div className="text-danger small mt-1">
                              {errors.pincode[index]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Select CRM</label>
                        <select
                          className={`form-select ${
                            errors.crm ? "is-invalid" : ""
                          }`}
                          name="crm"
                          value={formData.crm}
                          onChange={handleInputChange}
                        >
                          <option value="">Select CRM</option>
                          {crm.map((crmUser) => (
                            <option key={crmUser._id} value={crmUser._id}>
                              {crmUser.name}
                            </option>
                          ))}
                        </select>
                        {errors.crm && (
                          <div className="invalid-feedback">{errors.crm}</div>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label">Select Salesman</label>
                        <select
                          className={`form-select ${
                            errors.salesman ? "is-invalid" : ""
                          }`}
                          name="salesman"
                          value={formData.salesman}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Salesman</option>
                          {salesmen.map((salesman) => (
                            <option key={salesman._id} value={salesman._id}>
                              {salesman.name}
                            </option>
                          ))}
                        </select>
                        {errors.salesman && (
                          <div className="invalid-feedback">
                            {errors.salesman}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Select Delivery Man</label>
                      <select
                        className={`form-select ${
                          errors.deliveryman ? "is-invalid" : ""
                        }`}
                        name="deliveryman"
                        value={formData.deliveryman}
                        onChange={handleInputChange}
                      >
                        <option value="">Select Delivery Man</option>
                        {deliverymen.map((deliveryman) => (
                          <option key={deliveryman._id} value={deliveryman._id}>
                            {deliveryman.name}
                          </option>
                        ))}
                      </select>
                      {errors.deliveryman && (
                        <div className="invalid-feedback">
                          {errors.deliveryman}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">
                        Delivery Charges (Range Based)
                      </label>
                      {formData.deliveryCharges.map((charge, index) => (
                        <div
                          key={index}
                          className="row g-2 align-items-center mb-3"
                        >
                          {/* From Input */}
                          <div className="col-md-3">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              className={`form-control ${
                                errors.deliveryCharges[index]?.from
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={charge.from}
                              onChange={(e) =>
                                handleDeliveryChargeChange(
                                  index,
                                  "from",
                                  e.target.value
                                )
                              }
                              placeholder="From (grams)"
                            />
                            {errors.deliveryCharges[index]?.from && (
                              <div className="invalid-feedback">
                                {errors.deliveryCharges[index].from}
                              </div>
                            )}
                          </div>

                          {/* To Input */}
                          <div className="col-md-3">
                            <input
                              type="number"
                              min="1"
                              step="1"
                              className={`form-control ${
                                errors.deliveryCharges[index]?.to
                                  ? "is-invalid"
                                  : ""
                              }`}
                              value={charge.to}
                              onChange={(e) =>
                                handleDeliveryChargeChange(
                                  index,
                                  "to",
                                  e.target.value
                                )
                              }
                              placeholder="To (grams)"
                            />
                            {errors.deliveryCharges[index]?.to && (
                              <div className="invalid-feedback">
                                {errors.deliveryCharges[index].to}
                              </div>
                            )}
                          </div>

                          {/* Price Input */}
                          <div className="col-md-4">
                            <div className="input-group">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                className={`form-control ${
                                  errors.deliveryCharges[index]?.price
                                    ? "is-invalid"
                                    : ""
                                }`}
                                value={charge.price}
                                onChange={(e) =>
                                  handleDeliveryChargeChange(
                                    index,
                                    "price",
                                    e.target.value
                                  )
                                }
                                placeholder="Price"
                              />
                              <span className="input-group-text">₹ per</span>
                            </div>
                            {errors.deliveryCharges[index]?.price && (
                              <div className="invalid-feedback d-block">
                                {errors.deliveryCharges[index].price}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="col-md-2 d-flex justify-content-end gap-2">
                            {formData.deliveryCharges.length > 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => removeDeliveryChargeField(index)}
                                style={{ width: "40px" }}
                              >
                                <Icon icon="fluent:delete-24-regular" />
                              </button>
                            )}
                            {index === formData.deliveryCharges.length - 1 && (
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={addDeliveryChargeField}
                                style={{ width: "40px" }}
                                disabled={!canAddNewCharge}
                                title={
                                  !canAddNewCharge
                                    ? "Complete current range first"
                                    : "Add new range"
                                }
                              >
                                <Icon icon="lucide:plus" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleclose}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {editMode ? "Update" : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

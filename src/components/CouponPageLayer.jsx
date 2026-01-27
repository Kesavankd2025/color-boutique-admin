import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Select from "react-select";
// import { toast } from "react-toastify";
import ReactTableComponent from "../table/ReactTableComponent";
import CouponApi from "../apiProvider/couponApi"; // Ensure this API provider is correctly implemented
// import CouponApi from "../apiProvider/couponApi"; // You'll need to create this API provider
import CategoryApi from "../apiProvider/categoryapi"; // For fetching categories
import ProductApi from "../apiProvider/product"; // For fetching products
import UserApi from "../apiProvider/userapi"; // For fetching users (if needed for user-based coupons)
import Swal from "sweetalert2";

const CouponPageLayer = () => {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    startDate: "",
    endDate: "",
    type: "all_products", // 'all_products', 'category', 'product', 'user'
    categoryId: [],
    productIds: [],
    userIds: [],
    discountValue: "",
    discountType: "percentage",
    minOrderAmount: "",
    // maxDiscountAmount: "",
    usageLimit: "",
    status: true,
  });

  const [errors, setErrors] = useState({});
  const [coupons, setCoupons] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]); // For user-based coupons
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState([]);
  const [search, setSearch] = useState("");
  const searchDebounceRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingModalData, setIsLoadingModalData] = useState(false);

  const filterableColumns = ["name", "code"];

  useEffect(() => {
    fetchCoupons();
  }, [pageIndex, pageSize, filters, sorting]);

  const fetchModalData = async () => {
    setIsLoadingModalData(true);
    try {
      await Promise.all([fetchCategories(), fetchProducts(), fetchUsers()]);
    } catch (error) {
      console.error("Error fetching modal data:", error);
    } finally {
      setIsLoadingModalData(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPageIndex(0); // reset to first page

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    searchDebounceRef.current = setTimeout(() => {
      fetchCoupons(); // call API after debounce
    }, 300); // 300ms debounce
  };

  const fetchCoupons = async () => {
    try {
      const response = await CouponApi.couponList({
        search: search,
        page: pageIndex,
        limit: pageSize,
      });
      if (response?.response?.data) {
        setCoupons(response.response.data);
        setTotalPages(response.response.totalPages);
        setTotal(response.response.total);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await CategoryApi.getCategory();
      if (response?.data?.data) {
        setCategories(
          response.data?.data?.items.map((cat) => ({
            value: cat._id,
            label: cat.name,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log("enter 1");
      const input = {
        page: pageIndex,
        limit: 100,
      };
      const response = await ProductApi.getAllproductList(input);
      console.log(response, "response--   products");
      if (response?.response?.data) {
        setProducts(
          response.response.data.map((prod) => ({
            value: prod._id,
            label: prod.productName,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await UserApi.getAllCustomerList();
      if (response?.response?.data) {
        setUsers(
          response.response.data.map((user) => ({
            value: user._id,
            label: `${user.name} (${user.email})`,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "discountValue" && formData.discountType === "percentage") {
      const numericValue = parseFloat(value);
      if (numericValue > 100) {
        value = "100"; // Cap the value at 100
      } else if (numericValue < 0) {
        value = "0"; // Prevent negative values
      }
    }

    // Clear type-specific selections when coupon type changes
    if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        categoryId: [],
        productIds: [],
        userIds: [],
      }));
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        categoryId: "",
        productIds: "",
        userIds: "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleMultiSelectChange = (selectedOptions, { name }) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOptions || [], // Ensure it's always an array
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Coupon name is required";
    if (!formData.code) newErrors.code = "Coupon code is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = "End date must be after start date";
    }
    if (!formData.discountValue) {
      newErrors.discountValue = "Discount value is required";
    } else if (
      formData.discountType === "percentage" &&
      parseFloat(formData.discountValue) > 100
    ) {
      newErrors.discountValue = "Percentage discount cannot exceed 100.";
    }

    // Type-specific validations
    switch (formData.type) {
      case "category":
        if (!formData.categoryId || formData.categoryId.length === 0)
          newErrors.categoryId = "Category is required";
        break;
      case "product":
        if (!formData.productIds || formData.productIds.length === 0) {
          newErrors.productIds = "At least one product is required";
        }
        break;
      case "user":
        if (!formData.userIds || formData.userIds.length === 0) {
          newErrors.userIds = "At least one user is required";
        }
        break;
      // 'all_products' doesn't need additional validation
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchCouponById = async (id) => {
    try {
      const response = await CouponApi.getCouponById(id);
      console.log("response for coupon by id:", response);

      if (response?.response?.data) {
        const coupon = response.response.data;

        // Map the coupon data to formData structure
        const mappedData = {
          _id: coupon._id,
          name: coupon.name,
          code: coupon.code,
          startDate: coupon.startDate
            ? new Date(coupon.startDate).toISOString().slice(0, 16)
            : "",
          endDate: coupon.endDate
            ? new Date(coupon.endDate).toISOString().slice(0, 16)
            : "",
          type: coupon.type,
          discountValue: coupon.discountValue?.toString(),
          discountType: coupon.discountType,
          minOrderAmount: coupon.minOrderAmount?.toString() || "",
          // maxDiscountAmount: coupon.maxDiscountAmount?.toString() || "",
          usageLimit: coupon.usageLimit?.toString() || "",
          status: coupon.isActive,
          // Map IDs to select options
          categoryId: coupon.categoryId
            ? categories.filter((cat) => coupon.categoryId.includes(cat.value))
            : [],
          productIds: coupon.productIds
            ? products.filter((prod) => coupon.productIds.includes(prod.value))
            : [],
          userIds: coupon.userIds
            ? users.filter((user) => coupon.userIds.includes(user.value))
            : [],
        };

        console.log("Mapped form data:", mappedData);
        setFormData(mappedData);
        setIsEditMode(true);
      }
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  };

  const handleEdit = async (id) => {
    console.log("id for edit:", id);

    // First fetch all dropdown data
    await fetchModalData();

    // Then fetch and populate the coupon data
    await fetchCouponById(id);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await CouponApi.deleteCoupon(id);
        if (response.status) {
          fetchCoupons(); // Refresh the coupon list
        } else {
        }
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const couponData = {
        name: formData.name,
        code: formData.code,
        startDate: formData.startDate,
        endDate: formData.endDate,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        status: formData.status,
        usageLimit: formData?.usageLimit,
        minOrderAmount: formData?.minOrderAmount,
        type: formData.type,
        ...(formData.type === "category" && {
          categoryId: formData.categoryId.map((c) => c.value),
        }),
        ...(formData.type === "product" && {
          productIds: formData.productIds.map((p) => p.value),
        }),
        ...(formData.type === "user" && {
          userIds: formData.userIds.map((u) => u.value),
        }),
      };

      let response;
      if (isEditMode) {
        couponData.id = formData._id; // Include ID for update
        response = await CouponApi.updateCoupon(formData._id, couponData);
      } else {
        response = await CouponApi.couponCreate(couponData);
      }

      if (response.status) {
        // toast.success(`Coupon ${isEditMode ? 'updated' : 'created'} successfully!`);
        resetForm();
        fetchCoupons();
        document
          .getElementById("couponModal")
          ?.querySelector(".btn-close")
          ?.click();
      } else {
        // toast.error(response.message || `Failed to ${isEditMode ? 'update' : 'create'} coupon`);
      }
    } catch (error) {
      console.error("Error saving coupon:", error);
      // toast.error(`Failed to ${isEditMode ? 'update' : 'create'} coupon`);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      name: "",
      code: "",
      startDate: "",
      endDate: "",
      type: "all_products",
      categoryId: [],
      productIds: [],
      userIds: [],
      discountValue: "",
      discountType: "percentage",
      minOrderAmount: "",
      // maxDiscountAmount: "",
      usageLimit: "",
      status: true,
    });
    setErrors({});
    setIsEditMode(false);
  };
  const handleClose = () => {
    setFormData({
      _id: "",
      name: "",
      code: "",
      startDate: "",
      endDate: "",
      type: "all_products",
      categoryId: [],
      productIds: [],
      userIds: [],
      discountValue: "",
      discountType: "percentage",
      minOrderAmount: "",
      // maxDiscountAmount: "",
      usageLimit: "",
      status: true,
    });
    setErrors({});
    setIsEditMode(false);
  };
  const columns = useMemo(
    () => [
      {
        header: "S.No",
        id: "sno",
        cell: (info) => pageIndex * pageSize + info.row.index + 1,
      },
      { header: "Coupon Name", accessorKey: "name" },
      { header: "Code", accessorKey: "code" },
      {
        header: "Type",
        accessorKey: "type",
        cell: (info) => {
          const typeMap = {
            all_products: "All Products",
            category: "Category",
            product: "Product",
            user: "User",
          };
          return typeMap[info.getValue()] || info.getValue();
        },
      },
      {
        header: "Discount",
        accessorKey: "discountValue",
        cell: (info) =>
          `${info.getValue()}${info.row.original.discountType === "percentage" ? "%" : ""
          }`,
      },
      {
        header: "Valid From",
        accessorKey: "startDate",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        header: "Valid To",
        accessorKey: "endDate",
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      },
      {
        header: "Status",
        accessorKey: "isActive",
        cell: (info) => (
          <span
            className={`badge bg-${info.getValue() ? "success" : "danger"}`}
          >
            {info.getValue() ? "Active" : "Inactive"}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: (info) => (
          <div className="d-flex justify-content-center gap-2">
            <button
              type="button"
              className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              data-bs-toggle="modal"
              data-bs-target="#couponModal"
              onClick={() => handleEdit(info.row.original._id)}
            >
              <Icon icon="lucide:edit" className="menu-icon" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(info.row.original._id)}
              className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            >
              <Icon icon="fluent:delete-24-regular" className="menu-icon" />
            </button>
          </div>
        ),
      },
    ],
    [pageIndex, pageSize, categories, products, users]
  );

  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  // Render the appropriate select box based on coupon type
  const renderTypeSpecificSelect = () => {
    switch (formData.type) {
      case "category":
        return (
          <div className="col-12">
            <label className="form-label">Select Category</label>
            <Select
              name="categoryId"
              isMulti
              options={categories}
              value={formData.categoryId}
              onChange={handleMultiSelectChange}
              isLoading={isLoadingModalData}
              isDisabled={isLoadingModalData}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: errors.categoryId ? "#dc3545" : base.borderColor,
                  "&:hover": {
                    borderColor: errors.categoryId
                      ? "#dc3545"
                      : base.borderColor,
                  },
                }),
              }}
            />
            {errors.categoryId && (
              <div className="text-danger small mt-1">{errors.categoryId}</div>
            )}
          </div>
        );
      case "product":
        return (
          <div className="col-12">
            <label className="form-label">Select Products</label>
            <Select
              name="productIds"
              isMulti
              options={products}
              value={formData.productIds}
              onChange={handleMultiSelectChange}
              isLoading={isLoadingModalData}
              isDisabled={isLoadingModalData}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: errors.productIds ? "#dc3545" : base.borderColor,
                  "&:hover": {
                    borderColor: errors.productIds
                      ? "#dc3545"
                      : base.borderColor,
                  },
                }),
              }}
            />
            {errors.productIds && (
              <div className="text-danger small mt-1">{errors.productIds}</div>
            )}
          </div>
        );
      case "user":
        return (
          <div className="col-12">
            <label className="form-label">Select Users</label>
            <Select
              name="userIds"
              isMulti
              options={users}
              value={formData.userIds}
              onChange={handleMultiSelectChange}
              isLoading={isLoadingModalData}
              isDisabled={isLoadingModalData}
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: errors.userIds ? "#dc3545" : base.borderColor,
                  "&:hover": {
                    borderColor: errors.userIds ? "#dc3545" : base.borderColor,
                  },
                }),
              }}
            />
            {errors.userIds && (
              <div className="text-danger small mt-1">{errors.userIds}</div>
            )}
          </div>
        );
      case "all_products":
        return null; // No additional select needed
      default:
        return null;
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
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
        <div>
          <button
            type="button"
            className="btn btn-success text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-right gap-2"
            data-bs-toggle="modal"
            data-bs-target="#couponModal"
            onClick={() => {
              resetForm();
              fetchModalData();
            }}
          >
            <Icon
              icon="ic:baseline-plus"
              className="icon text-xl line-height-1"
            />
            Create Coupon
          </button>
        </div>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <ReactTableComponent
            data={coupons}
            columns={columns}
            filterableColumns={filterableColumns}
            pageIndex={pageIndex}
            totalPages={totalPages}
            totalRecords={total}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            filters={filters}
            setFilters={setFilters}
            sorting={sorting}
            setSorting={setSorting}
          />
        </div>
      </div>

      {/* Coupon Modal */}
      <div
        className="modal fade"
        id="couponModal"
        tabIndex="-1"
        aria-labelledby="couponModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h5 className="modal-title" id="couponModalLabel">
                {isEditMode ? "Edit Coupon" : "Create Coupon"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={resetForm}
              ></button>
            </div>
            <div className="modal-body p-24">
              {isLoadingModalData ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading data...</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row gy-3">
                    {/* Basic Coupon Info */}
                    <div className="col-12">
                      <label className="form-label">Coupon Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name ? "is-invalid" : ""
                          }`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <div className="text-danger small mt-1">
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Coupon Code</label>
                      <input
                        type="text"
                        name="code"
                        className={`form-control ${errors.code ? "is-invalid" : ""
                          }`}
                        value={formData.code}
                        onChange={handleChange}
                      />
                      {errors.code && (
                        <div className="text-danger small mt-1">
                          {errors.code}
                        </div>
                      )}
                    </div>

                    {/* Date Range */}
                    <div className="col-md-6">
                      <label className="form-label">Start Date</label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        className={`form-control ${errors.startDate ? "is-invalid" : ""
                          }`}
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                      {errors.startDate && (
                        <div className="text-danger small mt-1">
                          {errors.startDate}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">End Date</label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        className={`form-control ${errors.endDate ? "is-invalid" : ""
                          }`}
                        value={formData.endDate}
                        onChange={handleChange}
                        min={formData.startDate}
                      />
                      {errors.endDate && (
                        <div className="text-danger small mt-1">
                          {errors.endDate}
                        </div>
                      )}
                    </div>

                    {/* Discount Info */}
                    <div className="col-md-6">
                      <label className="form-label">Discount Type</label>
                      <select
                        name="discountType"
                        className="form-select"
                        value={formData.discountType}
                        onChange={handleChange}
                      >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed Amount</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Discount Value</label>
                      <input
                        type="number"
                        name="discountValue"
                        className={`form-control ${errors.discountValue ? "is-invalid" : ""
                          }`}
                        value={formData.discountValue}
                        onChange={handleChange}
                        min="0"
                        max={
                          formData.discountType === "percentage"
                            ? "100"
                            : undefined
                        }
                        step={
                          formData.discountType === "percentage" ? "0.1" : "1"
                        }
                      />
                      {errors.discountValue && (
                        <div className="text-danger small mt-1">
                          {errors.discountValue}
                        </div>
                      )}
                    </div>

                    {/* Optional Fields */}
                    <div className="col-md-6">
                      <label className="form-label">Minimum Order Amount</label>
                      <input
                        type="number"
                        name="minOrderAmount"
                        className="form-control"
                        value={formData.minOrderAmount}
                        onChange={handleChange}
                        min={0}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Usage Limit</label>
                      <input
                        type="number"
                        name="usageLimit"
                        className="form-control"
                        value={formData.usageLimit}
                        onChange={handleChange}
                        min={0}
                      />
                    </div>

                    {/* Coupon Type Selection */}
                    <div className="col-12">
                      <label className="form-label">Coupon Type</label>
                      <select
                        name="type"
                        className="form-select"
                        value={formData.type}
                        onChange={handleChange}
                      >
                        <option value="all_products">All Products</option>
                        <option value="category">Category Based</option>
                        <option value="product">Product Based</option>
                        <option value="user">User Based</option>
                      </select>
                    </div>
                    {renderTypeSpecificSelect()}
                    <div className="col-12">
                      <label className="form-label">Coupon Status</label>
                      <select
                        name="status"
                        className="form-select"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            status: e.target.value === "true",
                          }))
                        }
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    {/* Submit Button */}
                    <div className="modal-footer">
                      <button
                        type="button"
                        data-bs-dismiss="modal"
                        onClick={() => handleClose()}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {isEditMode ? "Update" : "Create"}
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponPageLayer;

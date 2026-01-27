import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiProvider from "../apiProvider/product";
import { IMAGE_URL } from "../network/apiClient";
import VendorApi from "../apiProvider/vendor";
import Select from "react-select";
import ReactTableComponent from "../table/ReactTableComponent";
import { Download_URL } from "../network/apiClient";

const VendorList = () => {
  const [errors, setErrors] = useState({});
  const initialFormData = {
    vendorName: "",
    contactPerson: "",
    phoneNumber: "",
    emailAddress: "",
    paymentDueDays: "",
    businessAddress: "",
    gstNumber: "",
    product: [],
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    city: "",
    alternativeNumber: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [VendorData, setVendorData] = useState([]);
  const [total, setTotal] = useState(0);
  const [products, setProducts] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const handleExport = async (format) => {
    try {
      const input = {
        format: "excel",
      };
      const response = await VendorApi.vendorList(input);

      if (response && response.status) {
        const data = response?.response?.data?.data || response?.response?.data;

        const downloadUrl = data?.downloadUrl;
        const filename = data?.filename;

        const link = document.createElement("a");
        link.href = Download_URL + downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
      }
    } catch (error) {
      console.error("Error exporting report:", error);
    } finally {
    }
  };

  const fetchData = async () => {
    const input = {
      page: pageIndex,
      limit: pageSize,
      search: search.trim(),
    };

    try {
      const response = await VendorApi.vendorList(input);

      if (response.status) {
        console.log(response, "response");
        setVendorData(response.response.data || []);
        setTotalPages(response.response.totalPages || 0);
        setTotal(response.response.total || 0);
      } else {
        console.error("Failed to fetch brand list");
      }
    } catch (error) {
      console.error("Error fetching brand list:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, search]);

  const fetchProductData = async () => {
    try {
      const input = {
        // page,
        // limit:100,
        // search,
      };
      const response = await apiProvider.productList(input);
      if (response.status) {
        let productOption = [];
        response.response.data?.map((ival) => {
          let label = ival.productName;
          let value = ival._id;
          productOption.push({ label, value });
        });
        setProducts(productOption || []);
      } else {
        console.error("Failed to fetch product list");
      }
    } catch (error) {
      console.error("Error fetching product list:", error);
    }
  };

  const handleOpenModal = () => {
    fetchProductData();
    setIsEditMode(false);
    setEditId(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleEditOpenModal = async (id) => {
    await fetchProductData();

    const response = await VendorApi.vendorDetails(id);
    if (response.status) {
      setIsEditMode(true);
      setEditId(id);

      const vendor = response.response.data;

      const matchingProducts = products.filter(
        (vendorProduct) =>
          vendor.products &&
          vendor.products.some(
            (product) => product.value === vendorProduct.value
          )
      );

      setFormData({
        vendorName: vendor.name,
        contactPerson: vendor.contactPerson,
        phoneNumber: vendor.phoneNumber,
        emailAddress: vendor.email,
        paymentDueDays: vendor.paymentDueDays,
        businessAddress: vendor.address,
        gstNumber: vendor.gstNumber || "",
        product: matchingProducts,
        bankName: vendor.bankName || "",
        accountNumber: vendor.accountNumber || "",
        ifscCode: vendor.ifscCode || "",
        city: vendor.city || "",
        alternativeNumber: vendor.alternativeNumber || "",
      });
    }
  };

  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.vendorName.trim())
      newErrors.vendorName = "Vendor name is required";
    else if (!/^[a-zA-Z\s]+$/.test(formData.vendorName))
      newErrors.vendorName = "Vendor name must contain only Alphabets";

    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "Phone number must be 10 digits";

    if (
      formData.alternativeNumber.trim() &&
      !/^\d{10}$/.test(formData.alternativeNumber)
    )
      newErrors.alternativeNumber = "Alternative number must be 10 digits";

    if (!formData.paymentDueDays.trim())
      newErrors.paymentDueDays = "Payment Due Days is required";

    if (!formData.businessAddress.trim())
      newErrors.businessAddress = "Business address is required";

    if (!formData.city.trim()) newErrors.city = "City is required";

    const hasBankDetails =
      formData.bankName.trim() ||
      formData.accountNumber.trim() ||
      formData.ifscCode.trim();

    if (hasBankDetails) {
      if (!formData.bankName.trim())
        newErrors.bankName =
          "Bank name is required when providing bank details";
      else if (!/^[a-zA-Z\s]+$/.test(formData.bankName))
        newErrors.bankName = "Bank name must contain only Alphabets";

      if (!formData.accountNumber.trim())
        newErrors.accountNumber =
          "Account number is required when providing bank details";
      else if (!/^\d{9,18}$/.test(formData.accountNumber))
        newErrors.accountNumber = "Account number must be 9-18 digits";

      if (!formData.ifscCode.trim())
        newErrors.ifscCode =
          "IFSC code is required when providing bank details";
      else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode))
        newErrors.ifscCode =
          "IFSC code must be in valid format (e.g., SBIN0123456)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCloseModal = () => {
    setIsEditMode(false);
    setEditId(null);
    setFormData(initialFormData);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const transformedProducts =
      formData.product?.map((product) => ({
        id: product.value,
        label: product.label,
        value: product.value,
      })) || [];

    if (!isEditMode) {
      const input = {
        name: formData.vendorName,
        contactPerson: formData.contactPerson,
        phoneNumber: formData.phoneNumber,
        email: formData.emailAddress,
        paymentDueDays: formData.paymentDueDays,
        address: formData.businessAddress,
        gstNumber: formData.gstNumber,
        products: transformedProducts,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        city: formData.city,
        alternativeNumber: formData.alternativeNumber,
      };
      const response = await VendorApi.vendorcreate(input);
      if (response.status) {
        const backdrop = document.querySelector(".modal-backdrop");
        const modal = document.getElementById("exampleModalEdit");

        if (modal) {
          modal.classList.remove("show");
          modal.classList.remove("d-block");
          modal.setAttribute("aria-hidden", "true");
          modal.style.display = "none";
        }

        if (backdrop) {
          backdrop.remove();
        }

        document.body.classList.remove("modal-open");
        document.body.style.overflow = "auto";
        handleCloseModal();
        fetchData();
      }
    } else {
      const input = {
        name: formData.vendorName,
        contactPerson: formData.contactPerson,
        phoneNumber: formData.phoneNumber,
        email: formData.emailAddress,
        paymentDueDays: formData.paymentDueDays,
        address: formData.businessAddress,
        gstNumber: formData.gstNumber,
        id: editId,
        products: transformedProducts,
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        city: formData.city,
        alternativeNumber: formData.alternativeNumber,
      };
      const response = await VendorApi.updatevendor(input, editId);

      if (response.status) {
        const backdrop = document.querySelector(".modal-backdrop");
        const modal = document.getElementById("exampleModalEdit");

        if (modal) {
          modal.classList.remove("show");
          modal.classList.remove("d-block");
          modal.setAttribute("aria-hidden", "true");
          modal.style.display = "none";
        }

        if (backdrop) {
          backdrop.remove();
        }

        document.body.classList.remove("modal-open");
        document.body.style.overflow = "auto";
        handleCloseModal();
        fetchData();
      }
    }
  };

  const handleEdit = async (id) => {
    handleEditOpenModal(id);
  };

  const handleRemoveRow = async (id) => {
    const response = await VendorApi.deletetVendor(id);
    if (response.status) {
      fetchData();
    }
  };

  const handleProductChange = (selectedOptions) => {
    setFormData((prev) => ({
      ...prev,
      product: selectedOptions,
    }));
  };

  const columns = [
    {
      header: "S.No",
      id: "sno",
      size: 80,
      cell: ({ row }) => pageIndex * pageSize + row.index + 1,
    },
    {
      header: "ID",
      accessorKey: "vendorCode",
      size: 120,
    },
    {
      header: "Name",
      accessorKey: "name",
      size: 140,
    },
    {
      header: "Contact Person",
      accessorKey: "contactPerson",
      size: 140,
    },
    {
      header: "Phone Number",
      accessorKey: "phoneNumber",
      size: 130,
    },
    {
      header: "Email Address",
      accessorKey: "email",
      size: 160,
    },
    {
      header: "Bank Name",
      accessorKey: "bankName",
      size: 140,
    },
    {
      header: "Account Number",
      accessorKey: "accountNumber",
      size: 140,
      cell: ({ row }) => (
        <span className="text-muted">
          ••••{row.original.accountNumber?.slice(-4)}
        </span>
      ),
    },
    {
      header: "IFSC Code",
      accessorKey: "ifscCode",
      size: 120,
    },
    {
      header: "Action",
      id: "action",
      size: 100,
      cell: ({ row }) => (
        <div className="d-flex gap-2 justify-content-start">
          <button
            type="button"
            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            data-bs-toggle="modal"
            data-bs-target="#exampleModalEdit"
            onClick={() => handleEdit(row.original._id)}
            title="Edit"
          >
              <Icon icon="lucide:edit" />
          </button>

          <button
            type="button"
            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            onClick={() => handleRemoveRow(row.original._id)}
            title="Delete"
          >
            <Icon icon="fluent:delete-24-regular" width="20" height="20" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="card h-100 p-20 radius-12">
        <div className="card-body h-100 p-0 radius-12">
          <div class="d-flex flex-wrap align-items-center mb-3">
            <div
              className="me-auto"
              style={{ minWidth: 200, maxWidth: 350, position: "relative" }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                style={{ minWidth: 200, maxWidth: 350 }}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPageIndex(0);
                }}
              />
              <div
                className="search-icon"
                style={{ position: "absolute", right: "10px", top: "8px" }}
              >
                <Icon
                  icon="ic:baseline-search"
                  className="icon text-xl line-height-1"
                />
              </div>
            </div>
            <div class="ms-auto d-flex">
              <button
                className="btn btn-success me-2"
                onClick={() => handleExport("excel")}
              >
                Export Excel
              </button>
              <button
                type="button"
                class="btn btn-success waves-effect waves-light"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalEdit"
                onClick={handleOpenModal}
              >
                <i class="fa fa-plus-circle font-size-16 align-middle me-2"></i>
                Add Vendor
              </button>
            </div>
          </div>
          <div className="table-responsive scroll-sm">
            <ReactTableComponent
              data={VendorData}
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

      {/* Edit/Create Modal */}
      <div
        className="modal fade"
        id="exampleModalEdit"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-lg modal-dialog-centered">
          <div class="modal-content radius-16 bg-base p-20">
            <div class="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h5 class="modal-title" id="addInvoiceModalLabel">
                {isEditMode ? "Edit Vendors" : "Create Vendors"}
              </h5>
              <button
                type="button"
                class="btn-close"
                onClick={handleCloseModal}
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body p-4">
              <div class="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="vendorName">
                          Vendor Name <span className="text-danger">*</span>
                        </label>
                        <input
                          id="vendorName"
                          name="vendorName"
                          type="text"
                          className="form-control"
                          value={formData.vendorName}
                          onChange={handleChange}
                        />
                        {errors.vendorName && (
                          <div className="text-danger">{errors.vendorName}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="contactPerson">
                          Contact Person
                        </label>

                        <input
                          id="contactPerson"
                          name="contactPerson"
                          type="text"
                          className="form-control"
                          value={formData.contactPerson}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allows letters and spaces only
                            if (/^[A-Za-z\s]*$/.test(value)) {
                              handleChange(e);
                            }
                          }}
                        />

                        {errors.contactPerson && (
                          <div className="text-danger">
                            {errors.contactPerson}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="phoneNumber">
                          Phone Number <span className="text-danger">*</span>
                        </label>
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          className="form-control"
                          value={formData.phoneNumber}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[0-9]*$/.test(value)) {
                              handleChange(e);
                            }
                          }}
                          maxLength="10"
                        />
                        {errors.phoneNumber && (
                          <div className="text-danger">
                            {errors.phoneNumber}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label
                          className="form-label"
                          htmlFor="alternativeNumber"
                        >
                          Alternative Number
                        </label>
                        <input
                          id="alternativeNumber"
                          name="alternativeNumber"
                          type="tel"
                          className="form-control"
                          value={formData.alternativeNumber}
                          maxLength={10}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^[0-9]*$/.test(value)) {
                              handleChange(e);
                            }
                          }}
                        />

                        {errors.alternativeNumber && (
                          <div className="text-danger">
                            {errors.alternativeNumber}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="emailAddress">
                          Email Address
                        </label>
                        <input
                          id="emailAddress"
                          name="emailAddress"
                          type="email"
                          className="form-control"
                          value={formData.emailAddress}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="city">
                          City <span className="text-danger">*</span>
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          className="form-control"
                          value={formData.city}
                          onChange={handleChange}
                        />
                        {errors.city && (
                          <div className="text-danger">{errors.city}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="paymentDueDays">
                          Payment Due Days{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          id="paymentDueDays"
                          name="paymentDueDays"
                          type="number"
                          min="1"
                          className="form-control"
                          value={formData.paymentDueDays}
                          onChange={handleChange}
                        />
                        {errors.paymentDueDays && (
                          <div className="text-danger">
                            {errors.paymentDueDays}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="businessAddress">
                          Business Address{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <textarea
                          id="businessAddress"
                          name="businessAddress"
                          className="form-control"
                          rows="3"
                          value={formData.businessAddress}
                          onChange={handleChange}
                        />
                        {errors.businessAddress && (
                          <div className="text-danger">
                            {errors.businessAddress}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="gstNumber">
                          GST Number (if applicable)
                        </label>
                        <input
                          id="gstNumber"
                          name="gstNumber"
                          type="text"
                          className="form-control"
                          value={formData.gstNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank Details Section */}
                  <div className="row">
                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="bankName">
                          Bank Name
                        </label>
                        <input
                          id="bankName"
                          name="bankName"
                          type="text"
                          className="form-control"
                          value={formData.bankName}
                          onChange={handleChange}
                          placeholder="e.g., State Bank of India"
                        />
                        {errors.bankName && (
                          <div className="text-danger">{errors.bankName}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="accountNumber">
                          Account Number
                        </label>
                        <input
                          id="accountNumber"
                          name="accountNumber"
                          type="text"
                          className="form-control"
                          value={formData.accountNumber}
                          onChange={handleChange}
                          maxLength="18"
                          placeholder="9-18 digits"
                        />
                        {errors.accountNumber && (
                          <div className="text-danger">
                            {errors.accountNumber}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="mb-3">
                        <label className="form-label" htmlFor="ifscCode">
                          IFSC Code
                        </label>
                        <input
                          id="ifscCode"
                          name="ifscCode"
                          type="text"
                          className="form-control text-uppercase"
                          value={formData.ifscCode}
                          onChange={handleChange}
                          maxLength="11"
                          placeholder="e.g., SBIN0123456"
                        />
                        {errors.ifscCode && (
                          <div className="text-danger">{errors.ifscCode}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="mb-3">
                      <label className="form-label"> Select Products</label>
                      <Select
                        isMulti
                        options={products}
                        value={formData.product}
                        onChange={handleProductChange}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isLoading={products.length === 0}
                        placeholder={
                          products.length === 0
                            ? "Loading products..."
                            : "Select products"
                        }
                      />
                      {errors.product && (
                        <div className="text-danger">{errors.product}</div>
                      )}
                    </div>
                  </div>

                  <div class="modal-footer">
                    <button
                      type="submit"
                      class="btn btn-primary waves-effect"
                      disabled={products.length === 0 && !isEditMode}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={handleCloseModal}
                      class="btn btn-secondary waves-effect"
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
};

export default VendorList;

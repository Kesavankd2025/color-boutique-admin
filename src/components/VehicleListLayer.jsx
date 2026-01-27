import React, { useEffect, useState, useRef } from "react";
import { PlusCircle } from "@phosphor-icons/react";
import { toast } from "react-toastify";
import vehicleApis from "../apiProvider/vehicleapi.jsx";
import ReactTableComponent from "../table/ReactTableComponent";
import { Icon } from "@iconify/react";
import Swal from "sweetalert2";

export default function VehicleListLayer() {
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const searchDebounceRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [errors, setErrors] = useState({});
  const [viewVehicle, setViewVehicle] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    fcDate: "",
    insuranceDate: "",
    taxDate: "",
    permitDate: "",
    advertiseDate: "",
    pollutionDate: "",
    status: "",
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

      const result = await vehicleApis.getVehicles(input);
      if (result && result.status) {
        const items = result.response?.data || [];
        setVehicles(items);
        setTotalPages(result.response?.totalPages || 1);
        setTotal(result.response?.total || 0);
      } else if (result && result.response?.message === "Invalid token") {
        console.warn("Token invalid. Redirecting to login...");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleView = (vehicle) => {
    setViewVehicle({
      vehicleNumber: vehicle.vehicleNumber,
      fcDate: vehicle.fcDate,
      insuranceDate: vehicle.insuranceDate,
      taxDate: vehicle.taxDate,
      permitDate: vehicle.permitDate,
      advertiseDate: vehicle.advertiseDate,
      pollutionDate: vehicle.pollutionDate,
      status: vehicle.status,
    });
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
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0]; // "2025-09-03"
  };

  const handleEdit = (vehicle) => {
    setEditId(vehicle._id);
    console.log("Editing vehicle:", vehicle);
    console.log("editId set to:", vehicle._id);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber ?? "",
      fcDate: formatDate(vehicle.fcDate),
      insuranceDate: formatDate(vehicle.insuranceDate),
      taxDate: formatDate(vehicle.taxDate),
      permitDate: formatDate(vehicle.permitDate),
      advertiseDate: formatDate(vehicle.advertiseDate),
      pollutionDate: formatDate(vehicle.pollutionDate),
      status: vehicle.status,
    });
    setEditModalVisible(true);
  };

  const handleDelete = async (vehicle) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will delete the vehicle permanently!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await vehicleApis.deleteVehicle(vehicle._id);
        if (response.status) {
          toast.success("Vehicle deleted successfully");
          fetchData();
        } else {
          toast.error("Failed to delete vehicle");
        }
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Something went wrong");
    }
  };

  const handleCloseModals = () => {
    setEditModalVisible(false);
    setViewVehicle(null);
    setEditId(null);
    setFormData({
      vehicleNumber: "",
      fcDate: "",
      insuranceDate: "",
      taxDate: "",
      permitDate: "",
      advertiseDate: "",
      pollutionDate: "",
      status: "",
    });
  };

  const handleChange = (e) => {
    setErrors({});
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "vehicleNumber") {
      updatedValue = value.replace(/[a-z]/g, (char) => char.toUpperCase());
    }
    setFormData((prev) => ({ ...prev, [name]: updatedValue }));
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const input = {
      vehicleNumber: formData.vehicleNumber.trim(),
      fcDate: formData.fcDate || null,
      insuranceDate: formData.insuranceDate || null,
      taxDate: formData.taxDate || null,
      permitDate: formData.permitDate || null,
      advertiseDate: formData.advertiseDate || null,
      pollutionDate: formData.pollutionDate || null,
      status: formData.status,
    };
    console.log("Input for submission:", input, "Edit ID:", editId);
    let result;
    if (editId) {
      result = await vehicleApis.updateVehicle(editId, input);
    } else {
      result = await vehicleApis.createVehicle(input);
    }

    if (result.status) {
      toast.success(
        editId ? "Vehicle Updated Successfully" : "Vehicle Created Successfully"
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

  const formatDateForView = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const columns = [
    {
      header: "S.No",
      accessorKey: "index",
      cell: (info) => pageIndex * pageSize + info.row.index + 1,
    },
    { header: "Vehicle Number", accessorKey: "vehicleNumber" },
    {
      header: "FC Date",
      accessorKey: "fcDate",
      cell: ({ row }) => formatDateForView(row.original.fcDate),
    },
    {
      header: "Insurance Date",
      accessorKey: "insuranceDate",
      cell: ({ row }) => formatDateForView(row.original.insuranceDate),
    },
    {
      header: "Tax Date",
      accessorKey: "taxDate",
      cell: ({ row }) => formatDateForView(row.original.taxDate),
    },
    {
      header: "Permit Date",
      accessorKey: "permitDate",
      cell: ({ row }) => formatDateForView(row.original.permitDate),
    },
    {
      header: "Advertise Date",
      accessorKey: "advertiseDate",
      cell: ({ row }) => formatDateForView(row.original.advertiseDate),
    },
    {
      header: "Pollution Date",
      accessorKey: "pollutionDate",
      cell: ({ row }) => formatDateForView(row.original.pollutionDate),
    },

    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <button
          className={`btn btn-subtle-${
            row.original.status === "active" ? "success" : "danger"
          } btn-sm`}
        >
          {row.original.status
            ? row.original.status.charAt(0).toUpperCase() +
              row.original.status.slice(1)
            : ""}
        </button>
      ),
    },
    {
      header: "Actions",
      size: 160,
      cell: (info) => {
        const vehicle = info.row.original;
        return (
          <div className="d-flex justify-content-start align-items-center gap-2">
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-info-focus text-info-600 bg-hover-info-200 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleView(vehicle)}
            >
              <Icon icon="majesticons:eye-line" className="text-xl" />
            </button>
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleEdit(vehicle)}
            >
              <Icon icon="lucide:edit" />
            </button>
            <button
              type="button"
              className="d-flex justify-content-center align-items-center bg-danger-focus text-danger-600 bg-hover-danger-200 fw-medium w-40-px h-40-px rounded-circle"
              onClick={() => handleDelete(vehicle)}
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
    const indianVehicleRegex = /^[A-Z]{2}\s?[0-9]{2}\s?[A-Z]{1,2}\s?[0-9]{4}$/i;

    if (!formData.vehicleNumber.trim()) {
      errors.vehicleNumber = "Vehicle Number is required";
    } else if (!indianVehicleRegex.test(formData.vehicleNumber.trim())) {
      errors.vehicleNumber = "Invalid Vehicle Number";
    }

    if (!formData.status) {
      errors.status = "Status is required";
    }

    return errors;
  };

  const today = new Date().toISOString().split("T")[0];

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
                    vehicleNumber: "",
                    fcDate: "",
                    insuranceDate: "",
                    taxDate: "",
                    permitDate: "",
                    advertiseDate: "",
                    pollutionDate: "",
                    status: "",
                  });
                  setEditModalVisible(true);
                }}
              >
                <Icon
                  icon="ic:baseline-plus"
                  className="icon text-xl line-height-1"
                />
                Create Vehicle
              </button>
            </div>

            <ReactTableComponent
              data={vehicles}
              columns={columns}
              pageIndex={pageIndex}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              totalRecords={total}
            />

            {/* View Modal */}
            {viewVehicle && !editModalVisible && (
               <div className="modal fade show d-block" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
                <div className="modal-dialog modal-dialog modal-dialog-centered">
                  <div className="modal-content radius-16 bg-base">
                    <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                      <h5 className="modal-title">Vehicle Details</h5>
                    </div>
                    <div className="modal-body p-4">
                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Vehicle Number:</strong>
                        </div>
                        <div className="col-md-6">
                          {viewVehicle.vehicleNumber}
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>FC Date:</strong>
                        </div>
                        <div className="col-md-6">
                          {formatDateForView(viewVehicle.fcDate)}
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Insurance Date:</strong>
                        </div>
                        <div className="col-md-6">
                          {formatDateForView(viewVehicle.insuranceDate)}
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Tax Date:</strong>
                        </div>
                        <div className="col-md-6">
                          {formatDateForView(viewVehicle.taxDate)}
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Permit Date:</strong>
                        </div>
                        <div className="col-md-6">
                          {formatDateForView(viewVehicle.permitDate)}
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Advertise Date:</strong>
                        </div>
                        <div className="col-md-6">
                          {formatDateForView(viewVehicle.advertiseDate)}
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Pollution Date:</strong>
                        </div>
                        <div className="col-md-6">
                          {formatDateForView(viewVehicle.pollutionDate)}
                        </div>
                      </div>

                      <div className="mb-3 row">
                        <div className="col-md-6">
                          <strong>Status:</strong>
                        </div>
                        <div className="col-md-6">
                          {viewVehicle.status
                            ? viewVehicle.status.charAt(0).toUpperCase() +
                              viewVehicle.status.slice(1)
                            : "-"}
                        </div>
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
                        {editId ? "Edit Vehicle" : "Create Vehicle"}
                      </h5>
                      <button
                        type="button"
                        className="btn-close "
                        onClick={handleCloseModals}
                      ></button>
                    </div>
                    <div className="modal-body p-4">
                      <form>
                        <div className="row">
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Vehicle Number</label>
                            <input
                              type="text"
                              name="vehicleNumber"
                              value={formData.vehicleNumber}
                              onChange={handleChange}
                              className="form-control"
                            />
                            {errors.vehicleNumber && (
                              <p className="text-danger">
                                {errors.vehicleNumber}
                              </p>
                            )}
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">FC Date</label>
                            <input
                              type="date"
                              name="fcDate"
                              min={today}
                              value={formData.fcDate}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Insurance Date</label>
                            <input
                              type="date"
                              min={today}
                              name="insuranceDate"
                              value={formData.insuranceDate}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Tax Date</label>
                            <input
                              type="date"
                              min={today}
                              name="taxDate"
                              value={formData.taxDate}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Permit Date</label>
                            <input
                              type="date"
                              min={today}
                              name="permitDate"
                              value={formData.permitDate}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Advertise Date</label>
                            <input
                              type="date"
                              min={today}
                              name="advertiseDate"
                              value={formData.advertiseDate}
                              onChange={handleChange}
                              className="form-control"
                            />
                          </div>
                          <div className="col-lg-6 mb-3">
                            <label className="form-label">Pollution Date</label>
                            <input
                              type="date"
                              min={today}
                              name="pollutionDate"
                              value={formData.pollutionDate}
                              onChange={handleChange}
                              className="form-control"
                            />
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
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
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

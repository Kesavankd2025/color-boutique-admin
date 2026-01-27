import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "@phosphor-icons/react";
import apiProvider from "../apiProvider/wholesalerapi";
import ReactTableComponent from "../table/ReactTableComponent";
import { IMAGE_BASE_URL } from "../network/apiClient";

const WholeSalerForm = () => {
  const [selectedWholesaler, setSelectedWholesaler] = useState(null);
  const [totalOrders, setTotalOrders] = useState("");
  const [wholesalers, setWholesalers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [hoveredStatus, setHoveredStatus] = useState({});
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusForm, setStatusForm] = useState({
    phone: "",
    pin: "",
    status: "",
  });
  const [customerCategories, setCustomerCategories] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [type] = useState("Wholesaler");
  const getStatusStyles = (status, hovered) => {
    const colors = {
      Active: {
        light: "#d4edda",
        dark: "#28a745",
        textLight: "#155724",
      },
      Inactive: {
        light: "#fff3cd",
        dark: "#ffc107",
        textLight: "#856404",
      },
      Blocked: {
        light: "#f8d7da",
        dark: "#dc3545",
        textLight: "#721c24",
      },
    };

    const color = colors[status] || colors.Active;

    return {
      backgroundColor: hovered ? color.dark : color.light,
      color: hovered ? "#fff" : color.textLight,
      border: "1px solid transparent",
      transition: "all 0.3s ease",
    };
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    setStatusForm({ ...statusForm, [e.target.name]: e.target.value });
  };

  const handleOpenStatusModal = (wholesaler) => {
    console.log(wholesaler, "wholesaler");

    setSelectedWholesaler(wholesaler);
    setStatusForm({
      phone: wholesaler.phone,
      pin: "",
      status: wholesaler.status,
    });
    setShowStatusModal(true);
  };
  console.log(selectedWholesaler, "selectedWholesaler");

  const handleStatusUpdate = async () => {
    try {
      const result = await apiProvider.updateStatus(statusForm);

      if (!result || result.status !== 200) {
        setErrorMessage("Failed to update status");
      } else {
        setSuccessMessage("Status updated successfully.");
        toast.success("Status updated!");
        fetchData();
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      }
    } catch (error) {
      setErrorMessage("Something went wrong.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, search, type]);

  const fetchData = async () => {
    try {
      let input = {
        page: pageIndex,
        limit: pageSize,
        type: type,
        search: search.trim(),
        type: type
      };
      // const result = await apiProvider.getWholesalerList(input);
      const result = await apiProvider.getWholesalerListAll(input);

      console.log("Fetched Wholesaler List:", input);
      console.log("Fetched Wholesaler Result:", result);
      console.log("Fetched Wholesaler Response:", result.response.data);

      if (result && result.status) {
        const items = result.response?.data.filter(ival => ival.customerType === "Wholesaler") || [];
        console.log("Total orders:", result.response.total);
        const totalCount = result.response.totalCount ||
          result.response.data?.totalCount ||
          result.response.total ||
          0;

        setTotalOrders(result.response.total || 0);
        setWholesalers(items);
        setTotalPages(result.response?.totalPages || 1);
        console.log("Total wholesalers count:", totalCount);
      } else {
        if (result && result.response?.message === "Invalid token") {
          console.warn("Token invalid. Redirecting to login...");
          return;
        }
        console.error("Failed to fetch wholesalers:", result);
      }
    } catch (error) {
      console.error("Error fetching wholesaler data:", error);
    }
  };

  useEffect(() => {
    UserVareientList();
  }, []);

  const UserVareientList = async () => {
    try {
      const result = await apiProvider.getUserVareientList();
      console.log(result, " UserVareientList result");

      if (result && result.status) {
        setCustomerCategories(result.response?.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching customer categories:", error);
    }
  };

  const handleVariantSubmit = async () => {
    if (!selectedWholesaler || !selectedVariant) return;

    try {
      const payload = {
        id: selectedWholesaler._id,
        variantId: selectedVariant,
        userType: "Wholesaler"
      };

      const result = await apiProvider.updateWholesalerVariant(payload);

      if (result && result.status) {
        toast.success("Customer category updated successfully");
        setSelectedVariant('');
        fetchData(); // Refresh the list
      } else {
        toast.error("Failed to update customer category");
      }
    } catch (error) {
      console.error("Error updating customer category:", error);
      toast.error("Something went wrong");
    }
  };
  const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const columns = useMemo(
    () => [
      {
        header: 'S.No', size: 50,
        id: 'sno',
        cell: info => pageIndex * pageSize + info.row.index + 1
      },
      // {
      //   header: 'ID',
      //   accessorKey: 'Id',
      //   cell: info => (
      //     <span className="text-md mb-0 fw-normal text-secondary-light">
      //       {info.getValue() || '-'}
      //     </span>
      //   ),
      // },
      {
        header: 'Company Name',
        accessorKey: 'companyName',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() || '-'}
          </span>
        ),
      },
      {
        header: 'Contact Person',
        accessorKey: 'contactPersonName',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() || '-'}
          </span>
        ),
      },
      {
        header: 'Created By',
        accessorKey: 'createdByInfo.name', // keep this for sorting/filtering if needed
        cell: info => {
          const createdBy = info.row.original.createdByInfo;
          const displayValue = createdBy
            ? `${createdBy.name} (${createdBy.role ? createdBy.role : "Admin"})`
            : '-';

          return (
            <span className="text-md mb-0 fw-normal text-secondary-light">
              {displayValue}
            </span>
          );
        },
      },
      {
        header: 'Created Date',
        accessorKey: 'contactPersonName',
        cell: info => {
          const CreatedDateFind = formatDateTime(info.row.original.createdAt)
          return (
            <span className="text-md mb-0 fw-normal text-secondary-light">
              {CreatedDateFind}
            </span>
          )
        }
      },

      {
        header: 'Phone Number',
        accessorKey: 'phone',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() || '-'}
          </span>
        ),
      },
      {
        header: 'Account Status',
        accessorKey: 'status',
        cell: info => {
          const isHovered = hoveredStatus[info.row.id];
          const statusValue = info.getValue();
          const statusStyles = getStatusStyles(statusValue, isHovered);

          // Define styles for different status values
          const getStatusSpecificStyles = (status) => {
            const statusLower = status?.toLowerCase();

            switch (statusLower) {
              case 'pending':
                return {
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  fontWeight: 'bold'
                };
              case 'active':
                return {
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none'
                };
              case 'inactive':
                return {
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none'
                };
              case 'suspended':
                return {
                  backgroundColor: '#ffc107',
                  color: '#212529',
                  border: 'none',
                  fontWeight: 'bold'
                };
              default:
                return {};
            }
          };

          const statusSpecificStyles = getStatusSpecificStyles(statusValue);

          return (
            <button
              type="button"
              className="btn btn-sm waves-effect waves-light"
              style={{ ...statusStyles, ...statusSpecificStyles }}
              onMouseEnter={() => setHoveredStatus(prev => ({
                ...prev,
                [info.row.id]: true
              }))}
              onMouseLeave={() => setHoveredStatus(prev => ({
                ...prev,
                [info.row.id]: false
              }))}
            >
              {capitalize(statusValue)}
            </button>
          );
        },
      },
      {
        header: 'Actions',
        cell: info => {
          const wholesaler = info.row.original;
          return (
            <div className="d-flex justify-content-start align-items-center gap-2">
              <button
                type="button"
                className="d-flex justify-content-center align-items-center bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px rounded-circle"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalView"
                onClick={() => setSelectedWholesaler(wholesaler)}
              >
                <Icon icon="majesticons:eye-line" className="text-xl" />
              </button>
              <button
                type="button"
                className="d-flex justify-content-center align-items-center bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px rounded-circle"
                onClick={() =>
                  navigate("/create-wholesaler", {
                    state: { wholesaler },
                  })
                }
              >
                <Icon icon="lucide:edit" />
              </button>
              <button
                type="button"
                className="d-flex justify-content-center align-items-center bg-primary-subtle  bg-hover-danger-200  fw-medium w-40-px h-40-px rounded-circle"
                onClick={() => handleOpenStatusModal(wholesaler)}
                style={{ backgroundColor: '#f0f0f0', color: '#007bff' }}
              >
                     <Icon icon="lucide:edit" />
              </button>
            </div >
          );
        },
      },
    ],
    [pageIndex, pageSize, hoveredStatus]
  );
  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex(prev => prev - 1);
  };
  console.log(selectedWholesaler, "selectedWholesaler in wholesaler list");
  return (
    <div>
      <div className="card h-100 p-20 radius-12">
        <div className="card-body h-100 p-0 radius-12">
          <div className="d-flex flex-wrap align-items-center mb-3">
            <div className="me-auto" style={{ minWidth: 200, maxWidth: 350, position: "relative" }}>
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

              <div className="search-icon" style={{ position: "absolute", right: "10px", top: "8px" }}>
                <Icon
                  icon="ic:baseline-search"
                  className="icon text-xl line-height-1"

                />
              </div>
            </div>
            <div className="ms-auto">
              <a href="create-wholesaler" style={{ textDecoration: "none" }}>
                <button
                  type="button"
                  className="btn d-flex align-items-center justify-content-center btn-success waves-effect waves-light"
                >
                  <PlusCircle size={18} weight="fill" className="me-2" />
                  Wholesaler
                </button>
              </a>
            </div>
          </div>
          <div className="table-responsive scroll-sm">
            <ReactTableComponent
              data={wholesalers}
              columns={columns}
              pageIndex={pageIndex}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              totalRecords={totalOrders}
            />
          </div>
        </div>
      </div>

      {/* View Modal */}
      <div
        className="modal fade"
        id="exampleModalView"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                Wholesaler Details
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              {selectedWholesaler ? (
                <div className="card-body">
                  {/* Shop Image Section */}
                  <div className="mb-4 text-center">
                    <h5 className="font-size-14 py-2">Shop Image</h5>
                    {selectedWholesaler.shopImage ? (
                      <a
                        src={`${IMAGE_BASE_URL}/${selectedWholesaler?.shopImage[0]?.docPath}/${selectedWholesaler?.shopImage[0]?.docName}`} target="_blank"
                        rel="noopener noreferrer"
                        className="d-inline-block"
                      >
                        <img
                          src={`${IMAGE_BASE_URL}/${selectedWholesaler?.shopImage[0]?.docPath}/${selectedWholesaler?.shopImage[0]?.docName}`} alt="Shop"
                          className="img-fluid rounded cursor-pointer"
                          style={{
                            maxHeight: '200px',
                            objectFit: 'cover',
                            transition: 'transform 0.2s ease',
                          }}
                          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                        />
                        <div className="mt-2 small text-muted">
                          Click image to view in full size
                        </div>
                      </a>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center bg-light rounded" style={{ height: '200px' }}>
                        <Icon icon="mdi:store-outline" className="text-muted" style={{ fontSize: '64px' }} />
                        <span className="ms-2 text-muted">No Shop Image</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Shop Name : </h5>
                    </div>
                    <div className="col-md-6">
                      <span className="fw-normal text-body">
                        {selectedWholesaler.companyName}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Contact Person : </h5>
                    </div>
                    <div className="col-md-6">
                      <span className="fw-normal text-body">
                        {selectedWholesaler.contactPersonName}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Phone Number : </h5>
                    </div>
                    <div className="col-md-6">
                      <span className="fw-normal text-body">
                        {selectedWholesaler.phone}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Email Address : </h5>
                    </div>
                    <div className="col-md-6">
                      <span className=" fw-normal text-body">
                        {selectedWholesaler.email}
                      </span>
                    </div>
                  </div>
                  {/* Address Section */}
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Business Address: </h5>
                    </div>
                    <div className="col-md-6">
                      <span className="fw-normal text-body">
                        {selectedWholesaler.address?.addressLine || '-'},<br />
                        {selectedWholesaler.address?.city || '-'},<br />
                        {selectedWholesaler.address?.state || '-'},<br />
                        {selectedWholesaler.address?.postalCode || '-'},<br />
                        {selectedWholesaler.address?.country || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Created By: </h5>
                    </div>
                    <div className="col-md-6">
                      <span className="fw-normal text-body">
                        {selectedWholesaler.createdByInfo?.name || '-'} - {" "}
                        {selectedWholesaler.createdByInfo?.role || '-'},<br />
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Credit Limit : </h5>
                    </div>
                    <div className="col-md-6">
                      <span className=" fw-normal text-body">
                        {selectedWholesaler.creditLimit}{" "}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Payment Terms : </h5>
                    </div>
                    <div className="col-md-6">
                      <span className=" fw-normal text-body">
                        {" "}
                        {selectedWholesaler.creditPeriod}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Outstanding Balance : </h5>
                    </div>
                    <div className="col-md-6">
                      <span className=" fw-normal text-body">
                        {" "}
                        {selectedWholesaler.outStandingBalance || "-"}
                      </span>
                    </div>
                  </div>
                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Current Category: </h5>
                    </div>
                    <div className="col-md-6">
                      <span className="fw-normal text-body">
                        {selectedWholesaler?.customerVariantName || 'Not assigned'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3 row">
                    <div className="col-md-6">
                      <h5 className="font-size-14 py-2">Update Category: </h5>
                    </div>
                    <div className="col-md-6 px-2">
                      <select
                        className="form-select"
                        value={selectedVariant}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {customerCategories && customerCategories?.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4 text-end">
                    <button
                      className="btn btn-primary"
                      onClick={handleVariantSubmit}
                      disabled={!selectedVariant}
                    >
                      Update Category
                    </button>
                  </div>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Status</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowStatusModal(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {successMessage && (
                  <div className="alert alert-success">{successMessage}</div>
                )}
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={statusForm.phone}
                    onChange={handleChange}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">PIN</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pin"
                    maxLength="4"
                    value={statusForm.pin}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4);
                      setStatusForm((prev) => ({
                        ...prev,
                        pin: value,
                      }));
                    }}
                    pattern="\d{4}"
                    inputMode="numeric"
                    placeholder="Enter 4-digit PIN"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={statusForm.status}
                    onChange={handleChange}
                  >
                    <option value="">Select Status</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowStatusModal(false)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleStatusUpdate}
                  disabled={!statusForm.pin || !statusForm.status}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showStatusModal && <div className="modal-backdrop fade show"></div>}

      <div
        className="modal fade"
        id="exampleModalView"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Update Status</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={statusForm.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">PIN</label>
                <input
                  type="text"
                  className="form-control"
                  name="pin"
                  maxLength="4"
                  value={statusForm.pin}
                  onChange={(e) => {
                    // Only allow numbers and limit to 4 digits
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setStatusForm((prev) => ({
                      ...prev,
                      pin: value,
                    }));
                  }}
                  pattern="\d{4}"
                  inputMode="numeric"
                  placeholder="Enter 4-digit PIN"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={statusForm.status}
                  onChange={handleChange}
                >
                  <option value="">Select Status</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button className="btn btn-primary" onClick={handleStatusUpdate}>
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModalEdit"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                Edit Transaction List
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div class="modal-body p-20">
              <form>
                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Transaction ID
                      </label>
                      <input
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>

                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="manufacturername">
                        Order ID
                      </label>
                      <input
                        name="Contact Person"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="manufacturerbrand">
                        Customer/Wholesaler Name
                      </label>
                      <input
                        name="Phone Number"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="price">
                        Payment Date &amp; Time
                      </label>
                      <input name="price" type="text" class="form-control" />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="manufacturername">
                        Payment Method
                      </label>
                      <select class="form-control" name="payment-method">
                        <option value="">Select Payment Method</option>
                        <option value="cash">Cash</option>
                        <option value="credit_card">Credit Card</option>
                        <option value="debit_card">Debit Card</option>
                        <option value="upi">UPI</option>
                        <option value="wallet">Wallet</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="credit_account">Credit Account</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-lg-6">
                    <div class="mb-6">
                      <label class="form-label" for="manufacturerbrand">
                        Amount Paid
                      </label>
                      <input
                        name="GST Number"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="choices-single-default" class="form-label">
                        Payment Status
                      </label>
                      <select
                        class="form-control"
                        data-trigger=""
                        name="choices-single-category"
                        id="choices-single-category"
                      >
                        <option value="">Select</option>
                        <option value="EL">Paid</option>
                        <option value="FA">Unpaid</option>
                        <option value="FI">Partially Paid</option>
                        <option value="FI">Refund</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label
                        for="choices-single-specifications"
                        class="form-label"
                      >
                        Invoice Number
                      </label>
                      <input
                        name="GST Number"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>
              </form>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-success waves-effect"
                  data-bs-dismiss="modal"
                >
                  Save
                </button>
                <button
                  type="button"
                  class="btn btn-danger waves-effect waves-light"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModalRefund"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-lg  modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                Process Refund
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div class="modal-body p-20">
              <form>
                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Customer/Wholesaler Name
                      </label>
                      <input
                        value="Radhakrishnan"
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Transaction ID
                      </label>
                      <input
                        value="TS345678"
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Order ID
                      </label>
                      <input
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>

                  <div class="col-lg-6">
                    <div class="mb-3">
                      <label class="form-label" for="productname">
                        Refund Amount
                      </label>
                      <input
                        name="productname"
                        type="text"
                        class="form-control"
                      />
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label for="choices-single-default" class="form-label">
                        Refund Method
                      </label>
                      <select class="form-select">
                        <option selected="">Select option</option>
                        <option>Bank Transfer</option>
                        <option>UPI</option>
                        <option>Wallet</option>
                        <option>Credit Adjustment</option>
                      </select>
                    </div>
                  </div>

                  <div class="col-md-6">
                    <div class="mb-3">
                      <label
                        for="choices-single-specifications"
                        class="form-label"
                      >
                        Refund Reason
                      </label>
                      <select class="form-select">
                        <option selected="">Select option</option>
                        <option>Order Cancellation</option>
                        <option>Product Return</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </form>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary waves-effect"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  class="btn btn-primary waves-effect waves-light"
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholeSalerForm;

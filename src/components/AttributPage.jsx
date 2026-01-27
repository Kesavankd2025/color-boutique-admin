import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useMemo, useRef } from "react";
import ReactTableComponent from "../table/ReactTableComponent";
import AttribiteApis from "../apiProvider/attribute";
import usePermission from "../hook/usePermission";

const AttributePage = () => {
  const canAdd = usePermission("attributes", "add");
  const canEdit = usePermission("attributes", "edit");
  const canDelete = usePermission("attributes", "delete");
  const havePermissions = canEdit || canDelete;
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    AttributeName: "",
    AttributeValue: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [attributeData, setAttributeData] = useState([]);
  const [total, setTotal] = useState(0);
  const attributeFilter = ["name", "values"]
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const fetchData = async () => {
    try {
      const input = {
        page: pageIndex,
        limit: pageSize,
        // filters: filters, // Filters are not used in this component's API call structure
        search: search
      };
      console.log("Fetching data with input:", input, "Filters:", filters, "Sorting:", sorting);
      // Convert filters array to filters object
      const response = await AttribiteApis.attributeList(input);
      if (response.status) {
        setAttributeData(response.response.data || []);
        console.log(response.response.data, "response")
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
  }, [pageIndex, pageSize, filters, search]);
  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex(prev => prev - 1);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    // setFormData((prev) => ({
    //   ...prev,
    //   [name]: value,
    // }));
    if (name === "AttributeName") {
      // Only allow if the first character is a letter or if the input is empty
      if (value === "" || /^[a-zA-Z]/.test(value)) {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.AttributeName || !formData.AttributeName.trim()) {
      newErrors.AttributeName = "Name is required";
    }

    if (!formData.AttributeValue || !formData.AttributeValue.trim()) {
      newErrors.AttributeValue = "Value Name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    // console.log('+++++++++++++++++++++++++++++++++++++++++++++++++');

    e.preventDefault();
    // Validate the form before proceeding
    if (!validateForm()) {
      console.log("Form submitted:", formData);
      return;
    }

    if (!isEditMode) {
      const input = {
        name: formData.AttributeName,
        value: formData.AttributeValue,
      };
      console.log(input,"input")
      const response = await AttribiteApis.attributecreate(input);

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
        setFormData({
          AttributeName: '',
          AttributeValue: '',
        });
        fetchData();
      }
    } else {
      const input = {
        name: formData.AttributeName,
        value: formData.AttributeValue,
        id: editId,
      };
      console.log("enter here ",input)
      const response = await AttribiteApis.updateattribute(input, editId);

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
        fetchData();
        setFormData({
          AttributeName: '',
          AttributeValue: '',
        });
      }
    }

  };

  const handleEdit = async (id) => {
    const response = await AttribiteApis.attributeDetails(id);
    if (response.status) {
      setIsEditMode(true);
      setEditId(id);
      setFormData({
        AttributeName: response.response.data.name,
        AttributeValue: response.response.data.value?.map((e) => e.value).join(", "),
      });
    }
  };

  const handleRemoveRow = async (id) => {
    const response = await AttribiteApis.deleteAttribute(id);
    if (response.status) {
      fetchData()
    }
  };
  const columns = useMemo(
    () => [
      {
        header: 'S.No',
        cell: info => info.row.index + 1,
      },
      {
        header: 'Attribute Name',
        accessorKey: 'name',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'values',
        header: 'Values',
        cell: info => info.getValue(),
        accessorFn: row => row.value.map(e => e.value).join(', '),
      },
      // {
      //   header: 'Status',
      //   accessorKey: 'isActive',
      //   cell: info => (
      //     <span
      //       className={`${info.getValue()
      //         ? 'bg-success-focus text-success-600 border border-success-border'
      //         : 'bg-danger-focus text-danger-600 border border-danger-main'
      //         } px-24 py-4 radius-4 fw-medium text-sm`}
      //     >
      //       {info.getValue() ? 'Active' : 'Not Active'}
      //     </span>
      //   ),
      // },

      ...(havePermissions
        ? [{
          header: 'Actions',
          cell: info => {
            const attr = info.row.original;
            return (
              <div className="d-flex justify-content-start align-items-center gap-2">
                {canEdit && (
                  <button
                    type="button"
                    className="d-flex justify-content-center align-items-center bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px rounded-circle"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModalEdit"
                    onClick={() => handleEdit(attr._id)}
                  >
                    <Icon icon="lucide:edit" className="menu-icon" />
                  </button>
                )}
                {canDelete && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(attr._id)}
                    className="d-flex justify-content-center align-items-center bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px rounded-circle"
                  >
                    <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                  </button>
                )}
              </div>
            );
          },
        },
        ]
        : []),
    ],
    [handleEdit, handleRemoveRow, canEdit, canDelete]
  );
    const searchDebounceRef = useRef(null);

   const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setPageIndex(0); // reset to first page

        if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

        searchDebounceRef.current = setTimeout(() => {
          fetchData(); // call API after debounce
        }, 300); // 300ms debounce
      };
  return (
    <div className="card h-100 p-0 radius-12">
    
      {canAdd && (
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
              data-bs-target="#exampleModalEdit"
              onClick={() => {
                setFormData({
                  AttributeName: '',
                  AttributeValue: '',
                });
                setIsEditMode(false);
              }}

            >
              <Icon
                icon="ic:baseline-plus"
                className="icon text-xl line-height-1"
              />
              Add Attribute
            </button>
          </div>
        </div>
      )}

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check d-none">
            <thead>
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Attribute Name</th>
                <th scope="col">Attribute Values</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {attributeData.map((attr, index) => (
                <tr key={attr._id}>
                  <td>{index + 1}</td>
                  <td>
                    <span className="text-md mb-0 fw-normal text-secondary-light">
                      {attr.name}
                    </span>
                  </td>
                  <td>
                    {attr?.value?.map((e) => e.value).join(", ")}
                  </td>
                  <td>
                    <span
                      className={`${attr.isActive === true
                        ? "bg-success-focus text-success-600 border border-success-border"
                        : "bg-danger-focus text-danger-600 border border-danger-main"
                        } px-24 py-4 radius-4 fw-medium text-sm`}
                    >
                      {attr.isActive == true ? "Active" : "Not Active"}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        type="button"
                        className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalEdit"
                        onClick={() => {
                          handleEdit(attr._id);
                        }}
                      >
                        <Icon icon="lucide:edit" className="menu-icon" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(attr._id)}
                        className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                      >
                        <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactTableComponent data={attributeData}
            columns={columns}
            filterableColumns={attributeFilter}
            pageIndex={pageIndex}
            totalPages={totalPages}
            totalRecords={total}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
        {/* Pagination buttons */}

      </div>

      {/* add About model */}

      <div
        className="modal fade"
        id="exampleModalEdit"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
              <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                {/* <h1 className="modal-title fs-5"> */}
                {isEditMode ? "Edit Attribute" : "Add Attribute"}
                {/* </h1> */}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                  {/* Facilitator Name */}
                  <div className="col-12">
                    <label className="form-label">Attribute Name</label>
                    <input
                      type="text"
                      name="AttributeName"
                      className="form-control"
                      value={formData.AttributeName || ""}
                      onChange={handleChange}
                    />
                    {errors.AttributeName && (
                      <span className="text-danger">
                        {errors.AttributeName}
                      </span>
                    )}
                  </div>

                  {/* Designation */}
                  <div className="col-12">
                    <label className="form-label">Attribute Value</label>
                    <input
                      type="text"
                      name="AttributeValue"
                      className="form-control"
                      value={formData.AttributeValue || ""}
                      onChange={handleChange}
                    />
                    {errors.designation && (
                      <span className="text-danger">{errors.designation}</span>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button type="submit" className="btn btn-primary text-sm">
                      {isEditMode ? "Update" : "Submit"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* add category model */}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default AttributePage;

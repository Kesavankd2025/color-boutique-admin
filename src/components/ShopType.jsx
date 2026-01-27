import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import ReactTableComponent from "../table/ReactTableComponent";
import AttribiteApis from "../apiProvider/attribute";
import Swal from "sweetalert2";
const ShopTypePage = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    ShopTypeName: ""
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [shopTypeData, setshopTypeData] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  const fetchData = async () => {
    try {
      const input = {
        page: pageIndex,
        limit: pageSize,
        search: search.trim(),
      };
      const response = await AttribiteApis.shoptypeList(input);
      if (response?.response?.data) {
        setshopTypeData(response.response.data);
        setTotalPages(response.response.totalPages);
        setTotal(response.response.total);
      }
    } catch (error) {
      console.error('Error fetching shop TYpe:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageIndex, pageSize, search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setPageIndex(0)
    setSearch(value);
  };

  

   const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow if the first character is a letter or if the input is empty
    if (value === "" || /^[a-zA-Z]/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.ShopTypeName || !formData.ShopTypeName.trim()) {
      newErrors.ShopTypeName = "Shop type name is required";
    } else if (formData.ShopTypeName.trim().length < 2) {
      newErrors.ShopTypeName = "shop type name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Form submitted:", formData);
      return;
    }

    if (!isEditMode) {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.ShopTypeName);

      const response = await AttribiteApis.shoptypecreate(formDataToSend);

      if (response.status) {
        toast(response.message);
        setshopTypeData([])
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
      }
    } else {
      const formDataToSend = new FormData();
      formDataToSend.append("id", editId);
      formDataToSend.append("name", formData.ShopTypeName);

      const response = await AttribiteApis.updateshoptype(formDataToSend, editId);

      if (response.status) {
        toast(response.message);
        setshopTypeData([])
        setIsEditMode(false)
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
      }
    }
  };

  const handleEdit = async (id) => {
    const response = await AttribiteApis.shoptypeDetails(id);
    if (response.status) {
      setIsEditMode(true);
      setEditId(id);
      setFormData({
        ShopTypeName: response.response.data.name,
      });
    }
  };

   const handleRemoveRow = async (id) => {
    console.log(id, "id")
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        const response = await AttribiteApis.deleteShopType(id);
        if (response.status) {
          //   toast.success("Unit deleted successfully");
          fetchData();
        }
      }
    } catch (error) {
      console.error("Error deleting unit:", error);
      toast.error("Failed to delete unit");
    }
  };
  const columns = useMemo(
    () => [
      { header: 'S.No', size: 70, id: 'sno', cell: info => pageIndex * pageSize + info.row.index + 1 },
      {
        header: 'Name',
        accessorKey: 'name',
        cell: info => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue()}
          </span>
        ),
      },
      {
        header: 'Actions',
        cell: info => {
          const shopTypeId = info.row.original._id;
          return (
            <div className="d-flex justify-content-start gap-2">
              <button
                type="button"
                className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                data-bs-toggle="modal"
                data-bs-target="#exampleModalEdit"
                onClick={() => handleEdit(shopTypeId)}
              >
                <Icon icon="lucide:edit" className="menu-icon" />
              </button>
              <button
                type="button"
                onClick={() => handleRemoveRow(shopTypeId)}
                className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              >
                <Icon icon="fluent:delete-24-regular" className="menu-icon" />
              </button>
            </div>
          );
        },
      },
    ],
    [pageIndex, pageSize]
  );
  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex(prev => prev - 1);
  };

  console.log(isEditMode, "editMODE", formData, "formData");
  const handleModalClose = () => {
    setFormData((prev) => ({
      ...prev,
    }));
    setErrors({});
  };
  return (
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
          <div className="search-icon" style={{ position: "absolute", right: "10px", top: "8px", }}>
            <Icon
              icon="ic:baseline-search"
              className="icon text-xl line-height-1"
            />
          </div>
        </div>
        <div>
          <button
            type="button"
            className="btn btn-success text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-right gap-2"
            data-bs-toggle="modal"
            data-bs-target="#exampleModalEdit"
            onClick={() => {
              setFormData({
                brandName: "",
              });
            }}
          >
            <Icon
              icon="ic:baseline-plus"
              className="icon text-xl line-height-1"
            />
            Add Shop type
          </button>
        </div>
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          <ReactTableComponent
            data={shopTypeData}
            columns={columns}
            pageIndex={pageIndex}
            totalPages={totalPages}
            onNextPage={handleNextPage}
            onPreviousPage={handlePreviousPage}
            totalRecords={total}
          />
        </div>
      </div>

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
                 {isEditMode ? "Edit Shop type" : "Add shop type"}
                {/* </h1> */}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => handleModalClose()}
              />
            </div>
            <div className="modal-body p-24">
              <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                  {/* Facilitator Name */}
                  <div className="col-12">
                    <label className="form-label">Shop Type Name</label>
                    <input
                      type="text"
                      name="ShopTypeName"
                      className="form-control"
                      value={formData.ShopTypeName || ""}
                      onChange={handleChange}
                    />
                    {errors.ShopTypeName && (
                      <span className="text-danger">{errors.ShopTypeName}</span>
                    )}
                  </div>

                  <div className="modal-footer" style={{margin:"0px "}}>
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
      {/* <ToastContainer /> */}
    </div>
  );
};

export default ShopTypePage;
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { IMAGE_BASE_URL } from "../network/apiClient";
import BrandApi from "../apiProvider/brand";
import { toast } from "react-toastify";
import ReactTableComponent from "../table/ReactTableComponent";

const BrandPage = () => {
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    brandName: "",
    Image: null,
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // TABLE DATA STATES
  const [brandData, setBrandData] = useState([]);      // visible rows
  const [allBrandsCache, setAllBrandsCache] = useState(null);  // full dataset
  const [filteredBrands, setFilteredBrands] = useState(null);  // filtered dataset

  // PAGINATION STATES
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // SEARCH STATES
  const [search, setSearch] = useState("");
  const searchDebounceRef = useRef(null);
  const fetchIdRef = useRef(0);

  /* ---------------------------
      SERVER PAGE FETCH
  ----------------------------*/
  const fetchServerPage = async (page = 0) => {
    return await BrandApi.brandList({
      page,
      limit: pageSize,
      search: "",
    });
  };

  /* ---------------------------
      FETCH ALL PAGES (CACHE)
  ----------------------------*/
  const fetchAllPages = async (fetchIdAtCall) => {
    const first = await BrandApi.brandList({ page: 0, limit: pageSize, search: "" });

    if (fetchIdAtCall !== fetchIdRef.current) return null;
    if (!first?.response) return null;

    let all = [...first.response.data];
    const totalPagesFromBackend = first.response.totalPages || 1;

    if (totalPagesFromBackend === 1) {
      setAllBrandsCache(all);
      return all;
    }

    const promises = [];
    for (let p = 1; p < totalPagesFromBackend; p++) {
      promises.push(BrandApi.brandList({ page: p, limit: pageSize, search: "" }));
    }

    const results = await Promise.all(promises);

    for (const r of results) {
      const d = r?.response;
      if (d?.data) all.push(...d.data);
    }

    setAllBrandsCache(all);
    return all;
  };

  /* ---------------------------
      ROOT-STYLE SEARCH ENGINE
  ----------------------------*/
  const fetchCurrentView = async () => {
    const fetchId = ++fetchIdRef.current;

    // 1) Search EMPTY → server pagination
    if (!search.trim()) {
      setFilteredBrands(null);
      setAllBrandsCache(null);

      const res = await fetchServerPage(pageIndex);
      if (fetchId !== fetchIdRef.current) return;

      const d = res?.response;
      setBrandData(d?.data || []);
      setTotalPages(d?.totalPages || 1);
      setTotal(d?.total || 0);
      return;
    }

    // 2) Search ACTIVE → use FULL dataset
    let all = allBrandsCache;

    if (!all) all = await fetchAllPages(fetchId);
    if (fetchId !== fetchIdRef.current) return;

    const q = search.trim().toLowerCase();

    const filtered = all.filter((item) => {
      const name = item.name?.toLowerCase() || "";
      return name.includes(q);
    });

    setFilteredBrands(filtered);
    const newTotalPages = Math.ceil(filtered.length / pageSize) || 1;
    setTotalPages(newTotalPages);

    const start = pageIndex * pageSize;
    setBrandData(filtered.slice(start, start + pageSize));
  };

  /* ---------------------------
      DEBOUNCED SEARCH INPUT
  ----------------------------*/
  const handleSearchChange = (e) => {
    const v = e.target.value;
    setSearch(v);
    setPageIndex(0);

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      fetchIdRef.current += 1;
      fetchCurrentView();
  };

  /* ---------------------------
      INITIAL FETCH
  ----------------------------*/
  useEffect(() => {
    fetchCurrentView();
  }, [pageIndex]);

  /* ---------------------------
      FORM LOGIC
  ----------------------------*/
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG and PNG allowed.");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      Image: file,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.brandName.trim()) newErrors.brandName = "Brand Name is required";
    if (!formData.Image) newErrors.Image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------------------
      SUBMIT (Create/Update)
  ----------------------------*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formToSend = new FormData();
    formToSend.append("name", formData.brandName);
    formToSend.append("logo", formData.Image);

    let response;
    if (isEditMode) {
      response = await BrandApi.updateBrand(formToSend, editId);
      console.log(response,"response")
      console.log(formToSend,"formToSend")
      console.log(editId,"editId")

    } else {
      response = await BrandApi.brandcreate(formToSend);
    }

    if (response.status) {
      toast(response.message);
      setAllBrandsCache(null);
      setFilteredBrands(null);
      fetchCurrentView();

      const modal = document.getElementById("exampleModalEdit");
      modal.classList.remove("show");
      modal.style.display = "none";
      document.body.classList.remove("modal-open");
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) backdrop.remove();
    }
  };

  /* ---------------------------
      EDIT
  ----------------------------*/
  const handleEdit = async (id) => {
    console.log(id,'idddddddddddd')
    const response = await BrandApi.brandDetails(id);
    if (response.status) {
      console.log(response,"response")
      setIsEditMode(true);
      setEditId(id);
      setFormData({
        brandName: response.response.data.name,
        Image: response.response.data.logo.docName,
      });
    }
  };

  /* ---------------------------
      DELETE
  ----------------------------*/
  const handleRemoveRow = async (id) => {
    const response = await BrandApi.deleteBrand(id);
    if (response.status) {
      setAllBrandsCache(null);
      setFilteredBrands(null);
      fetchCurrentView();
    }
  };

  /* ---------------------------
      COLUMNS
  ----------------------------*/
  const columns = useMemo(
    () => [
      {
        header: "S.No",
        size: 70,
        id: "sno",
        cell: (info) => pageIndex * pageSize + info.row.index + 1,
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Logo",
        accessorKey: "logo",
        cell: (info) => {
          const logo = info.row.original.logo;
          const imageUrl = logo
            ? `${IMAGE_BASE_URL}/${logo.docPath}/${logo.docName}`
            : "/default-image.png";
          return (
            <img
              src={imageUrl}
              style={{ width: 40, height: 40, objectFit: "cover" }}
            />
          );
        },
      },
      {
        header: "Actions",
        cell: (info) => {
          const id = info.row.original._id;
          return (
            <div className="d-flex gap-2">
              <button
              type="button"
              className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              data-bs-toggle="modal"
              data-bs-target="#exampleModalEdit"
              onClick={() => handleEdit(id)}
            >
              <Icon icon="lucide:edit" />
            </button>

              <button
              type="button"
                 className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                onClick={() => handleRemoveRow(id)}
              >
                <Icon icon="fluent:delete-24-regular" />
              </button>
            </div>
          );
        },
      },
    ],
    [pageIndex]
  );

  /* ---------------------------
      PAGINATION BUTTONS
  ----------------------------*/
  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  const handleModalClose = () => {
    setFormData({ brandName: "", Image: null });
    const fileInput = document.getElementById("brandImageInput");
    if (fileInput) fileInput.value = "";
    setErrors({});
  };

  return (
    <div className="card h-100 p-0 radius-12">
      {/* SEARCH + CREATE BUTTON */}
      <div className="card-header d-flex justify-content-between py-16 px-24">
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
          className="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#exampleModalEdit"
          onClick={() =>
            setFormData({ brandName: "", Image: "" }) || setIsEditMode(false)
          }
        >
          <Icon
          icon="ic:baseline-plus"
          className="icon text-xl line-height-1"
        />
          Create Brand
        </button>
      </div>

      {/* TABLE */}
      <div className="card-body p-24">
        <ReactTableComponent
          data={brandData}
          columns={columns}
          pageIndex={pageIndex}
          totalPages={totalPages}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          totalRecords={total}
        />
      </div>

      {/* MODAL (YOUR EXACT UI) */}
      {/* ---------------------------------------------------------- */}
      <div
        className="modal fade"
        id="exampleModalEdit"
        tabIndex={-1}
        aria-labelledby="exampleModalEditLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog modal-dialog-centered">
          <div className="modal-content radius-16 bg-base">
            <div className="modal-header py-16 px-24 border-bottom">
              <h1 className="modal-title fs-5" id="exampleModalEditLabel">
                {isEditMode ? "Edit Brand" : "Create Brand"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleModalClose}
              />
            </div>

            <div className="modal-body p-24">
              <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                  <div className="col-12">
                    <label className="form-label">Brand Name</label>
                    <input
                      type="text"
                      name="brandName"
                      className="form-control"
                      value={formData.brandName || ""}
                      onChange={handleChange}
                    />
                    {errors.brandName && (
                      <span className="text-danger">{errors.brandName}</span>
                    )}
                  </div>

                  <div className="col-12">
                    <label className="form-label">Brand Logo</label>
                    <input
                      id="brandImageInput"
                      className="form-control form-control-sm"
                      name="Image"
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleFileChange}
                      style={{ height: "52px" }}
                    />

                    {isEditMode && formData.Image && (
                      <img
                        src={
                          typeof formData.Image === "string"
                            ? IMAGE_BASE_URL + formData.Image
                            : URL.createObjectURL(formData.Image)
                        }
                        className="img-thumbnail mt-2"
                        style={{ width: 50, height: 50 }}
                      />
                    )}

                    {errors.Image && (
                      <span className="text-danger">{errors.Image}</span>
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
    </div>
  );
};

export default BrandPage;

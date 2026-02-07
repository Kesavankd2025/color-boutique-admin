import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import BannerApi from "../apiProvider/bannerapi";
import { IMAGE_BASE_URL } from "../network/apiClient";
import usePermission from "../hook/usePermission";
import ReactTableComponent from "../table/ReactTableComponent";

const BannerManagement = () => {
  const canAdd = usePermission("homePage", "add");
  const canedit = usePermission("homePage", "edit");
  const candelete = usePermission("homePage", "delete");
  const hasPermission = canedit || candelete;

  const fileInputRef = useRef(null);
  const [banners, setBanners] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    heading: "",
    subheading: "",
    buttonName: "",
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const input = {
        page: pageIndex,
        limit: pageSize,
        search: search.trim(),
      };
      const response = await BannerApi.bannerList(input);
      if (response.status) {
        setBanners(response.response.data || []);
        setTotalPages(response.response.totalPages || 1);
        setTotal(response.response.total || 0);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to fetch banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [pageIndex, pageSize, search]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setPageIndex(0);
    setSearch(value);
  };

  const handleNextPage = () => {
    if (pageIndex + 1 < totalPages) setPageIndex((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (pageIndex > 0) setPageIndex((prev) => prev - 1);
  };

  const MAX_FILE_SIZE_MB = 5;
  const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];

    files.forEach((file) => {
      if (file.size <= MAX_FILE_SIZE) {
        validFiles.push(file);
      } else {
        if (fileInputRef.current) {
          fileInputRef.current.value = null;
        }
        toast.warning(
          `${file.name} exceeds ${MAX_FILE_SIZE_MB}MB and was skipped.`
        );
      }
    });

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validFiles],
      }));
      if (errors.images) {
        setErrors((prev) => ({ ...prev, images: "" }));
      }
    }
  };

  // Remove an image
  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const newErrors = {};
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.images || formData.images.length === 0) {
      newErrors.images = "Please upload at least one image";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.title);
    formDataToSend.append("heading", formData.heading);
    formDataToSend.append("subheading", formData.subheading);
    formDataToSend.append("buttonName", formData.buttonName);
    let imageIds = [];
    formData.images.forEach((image) => {
      if (image instanceof File) {
        formDataToSend.append("image", image);
      } else if (image._id) {
        imageIds.push(image._id);
      }
    });
    formDataToSend.append("imageIds", imageIds);

    try {
      let response;
      if (isEditMode) {
        response = await BannerApi.updateBanner(
          currentBannerId,
          formDataToSend
        );
      } else {
        response = await BannerApi.createBanner(formDataToSend);
      }
      if (response.status) {
        closeModal();
        fetchBanners();
      } else {
        console.error(response || "Failed to save banner");
      }
    } catch (error) {
      toast.error("An error occurred while saving the banner");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setIsEditMode(true);
    setCurrentBannerId(banner._id);
    setFormData({
      title: banner.name || "",
      heading: banner.heading || "",
      subheading: banner.subheading || "",
      buttonName: banner.buttonName || "",
      images: banner.images || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
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
      try {
        setIsLoading(true);
        const response = await BannerApi.deleteBanner(id);
        if (response.status) {
          toast.success("Banner deleted successfully");
          fetchBanners();
        } else {
          toast.error("Failed to delete banner");
        }
      } catch (error) {
        toast.error("An error occurred while deleting the banner");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setCurrentBannerId(null);
    setFormData({
      title: "",
      heading: "",
      subheading: "",
      buttonName: "",
      images: [],
    });
    setErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      title: "",
      heading: "",
      subheading: "",
      buttonName: "",
      images: [],
    });
    setErrors({});
    setIsEditMode(false);
    setCurrentBannerId(null);
  };

  const columns = useMemo(
    () => [
      {
        header: "S.No",
        size: 70,
        id: "sno",
        cell: (info) => pageIndex * pageSize + info.row.index + 1,
      },
      {
        header: "Images",
        accessorKey: "images",
        cell: (info) => {
          const images = info.getValue();
          return (
            <div className="d-flex flex-wrap gap-2">
              {images && images.length > 0 ? (
                images.map((image, index) => (
                  <img
                    key={index}
                    src={`${IMAGE_BASE_URL}/${image?.docPath}/${image?.docName}`}
                    alt={`Banner ${index}`}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                    className="img-thumbnail"
                  />
                ))
              ) : (
                <span className="text-muted">No images</span>
              )}
            </div>
          );
        },
      },
      {
        header: "Title",
        accessorKey: "name",
        cell: (info) => (
          <span className="text-md mb-0 fw-normal text-secondary-light">
            {info.getValue() || "No title"}
          </span>
        ),
      },
      {
        header: "Actions",
        cell: (info) => {
          const bannerId = info.row.original._id;
          return (
            <div className="d-flex justify-content-start gap-2">
              {canedit && (
                <button
                  type="button"
                  className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                  onClick={() => handleEdit(info.row.original)}
                >
                  <Icon icon="lucide:edit" className="menu-icon" />
                </button>
              )}
              {candelete && (
                <button
                  type="button"
                  onClick={() => handleDelete(bannerId)}
                  className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                >
                  <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [pageIndex, pageSize, canedit, candelete]
  );

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
        {canAdd && (
          <div>
            <button
              type="button"
              className="btn btn-success text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-right gap-2"
              onClick={openCreateModal}
            >
              <Icon
                icon="ic:baseline-plus"
                className="icon text-xl line-height-1"
              />
              Add Banner
            </button>
          </div>
        )}
      </div>

      <div className="card-body p-24">
        <div className="table-responsive scroll-sm">
          {isLoading && banners.length === 0 ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : banners.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No banners found. {canAdd && 'Click "Add Banner" to create one.'}
            </div>
          ) : (
            <ReactTableComponent
              data={banners}
              columns={columns}
              pageIndex={pageIndex}
              totalPages={totalPages}
              onNextPage={handleNextPage}
              onPreviousPage={handlePreviousPage}
              totalRecords={total}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Modal - Using show/hide with React state */}
      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content radius-16 bg-base">
                <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
                  <h1 className="modal-title fs-5">
                    {isEditMode ? "Edit Banner" : "Add Banner"}
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    disabled={isLoading}
                  />
                </div>
                <div className="modal-body p-24">
                  <form onSubmit={handleSubmit}>
                    <div className="row gy-3">
                      <div className="col-12">
                        <label className="form-label">Title *</label>
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          value={formData.title}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                        {errors.title && (
                          <small className="text-danger">{errors.title}</small>
                        )}
                      </div>

                      <div className="col-12">
                        <label className="form-label">Heading</label>
                        <input
                          type="text"
                          name="heading"
                          className="form-control"
                          value={formData.heading}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Sub Heading</label>
                        <input
                          type="text"
                          name="subheading"
                          className="form-control"
                          value={formData.subheading}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">Button Name</label>
                        <input
                          type="text"
                          name="buttonName"
                          className="form-control"
                          value={formData.buttonName}
                          onChange={handleInputChange}
                          disabled={isLoading}
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label">
                          {isEditMode ? "Add More Images" : "Upload Images*"}
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={isLoading}
                        />
                        <small className="text-muted">
                          Select multiple images (JPEG, PNG, max{" "}
                          {MAX_FILE_SIZE_MB}MB each)
                        </small>
                        {errors.images && (
                          <div className="text-danger small">
                            {errors.images}
                          </div>
                        )}
                      </div>

                      {formData.images.length > 0 && (
                        <div className="col-12">
                          <div className="d-flex flex-wrap gap-2">
                            {formData.images.map((image, index) => (
                              <div
                                key={index}
                                className="image-preview position-relative"
                              >
                                <img
                                  src={
                                    image instanceof File
                                      ? URL.createObjectURL(image)
                                      : `${IMAGE_BASE_URL}/${image?.docPath}/${image?.docName}`
                                  }
                                  alt={`Preview ${index}`}
                                  className="img-thumbnail"
                                  style={{
                                    width: "70px",
                                    height: "70px",
                                    objectFit: "cover",
                                  }}
                                />

                                {/* ❌ Remove Button */}

                                <button
                                  type="button"
                                  className="btn btn-success btn-sm position-absolute top-0 end-0"
                                  onClick={() => removeImage(index)}
                                  style={{
                                    transform: "translate(50%, -50%)",
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: 0,
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="10"
                                    height="10"
                                    viewBox="0 0 256 256"
                                  >
                                    <g
                                      fill="#ffffff"
                                      fillRule="nonzero"
                                      stroke="none"
                                      strokeWidth="1"
                                      strokeLinecap="butt"
                                      strokeLinejoin="miter"
                                      strokeMiterlimit="10"
                                      style={{ mixBlendMode: "normal" }}
                                      transform="scale(8.53333)"
                                    >
                                      <path d="M7,4c-0.25587,0 -0.51203,0.09747 -0.70703,0.29297l-2,2c-0.391,0.391 -0.391,1.02406 0,1.41406l7.29297,7.29297l-7.29297,7.29297c-0.391,0.391 -0.391,1.02406 0,1.41406l2,2c0.391,0.391 1.02406,0.391 1.41406,0l7.29297,-7.29297l7.29297,7.29297c0.39,0.391 1.02406,0.391 1.41406,0l2,-2c0.391,-0.391 0.391,-1.02406 0,-1.41406l-7.29297,-7.29297l7.29297,-7.29297c0.391,-0.39 0.391,-1.02406 0,-1.41406l-2,-2c-0.391,-0.391 -1.02406,-0.391 -1.41406,0l-7.29297,7.29297l-7.29297,-7.29297c-0.1955,-0.1955 -0.45116,-0.29297 -0.70703,-0.29297z" />
                                    </g>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="col-12 d-flex justify-content-end gap-2">
                        <button
                          type="submit"
                          className="btn btn-success text-sm"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              {isEditMode ? "Updating..." : "Submitting..."}
                            </>
                          ) : isEditMode ? (
                            "Update"
                          ) : (
                            "Submit"
                          )}
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary text-sm"
                          onClick={closeModal}
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default BannerManagement;

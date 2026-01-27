// import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import hljs from "highlight.js";
import ReactQuill from "react-quill-new";
import DynamicModal from "../model/DynamicModel";
import apiProvider from "../apiProvider/categoryapi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IMAGE_BASE_URL } from "../network/apiClient";

const AddCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [curriculamForm, setCurriculamForm] = useState({
    name: "",
    serial: "",
  });
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [curriculamData, setCurriculamData] = useState([]);
  const [reviewData, setReviewData] = useState([]);
  const [getId, setGetId] = useState(localStorage.getItem("getCourseId") ?? "");
  const location = useLocation();
  const { editDatas } = location.state || {};

  const [courseId, setCourseId] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  const quillRef = useRef(null);
  const [isHighlightReady, setIsHighlightReady] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [getSubtitle, setgetSubtitle] = useState();

  const [selectedCategory, setSelectedCategory] = useState(null);

  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
    slug: "",
    Image: "",
    Tags: "",
    featuredCategory: false,
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    displayOrder: 0,
    status: false,
  });

  const handleChangeForModul = (e) => {
    const { name, value } = e.target;
    setCurriculamForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setErrors({});
    if (name === "featuredCategory") {
      setFormData({
        ...formData,
        [name]: value === "Yes",
      });
    } else if (name === "status") {
      setFormData({
        ...formData,
        [name]: value === "Active",
      });
    } else if (name === "displayOrder" || name === "orders") {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value, 10) : 0,
      });
    } else if (name === "categoryName") {
      // Allow alphabets, spaces, and common special characters but block numbers
      const filteredValue = value.replace(/[0-9]/g, ""); // Remove only numbers

      // Validate the filtered value
      let newErrors = { ...errors }; // Copy existing errors

      if (!filteredValue.trim()) {
        newErrors.categoryName = "Category name is required";
      } else if (!/^[a-zA-Z\s\-_&@!?'".]+$/.test(filteredValue)) {
        newErrors.categoryName = "Numbers are not allowed";
      } else {
        delete newErrors.categoryName; // Remove error if valid
      }

      setFormData((prev) => ({
        ...prev,
        [name]: filteredValue,
      }));

      setErrors(newErrors);
    } else {
      setFormData({
        ...formData,
        [name]: type === "file" ? files[0] : value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required ";
    }
    // if(!/^[A-Za-z\s]+$/.test(formData.categoryName.trim())){
    //   newErrors.categoryName = "Category name must contain alphabets and spaces only. No numbers or special characters allowed.";
    // }

    if (!formData.slug.trim()) {
      newErrors.slug = "slug is required.";
    }
    if (!formData.Image) {
      newErrors.Image = "Image is required.";
    }
    // if (!formData.displayOrder) {
    //   newErrors.displayOrder = "order is required.";
    // }

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const slug = formData.categoryName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-+/g, "-")
      .replace(/^-+|-+$/g, "");

    setFormData((prev) => ({ ...prev, slug }));
  }, [formData.categoryName]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (validate()) {
      try {
        const input = new FormData();
        input.append("name", formData.categoryName);
        input.append("description", formData.description);
        input.append("slug", formData.slug);
        input.append("tags", formData.Tags);
        input.append("featuredCategory", formData.featuredCategory);
        input.append("metaKeywords", formData.metaKeywords);
        input.append("metaTitle", formData.metaTitle);
        input.append("metaDescription", formData.metaDescription);
        // input.append("displayOrder", formData.displayOrder);
        input.append("status", formData.status);
        input.append("isActive", formData.status);
        if (formData.Image) {
          input.append("image", formData.Image);
        }
        for (let [] of input.entries()) {
        }
        if (isEditMode) {
          input.append("id", formData.id);
        }
        let addCategoryResponse;

        if (isEditMode) {
        
          addCategoryResponse = await apiProvider.updateCategory(
            formData.id,
            input
          );
        } else {
          addCategoryResponse = await apiProvider.addCategory(input);
        }


        if (addCategoryResponse.status) {
       
          const successMessage = isEditMode
            ? "Category updated successfully!"
            : "Category added successfully!";
          toast.success(successMessage);
          setTimeout(() => navigate("/category"), 1000);
        } else {
          console.error(
            "Error adding category:",
            addCategoryResponse
              ? addCategoryResponse?.response?.data?.message
              : "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error during category creation:", error);
      }
    } else {
      // console.log('Form validation failed.');
    }
  };

  const handleCurriculamSubmit = async () => {
    // e.preventDefault();
    // console.log("Form submitted:", curriculamForm);

    const input = new FormData();
    input.append("courseId", getId);
    input.append("tittle", curriculamForm.name);
    input.append("serial", curriculamForm.serial);
    input.append("subTittle", curriculamForm.subTittle);

    // console.log(...input, "input");

    try {
      let response;
      if (isEditMode) {
        // For edit mode, include the ID and use update endpoint
        input.append("id", curriculamForm.id);
        response = await apiProvider.updateCurriculam(input);
      } else {
        // For create mode
        response = await apiProvider.addCurriculam(input);
      }

      // console.log(response, "response-curi");

      if (response) {
        fetchCurriculum();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    // Add your form submission logic here
  };

  useEffect(() => {
    // Load highlight.js configuration and signal when ready
    hljs?.configure({
      languages: [
        "javascript",
        "ruby",
        "python",
        "java",
        "csharp",
        "cpp",
        "go",
        "php",
        "swift",
      ],
    });
  }, []);

  const fetchCategories = async () => {
    // console.log("enetr ffffffffff");

    try {
      const categoryResult = await apiProvider.getCategory();
      if (categoryResult?.response?.data?.data) {
        const updatedCategories = categoryResult.response.data.data.map(
          (ival) => ({
            ...ival,
            categoryName: `${ival.categoryName} / ${
              ival.categoryType === "1" ? "Online" : "Offline"
            }`,
          })
        );
        setCategories(updatedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchCurriculum = async () => {
    try {
      const curriculumResult = await apiProvider.getCurriculam();
      if (curriculumResult?.response?.data?.data) {
        // console.log(curriculumResult.response.data.data, "curriculum data", getId, "getId");

        // Filter curriculum based on courseId
        const filteredData = curriculumResult.response.data.data.filter(
          (ival) => ival.courseId == getId
        );
        setCurriculamData(filteredData);
        // console.log(filteredData, "filteredData");

        // Prepare subtitles
        const subtitles = filteredData.map((ival) => ({
          name: ival.subTittle,
          value: ival.id,
          courseId: ival.courseId,
        }));

        setgetSubtitle(subtitles);
      }

      const reviewResult = await apiProvider.getReview();
      // console.log(reviewResult, "reviewResult");

      if (reviewResult?.response?.data?.data) {
        const filteredReviewData = reviewResult.response.data.data.filter(
          (ival) => ival.courseId == getId
        );
        // console.log(filteredReviewData, "filteredReviewData- revieww");
        setReviewData(filteredReviewData);
      }
    } catch (error) {
      console.error("Error fetching curriculum:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (getId) {
      fetchCurriculum();
    }
  }, [getId]);
  // eslint-disable-next-line no-unused-vars

  // Quill editor modules with syntax highlighting (only load if highlight.js is ready)

  useEffect(() => {
    // console.log("editDatas edit cat :", editDatas.images[0].docName);
    // console.log("editDatas edit cat :", editDatas);
    if (!editDatas) return;
    setIsEditMode(true);
    // console.log(editDatas, "editDatas-props function");
    // return false
    setFormData({
      id: editDatas._id,
      categoryName: editDatas.name,
      description: editDatas.description,
      slug: editDatas.slug,
      // Image: editDatas.images,
      // Image:editDatas.images?.[0]?.docName ||'',
      Image:
        editDatas.images && editDatas.images.length > 0 && editDatas.images[0],
      Tags: editDatas.tags,
      featuredCategory: editDatas.featuredCategory,
      metaTitle: editDatas.metaTitle,
      metaKeywords: editDatas.metaKeywords,
      metaDescription: editDatas.metaDescription,
      // displayOrder: editDatas.displayOrder,
      status: editDatas.status,
    });
  }, []);

  // Function to handle status change

  console.log(formData, "formData-edit");

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
        <div className="col-md-12">
          <div className="card-body">
            {/* Form Wizard Start */}
            <div className="form-wizard">
              <div>
                <fieldset
                  className={`wizard-fieldset ${currentStep === 1 && "show"} `}
                >
                  <div className="row gy-3">
                    <div className="col-sm-6">
                      <label className="form-label">Category Name</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control wizard-required"
                          required
                          name="categoryName"
                          value={formData.categoryName}
                          onChange={handleChange}
                        />
                        {errors.categoryName && (
                          <div className="text-danger">
                            {errors.categoryName}
                          </div>
                        )}

                        <div className="wizard-form-error" />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label">Description</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control wizard-required"
                          required
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                        />
                        {/* {errors.courseName && <div className="text-danger">{errors.courseName}</div>} */}

                        <div className="wizard-form-error" />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Category Slug</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control wizard-required"
                          required
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                        />
                        {errors.slug && (
                          <div className="text-danger">{errors.slug}</div>
                        )}

                        <div className="wizard-form-error" />
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label">Category Image</label>
                      <div className="position-relative">
                        <input
                          className="form-control form-control-sm"
                          name="Image"
                          type="file"
                          accept="image/png, image/jpeg, image/svg"
                          onChange={handleChange}
                          style={{ height: "45px" }}
                        />
                      </div>
                      {editDatas && (
                        <img
                          src={
                            formData.Image
                              ? `${IMAGE_BASE_URL}/${formData.Image?.docPath}/${formData.Image?.docName}`
                              : "/default-image.png"
                          }
                          alt={`${formData.name} Image`}
                          width="40"
                          height="40"
                        />
                      )}
                      {errors.Image && (
                        <div className="text-danger">{errors.Image}</div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label">Tags</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control wizard-required"
                          required=""
                          name="Tags"
                          value={formData.Tags}
                          onChange={(e) => {
                            const alphaOnly = e.target.value.replace(
                              /[^a-zA-Z\s]/g,
                              ""
                            ); // allow letters and space
                            setFormData((prev) => ({
                              ...prev,
                              Tags: alphaOnly,
                            }));
                          }}
                        />
                        <div className="wizard-form-error" />
                      </div>
                    </div>

                      <div className="col-sm-6" style={{ width:"50%" }}>
                    <label className="form-label">Featured Category</label>
                    <div className="position-relative" style={{ width:"100%" }}>
                      <select
                        className="form-select"
                        name="featuredCategory"
                        value={formData.featuredCategory ? "Yes" : "No"}
                        onChange={handleChange}
                      >
                        <option value="">Select Featured Category</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                      <div className="wizard-form-error" />
                    </div>
                  </div>
                 {/* <div className="col-sm-6" style={{width:"50%"}}>
                      <label className="form-label">Featured Category</label>
                      <div style={{ 
                        width: "100%", 
                        position: "relative",
                        border: "1px solid #ced4da",
                        borderRadius: "0.375rem",
                        overflow: "visible"
                      }}>
                        <select
                          className="form-select"
                          name="featuredCategory"
                          value={formData.featuredCategory ? "Yes" : "No"}
                          onChange={handleChange}
                          style={{
                            width: "100%",
                            border: "none",
                            outline: "none",
                            background: "transparent"
                          }}
                        >
                          <option value="">Select Featured Category</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <div className="wizard-form-error" />
                        <div>
                          <svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" 
                          fill="currentColor" className="bs-arrow bi bi-chevron-down" viewBox="0 0 16 16">
                        <path fillRule="evenodd" 
                              d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 
                              .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
                      </svg>
                        </div>

                        
                      </div>
                    </div> */}



                    <div className="col-sm-6">
                      <label className="form-label">Meta Keywords</label>
                      <div className="position-relative">
                        <input
                          inputMode="none"
                          type="text"
                          className="form-control wizard-required"
                          required=""
                          name="metaKeywords"
                          value={formData.metaKeywords}
                          onChange={handleChange}
                        />
                        <div className="wizard-form-error" />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Meta Title</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control wizard-required"
                          required=""
                          name="metaTitle"
                          value={formData.metaTitle}
                          onChange={handleChange}
                        />
                        {/* {errors.price && <div className="text-danger">{errors.price}</div>} */}

                        <div className="wizard-form-error" />
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label">Meta Description</label>
                      <div className="position-relative">
                        <input
                          type="text"
                          className="form-control wizard-required"
                          required=""
                          name="metaDescription"
                          value={formData.metaDescription}
                          onChange={handleChange}
                        />
                        <div className="wizard-form-error" />
                      </div>
                    </div>
                    {/* <div className="col-sm-6">
                      <label className="form-label">Display Order</label>
                      <div className="position-relative">
                        <input
                          type="number"
                          className="form-control wizard-required"
                          name="displayOrder"
                          value={formData.displayOrder || ""}
                          min="1"
                          onChange={(e) => {
                            const value = parseInt(e.target.value, 10);
                            if (value >= 1 || e.target.value === "") {
                              handleChange(e);
                            }
                          }}
                          onKeyDown={(e) => {
                            // Prevent invalid characters
                            if (
                              e.key === "e" ||
                              e.key === "E" ||
                              e.key === "+" ||
                              e.key === "-" ||
                              e.key === "." // optional: block decimal if only integers are allowed
                            ) {
                              e.preventDefault();
                            }
                          }}
                          required
                        />
                        {errors.displayOrder && (
                          <div className="text-danger">
                            {errors.displayOrder}
                          </div>
                        )}
                        <div className="wizard-form-error" />
                      </div>
                    </div> */}

                    <div className="col-sm-6">
                      <label className="form-label">Status</label>
                      <div className="position-relative">
                        <select
                          className="form-select"
                          name="status"
                          value={formData.status ? "Active" : "Inactive"} // Show 'Active' or 'Inactive' based on the boolean value
                          onChange={handleChange}
                        >
                          <option value="">-- Select Status --</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-group text-end">
                      <button
                        type="ffff"
                        className="form-wizard-next-btn btn btn-secondary me-1 px-32"
                        onClick={() => navigate(`/category`)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="form-wizard-next-btn btn btn-primary px-32"
                        onClick={handleSubmit}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            {/* Form Wizard End */}
          </div>
        </div>
      </div>

      {/* Model */}
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
                {isEditMode ? "Edit Module" : " Create Module"}
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-24">
              <div>
                <div className="row gy-3">
                  <div className="col-12">
                    <label className="form-label"> Name </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={curriculamForm.name}
                      onChange={handleChangeForModul}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Serial</label>
                    <input
                      type="number"
                      name="serial"
                      className="form-control"
                      value={curriculamForm.serial}
                      onChange={handleChangeForModul}
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary text-sm"
                      onClick={handleCurriculamSubmit}
                    >
                      {isEditMode ? "Update" : "Submit"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Modal */}

      <DynamicModal
        selectedCategory={selectedCategory}
        getSubtitle={getSubtitle}
        fetchCurriculum={fetchCurriculum}
      />
    </div>
  );
};

export default AddCategoryPage;

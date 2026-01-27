// import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import hljs from "highlight.js";
import ReactQuill from "react-quill-new";
import DynamicModal from "../model/DynamicModel";
import apiProvider from "../apiProvider/api";
import SubcategoriesApi from "../apiProvider/subcategoryapi";
import childCategoryApi from "../apiProvider/childcategoryapi";
import { useSearchParams } from "react-router-dom";


import { Link, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { IMAGE_BASE_URL } from "../network/apiClient";

const AddChildCategoryPage = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const { editDatas } = location.state || {};
  const [category, setCategory] = useState()
  const quillRef = useRef(null);
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("from") || "category";


  const [formData, setFormData] = useState({
    childCategoryName: "",
    subCategory: "",
    parentCategory: "",
    description: "",
    slug: "",
    image: null,
    tags: "",
    featuredCategory: "",
    displayOrder: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
    status: true,
  });

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleCancel = () => {
    // Handle cancel action
    // console.log('Form cancelled');
  };

  const handleChange = (e) => {
    // console.log("enetr halchangeee");

    const { name, value, type, files } = e.target;

    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const Validate = () => {
    const newErrors = {};

    if (!formData.childCategoryName.trim()) {
      newErrors.childCategoryName = "Child Category name is required ";
      setErrors(newErrors);
      return false;
    }
    if (!/^[A-Za-z\s]+$/.test(formData.childCategoryName.trim())) {
      newErrors.childCategoryName = "Child Category name must contain alphabets and spaces only. No numbers or special characters allowed.";
      setErrors(newErrors);
      return false;
    }
    // if (!formData.displayOrder.trim()) {
    //     newErrors.displayOrder = 'Display Order is Required';
    // }
    if (!formData.subCategory.trim()) {
      newErrors.subCategory = "Sub Category is Required";
      setErrors(newErrors);
      return false;
    }
    if (!formData.image) {
      newErrors.image = "Image is required.";
      setErrors(newErrors);
      return false;
    }
    // if (!formData.unit.trim()) {
    //   newErrors.unit = "Unit is required.";
    //   setErrors(newErrors);
    //   return false;
    // }
    // if (!formData.parentCategory.trim()) {
    //     newErrors.parentCategory = 'Parent Category is Required';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Validate()) {
      const input = new FormData();

      input.append("name", formData.childCategoryName);
      input.append("subcategory", formData.subCategory);
      input.append("parentCategory", formData.parentCategory);
      input.append("description", formData.description);
      input.append(
        "slug",
        formData.childCategoryName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") // Replace spaces & special characters with "-"
          .replace(/^-+|-+$/g, "")
      );

      // Only append image if it's a File (you can validate this before)
      if (formData.image && formData.image instanceof File) {
        input.append("image", formData.image);
      }

      input.append("tags", formData.tags);
      input.append("featuredCategory", formData.featuredCategory); // boolean or '' — handle as needed
      // input.append("displayOrder", formData.displayOrder);
      input.append("metaTitle", formData.metaTitle);
      input.append("metaDescription", formData.metaDescription);
      input.append("metaKeywords", formData.metaKeywords);
      input.append("status", formData.status); // should be "Active" or "Inactive"
      input.append("isActive", formData.status);
      try {
        let response;
        if (isEditMode) {
          // For edit mode, include the ID and use update endpoint
          input.append("id", formData.id);
          response = await childCategoryApi.updateChildCategory(
            formData.id,
            input
          );
        } else {
          // For create mode
          response = await childCategoryApi.addChildCategory(input);
        }

        // console.log(response, "response-g");

      if (response.status) {
          toast(response.message);

          setTimeout(() => {
            if (returnTo === "subcategorylist") {
              navigate("/category?type=subcategorylist");
            } 
            else if (returnTo === "childcategorylist") {
              navigate("/category?type=childcategorylist");
            } 
            else {
              navigate("/category");
            }
          }, 1000);

          // Reset form
          setFormData({
            childCategoryName: "",
            subCategory: "",
            parentCategory: "",
            description: "",
            slug: "",
            image: null,
            tags: "",
            featuredCategory: "",
            metaTitle: "",
            metaDescription: "",
            metaKeywords: "",
            status: true,
          });
        }else{
          toast(response.message);
        }

      } catch (error) {
        console.error("Error submitting form:", error);
        // You might want to add error handling here (show toast, etc.)
      }
      // Add your form submission logic here
    }


  };

  useEffect(() => {
    if (!editDatas) return;

    console.log(editDatas, "editDatas - child");

    setIsEditMode(true);

    setFormData({
      childCategoryName: editDatas.name || "",
      slug: editDatas.slug || "",
      description: editDatas.description || "",
      tags: editDatas.tags || "",
      featuredCategory: editDatas.featuredCategory || false,
      // displayOrder: editDatas.displayOrder || "",
      metaTitle: editDatas.metaTitle || "",
      metaDescription: editDatas.metaDescription || "",
      metaKeywords: editDatas.metaKeywords || "",
      status: editDatas.status ? true : false,
      subCategory: editDatas.subcategory?._id || "", // assuming single subCategory
      parentCategory: editDatas.category?.name || "", // assuming single parent category
      id: editDatas._id || "",
      image:
        editDatas.images && editDatas.images.length > 0 && editDatas.images[0],
    });
  }, []);

  // Sub category
  useEffect(() => {
    fetchSubCategoriesData();
  }, []);

  const fetchSubCategoriesData = async () => {
    try {
      const input = {
        limit: 100,
        offset: 0,
        search: '',
      }
      const result = await SubcategoriesApi.getSubCategorys(input);

      // console.log("Fetched SubCategorys Response:", result.response);

      if (result && result.status) {
        const items = result.response?.data?.data.items || [];
        setSubCategories(items);
      } else {
        if (result && result.response?.message === "Invalid token") {
          console.warn("Token invalid. Redirecting to login...");
          // localStorage.removeItem("authToken");
          // window.location.href = "/login";
          return;
        }

        console.error(
          "Failed to fetch categories. Result is invalid or missing expected response:",
          result
        );
      }
    } catch (error) {
      console.error("Error fetching category data:", error);

      if (error.response) {
        console.error("API Error Response Status:", error.response.status);
        console.error("API Error Response Data:", error.response.data);
      }
    }
  };
  useEffect(() => {
    if (!editDatas) {
      fetchCategoriesData();
    }
  }, [formData.subCategory]);

  const fetchCategoriesData = async () => {
    const categories = subCategories.filter(category => category._id === formData.subCategory);

    setFormData(prev => ({
      ...prev,
      parentCategory: categories.length > 0 ? categories[0]?.category?.name || "" : ""
    }));
  };

  // console.log(formData, "formData");

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
        <div className="col-md-12">
          <div className="card-body">
            {/* Form Wizard Start */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12">
                  <div className="">
                    <div className="p-4 ">
                      <form onSubmit={handleSubmit}>
                        {/* First Row */}
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Child Category Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="childCategoryName"
                                value={formData.childCategoryName}
                                onChange={handleChange}
                                required
                              />
                              {errors.childCategoryName && (
                                <div className="text-danger">
                                  {errors.childCategoryName}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">Sub Category</label>
                              <select
                                className="form-select"
                                name="subCategory"
                                value={formData.subCategory}
                                onChange={handleChange}
                                required
                              >
                                <option value="">Select Category</option>
                                {subCategories.map((category) => (
                                  <option
                                    key={category._id}
                                    value={category._id}
                                  >
                                    {category.name}
                                  </option>
                                ))}
                              </select>
                              {errors.subCategory && (
                                <div className="text-danger">
                                  {errors.subCategory}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Category
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="parentCategory"
                                value={formData.parentCategory}
                                onChange={handleChange}
                                placeholder="Auto fetched"
                                readOnly
                              />
                              {errors.parentCategory && (
                                <div className="text-danger">
                                  {errors.parentCategory}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Second Row */}
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">Description</label>
                              <input
                                type="text"
                                className="form-control"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Child Category Slug
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="slug"
                                value={formData.childCategoryName}
                                onChange={handleChange}
                              />
                              {errors.slug && (
                                <div className="text-danger">{errors.slug}</div>
                              )}
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-0">
                              <label className="form-label">
                                Child Category Image
                              </label>
                              <input
                                className="form-control"
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                              // value={editDatas? formData.image : ""}
                              />
                              {editDatas && (
                                <img
                                  src={
                                    formData.image
                                      ? `${IMAGE_BASE_URL}/${formData.image.docPath}/${formData.image.docName}`
                                      : "/default-image.png"
                                  }
                                  alt={`${formData.name} Image`}
                                  width="40"
                                  height="40"
                                />
                              )}
                              {errors.image && (
                                <div className="text-danger">{errors.image}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Third Row */}
                        <div className="row">
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">Tags</label>
                              <input
                                className="form-control"
                                type="text"
                                name="tags"
                                value={formData.tags}
                                // onChange={handleChange}
                                onChange={(e) => {
                                  const alphaOnly = e.target.value.replace(
                                    /[^a-zA-Z\s]/g,
                                    ""
                                  ); // allow letters and space
                                  setFormData((prev) => ({
                                    ...prev,
                                    tags: alphaOnly,
                                  }));
                                }}
                              // placeholder="Enter tags separated by commas"
                              />
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Featured Category
                              </label>
                              <select
                                className="form-select"
                                name="featuredCategory"
                                value={formData.featuredCategory}
                                onChange={handleChange}
                              >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                              </select>
                            </div>
                          </div>

                          {/* <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Display Order
                              </label>
                              <input
                                className="form-control"
                                type="number"
                                name="displayOrder"
                                value={formData.displayOrder}
                                // onChange={handleChange}
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
                              />
                              {errors.displayOrder && (
                                <div className="text-danger">
                                  {" "}
                                  {errors.displayOrder}{" "}
                                </div>
                              )}
                            </div>
                          </div> */}
                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">Meta Title</label>
                              <input
                                type="text"
                                className="form-control"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Fourth Row */}
                        <div className="row">


                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Meta Description
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleChange}
                              />
                            </div>
                          </div>

                          <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">
                                Meta Keywords
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                name="metaKeywords"
                                value={formData.metaKeywords}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                            <div className="col-lg-4">
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Fifth Row */}
                        <div className="row">

                        </div>

                        {/* Form Actions */}
                        <div className="row mb-4">
                          <div className="col text-end">
                            <button
                              type="button"
                              className="btn btn-danger"
                              // onClick={handleCancel}
                             onClick={() => {
                      if (returnTo === "subcategorylist") navigate("/category?type=subcategorylist");
                      else if (returnTo === "childcategorylist") navigate("/category?type=childcategorylist");
                      else navigate("/category");
                    }}
                            >
                              <i className="bx bx-x me-1"></i> Cancel
                            </button>

                            <button
                              type="submit"
                              className="btn btn-success ms-2"
                              onClick={handleSubmit}
                            >
                              <i className="bx bx-file me-1"></i> Save
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Form Wizard End */}
          </div>
        </div>
      </div>

      {/* Model */}

      {/* Category Modal */}
      <ToastContainer />
    </div>
  );
};

export default AddChildCategoryPage;

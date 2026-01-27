// import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import CategoryApi from '../apiProvider/categoryapi';
import subCategoryApi from '../apiProvider/subcategoryapi';
import { IMAGE_BASE_URL } from '../network/apiClient';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddSubCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("from");

  const navigate = useNavigate();
  const location = useLocation();
  const { editDatas } = location.state || {};

  const [formData, setFormData] = useState({
    subCategoryName: '',
    parentCategory: '',
    description: '',
    Image: '',
    slug: '',
    tags: '',
    featuredCategory: true,
    title: '',
    metaKeywords: '',
    metaDescription: '',
    status: true,
  });

  /* -----------------------------
        CHANGE HANDLER
  ----------------------------- */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  /* -----------------------------
        VALIDATION
  ----------------------------- */
  const Validate = () => {
    let newErrors = {};

    if (!formData.subCategoryName.trim()) {
      newErrors.subCategoryName = "Sub category name is required";
    }

    if (!isEditMode && !formData.Image) {
      newErrors.Image = "Image is required";
    }

    if (isEditMode && !formData.Image && !formData.image) {
      newErrors.Image = "Image is required";
    }

    if (!formData.parentCategory) {
      newErrors.parentCategory = "Parent category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* -----------------------------
        SUBMIT HANDLER
  ----------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Validate()) return;

    const form = new FormData();
    form.append("image", formData.Image);
    form.append("category", formData.parentCategory);
    form.append("name", formData.subCategoryName);
    form.append("description", formData.description);

    form.append(
      "slug",
      formData.subCategoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    );

    form.append("tags", formData.tags);
    form.append("featuredCategory", formData.featuredCategory);
    form.append("metaTitle", formData.title);
    form.append("metaKeywords", formData.metaKeywords);
    form.append("metaDescription", formData.metaDescription);
    form.append("status", formData.status);
    form.append("isActive", formData.status);

    if (isEditMode) {
      form.append("id", formData.id);
    }

    try {
      let response;

      if (isEditMode) {
        response = await subCategoryApi.updateSubCategory(formData.id, form);
      } else {
        response = await subCategoryApi.addSubCategory(form);
      }

      if (response.status) {
        toast(response.message);

        setTimeout(() => {
          if (returnTo === "subcategorylist") {
            navigate("/category?type=subcategorylist");
          } else if (returnTo === "childcategorylist") {
            navigate("/category?type=childcategorylist");
          } else {
            navigate("/category");
          }
        }, 800);
      }else{
        toast(response.message);
      }
    } catch (err) {
      console.error("Error saving:", err);
    }
  };

  /* -----------------------------
        FETCH CATEGORIES
  ----------------------------- */
  const fetchGetCategories = async () => {
    try {
      const categoryResult = await CategoryApi.getCategory();
      setCategories(categoryResult.data.data.items || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchGetCategories();
  }, []);

  /* -----------------------------
        EDIT MODE DATA FILL
  ----------------------------- */
  useEffect(() => {
    if (!editDatas) return;

    setIsEditMode(true);

    setFormData({
      id: editDatas._id,
      subCategoryName: editDatas.name || "",
      parentCategory: editDatas.category?._id || "",
      description: editDatas.description || "",
      Image: "",
      slug: editDatas.slug || "",
      tags: editDatas.tags || "",
      featuredCategory: !!editDatas.featuredCategory,
      title: editDatas.metaTitle || "",
      metaKeywords: editDatas.metaKeywords || "",
      metaDescription: editDatas.metaDescription || "",
      status: editDatas.status ? "true" : "false",
      image: editDatas.images?.length > 0 ? editDatas.images[0] : null,
    });
  }, [editDatas]);

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
        <div className="col-md-12">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row gy-3">

                {/* SUBCATEGORY NAME */}
                <div className='col-sm-6'>
                  <label className='form-label'>Sub Category Name</label>
                  <input
                    type='text'
                    className='form-control'
                    name="subCategoryName"
                    value={formData.subCategoryName}
                    onChange={handleChange}
                  />
                  {errors.subCategoryName && <div className="text-danger">{errors.subCategoryName}</div>}
                </div>

                {/* CATEGORY */}
                <div className='col-sm-6'>
                  <label className='form-label'>Category</label>
                  <select
                    className='form-select'
                    name="parentCategory"
                    value={formData.parentCategory}
                    onChange={handleChange}
                  >
                    <option value="">--Select Category--</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                  {errors.parentCategory && <div className="text-danger">{errors.parentCategory}</div>}
                </div>

                {/* DESCRIPTION */}
                <div className='col-sm-6'>
                  <label className='form-label'>Description</label>
                  <input
                    type='text'
                    className='form-control'
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                {/* IMAGE */}
                <div className='col-sm-6'>
                  <label className='form-label'>Sub Category Image</label>
                  <input
                    className='form-control'
                    type="file"
                    name="Image"
                    accept="image/png, image/jpeg"
                    onChange={handleChange}
                  />

                  {isEditMode && formData.image && (
                    <img
                      src={`${IMAGE_BASE_URL}/${formData.image.docPath}/${formData.image.docName}`}
                      width="40"
                      height="40"
                    />
                  )}

                  {errors.Image && <div className="text-danger">{errors.Image}</div>}
                </div>

                {/* SLUG */}
                <div className='col-sm-6'>
                  <label className='form-label'>Slug</label>
                  <input
                    type='text'
                    className='form-control'
                    name="slug"
                    value={formData.subCategoryName}
                    onChange={handleChange}
                  />
                </div>

                {/* TAGS */}
                <div className='col-sm-6'>
                  <label className='form-label'>Tags</label>
                  <input
                    type='text'
                    className='form-control'
                    name="tags"
                    value={formData.tags}
                    onChange={(e) => {
                      const onlyAlpha = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                      setFormData({ ...formData, tags: onlyAlpha });
                    }}
                  />
                </div>

                {/* FEATURED */}
                <div className='col-sm-6'>
                  <label className='form-label'>Featured Category</label>
                  <select
                    className='form-select'
                    name="featuredCategory"
                    value={formData.featuredCategory}
                    onChange={handleChange}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {/* META TITLE */}
                <div className='col-sm-6'>
                  <label className='form-label'>Meta Title</label>
                  <input
                    type='text'
                    className='form-control'
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                {/* META KEYWORDS */}
                <div className='col-sm-6'>
                  <label className='form-label'>Meta Keywords</label>
                  <input
                    type='text'
                    className='form-control'
                    name="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={handleChange}
                  />
                </div>

                {/* META DESC */}
                <div className='col-sm-6'>
                  <label className='form-label'>Meta Description</label>
                  <input
                    type='text'
                    className='form-control'
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                  />
                </div>

                {/* STATUS */}
                <div className='col-sm-6'>
                  <label className='form-label'>Status</label>
                  <select
                    className='form-select'
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Status --</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                {/* BUTTONS */}
                <div className='form-group text-end'>
                  {/* CANCEL BUTTON FIX */}
                  <button
                    type="button"
                    className='btn btn-secondary me-2 px-32'
                    onClick={() => {
                      if (returnTo === "subcategorylist") navigate("/category?type=subcategorylist");
                      else if (returnTo === "childcategorylist") navigate("/category?type=childcategorylist");
                      else navigate("/category");
                    }}
                  >
                    Cancel
                  </button>

                  {/* SAVE BUTTON */}
                  <button
                    type="submit"
                    className='btn btn-primary px-32'
                  >
                    Save
                  </button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSubCategoryPage;

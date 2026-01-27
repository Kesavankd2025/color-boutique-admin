import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import { IMAGE_URL } from '../../src/network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import hljs from "highlight.js";
import ReactQuill from "react-quill-new";
const ItemsPerPage = 10; // Number of items per page

const ManagementPageLayer = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [usedNumbers, setUsedNumbers] = useState(new Set());
    const [facilitatorsData, setFacilitatorsData] = useState([]);
    const [newExpertise, setNewExpertise] = useState("");
    const [newCertificate, setNewCertificate] = useState("");
    const [errors, setErrors] = useState({});
    const quillRef = useRef(null);
    const [isHighlightReady, setIsHighlightReady] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        designation: "",
        description: "",
        Image: null,
        slug: "",
    });



    const generateUniqueSlug = (name) => {
        if (!name) return "";

        // Remove all spaces and make it lowercase
        const baseSlug = name.replace(/\s/g, "").toLowerCase();


        let uniqueNumber;
        do {
            uniqueNumber = Math.floor(100 + Math.random() * 900); // Generate a 3-digit random number
        } while (usedNumbers.has(uniqueNumber)); // Ensure it's unique

        setUsedNumbers((prev) => new Set(prev).add(uniqueNumber));

        return `${baseSlug}-management-team-${uniqueNumber}`;
    };

    // Update slug when name changes
    useEffect(() => {
        if (formData.name) {
            const newSlug = generateUniqueSlug(formData.name);
            setFormData((prev) => ({ ...prev, slug: newSlug }));
        }
    }, [formData.name]);


    const fetchData = async () => {
        try {
            const result = await apiProvider.getManagementTeam();
            console.log(result, "result-manage");
            if (result) {
                setFacilitatorsData(result.response.data.data);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        let newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.designation.trim()) newErrors.designation = "Designation is required";
        if (!formData.description.trim()) newErrors.description = "Description is required";
        // if (!formData.slug.trim()) newErrors.slug = "Slug cannot be empty";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };


    // const handleFileChange = (e) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         setFormData((prev) => ({
    //             ...prev,
    //             Image: e.target.files[0],
    //         }));
    //     }
    // };
    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png'];
            if (!allowedTypes.includes(file.type)) {
                alert('Only JPG and PNG image formats are allowed.');
                e.target.value = ""; // Clear the input
                return;
            }

            setFormData((prev) => ({
                ...prev,
                Image: file,
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validate the form before proceeding
        if (!validateForm()) {
            return;
        }
        console.log("Form submitted:", formData);

        const input = new FormData();
        input.append("name", formData.name);
        input.append("designation", formData.designation);
        input.append("description", formData.description);
        input.append("slug", formData.slug);


        // Only append image if it's a new file (not a string path)
        if (formData.Image instanceof File) {
            input.append("image", formData.Image);
        } else if (typeof formData.Image === 'string') {
            input.append("imagePath", formData.Image);
        }

        console.log(...input, "input");

        try {
            let response;
            if (isEditMode) {
                input.append("id", formData.id);
                response = await apiProvider.updateManagementTeam(input);
            } else {
                response = await apiProvider.addManagementTeam(input);
            }

            console.log(response, "response");

            if (response) {
                toast(response.response.data.message);
                setFormData({
                    name: "",
                    designation: "",
                    description: "",
                    Image: null,
                    slug: "",
                });
                document.querySelector("input[type='file']").value = "";
                // Refresh data
                fetchData();
                setIsEditMode(false);
                // const modalElement = document.getElementById("exampleModalEdit");
                // console.log(modalElement, "modalElement");

                // if (modalElement) {
                //     const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
                //     modal.hide();
                // }

                // Remove modal styles and backdrop manually
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
                document.body.style.overflow = "auto"; // 

                // setTimeout(() => {
                //     window.location.reload()
                // }, 1000)

            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };


    const handleEditClick = (category) => {
        console.log(category, "edittttt");

        setIsEditMode(true);
        setFormData({
            id: category.id,
            name: category.name,
            designation: category.designation,
            description: category.description,
            image: category.image,
            slug: category.slug,
        })
    };

    // Calculate total pages
    const totalPages = Math.ceil(facilitatorsData.length / ItemsPerPage);

    // Get the current page's data
    const startIndex = (currentPage - 1) * ItemsPerPage;
    const endIndex = startIndex + ItemsPerPage;
    const currentData = facilitatorsData.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };
    // console.log(formData,"ffff");

    const handleDelete = async (category) => {
        console.log(category, "ccccccccc");

        Swal.fire({
            title: 'Are you sure?',
            text: `You are about to delete "${category.name}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                title: 'swal-title-small',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                // 👇 Call your delete API or logic here
                const result = await apiProvider.deletManagementTeam(category.id);
                console.log(result, "rrrrrrrrrrrr");
                if (result) {
                    deleteCategory(category.id);
                }



            }
        });
    };

    // Example delete function (you should replace this with your actual API call)
    const deleteCategory = async (id) => {
        try {
            // await your API delete call
            console.log("Deleting category with ID:", id);

            Swal.fire(
                'Deleted!',
                'Team detail has been deleted.',
                'success'
            );
            // Refresh data
            fetchData();

            // Optionally refresh the list or update UI
        } catch (error) {
            Swal.fire(
                'Error!',
                'There was a problem deleting the category.',
                'error'
            );
        }
    };
    const handleRichTextChange = useCallback((value) => {
        setFormData((prev) => ({
            ...prev,
            description: value, // Update description field
        }))
    }, [])

    // Quill editor modules with syntax highlighting (only load if highlight.js is ready)
    const modules = isHighlightReady
        ? {
            syntax: {
                highlight: (text) => hljs?.highlightAuto(text).value, // Enable highlight.js in Quill
            },
            toolbar: {
                container: "#toolbar-container", // Custom toolbar container
            },
        }
        : {
            toolbar: {
                container: "#toolbar-container", // Custom toolbar container
            },
        };

    const formats = [
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "color",
        "background",
        "script",
        "header",
        "blockquote",
        "code-block",
        "list",
        "indent",
        "direction",
        "align",
        "link",
        "image",
        "video",
        "formula",
    ];

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
                <div></div>
                <div>
                    <button
                        type="button"
                        className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-right gap-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalEdit"
                        onClick={() => setFormData({
                            name: "",
                            designation: "",
                            description: "",
                            Image: null,
                            slug: "",
                        })}
                    >
                        {/* <Icon
                            icon="ic:baseline-plus"
                            className="icon text-xl line-height-1"
                        /> */}
                        Add Management Team
                    </button>
                </div>
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Designation</th>
                                <th scope="col">Slug</th>
                                {/* <th scope="col">Experience</th> */}
                                {/* <th scope="col">Expertise</th>*/}
                                <th scope="col">Image</th>
                                <th scope="col">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((category, index) => (
                                <tr key={category.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-10">

                                            {index + 1}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {category.name}
                                        </span>
                                    </td>
                                    {/* <td className="text-center">
                                        <span className={`${category.categoryStatus === 'Active'
                                            ? 'bg-success-focus text-success-600 border border-success-border'
                                            : 'bg-danger-focus text-danger-600 border border-danger-main'} 
                    px-24 py-4 radius-4 fw-medium text-sm`}>
                                            {category.categoryStatus.charAt(0).toUpperCase() + category.categoryStatus.slice(1)}
                                        </span>
                                    </td> */}
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {category.designation}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {category.slug}
                                        </span>
                                    </td>
                                    <td>
                                        {/* - */}
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {category.image ? (
                                                <img
                                                    src={IMAGE_URL + category.image}
                                                    alt="Category"
                                                    className="img-thumbnail"
                                                    style={{ width: '50px', height: '50px' }}
                                                />
                                            ) : 'No Image'}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="d-flex align-items-center gap-10 justify-content-center">
                                            {/* <button
                                                    type="button"
                                                    className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                >
                                                    <Icon
                                                        icon="majesticons:eye-line"
                                                        className="icon text-xl"
                                                    />
                                                </button> */}
                                            <button
                                                type="button"
                                                className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModalEdit"
                                                onClick={() => handleEditClick(category)}
                                            >
                                                <Icon icon="lucide:edit" className="menu-icon" />
                                            </button>
                                            <button
                                                type="button"
                                                className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                onClick={() => handleDelete(category)}
                                            >
                                                <Icon
                                                    icon="fluent:delete-24-regular"
                                                    className="menu-icon"
                                                />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                        <span>
                            Showing {startIndex + 1} to {Math.min(endIndex, facilitatorsData.length)} of {facilitatorsData.length} entries
                        </span>
                        <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                            {/* Previous Page Button */}
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <Link
                                    className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                    to="#"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    <Icon icon="ep:d-arrow-left" />
                                </Link>
                            </li>

                            {/* Page Numbers */}
                            {[...Array(totalPages)].map((_, i) => (
                                <li key={i} className="page-item">
                                    <Link
                                        className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${currentPage === i + 1 ? "bg-primary-600 text-white" : "bg-neutral-200 text-secondary-light"
                                            }`}
                                        to="#"
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </Link>
                                </li>
                            ))}

                            {/* Next Page Button */}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <Link
                                    className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                    to="#"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    <Icon icon="ep:d-arrow-right" />
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
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
                                {isEditMode ? 'Edit Management team' : 'Add Management team'}
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
                                        <label className="form-label"> Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={formData.name || ""}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <span className="text-danger">{errors.name}</span>}

                                    </div>

                                    {/* Designation */}
                                    <div className="col-12">
                                        <label className="form-label">Designation</label>
                                        <input
                                            type="text"
                                            name="designation"
                                            className="form-control"
                                            value={formData.designation || ""}
                                            onChange={handleChange}
                                        />
                                        {errors.designation && <span className="text-danger">{errors.designation}</span>}

                                    </div>
                                    <div className='col-sm-12'>
                                        <div>
                                            <label className='form-label text-neutral-900'>
                                                Description
                                            </label>
                                            <div className='border border-neutral-200 radius-8 overflow-hidden'>
                                                <div className='height-200'>
                                                    {/* Toolbar */}
                                                    <div id='toolbar-container'>
                                                        <span className='ql-formats'>
                                                            <select className='ql-font'></select>
                                                            <select className='ql-size'></select>
                                                        </span>
                                                        <span className='ql-formats'>
                                                            <button className='ql-bold'></button>
                                                            <button className='ql-italic'></button>
                                                            <button className='ql-underline'></button>
                                                            <button className='ql-strike'></button>
                                                        </span>
                                                        <span className='ql-formats'>
                                                            <select className='ql-color'></select>
                                                            <select className='ql-background'></select>
                                                        </span>
                                                        <span className='ql-formats'>
                                                            <button className='ql-script' value='sub'></button>
                                                            <button className='ql-script' value='super'></button>
                                                        </span>
                                                        <span className='ql-formats'>
                                                            <button className='ql-header' value='1'></button>
                                                            <button className='ql-header' value='2'></button>
                                                            <button className='ql-blockquote'></button>
                                                            <button className='ql-code-block'></button>
                                                        </span>
                                                        <span className='ql-formats'>
                                                            <button className='ql-list' value='ordered'></button>
                                                            <button className='ql-list' value='bullet'></button>
                                                            <button className='ql-indent' value='-1'></button>
                                                            <button className='ql-indent' value='+1'></button>
                                                        </span>
                                                        <span className='ql-formats'>
                                                            <button className='ql-direction' value='rtl'></button>
                                                            <select className='ql-align'></select>
                                                        </span>
                                                        <span className='ql-formats'>
                                                            <button className='ql-link'></button>
                                                            <button className='ql-image'></button>
                                                            <button className='ql-video'></button>
                                                            <button className='ql-formula'></button>
                                                        </span>
                                                        <span className='ql-formats'>
                                                            <button className='ql-clean'></button>
                                                        </span>
                                                    </div>

                                                    {/* Editor */}
                                                    <ReactQuill
                                                        ref={quillRef}
                                                        theme='snow'
                                                        value={formData.description}
                                                        onChange={handleRichTextChange}
                                                        modules={modules}
                                                        formats={formats}
                                                        placeholder='Enter description...'
                                                    />
                                                    {/* {errors.description && <div className="text-danger">{errors.description}</div>} */}

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="col-12">
                                        <label className="form-label">Image</label>
                                        <input
                                            className="form-control form-control-sm"
                                            name="Image"
                                            type="file"
                                            accept="image/png, image/jpeg"
                                            onChange={handleFileChange}
                                            style={{ height: "52px" }}
                                        />
                                        {isEditMode && formData.Image && (
                                            <img
                                                src={IMAGE_URL + formData.Image}
                                                alt="Facilitator"
                                                className="img-thumbnail mt-2"
                                                style={{ width: '50px', height: '50px' }}
                                            />
                                        )}
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Slug</label>
                                        <input
                                            type="text"
                                            name="slug"
                                            className="form-control"
                                            value={formData.slug}
                                            readOnly
                                        />
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary text-sm">
                                            {isEditMode ? 'Update' : 'Submit'}
                                        </button>
                                    </div>
                                </div>
                            </form>


                        </div>
                    </div>
                </div>
            </div>
            {/* add category model */}
            <ToastContainer />

        </div>

    );
};

export default ManagementPageLayer;
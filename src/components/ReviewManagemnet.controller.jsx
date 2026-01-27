import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import { IMAGE_URL } from '../../src/network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
const ItemsPerPage = 10; // Number of items per page

const ReviewPageLayer = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewDatas, setReviewDatas] = useState([]);

    const fetchData = async () => {
        try {
            const reviewResult = await apiProvider.getReview();
            console.log(reviewResult, "reviewResult");
            if (reviewResult) {
                setReviewDatas(reviewResult.response.data.data);
            }
        } catch (error) {
            console.error("Error fetching reviewResult data:", error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount



    // Calculate total pages
    const totalPages = Math.ceil(reviewDatas.length / ItemsPerPage);

    // Get the current page's data
    const startIndex = (currentPage - 1) * ItemsPerPage;
    const endIndex = startIndex + ItemsPerPage;
    const currentData = reviewDatas.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        const input = new FormData();
        input.append("id", id);
        input.append("status", newStatus);

        // console.log(...input, "input");

        try {
            let response = await apiProvider.reviewUpdate(input);

            console.log(response, "response-review");

            if (response) {
                toast(response.response.data.message)

                // Refresh data
                // fetchCategories();
                fetchData();


                // Reset edit mode
                setIsEditMode(false);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            // You might want to add error handling here (show toast, etc.)
        }
    };
    // console.log(formData,"ffff");

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
                <div></div>
                {/* <div>
                    <button
                        type="button"
                        className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-right gap-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModalEdit"
                        onClick={() => setFormData({
                            facilitatorName: "",
                            designation: "",
                            background: "",
                            experience: "",
                            expertises: [], // ✅ Ensure this is an array
                            certificates: [],
                            Image: null,
                            slug: "",
                        })}
                    >
                        <Icon
                            icon="ic:baseline-plus"
                            className="icon text-xl line-height-1"
                        />
                        Add Facilitator
                    </button>
                </div> */}
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Name</th>
                                <th scope="col">Course Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Feedback</th>
                                <th scope="col">Rating</th>
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
                                            {category.courseName}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {category.email}
                                        </span>
                                    </td>
                                   
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {category.feedback}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {category.rating}
                                        </span>
                                    </td>
                                    <td className="text-center">
                                        <div className="text-center">
                                            <button
                                                className="btn px-18 py-11 text-primary-light"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                            >
                                                <Icon icon="entypo:dots-three-vertical" className="menu-icon" />
                                            </button>
                                            <ul className="dropdown-menu">
                                                {["Active", "Inactive"].map(status => (
                                                    <li key={status}>
                                                        <Link
                                                            className={`dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900 
                                                                                                                                  ${category.status === status ? "bg-primary-600 text-white" : ""}`}
                                                            to="#"
                                                            onClick={() => handleStatusChange(category.id, status)}
                                                        >
                                                            {status}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
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
                            Showing {startIndex + 1} to {Math.min(endIndex, currentData.length)} of {currentData.length} entries
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
            {/* add category model */}
            <ToastContainer />

        </div>

    );
};

export default ReviewPageLayer;
// import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import hljs from "highlight.js";
import ReactQuill from "react-quill-new";
import { Link, NavLink, useNavigate } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import Swal from 'sweetalert2';
// import { useSelector } from 'react-redux';
// import { handleForm } from "../redux/courseForm"

// const formisStatus = useSelector((state) => {
//   return state.ResourceAllocationFromHandle
// })


const ItemsPerPage = 10; // Number of items per page

// import { Link } from 'react-router-dom';

const CourseListPageLayer = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [courseData, setCourseData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const navigate = useNavigate();


    const fetchData = async () => {
        try {
            const result = await apiProvider.getCourse();
            console.log(result, "result-course");
            if (result) {
                setCourseData(result.response.data.data);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };

    const handleEditClick = (item) => {
        setIsEditMode(true)
        navigate(`/course-add`,
            { state: { editDatas: item } } // Pass the totalAmount as part of the state
        );
        // setSelectedItem(item);
        // console.log(item, "item");

        // setCurriculamForm({ name: item.tittle, serial: item.serial, id: item.id });
    };

     const handleDelete = async (course) => {
            console.log(course, "ccccccccc");
    
            Swal.fire({
                title: 'Are you sure?',
                text: `You are about to delete "${course.courseName}"`,
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
                    const result = await apiProvider.deletCourse(course.id);
                    console.log(result, "rrrrrrrrrrrr");
                    if (result) {
                        deleteCategory(course.id);
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
                    'Category has been deleted.',
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


    useEffect(() => {
        fetchData();
    }, []);

    // Calculate total pages
    const totalPages = Math.ceil(courseData.length / ItemsPerPage);
    console.log(totalPages, "ttpage");


    // Get the current page's data
    const startIndex = (currentPage - 1) * ItemsPerPage;
    const endIndex = startIndex + ItemsPerPage;
    const currentData = courseData.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };


    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-end">
                <div></div>
                <div>
                    <NavLink to='/course-add' >
                        <button
                            type="button"
                            className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-right gap-2"
                        >
                            {/* <Icon
                                icon="ic:baseline-plus"
                                className="icon text-xl line-height-1"
                            /> */}
                            Add Course
                        </button>

                    </NavLink>

                </div>
            </div>

            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Category Type</th>
                                <th scope="col">Category Name</th>
                                <th scope="col">Course Name</th>
                                <th scope="col">Instructor Name</th>
                                <th scope="col">Language</th>
                                <th scope="col">Price</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.length > 0 ? (
                                currentData.map((course, index) => (
                                    <tr key={course.id || index}>
                                        <td>
                                            <div className="d-flex align-items-center gap-10">
                                                <div className="form-check style-check d-flex align-items-center"></div>
                                                {index + 1}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                {course.categoryType || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                {course.categoryName || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                {course.courseName || "N/A"}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="px-24 py-4 radius-4 fw-medium text-sm">
                                                {course.instructorName || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                {course.lang || "N/A"}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="text-md mb-0 fw-normal text-secondary-light">
                                                ₹{course.price || "0"}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <div className="d-flex align-items-center gap-10 justify-content-center">
                                                {/* <button
                                                    type="button"
                                                    className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                >
                                                    <Icon icon="majesticons:eye-line" className="icon text-xl" />
                                                </button> */}
                                                <button
                                                    type="button"
                                                    className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => handleEditClick(course)}

                                                >
                                                    <Icon icon="lucide:edit" className="menu-icon" />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                                    onClick={() => handleDelete(course)}
                                               >
                                                    <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center text-muted">
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                        <span>
                            Showing {startIndex + 1} to {Math.min(endIndex, courseData.length)} of {courseData.length} entries
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
        </div>


    )
}

export default CourseListPageLayer
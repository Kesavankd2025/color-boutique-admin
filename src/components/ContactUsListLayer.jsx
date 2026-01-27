import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
const ItemsPerPage = 10; // Number of items per page

const ContactUsListLayer = () => {
    const [userData, setUserData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = async () => {

        try {
            const result = await apiProvider.gerContactUs();
            console.log(result, "result");
            if (result) {
                setUserData(result.response.data.data);
            }

        } catch (error) {
            console.error("Error fetching category data:", error);
        }
    };


    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    // Calculate total pages
    const totalPages = Math.ceil(userData.length / ItemsPerPage);

    // Get the current page's data
    const startIndex = (currentPage - 1) * ItemsPerPage;
    const endIndex = startIndex + ItemsPerPage;
    const currentData = userData.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="card h-100 p-0 radius-12">
            {/* <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                <div className="d-flex align-items-center flex-wrap gap-3">
                    <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
                    <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" defaultValue="Select Number">
                        <option value="Select Number" disabled>
                            Select Number
                        </option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                    <form className="navbar-search">
                        <input
                            type="text"
                            className="bg-base h-40-px w-auto"
                            name="search"
                            placeholder="Search"
                        />
                        <Icon icon="ion:search-outline" className="icon" />
                    </form>
                    <select className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px" defaultValue="Select Status">
                        <option value="Select Status" disabled>
                            Select Status
                        </option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
                <Link
                    to="/add-user"
                    className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
                >
                    <Icon
                        icon="ic:baseline-plus"
                        className="icon text-xl line-height-1"
                    />
                    Add New User
                </Link>
            </div> */}
            <div className="card-body p-24">
                <div className="table-responsive scroll-sm">
                    <table className="table bordered-table sm-table mb-0">
                        <thead>
                            <tr>
                                <th scope="col">
                                    <div className="d-flex align-items-center gap-10">
                                        S.No
                                    </div>
                                </th>
                                {/* <th scope="col">Id</th> */}
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Country</th>
                                <th scope="col">Phone No</th>
                                <th scope="col">Message</th>

                                {/* <th scope="col" className="text-center">
                                    Status
                                </th>
                                <th scope="col" className="text-center">
                                    Action
                                </th> */}
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((item, index) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="d-flex align-items-center gap-10">
                                            {index + 1}
                                        </div>
                                    </td>
                                    {/* <td>{item.id}</td> */}
                                    <td>
                                        <span className="text-md mb-0 fw-normal text-secondary-light">
                                            {item.fullName}
                                        </span>
                                    </td>
                                    <td>{item.email}</td>
                                    <td>{item.country}</td>
                                    <td>{item.phoneNo}</td>
                                    <td>{item.message}</td>

                                    {/* <td className="text-center">
                                        <span className={`${item.isActive
                                            ? "bg-success-focus text-success-600 border border-success-border"
                                            : "bg-neutral-200 text-neutral-600 border border-neutral-400"
                                            } px-24 py-4 radius-4 fw-medium text-sm`}>
                                            {item.isActive}
                                        </span>
                                    </td> */}
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
                                            {/* <button
                                                type="button"
                                                className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                            >
                                                <Icon icon="lucide:edit" className="menu-icon" />
                                            </button> */}
                                            {/* <button
                                                type="button"
                                                className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                            >
                                                <Icon
                                                    icon="fluent:delete-24-regular"
                                                    className="menu-icon"
                                                />
                                            </button> */}
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
        </div>

    );
};

export default ContactUsListLayer;
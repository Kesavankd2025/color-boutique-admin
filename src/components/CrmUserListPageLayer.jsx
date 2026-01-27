import { Icon } from '@iconify/react';
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/adminuserapi';
import ReactTableComponent from "../table/ReactTableComponent";
import { Download_URL } from '../network/apiClient';

const CrmListLayer = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const columns = useMemo(
        () => [
            {
                header: 'S.No',
                size: 70,
                cell: info => pageIndex * pageSize + info.row.index + 1
            },
            // {
            //     header: 'User ID',
            //     accessorKey: 'userId',
            //     cell: info => info.getValue()
            // },
            {
                header: 'Full Name',
                accessorKey: 'name',
                cell: info => info.getValue()
            },
            {
                header: 'Email Address',
                accessorKey: 'email',
                cell: info => info.getValue()
            },
            {
                header: 'Phone Number',
                accessorKey: 'phoneNumber',
                cell: info => info.getValue()
            },
            // {
            //     header: 'Status',
            //     accessorKey: 'isActive',
            //     cell: info => (
            //         <button
            //             className={`btn btn-sm ${info.getValue() ? 'btn-success' : 'btn-danger'}`}
            //         >
            //             {info.getValue() ? 'Active' : 'Inactive'}
            //         </button>
            //     )
            // },
            // {
            //     header: 'Actions',
            //     cell: info => {
            //         const user = info.row.original;
            //         return (
            //             <div className="dropdown">
            //                 <button
            //                     className="btn btn-light dropdown-toggle"
            //                     type="button"
            //                     data-bs-toggle="dropdown"
            //                 >
            //                     <Icon icon="mdi:dots-horizontal" />
            //                 </button>
            //                 <ul className="dropdown-menu shadow rounded-2 p-2">
            //                     <li>
            //                         <button
            //                             className="dropdown-item px-3 py-2 text-sm text-start"
            //                             onClick={() => setSelectedUser(user)}
            //                         >
            //                             View
            //                         </button>
            //                     </li>
            //                     <li>
            //                         <Link
            //                             className="dropdown-item px-3 py-2 text-sm text-start"
            //                             to="/create-user"
            //                             state={{ editUser: user }}
            //                         >
            //                             Edit
            //                         </Link>
            //                     </li>
            //                     <li>
            //                         <button
            //                             className="dropdown-item px-3 py-2 text-sm text-danger text-start"
            //                             onClick={() => handleDeleteUser(user)}
            //                         >
            //                             Delete
            //                         </button>
            //                     </li>
            //                 </ul>
            //             </div>
            //         );
            //     }
            // }
        ],
        [pageIndex, pageSize]
    );

    const fetchData = async () => {
        try {
            const input = {
                role: 'CRM',
                page: pageIndex,
                limit: pageSize,
                search: search.trim()
            };

            const result = await apiProvider.getUserList(input);
            if (result && result.status) {
                const items = result.response?.data || [];
                setUsers(items);
                setTotalPages(result.response?.totalPages || 1);
                setTotal(result.response?.total || 0);
            } else if (result && result.response?.message === "Invalid token") {
                console.warn("Token invalid. Redirecting to login...");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };
    const handleExport = async (format) => {

        try {
            const input = {
                format: "excel",
                role: 'CRM',
            };


            const response = await apiProvider.getUserList(input);

            if (response && response.status) {
                const data =
                    response?.response?.data?.data ||
                    response?.response?.data;

                const downloadUrl = data?.downloadUrl;
                const filename = data?.filename;
                // const downloadUrl = response?.response?.data.downloadUrl;
                // const filename = response?.response?.data.filename;

                const link = document.createElement('a');
                link.href = Download_URL + downloadUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // toast.success(`Report exported successfully as ${format.toUpperCase()}`);
            } else {
                // toast.error('Failed to export report');
            }
        } catch (error) {
            console.error('Error exporting report:', error);
            // toast.error('Failed to export report');
        } finally {
        }
    };
    const handleDeleteUser = async (user) => {
        try {
            const updatedUser = {
                ...user,
                isDelete: true,
                password: user.password || "dummy-password",
            };

            const response = await apiProvider.deleteUser(user._id, updatedUser);
            if (response && response.status === 200) {
                fetchData();
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setPageIndex(0);
    };

    const handleNextPage = () => {
        if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (pageIndex > 0) setPageIndex(prev => prev - 1);
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, search]);

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xxl-12">
                        <div className="card h-100 p-0 radius-12">
                            <h5 className="card-t my-3 mx-3">CRM User List</h5>
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
                                    <div className="search-icon" style={{ position: "absolute", right: "10px", top: "8px" }}>
                                        <Icon
                                            icon="ic:baseline-search"
                                            className="icon text-xl line-height-1"

                                        />
                                    </div>
                                </div>
                                {/* <div className="d-flex"> */}
                                {/* <button
                                    className="btn btn-success me-2"

                                    onClick={() => handleExport("excel")}
                                >
                                    Export Excel
                                </button> */}
                            </div>

                            <div className="card-body p-24">
                                <div className="table-responsive scroll-sm">
                                    <ReactTableComponent
                                        data={users}
                                        columns={columns}
                                        pageIndex={pageIndex}
                                        totalPages={totalPages}
                                        onNextPage={handleNextPage}
                                        onPreviousPage={handlePreviousPage}
                                        pageSize={pageSize}
                                        setPageSize={setPageSize}
                                        totalRecords={total}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View User Modal */}
            {selectedUser && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">User Details</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="card-body">
                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">User ID:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">{selectedUser.userId || 'N/A'}</span>
                                        </div>
                                    </div>

                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Full Name:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">{selectedUser.name}</span>
                                        </div>
                                    </div>

                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Email Address:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">{selectedUser.email}</span>
                                        </div>
                                    </div>

                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">PhoneNumber:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">{selectedUser.phoneNumber}</span>
                                        </div>
                                    </div>

                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Role:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">{selectedUser.role}</span>
                                        </div>
                                    </div>

                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Status:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">{selectedUser.isActive ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </div>

                                    <div className="mb-3 row">
                                        <div className="col-md-6">
                                            <h5 className="font-size-14 py-2">Last Login:</h5>
                                        </div>
                                        <div className="col-md-6">
                                            <span className="fw-normal text-body">{selectedUser.lastLogin}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setSelectedUser(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CrmListLayer;
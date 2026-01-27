import { Icon } from '@iconify/react';
import { PlusCircle } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import apiProvider from '../apiProvider/adminuserapi';
import ReactTableComponent from '../table/ReactTableComponent';

const SalesmanList = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(10)
    const [wholesalers, setWholesalers] = useState([])
    const [totalpages, setTotalPage] = useState(0)
    const [filters, setFilters] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: '',
        confirmPassword: '',
        status: ''
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const input = {
                role: 'Salesman',
                page: page,
                limit: limit,
                filters: {},
                sortBy: '',
                sortOrder: '',
            }
            const result = await apiProvider.getUserList(input);
            console.log("Fetched Category Response:", result.response);

            if (result && result.status) {
                const items = result.response?.data || [];
                setUsers(items);
                setTotalPage(result.response?.totalPages);
                console.log('setusers :', items)
            } else {
                if (result && result.response?.message === "Invalid token") {
                    console.warn("Token invalid. Redirecting to login...");
                    // localStorage.removeItem("authToken");
                    // window.location.href = "/login";
                    return;
                }

                console.error("Failed to fetch categories. Result is invalid or missing expected response:", result);
            }
        } catch (error) {
            console.error("Error fetching category data:", error);

            if (error.response) {
                console.error("API Error Response Status:", error.response.status);
                console.error("API Error Response Data:", error.response.data);
            }
        }
    };

    const handleDeleteUser = async (user) => {
        try {
            const updatedUser = {
                ...user,
                isDelete: true,
                password: user.password || "dummy-password",
            };

            console.log("updatedUser:", updatedUser);

            const response = await apiProvider.deleteUser(user._id, updatedUser);
            console.log("response:", response);

            if (response && response.status === 200) {
                toast.success("User marked as deleted successfully");
                fetchData();
                // Optionally refresh user list or update UI
            } else {
                toast.error("Failed to mark user as deleted");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Error occurred while marking user as deleted");
        }
    };

    const columns = useMemo(
        () => [
            {
                id: 'sno',
                header: 'S.No',
                cell: info => `${(page * limit) + info.row.index + 1}.`,
            },
            {
                id: 'userId',
                header: 'User ID',
                accessorKey: 'userId',
                cell: info => info.getValue(),
            },
            {
                id: 'fullName',
                header: 'Full Name',
                accessorKey: 'name',
                cell: info => info.getValue(),
            },
            {
                id: 'email',
                header: 'Email Address',
                accessorKey: 'email',
                cell: info => info.getValue(),
            },
            {
                id: 'phoneNumber',
                header: 'Phone Number',
                accessorKey: 'phoneNumber',
                cell: info => info.getValue(),
            },
            {
                id: 'status',
                header: 'Status',
                accessorKey: 'isActive',
                cell: info => {
                    const isActive = info.getValue() === true || info.getValue() === 'true';
                    return (
                        <button
                            className={`btn btn-sm ${isActive ? 'btn-success' : 'btn-danger'}`}
                        >
                            {isActive ? 'Active' : 'Inactive'}
                        </button>
                    );
                },
            },
            // Uncomment if you need these columns
            // {
            //   id: 'role',
            //   header: 'Role',
            //   accessorKey: 'role',
            //   cell: info => info.getValue(),
            // },
            // {
            //   id: 'lastLogin',
            //   header: 'Last Login',
            //   accessorKey: 'lastLogin',
            //   cell: info => info.getValue(),
            // },
            // {
            //   id: 'actions',
            //   header: 'Actions',
            //   cell: info => (
            //     <div className="dropdown">
            //       <button
            //         className="btn btn-light dropdown-toggle"
            //         type="button"
            //         data-bs-toggle="dropdown"
            //       >
            //         <Icon icon="mdi:dots-horizontal" />
            //       </button>
            //       <ul className="dropdown-menu shadow rounded-2 p-2">
            //         <li>
            //           <button
            //             className="dropdown-item px-3 py-2 text-sm text-start"
            //             onClick={() => setSelectedUser(info.row.original)}
            //           >
            //             View
            //           </button>
            //         </li>
            //         <li>
            //           <Link
            //             className="dropdown-item px-3 py-2 text-sm text-start"
            //             to="/create-user"
            //             state={{ editUser: info.row.original }}
            //           >
            //             Edit
            //           </Link>
            //         </li>
            //         <li>
            //           <button
            //             className="dropdown-item px-3 py-2 text-sm text-danger text-start"
            //             onClick={() => handleDeleteUser(info.row.original)}
            //           >
            //             Delete
            //           </button>
            //         </li>
            //       </ul>
            //     </div>
            //   ),
            // },
        ],
        []
    );
    const handleNextPage = () => {
        if (page + 1 < totalpages) setPage(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (page > 0) setPage(prev => prev - 1);
    };
    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xxl-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center mb-3">
                                    <h5 className="card-title me-2">Sales Man List</h5>
                                </div>

                                <div className="table-responsive" style={{ maxHeight: 332, overflowY: 'auto' }}>
                                    <ReactTableComponent
                                        data={users}
                                        columns={columns}
                                        pageIndex={page}          // should be a number like 0, 1, 2...
                                        totalPages={totalpages}        // should be a number like 5, 10, etc.
                                        onNextPage={handleNextPage}
                                        onPreviousPage={handlePreviousPage}
                                    // filters={filters}
                                    // setFilters={setFilters}
                                    // sorting={sorting}
                                    // setSorting={setSorting} 
                                    />
                                </div>

                                {/* Toast Container */}
                                <ToastContainer />

                                {/* View User Modal */}
                                {selectedUser && (
                                    <div
                                        className="modal fade show"
                                        id="addInvoiceModal"
                                        tabIndex="-1"
                                        aria-labelledby="addInvoiceModalLabel"
                                        aria-modal="true"
                                        role="dialog"
                                        style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
                                    >
                                        <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="addInvoiceModalLabel">User Details</h5>
                                                    <button type="button" className="btn-close" onClick={() => setSelectedUser(null)} aria-label="Close"></button>
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
                                                                <h5 className="font-size-14 py-2">PhoneNumber :</h5>
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

                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-secondary waves-effect" onClick={() => setSelectedUser(null)}>Close</button>
                                                        {/* <button type="button" className="btn btn-primary waves-effect waves-light">Save changes</button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesmanList;


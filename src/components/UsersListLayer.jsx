import { Icon } from '@iconify/react';
import { PlusCircle } from '@phosphor-icons/react';
import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import apiProvider from '../apiProvider/adminuserapi';
import ReactTableComponent from "../table/ReactTableComponent";
import { useNavigate } from 'react-router-dom';
const UsersListLayer = () => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();
    const [total, setTotal] = useState(0);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: '',
        confirmPassword: '',
        status: ''
    });

    const columns = useMemo(
        () => [
            {
                header: 'S.No',
                size: 70,
                cell: info => pageIndex * pageSize + info.row.index + 1
            },
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
            {
                header: 'Role',
                accessorKey: 'role.roleName',
                cell: info => info.getValue()
            },
            {
                header: 'Status',
                accessorKey: 'isActive',
                cell: info => (
                    <span
                        className={`${info.getValue()
                            ? 'bg-success-focus text-success-600 border border-success-border'
                            : 'bg-danger-focus text-danger-600 border border-danger-main'
                            } px-24 py-4 radius-4 fw-medium text-sm`}
                    >
                        {info.getValue() ? 'Active' : 'Inactive'}
                    </span>
                )
            },
            {
                header: 'Actions',
                cell: info => {
                    
                    const user = info.row.original;
                    return (
                        <div className="d-flex justify-content-start gap-2">
                            <button
                                type="button"
                                className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                onClick={() => navigate("/create-user", { state: { editUser: user } })}
                            >
                                <Icon icon="lucide:edit" className="menu-icon" />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            >
                                <Icon icon="fluent:delete-24-regular" className="menu-icon" />
                            </button>
                        </div>
                    );
                },
            }
        ],
        [pageIndex, pageSize]
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.email.includes('@')) newErrors.email = 'Valid Email required';
        if (!formData.phoneNumber.match(/^\+?[0-9]{10,15}$/)) newErrors.phoneNumber = 'Phone Number required';
        if (!formData.role) newErrors.role = 'Role is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.status) newErrors.status = 'Status is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            const input = new FormData();
            input.append("name", formData.fullName);
            input.append("email", formData.email);
            input.append("phoneNumber", formData.phoneNumber);
            input.append("role", formData.role);
            input.append("password", formData.password);
            input.append("status", formData.status);

            const createUserResponse = await apiProvider.createUser(input);
            const result = typeof createUserResponse.json === 'function'
                ? await createUserResponse.json()
                : createUserResponse;

            console.log('API Response:', result);
            toast.success('User created successfully!');
            setShowCreateModal(false);
            fetchData();
        } catch (error) {
            console.error('Error while saving user:', error);
            toast.error('Something went wrong while saving user.');
        }
    };

    const fetchData = async () => {
        try {
            const input = {
                page: pageIndex,
                limit: pageSize,
                search: search.trim()
            };

            const result = await apiProvider.getUserListForList(input);

            if (result && result.status) {
                const items = result.response?.data || [];
                setUsers(items);
                setTotalPages(result.response?.totalPages || 1);
                setTotal(result.response?.total || 0);
            } else if (result && result.response?.message === "Invalid token") {
                console.warn("Token invalid. Redirecting to login...");
                // Handle token expiration
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, search]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        setPageIndex(0);
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
                toast.success("User marked as deleted successfully");
                fetchData();
            } else {
                toast.error("Failed to mark user as deleted");
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Error occurred while marking user as deleted");
        }
    };

    const handleNextPage = () => {
        if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (pageIndex > 0) setPageIndex(prev => prev - 1);
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xxl-12">
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
                                    <div className="search-icon" style={{ position: "absolute", right: "10px", top: "8px" }}>
                                        <Icon
                                            icon="ic:baseline-search"
                                            className="icon text-xl line-height-1"

                                        />
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-success d-inline-flex justify-content-center align-items-center"
                                        onClick={() => window.location.href = "/create-user"}
                                    >
                                        <PlusCircle size={18} weight="fill" className="me-2" />
                                        Create User
                                    </button>
                                </div>
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

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create User</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <form>
                                    <div className="row">
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label">Full Name</label>
                                            <input type="text" className="form-control" name='fullName' value={formData.fullName} onChange={handleChange} />
                                            {errors.fullName && <div className='text-danger'>{errors.fullName}</div>}
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label">Email Address</label>
                                            <input type="email" className="form-control" name='email' value={formData.email} onChange={handleChange} />
                                            {errors.email && <div className='text-danger'>{errors.email}</div>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label">PhoneNumber</label>
                                            <input type="tel" className="form-control" name='phoneNumber' value={formData.phoneNumber} onChange={handleChange} />
                                            {errors.phoneNumber && <div className='text-danger'>{errors.phoneNumber}</div>}
                                        </div>
                                        <div className="col-lg-6 mb-3">
                                            <label className="form-label">Role</label>
                                            <select
                                                className="form-select"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                            >
                                                <option value="" disabled>Select option</option>
                                                <option value="Super Admin">Super Admin</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Purchase">Purchase</option>
                                                <option value="Accounts">Accounts</option>
                                                <option value="Warehouse">Warehouse</option>
                                                <option value="Salesman">Sales</option>
                                                <option value="Delivery">Delivery</option>
                                                <option value="Packing">Packing</option>
                                            </select>
                                            {errors.role && <div className="invalid-feedback d-block">{errors.role}</div>}
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-4 mb-3">
                                            <label className="form-label">Password</label>
                                            <input type="password" className="form-control" name='password' value={formData.password} onChange={handleChange} />
                                            {errors.password && <div className='text-danger'>{errors.password}</div>}
                                        </div>
                                        <div className="col-lg-4 mb-3">
                                            <label className="form-label">Confirm Password</label>
                                            <input type="password" className="form-control" name='confirmPassword' value={formData.confirmPassword} onChange={handleChange} />
                                            {errors.confirmPassword && <div className='text-danger'>{errors.confirmPassword}</div>}
                                        </div>
                                        <div className="col-lg-4 mb-3">
                                            <label className="form-label">Status</label>
                                            <select className="form-select" name='status' value={formData.status} onChange={handleChange}>
                                                <option value='Select Status'>Select Status</option>
                                                <option value='Active'>Active</option>
                                                <option value='Inactive'>Inactive</option>
                                                <option value='Suspended'>Suspended</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-success" onClick={handleSave}>
                                    Save
                                </button>
                                <button type="button" className="btn btn-danger" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersListLayer;
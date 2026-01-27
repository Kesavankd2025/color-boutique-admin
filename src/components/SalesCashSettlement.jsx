
import { Icon } from '@iconify/react';
import { PlusCircle } from '@phosphor-icons/react';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import apiProvider from '../apiProvider/adminuserapi';
import ReactTableComponent from '../table/ReactTableComponent';

const SalesCashSettlement = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [cashData, setcashData] = useState([])
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedPayments, setSelectedPayments] = useState([]);

    const fetchData = async () => {
        try {
            const input = {
                page: pageIndex,
                limit: pageSize,
                filters: filters
            };
            const result = await apiProvider.getCashSettlement(input);
            console.log("Fetched Category Response:", result.response);
            if (result && result.status) {
                const items = result.response?.data || [];
                setcashData(items);
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
            console.error("Error fetching brand list:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, filters]);
    const handleNextPage = () => {
        if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (pageIndex > 0) setPageIndex(prev => prev - 1);
    };
    const updateStatus = async (id, newStatus) => {
        try {
            let input = {
                id: id,
                status: newStatus
            }
            const result = await apiProvider.updateCashSettlement(input);
            console.log("Fetched Category Response:", result.response);
            if (result.status) {
                fetchData();
            }
            // Update local state
            setcashData(prevData =>
                prevData.map(item =>
                    item._id === id ? { ...item, status: newStatus } : item
                )
            );

        } catch (error) {
            console.error('Error updating status:', error);
            throw error;
        }
    };
    const handleViewClick = (rowData) => {
        console.log(rowData, "rowData")
        setSelectedPayments(rowData.paymentreceives || []);
        setViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setViewModalOpen(false);
        setSelectedPayments([]);
    };
    const columns = useMemo(
        () => [
            {
                header: 'S.No',
                cell: info => info.row.index + 1,
                size: 90
            },
            {
                header: 'Cash to be Settled',
                accessorKey: 'cashToBeSettled',
                cell: info => `₹${info.getValue()}`,
            },
            {
                header: 'Settlement Mode',
                accessorKey: 'settlementMode',
                cell: info => info.getValue(),
            },
            {
                header: 'Settlement Date',
                accessorKey: 'settlementDate',
                cell: info => new Date(info.getValue()).toLocaleDateString(),
            },
            {
                header: 'Handover Name',
                accessorKey: 'handOverName',
                cell: info => info.getValue(),
            },
            {
                header: 'Handover Email',
                accessorKey: 'handOverEmail',
                cell: info => info.getValue(),
                size: 200,
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: info => (
                    <span
                        className={`${info.getValue() === 'approved'
                            ? 'bg-success-focus text-success-600 border border-success-border'
                            : info.getValue() === 'rejected'
                                ? 'bg-danger-focus text-danger-600 border border-danger-main'
                                : 'bg-warning-focus text-warning-600 border border-warning-main'
                            } px-24 py-4 radius-4 fw-medium text-sm`}
                    >
                        {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
                    </span>
                ),
            },
            {
                header: 'Action',
                cell: info => (
                    <StatusSelect row={info.row} updateStatus={updateStatus} />
                ),
                size: 150,
            },
            {
                header: 'View',
                cell: info => (
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => handleViewClick(info.row.original)}
                    >
                        View
                    </button>
                ),
                size: 100,
            }

        ],
        [pageIndex, pageSize, filters] // No dependencies needed unless you add them
    );
    const StatusSelect = ({ row, updateStatus }) => {
        const [status, setStatus] = useState(row.original.status);

        const handleChange = async (e) => {
            const newStatus = e.target.value;
            setStatus(newStatus);
            await updateStatus(row.original._id, newStatus);
        };

        return (
            <select
                value={status}
                onChange={handleChange}
                className="form-select form-select-sm"
            >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>
        );
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-xxl-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="d-flex flex-wrap align-items-center mb-3">
                                    <h5 className="card-title me-2">Cash Settlement List</h5>
                                </div>
                                <div className="table-responsive" style={{ maxHeight: 332, overflowY: 'auto' }}>
                                    <ReactTableComponent
                                        data={cashData}
                                        columns={columns}
                                        // filterableColumns={attributeFilter}
                                        pageIndex={pageIndex}
                                        totalPages={totalPages}
                                        onNextPage={handleNextPage}
                                        onPreviousPage={handlePreviousPage}
                                        filters={filters}
                                        setFilters={setFilters}
                                    />
                                </div>
                                {/* Toast Container */}
                                <ToastContainer />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {viewModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1050
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            borderRadius: '8px',
                            width: '90%',
                            maxWidth: '800px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            padding: '20px',
                            position: 'relative',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}
                        >
                            <h4 style={{ margin: 0 }}>Payment Receives</h4>
                            <button
                                onClick={handleCloseModal}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#333',
                                }}
                            >
                                ×
                            </button>
                        </div>
                        <div>
                            {selectedPayments.length > 0 ? (
                                <table className="table table-bordered table-sm">
                                    <thead>
                                        <tr>
                                            <th>Order Code</th>
                                            <th>Paid Amount</th>
                                            <th>Due Amount</th>
                                            <th>Payment Method</th>
                                            <th>Payment Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPayments.map((pay, idx) => (
                                            <tr key={idx}>
                                                <td>{pay.orderCode}</td>
                                                <td>₹{pay.paidAmount}</td>
                                                <td>₹{pay.dueAmount}</td>
                                                <td>{pay.paymentMethod}</td>
                                                <td>{new Date(pay.paymentDate).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p>No payment details available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesCashSettlement;




// import { Icon } from '@iconify/react/dist/iconify.js';

// import React, { useState, useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import apiProvider from "../apiProvider/wholesalerapi";

// const WholesaleCreditManagement = () => {
//     const [selectedWholesaler, setSelectedWholesaler] = useState(null);
//     const [creditHistory, setCreditHistory] = useState([]);
//     const [newCreditLimit, setNewCreditLimit] = useState('');
//     const [adjustmentReason, setAdjustmentReason] = useState('');
//     const [page, setPage] = useState(0);
//     const [limit, setLimit] = useState(10);
//     const [wholesalerCreditData, setWholesalerCreditData] = useState([]);


//     // Mock data for wholesalers
//     const wholesalers = [
//         {
//             id: 1,
//             name: 'Durairaj A',
//             creditLimit: 90000,
//             creditUsed: 40000,
//             status: 'Blocked'
//         },
//         {
//             id: 2,
//             name: 'Ramesh K',
//             creditLimit: 85000,
//             creditUsed: 25000,
//             status: 'Active'
//         }
//     ];

//     // Mock data for credit history
//     const mockCreditData = {
//         1: [
//             {
//                 orderId: '#ORD-1001',
//                 date: '28 Feb 2025',
//                 amount: '₹ 15,000',
//                 paymentStatus: 'Paid',
//                 balance: '₹ 50,000'
//             },
//             {
//                 orderId: '#ORD-0987',
//                 date: '15 Feb 2025',
//                 amount: '₹ 25,000',
//                 paymentStatus: 'Paid',
//                 balance: '₹ 65,000'
//             },
//             {
//                 orderId: '#ORD-0954',
//                 date: '05 Feb 2025',
//                 amount: '₹ 40,000',
//                 paymentStatus: 'Credit',
//                 balance: '₹ 90,000'
//             }
//         ],
//         2: [
//             {
//                 orderId: '#ORD-0892',
//                 date: '27 Feb 2025',
//                 amount: '₹ 25,000',
//                 paymentStatus: 'Paid',
//                 balance: '₹ 60,000'
//             },
//             {
//                 orderId: '#ORD-0876',
//                 date: '20 Feb 2025',
//                 amount: '₹ 30,000',
//                 paymentStatus: 'Paid',
//                 balance: '₹ 85,000'
//             },
//             {
//                 orderId: '#ORD-0854',
//                 date: '10 Feb 2025',
//                 amount: '₹ 20,000',
//                 paymentStatus: 'Partially Paid',
//                 balance: '₹ 55,000'
//             }
//         ]
//     };

//     const handleViewCreditHistory = (wholesalerId) => {
//         setSelectedWholesaler(wholesalerId);
//         setCreditHistory(mockCreditData[wholesalerId] || []);
//     };

//     const handleAdjustCredit = (wholesalerId) => {
//         setSelectedWholesaler(wholesalerId);
//         const wholesaler = wholesalers.find(w => w.id === wholesalerId);
//         setNewCreditLimit(wholesaler.creditLimit.toString());
//     };

//     const handleCreditLimitSubmit = (e) => {
//         e.preventDefault();
//         // Here you would typically make an API call to update the credit limit
//         toast.success(`Credit limit updated to ₹ ${newCreditLimit} for ${wholesalers.find(w => w.id === selectedWholesaler).name}`);

//         // Close the modal
//         const modal = document.getElementById('creditAdjustmentModal');
//         const modalInstance = window.bootstrap.Modal.getInstance(modal);
//         modalInstance.hide();

//         // Reset form
//         setNewCreditLimit('');
//         setAdjustmentReason('');
//     };

//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-IN', {
//             style: 'currency',
//             currency: 'INR',
//             maximumFractionDigits: 0
//         }).format(amount).replace('₹', '₹ ');
//     };

//     useEffect(() => {
//         fetchData()
//     }, [page, limit])

//     const fetchData = async () => {
//         let input = {
//             page,
//             limit,
//             type: "Wholesaler"
//         }
//         const result = await apiProvider.getWholesalerCredit(input)

//         console.log(result, "resultt");
//         if (result && result.status) {
//             let resultData = result?.response?.data
//             // console.log(resultData,"reeeeeee");
//             setWholesalerCreditData(resultData)


//         }

//     }

//     return (
//         <div>
//             <ToastContainer />
//             <div className="card h-100 p-20 radius-12">
//                 <div className="card-body h-100 p-0 radius-12">
//                     <div>
//                         <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
//                             <thead>
//                                 <tr>
//                                     <th>S.No</th>
//                                     <th>Wholesaler Name</th>
//                                     <th>Credit Limit</th>
//                                     <th>Credit Used</th>
//                                     <th>Available Credit</th>
//                                     <th>Last Credit Payment Date</th>
//                                     <th>Status</th>
//                                     <th>Action</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {wholesalers.map((wholesaler, index) => (
//                                     <tr key={wholesaler.id}>
//                                         <td>{index + 1}</td>
//                                         <td>{wholesaler.name}</td>
//                                         <td>{formatCurrency(wholesaler.creditLimit)}</td>
//                                         <td>{formatCurrency(wholesaler.creditUsed)}</td>
//                                         <td>{formatCurrency(wholesaler.creditLimit - wholesaler.creditUsed)}</td>
//                                         <td>{wholesaler.id === 1 ? '28 Feb 2025' : '27 Feb 2025'}</td>
//                                         <td>
//                                             <button
//                                                 type="button"
//                                                 className={`btn btn-subtle-${wholesaler.status === 'Active' ? 'success' : 'danger'} btn-sm waves-effect waves-light`}
//                                             >
//                                                 {wholesaler.status}
//                                             </button>
//                                         </td>
//                                         <td>
//                                             <ul className="list-inline mb-0">
//                                                 <li className="list-inline-item dropdown">
//                                                     <a
//                                                         className="text-muted font-size-18 px-2"
//                                                         href="#"
//                                                         role="button"
//                                                         data-bs-toggle="dropdown"
//                                                         aria-haspopup="true"
//                                                     >
//                                                         <Icon icon="entypo:dots-three-horizontal" className="menu-icon" />
//                                                     </a>
//                                                     <div className="dropdown-menu dropdown-menu-end">
//                                                         <a
//                                                             className="dropdown-item"
//                                                             onClick={() => handleViewCreditHistory(wholesaler.id)}
//                                                             data-bs-toggle="modal"
//                                                             data-bs-target="#creditHistoryModal"
//                                                         >
//                                                             View Credit History
//                                                         </a>
//                                                         <a
//                                                             className="dropdown-item"
//                                                             onClick={() => handleAdjustCredit(wholesaler.id)}
//                                                             data-bs-toggle="modal"
//                                                             data-bs-target="#creditAdjustmentModal"
//                                                         >
//                                                             Adjust Credit Limit
//                                                         </a>
//                                                     </div>
//                                                 </li>
//                                             </ul>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>

//             {/* Credit History Modal */}
//             <div className="modal fade p-20" id="creditHistoryModal" tabIndex={-1} aria-labelledby="creditHistoryModalLabel" aria-hidden="true">
//                 <div className="modal-dialog modal-dialog modal-lg modal-dialog-centered">
//                     <div className="modal-content radius-16 bg-base p-20">
//                         <div className="modal-header">
//                             <h5 className="modal-title" id="creditHistoryModalLabel">
//                                 {selectedWholesaler && wholesalers.find(w => w.id === selectedWholesaler).name} - Credit History
//                             </h5>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <div className="modal-body p-4">
//                             <div className="mb-4">
//                                 <div className="row">
//                                     <div className="col-md-4">
//                                         <h6 className="font-size-14">Credit Limit:</h6>
//                                         <p className="fw-bold">
//                                             {selectedWholesaler && formatCurrency(wholesalers.find(w => w.id === selectedWholesaler).creditLimit)}
//                                         </p>
//                                     </div>
//                                     <div className="col-md-4">
//                                         <h6 className="font-size-14">Credit Used:</h6>
//                                         <p className="fw-bold">
//                                             {selectedWholesaler && formatCurrency(wholesalers.find(w => w.id === selectedWholesaler).creditUsed)}
//                                         </p>
//                                     </div>
//                                     <div className="col-md-4">
//                                         <h6 className="font-size-14">Available Credit:</h6>
//                                         <p className="fw-bold">
//                                             {selectedWholesaler && formatCurrency(
//                                                 wholesalers.find(w => w.id === selectedWholesaler).creditLimit -
//                                                 wholesalers.find(w => w.id === selectedWholesaler).creditUsed
//                                             )}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="table-responsive">
//                                 <table className="table table-striped table-bordered">
//                                     <thead>
//                                         <tr>
//                                             <th>Order ID</th>
//                                             <th>Date</th>
//                                             <th>Amount</th>
//                                             <th>Payment Status</th>
//                                             <th>Balance</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {creditHistory.map((item, index) => (
//                                             <tr key={index}>
//                                                 <td>{item.orderId}</td>
//                                                 <td>{item.date}</td>
//                                                 <td>{item.amount}</td>
//                                                 <td>
//                                                     {item.paymentStatus === 'Paid' && (
//                                                         <span className="badge bg-success">Paid</span>
//                                                     )}
//                                                     {item.paymentStatus === 'Credit' && (
//                                                         <span className="badge bg-warning">Credit</span>
//                                                     )}
//                                                     {item.paymentStatus === 'Partially Paid' && (
//                                                         <span className="badge bg-info">Partially Paid</span>
//                                                     )}
//                                                 </td>
//                                                 <td>{item.balance}</td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-secondary waves-effect" data-bs-dismiss="modal">Close</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Credit Adjustment Modal */}
//             <div className="modal fade" id="creditAdjustmentModal" tabIndex={-1} aria-labelledby="creditAdjustmentModalLabel" aria-hidden="true">
//                 <div className="modal-dialog modal-dialog-centered">
//                     <div className="modal-content radius-16 bg-base">
//                         <div className="modal-header py-16 px-24 border border-top-0 border-start-0 border-end-0">
//                             <h5 className="modal-title" id="creditAdjustmentModalLabel">
//                                 Adjust Credit Limit
//                             </h5>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//                         </div>
//                         <form onSubmit={handleCreditLimitSubmit}>
//                             <div className="modal-body p-20">
//                                 {selectedWholesaler && (
//                                     <>
//                                         <div className="mb-3">
//                                             <label className="form-label">Wholesaler</label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control"
//                                                 value={wholesalers.find(w => w.id === selectedWholesaler).name}
//                                                 readOnly
//                                             />
//                                         </div>

//                                         <div className="row">
//                                             <div className="col-md-6">
//                                                 <div className="mb-3">
//                                                     <label className="form-label">Current Credit Limit</label>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         value={formatCurrency(wholesalers.find(w => w.id === selectedWholesaler).creditLimit)}
//                                                         readOnly
//                                                     />
//                                                 </div>
//                                             </div>
//                                             <div className="col-md-6">
//                                                 <div className="mb-3">
//                                                     <label className="form-label">Credit Used</label>
//                                                     <input
//                                                         type="text"
//                                                         className="form-control"
//                                                         value={formatCurrency(wholesalers.find(w => w.id === selectedWholesaler).creditUsed)}
//                                                         readOnly
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         <div className="mb-3">
//                                             <label htmlFor="newCreditLimit" className="form-label">New Credit Limit (₹)</label>
//                                             <input
//                                                 type="number"
//                                                 className="form-control"
//                                                 id="newCreditLimit"
//                                                 value={newCreditLimit}
//                                                 onChange={(e) => setNewCreditLimit(e.target.value)}
//                                                 min="0"
//                                                 required
//                                             />
//                                         </div>

//                                         <div className="mb-3">
//                                             <label htmlFor="adjustmentReason" className="form-label">Reason for Adjustment</label>
//                                             <textarea
//                                                 className="form-control"
//                                                 id="adjustmentReason"
//                                                 rows="3"
//                                                 value={adjustmentReason}
//                                                 onChange={(e) => setAdjustmentReason(e.target.value)}
//                                                 required
//                                             ></textarea>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                             <div className="modal-footer">
//                                 <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
//                                 <button type="submit" className="btn btn-primary">Update Credit Limit</button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default WholesaleCreditManagement;


import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { ToastContainer, toast } from 'react-toastify';
import apiProvider from "../apiProvider/wholesalerapi";
import ReactTableComponent from '../table/ReactTableComponent';

function WholesaleCreditManagement() {
    const [loading, setLoading] = useState(true);
    const [wholesalers, setWholesalers] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedWholesaler, setSelectedWholesaler] = useState(null);
    const [creditHistory, setCreditHistory] = useState([]);
    const [newCreditLimit, setNewCreditLimit] = useState(0);
    const [adjustmentReason, setAdjustmentReason] = useState('');



    useEffect(() => {
        fetchData();
    }, [page, limit]);

    const fetchData = async () => {
        try {
            setLoading(true);
            let input = {
                page: page,
                limit: limit,
                type: "Wholesaler"
            };
            const result = await apiProvider.getWholesalerCredit(input);

            if (result?.status && result?.response?.data) {
                setWholesalers(result.response.data);
                setTotal(result.response.total || result.response.data.length);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewCreditHistory = async (wholesalerId) => {
        console.log(wholesalerId, "wholesalerId");
        // console.log(wholesalers, "wholesalers");
        // console.log(mockCreditData, "mockCreditData");



        setSelectedWholesaler(wholesalerId);
        // setCreditHistory(mockCreditData[wholesalerId] || []);
        const input = {
            page: 0,
            limit: 10,
            type: "Wholesaler",
            id: wholesalerId.id
        }

        const getCreditHistroy = await apiProvider.getCreditHistroy(input)

        console.log(getCreditHistroy, "getCreditHistroy---");
        if (getCreditHistroy && getCreditHistroy?.status) {
            let data = getCreditHistroy?.response?.data
            setCreditHistory(data)
        }

    };

    const handleAdjustCredit = (wholesaler) => {
        setSelectedWholesaler(wholesaler);
        setNewCreditLimit(wholesaler.creditLimit.toString());
    };

    const handleCreditLimitSubmit = async () => {
        console.log(selectedWholesaler, "selectedWholesaler");
        const input = {
            id: selectedWholesaler.id,
            creditLimit: Number(newCreditLimit),
            reason: adjustmentReason

        }
        const setCreditLimit = await apiProvider.increaseCreditLimit(input)

        console.log(setCreditLimit, "setCreditLimit");

        // return

        // e.preventDefault();
        toast.success(`Credit limit updated to ₹ ${newCreditLimit} for ${selectedWholesaler.name}`);
        setNewCreditLimit('');
        setAdjustmentReason('');
        fetchData();
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹ 0';
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        })
            .format(amount)
            .replace('₹', '₹ ');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const columns = useMemo(
        () => [
            {
                header: 'S.No',
                accessorFn: (_, rowIndex) => rowIndex + 1 + page * limit,
                cell: (info) => <>{info.getValue()}.</>,
                size: 30,
            },
            {
                header: 'Name',
                accessorKey: 'name',
                cell: (info) => info.getValue() || 'N/A',
            },
            {
                header: 'Credit Limit',
                accessorKey: 'creditLimit',
                cell: (info) => formatCurrency(info.getValue()),
            },
            {
                header: 'Credit Used',
                accessorKey: 'usedCreditAmount',
                cell: (info) => formatCurrency(info.getValue()),
            },
            {
                header: 'Available Credit',
                accessorKey: 'availableCreditAmount',
                cell: (info) => formatCurrency(info.getValue()),
            },
            {
                header: 'Last Payment Date',
                accessorKey: 'lastPaidedDate',
                cell: (info) => formatDate(info.getValue()),
            },
            {
                header: "Action",
                id: "actions",
                cell: ({ row }) => (
                    <div className="d-flex gap-2 justify-content-start">
                        <button
                            type="button"
                            className="d-flex justify-content-center align-items-center bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px rounded-circle"
                            onClick={() => handleViewCreditHistory(row.original)}
                            data-bs-toggle="modal"
                            data-bs-target="#creditHistoryModal"
                        >
                            <Icon icon="majesticons:eye-line" className="text-xl" />
                        </button>
                        <button
                            type="button"
                            className="d-flex justify-content-center align-items-center bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px rounded-circle"
                            onClick={() => handleAdjustCredit(row.original)}
                            data-bs-toggle="modal"
                            data-bs-target="#creditAdjustmentModal"
                            title="Adjust Credit"
                        >
                            <Icon icon="lucide:edit" />
                        </button>
                    </div>
                ),
            },


        ],
        [limit, page, handleViewCreditHistory, handleAdjustCredit]
    );


    return (
        <div className="container-fluid">
            {/* <ToastContainer position="top-right" autoClose={3000} /> */}
            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="">
                                <div className="table-responsive">
                                    <ReactTableComponent
                                        columns={columns}
                                        data={wholesalers}
                                        loading={loading}
                                        pageIndex={page}
                                        totalPages={Math.ceil(total / limit)}
                                        onNextPage={() => setPage((prev) => prev + 1)}
                                        onPreviousPage={() => setPage((prev) => Math.max(prev - 1, 0))}
                                        totalRecords={total}
                                    />
                                </div>

                                {/* Pagination controls */}
                                <div className="d-flex align-items-center mt-4 gap-3 d-none">
                                    <button
                                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                        disabled={page === 0}
                                        className="btn btn-primary"
                                    >
                                        Previous
                                    </button>

                                    <div className="d-flex align-items-center gap-2">
                                        <div>
                                            <span>Page {page + 1}</span>
                                        </div>
                                        <div>
                                            <select
                                                className="form-select"
                                                value={limit}
                                                onChange={(e) => {
                                                    setLimit(Number(e.target.value));
                                                    setPage(0); // Reset page when limit changes
                                                }}
                                            >
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setPage((prev) => prev + 1)}
                                        disabled={(page + 1) * limit >= total}
                                        className="btn btn-primary"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Credit History Modal */}
            <div className="modal fade" id="creditHistoryModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {selectedWholesaler?.name} - Credit History
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row mb-4">
                                <div className="col-md-4">
                                    <h6>Credit Limit:</h6>
                                    <p className="fw-bold">{formatCurrency(selectedWholesaler?.creditLimit)}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6>Credit Used:</h6>
                                    <p className="fw-bold">{formatCurrency(selectedWholesaler?.usedCreditAmount)}</p>
                                </div>
                                <div className="col-md-4">
                                    <h6>Available Credit:</h6>
                                    <p className="fw-bold">{formatCurrency(selectedWholesaler?.availableCreditAmount)}</p>
                                </div>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                            <th>Payment Status</th>
                                            <th>Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creditHistory.length > 0 ? (
                                            creditHistory.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.orderCode}</td>
                                                    <td>{formatDate(item.orderDate)}</td>
                                                    <td>₹ {item.usedCreditAmount}</td>
                                                    <td>
                                                        <span className={`badge bg-${item.paymentStatus === 'Paid' ? 'success' :
                                                            item.paymentStatus === 'Credit' ? 'warning' : 'info'
                                                            }`}>
                                                            {item.paymentStatus}
                                                        </span>
                                                    </td>
                                                    <td>₹ {item.remaingAmountToPay}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="text-center">No credit history available</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Credit Adjustment Modal */}
            <div className="modal fade" id="creditAdjustmentModal" tabIndex={-1} aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Adjust Credit Limit</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {/* <form onSubmit={handleCreditLimitSubmit}> */}
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Wholesaler</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedWholesaler?.name || ''}
                                    readOnly
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label">Current Credit Limit</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formatCurrency(selectedWholesaler?.creditLimit)}
                                        readOnly
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">Credit Used</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formatCurrency(selectedWholesaler?.usedCreditAmount)}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">New Credit Limit (₹)</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={newCreditLimit}
                                    onChange={(e) => setNewCreditLimit(e.target.value)}
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Reason for Adjustment</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={adjustmentReason}
                                    onChange={(e) => setAdjustmentReason(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="submit" onClick={() => handleCreditLimitSubmit()} className="btn btn-primary">Update Credit Limit</button>
                        </div>
                        {/* </form> */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WholesaleCreditManagement;
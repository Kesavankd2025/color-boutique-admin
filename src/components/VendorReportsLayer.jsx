// import { Icon } from '@iconify/react/dist/iconify.js';
// import React, { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import Swal from 'sweetalert2';
// import Select from 'react-select';

// const VendorReport = () => {
//     // Sample vendor data
//     const [vendors, setVendors] = useState([
//         { id: 1, name: 'Sakthi Foods' },
//         { id: 2, name: 'Venu Masalas' },
//         { id: 3, name: 'Aachi Spices' },
//         { id: 4, name: 'Eastern Condiments' },
//         { id: 5, name: 'MDH Spices' },
//     ]);

//     // Form state
//     const [formData, setFormData] = useState({ 
//         vendorId: '',
//         fromDate: '',
//         toDate: ''
//     });

//     // Report data state
//     const [reportData, setReportData] = useState([]);
//     const [isLoading, setIsLoading] = useState(false);
//     const [selectedVendorName, setSelectedVendorName] = useState('');

//     // Sample report data
//     const sampleReportData = [
//         {
//             id: 1,
//             purchaseNumber: 'PO-1001',
//             purchaseDate: '2025-01-15',
//             productQty: 5,
//             totalAmount: 12000,
//             paidAmount: 8000,
//             balanceAmount: 4000,
//             vendorId: 1
//         },
//         {
//             id: 2,
//             purchaseNumber: 'PO-1002',
//             purchaseDate: '2025-01-18',
//             productQty: 8,
//             totalAmount: 18500,
//             paidAmount: 18500,
//             balanceAmount: 0,
//             vendorId: 1
//         },
//         {
//             id: 3,
//             purchaseNumber: 'PO-1003',
//             purchaseDate: '2025-01-20',
//             productQty: 12,
//             totalAmount: 24500,
//             paidAmount: 10000,
//             balanceAmount: 14500,
//             vendorId: 2
//         },
//         {
//             id: 4,
//             purchaseNumber: 'PO-1004',
//             purchaseDate: '2025-01-22',
//             productQty: 7,
//             totalAmount: 16800,
//             paidAmount: 0,
//             balanceAmount: 16800,
//             vendorId: 2
//         },
//         {
//             id: 5,
//             purchaseNumber: 'PO-1005',
//             purchaseDate: '2025-01-25',
//             productQty: 10,
//             totalAmount: 22000,
//             paidAmount: 22000,
//             balanceAmount: 0,
//             vendorId: 3
//         },
//         {
//             id: 6,
//             purchaseNumber: 'PO-1006',
//             purchaseDate: '2025-01-28',
//             productQty: 6,
//             totalAmount: 15000,
//             paidAmount: 5000,
//             balanceAmount: 10000,
//             vendorId: 3
//         },
//         {
//             id: 7,
//             purchaseNumber: 'PO-1007',
//             purchaseDate: '2025-02-01',
//             productQty: 9,
//             totalAmount: 19500,
//             paidAmount: 19500,
//             balanceAmount: 0,
//             vendorId: 4
//         },
//         {
//             id: 8,
//             purchaseNumber: 'PO-1008',
//             purchaseDate: '2025-02-05',
//             productQty: 4,
//             totalAmount: 9800,
//             paidAmount: 0,
//             balanceAmount: 9800,
//             vendorId: 4
//         },
//         {
//             id: 9,
//             purchaseNumber: 'PO-1009',
//             purchaseDate: '2025-02-08',
//             productQty: 11,
//             totalAmount: 26500,
//             paidAmount: 15000,
//             balanceAmount: 11500,
//             vendorId: 5
//         },
//         {
//             id: 10,
//             purchaseNumber: 'PO-1010',
//             purchaseDate: '2025-02-10',
//             productQty: 3,
//             totalAmount: 7500,
//             paidAmount: 7500,
//             balanceAmount: 0,
//             vendorId: 5
//         },
//         {
//             id: 11,
//             purchaseNumber: 'PO-1011',
//             purchaseDate: '2025-02-12',
//             productQty: 13,
//             totalAmount: 30000,
//             paidAmount: 10000,
//             balanceAmount: 20000,
//             vendorId: 1
//         },
//         {
//             id: 12,
//             purchaseNumber: 'PO-1012',
//             purchaseDate: '2025-02-14',
//             productQty: 2,
//             totalAmount: 5400,
//             paidAmount: 5400,
//             balanceAmount: 0,
//             vendorId: 2
//         },
//         {
//             id: 13,
//             purchaseNumber: 'PO-1013',
//             purchaseDate: '2025-02-16',
//             productQty: 15,
//             totalAmount: 32000,
//             paidAmount: 18000,
//             balanceAmount: 14000,
//             vendorId: 3
//         },
//         {
//             id: 14,
//             purchaseNumber: 'PO-1014',
//             purchaseDate: '2025-02-18',
//             productQty: 9,
//             totalAmount: 18900,
//             paidAmount: 18900,
//             balanceAmount: 0,
//             vendorId: 4
//         },
//         {
//             id: 15,
//             purchaseNumber: 'PO-1015',
//             purchaseDate: '2025-02-20',
//             productQty: 7,
//             totalAmount: 15750,
//             paidAmount: 5000,
//             balanceAmount: 10750,
//             vendorId: 5
//         },
//         {
//             id: 16,
//             purchaseNumber: 'PO-1016',
//             purchaseDate: '2025-02-22',
//             productQty: 10,
//             totalAmount: 21000,
//             paidAmount: 21000,
//             balanceAmount: 0,
//             vendorId: 1
//         },
//         {
//             id: 17,
//             purchaseNumber: 'PO-1017',
//             purchaseDate: '2025-02-24',
//             productQty: 6,
//             totalAmount: 11400,
//             paidAmount: 4000,
//             balanceAmount: 7400,
//             vendorId: 2
//         },
//         {
//             id: 18,
//             purchaseNumber: 'PO-1018',
//             purchaseDate: '2025-02-26',
//             productQty: 8,
//             totalAmount: 17600,
//             paidAmount: 17600,
//             balanceAmount: 0,
//             vendorId: 3
//         },
//         {
//             id: 19,
//             purchaseNumber: 'PO-1019',
//             purchaseDate: '2025-02-28',
//             productQty: 14,
//             totalAmount: 32000,
//             paidAmount: 12000,
//             balanceAmount: 20000,
//             vendorId: 4
//         },
//         {
//             id: 20,
//             purchaseNumber: 'PO-1020',
//             purchaseDate: '2025-03-01',
//             productQty: 5,
//             totalAmount: 11000,
//             paidAmount: 11000,
//             balanceAmount: 0,
//             vendorId: 5
//         },
//         {
//             id: 21,
//             purchaseNumber: 'PO-1021',
//             purchaseDate: '2025-03-03',
//             productQty: 4,
//             totalAmount: 9400,
//             paidAmount: 0,
//             balanceAmount: 9400,
//             vendorId: 1
//         },
//         {
//             id: 22,
//             purchaseNumber: 'PO-1022',
//             purchaseDate: '2025-03-05',
//             productQty: 11,
//             totalAmount: 23700,
//             paidAmount: 12000,
//             balanceAmount: 11700,
//             vendorId: 2
//         },
//         {
//             id: 23,
//             purchaseNumber: 'PO-1023',
//             purchaseDate: '2025-03-07',
//             productQty: 9,
//             totalAmount: 19800,
//             paidAmount: 19800,
//             balanceAmount: 0,
//             vendorId: 3
//         },
//         {
//             id: 24,
//             purchaseNumber: 'PO-1024',
//             purchaseDate: '2025-03-09',
//             productQty: 6,
//             totalAmount: 13800,
//             paidAmount: 6000,
//             balanceAmount: 7800,
//             vendorId: 4
//         },
//         {
//             id: 25,
//             purchaseNumber: 'PO-1025',
//             purchaseDate: '2025-03-11',
//             productQty: 3,
//             totalAmount: 6900,
//             paidAmount: 6900,
//             balanceAmount: 0,
//             vendorId: 5
//         },
//         {
//             id: 26,
//             purchaseNumber: 'PO-1026',
//             purchaseDate: '2025-03-13',
//             productQty: 7,
//             totalAmount: 15400,
//             paidAmount: 10000,
//             balanceAmount: 5400,
//             vendorId: 1
//         },
//         {
//             id: 27,
//             purchaseNumber: 'PO-1027',
//             purchaseDate: '2025-03-15',
//             productQty: 10,
//             totalAmount: 23000,
//             paidAmount: 0,
//             balanceAmount: 23000,
//             vendorId: 2
//         },
//         {
//             id: 28,
//             purchaseNumber: 'PO-1028',
//             purchaseDate: '2025-03-17',
//             productQty: 12,
//             totalAmount: 26400,
//             paidAmount: 15000,
//             balanceAmount: 11400,
//             vendorId: 3
//         },
//         {
//             id: 29,
//             purchaseNumber: 'PO-1029',
//             purchaseDate: '2025-03-19',
//             productQty: 8,
//             totalAmount: 17800,
//             paidAmount: 17800,
//             balanceAmount: 0,
//             vendorId: 4
//         },
//         {
//             id: 30,
//             purchaseNumber: 'PO-1030',
//             purchaseDate: '2025-03-21',
//             productQty: 9,
//             totalAmount: 20200,
//             paidAmount: 2000,
//             balanceAmount: 18200,
//             vendorId: 5
//         },
//         {
//             id: 31,
//             purchaseNumber: 'PO-1031',
//             purchaseDate: '2025-03-23',
//             productQty: 10,
//             totalAmount: 24000,
//             paidAmount: 24000,
//             balanceAmount: 0,
//             vendorId: 1
//         },
//         {
//             id: 32,
//             purchaseNumber: 'PO-1032',
//             purchaseDate: '2025-03-25',
//             productQty: 6,
//             totalAmount: 12000,
//             paidAmount: 4000,
//             balanceAmount: 8000,
//             vendorId: 2
//         },
//         {
//             id: 33,
//             purchaseNumber: 'PO-1033',
//             purchaseDate: '2025-03-27',
//             productQty: 5,
//             totalAmount: 11000,
//             paidAmount: 11000,
//             balanceAmount: 0,
//             vendorId: 3
//         },
//         {
//             id: 34,
//             purchaseNumber: 'PO-1034',
//             purchaseDate: '2025-03-29',
//             productQty: 7,
//             totalAmount: 15400,
//             paidAmount: 15400,
//             balanceAmount: 0,
//             vendorId: 4
//         },
//         {
//             id: 35,
//             purchaseNumber: 'PO-1035',
//             purchaseDate: '2025-03-31',
//             productQty: 13,
//             totalAmount: 28600,
//             paidAmount: 10000,
//             balanceAmount: 18600,
//             vendorId: 5
//         },
//         {
//             id: 36,
//             purchaseNumber: 'PO-1036',
//             purchaseDate: '2025-04-02',
//             productQty: 4,
//             totalAmount: 8800,
//             paidAmount: 8800,
//             balanceAmount: 0,
//             vendorId: 1
//         },
//         {
//             id: 37,
//             purchaseNumber: 'PO-1037',
//             purchaseDate: '2025-04-04',
//             productQty: 6,
//             totalAmount: 13200,
//             paidAmount: 5000,
//             balanceAmount: 8200,
//             vendorId: 2
//         },
//         {
//             id: 38,
//             purchaseNumber: 'PO-1038',
//             purchaseDate: '2025-04-06',
//             productQty: 11,
//             totalAmount: 23100,
//             paidAmount: 23100,
//             balanceAmount: 0,
//             vendorId: 3
//         },
//         {
//             id: 39,
//             purchaseNumber: 'PO-1039',
//             purchaseDate: '2025-04-08',
//             productQty: 9,
//             totalAmount: 19800,
//             paidAmount: 19800,
//             balanceAmount: 0,
//             vendorId: 4
//         },
//         {
//             id: 40,
//             purchaseNumber: 'PO-1040',
//             purchaseDate: '2025-04-10',
//             productQty: 8,
//             totalAmount: 17600,
//             paidAmount: 12000,
//             balanceAmount: 5600,
//             vendorId: 5
//         }
//     ];


//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         if (name === 'vendorId') {
//             const vendor = vendors.find(v => v.id === parseInt(value));
//             setSelectedVendorName(vendor ? vendor.name : '');

//             // Reset entire form with new vendor but clear dates
//             setFormData({
//                 vendorId: value,  // Set the new vendor
//                 fromDate: "",     // Clear from date
//                 toDate: ""        // Clear to date
//             });
//         } else {
//             // Normal update for other fields
//             setFormData(prev => ({
//                 ...prev,
//                 [name]: value
//             }));
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         setIsLoading(true);

//         // Simulate API call
//         setTimeout(() => {
//             let filteredData = sampleReportData;

//             if (formData.vendorId) {
//                 filteredData = filteredData.filter(item => item.vendorId === parseInt(formData.vendorId));
//             }

//             if (formData.fromDate) {
//                 filteredData = filteredData.filter(item => new Date(item.purchaseDate) >= new Date(formData.fromDate));
//             }

//             if (formData.toDate) {
//                 filteredData = filteredData.filter(item => new Date(item.purchaseDate) <= new Date(formData.toDate));
//             }

//             setReportData(filteredData);
//             setIsLoading(false);
//         }, 1000);
//     };

//     const calculateSummary = () => {
//         return reportData.reduce((acc, item) => {
//             acc.totalAmount += item.totalAmount;
//             acc.paidAmount += item.paidAmount;
//             acc.balanceAmount += item.balanceAmount;
//             return acc;
//         }, { totalAmount: 0, paidAmount: 0, balanceAmount: 0 });
//     };

//     const formatDate = (dateString) => {
//         const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
//         return new Date(dateString).toLocaleDateString('en-GB', options);
//     };

//     return (
//         <div className="container-fluid p-0">
//             <div className="card radius-12 border-0">
//                 <div className="card-header bg-base py-3">
//                     <h5 className="mb-0">Vendor Report</h5>
//                 </div>
//                 <div className="card-body p-4">
//                     {/* Filter Form - Column Layout */}
//                     <form onSubmit={handleSubmit} className="mb-4">
//                         <div className="d-flex flex-column align-items-center gap-3" style={{ maxWidth: "500px", margin: "0 auto" }}>
//                             {/* Vendor Select with react-select */}
//                             <div className="w-100">
//                                 <label htmlFor="vendorId" className="form-label">Select Vendor</label>
//                                 <Select
//                                     options={vendors
//                                         .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
//                                         .map(vendor => ({
//                                             value: vendor.id,
//                                             label: vendor.name
//                                         }))}
//                                     value={formData.vendorId ? {
//                                         value: formData.vendorId,
//                                         label: vendors.find(v => v.id === formData.vendorId)?.name || ''
//                                     } : null}
//                                     onChange={(selectedOption) => {
//                                         handleChange({
//                                             target: {
//                                                 name: 'vendorId',
//                                                 value: selectedOption?.value || ''
//                                             }
//                                         });
//                                     }}
//                                     isClearable
//                                     placeholder="Search vendor..."
//                                     noOptionsMessage={() => "No vendors found"}
//                                     className="react-select-container"
//                                     classNamePrefix="react-select"
//                                 />
//                             </div>

//                             {/* Date Range - Stacked */}
//                             <div className="w-100">
//                                 <label htmlFor="fromDate" className="form-label">From Date</label>
//                                 <input
//                                     type="date"
//                                     className="form-control"
//                                     id="fromDate"
//                                     name="fromDate"
//                                     value={formData.fromDate}
//                                     onChange={handleChange}
//                                 />
//                             </div>

//                             <div className="w-100">
//                                 <label htmlFor="toDate" className="form-label">To Date</label>
//                                 <input
//                                     type="date"
//                                     className="form-control"
//                                     id="toDate"
//                                     name="toDate"
//                                     value={formData.toDate}
//                                     onChange={handleChange}
//                                     min={formData.fromDate}
//                                 />
//                             </div>

//                             {/* Submit Button */}
//                             <div className="w-100 d-flex justify-content-center mt-2">
//                                 <button
//                                     type="submit"
//                                     className="btn btn-primary px-4"
//                                     disabled={isLoading}
//                                 >
//                                     {isLoading ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                                             Generating...
//                                         </>
//                                     ) : 'Generate Report'}
//                                 </button>
//                             </div>
//                         </div>
//                     </form>
//                     <br></br>
//                     <br></br>
//                     <br></br>

//                     {/* Vendor Name and Summary */}
//                     {reportData.length > 0 && (
//                         <div className="mb-4">
//                             {selectedVendorName && (
//                                 <h5 className="mb-3">Vendor: {selectedVendorName}</h5>
//                             )}

//                             <div className="d-flex flex-wrap gap-4 mb-3">
//                                 <div className="bg-light p-3 rounded flex-grow-1">
//                                     <div className="text-muted small">Total Amount</div>
//                                     <div className="h4 text-primary mb-0">
//                                         ₹{calculateSummary().totalAmount.toLocaleString('en-IN')}
//                                     </div>
//                                 </div>
//                                 <div className="bg-light p-3 rounded flex-grow-1">
//                                     <div className="text-muted small">Paid Amount</div>
//                                     <div className="h4 text-success mb-0">
//                                         ₹{calculateSummary().paidAmount.toLocaleString('en-IN')}
//                                     </div>
//                                 </div>
//                                 <div className="bg-light p-3 rounded flex-grow-1">
//                                     <div className="text-muted small">Balance Amount</div>
//                                     <div className="h4 text-danger mb-0">
//                                         ₹{calculateSummary().balanceAmount.toLocaleString('en-IN')}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Report Table */}
//                     {reportData.length > 0 ? (
//                         <div className="table-responsive">
//                             <table className="table table-striped table-hover mb-0">
//                                 <thead className="table-light">
//                                     <tr>
//                                         <th>S.No</th>
//                                         <th>Purchase Number</th>
//                                         <th>Purchase Date</th>
//                                         <th>Product Qty</th>
//                                         <th>Total Amount</th>
//                                         <th>Paid Amount</th>
//                                         <th>Balance Amount</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {reportData.map((item, index) => (
//                                         <tr key={item.id}>
//                                             <td>{index + 1}</td>
//                                             <td>{item.purchaseNumber}</td>
//                                             <td>{formatDate(item.purchaseDate)}</td>
//                                             <td>{item.productQty}</td>
//                                             <td>₹{item.totalAmount.toLocaleString('en-IN')}</td>
//                                             <td>₹{item.paidAmount.toLocaleString('en-IN')}</td>
//                                             <td>
//                                                 {item.balanceAmount > 0 ? (
//                                                     <span className="badge bg-danger-subtle text-danger">
//                                                         ₹{item.balanceAmount.toLocaleString('en-IN')}
//                                                     </span>
//                                                 ) : (
//                                                     <span className="badge bg-success-subtle text-success">
//                                                         ₹0
//                                                     </span>
//                                                 )}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ) : (
//                         <div className="text-center py-5 border rounded bg-light">
//                             {isLoading ? (
//                                 <div className="d-flex align-items-center justify-content-center gap-2">
//                                     <div className="spinner-border text-primary" role="status"></div>
//                                     <span>Loading report data...</span>
//                                 </div>
//                             ) : (
//                                 <div className="alert alert-info mb-0">
//                                     No report data available. Please select filters and click "Generate Report".
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                 </div>
//             </div>
//             <ToastContainer />
//         </div>
//     );
// };

// export default VendorReport;

import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import Select from 'react-select';
import VendorApi from '../apiProvider/vendor'; // Adjust path as needed

const VendorReport = () => {
    const [vendors, setVendors] = useState([]);
    const [formData, setFormData] = useState({
        vendorId: '',
        fromDate: '',
        toDate: ''
    });
    const [reportData, setReportData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isVendorsLoading, setIsVendorsLoading] = useState(false);
    const [selectedVendorName, setSelectedVendorName] = useState('');

    // Fetch vendors on component mount
    useEffect(() => {
        const fetchVendors = async () => {
            setIsVendorsLoading(true);
            try {
                const input = { page: 0, limit: 100, search: '' }; // Adjust pagination as needed
                const response = await VendorApi.vendorList(input);

                if (response && response.status) {
                    setVendors(response.response.data);
                } else {
                    toast.error('Failed to load vendors');
                }
            } catch (error) {
                console.error('Error fetching vendors:', error);
                toast.error('Failed to load vendors');
            } finally {
                setIsVendorsLoading(false);
            }
        };

        fetchVendors();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'vendorId') {
            const vendor = vendors.find(v => v._id === value);
            setSelectedVendorName(vendor ? vendor.name : '');

            setFormData({
                vendorId: value,
                fromDate: "",
                toDate: ""
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.vendorId) {
            toast.error('Please select a vendor');
            return;
        }

        setIsLoading(true);

        try {
            // Prepare query params
            const params = {}
            params.vendorId = formData.vendorId;
            params.startDate = formData.fromDate ? new Date(formData.fromDate).toISOString() : undefined;
            params.endDate = formData.toDate ? new Date(formData.toDate).toISOString() : undefined;

            // params.append('vendorId', formData.vendorId);

            //             if (formData.fromDate) {
            //                 params.append('startDate', new Date(formData.fromDate).toISOString());
            //             }

            //             if (formData.toDate) {
            //                 params.append('endDate', new Date(formData.toDate).toISOString());
            //             }
            console.log(params, "ppppppppp");

            // Call API
            const response = await VendorApi.getVendorPurchases(params);

            if (response && response.status) {
                setReportData(response.response.data);
            } else {
                toast.error('Failed to fetch report data');
                setReportData([]);
            }
        } catch (error) {
            console.error('Error fetching report:', error);
            toast.error('Failed to fetch report data');
            setReportData([]);
        } finally {
            setIsLoading(false);
        }
    };

    const calculateSummary = () => {
        return reportData.reduce((acc, item) => {
            acc.totalAmount += item.totalPrice || 0;
            acc.paidAmount += item.amountPaid || 0;
            acc.balanceAmount += item.amountPending || 0;
            return acc;
        }, { totalAmount: 0, paidAmount: 0, balanceAmount: 0 });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    return (
        <div className="container-fluid p-0">
            <div className="card radius-12 border-0">
                <div className="card-header bg-base py-3">
                    <h5 className="mb-0">Vendor Report</h5>
                </div>
                <div className="card-body p-4">
                    {/* Filter Form */}
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="d-flex flex-column align-items-center gap-3" style={{ maxWidth: "500px", margin: "0 auto" }}>
                            {/* Vendor Select */}
                            <div className="w-100">
                                <label htmlFor="vendorId" className="form-label">Select Vendor</label>
                                <Select
                                    options={vendors
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map(vendor => ({
                                            value: vendor._id,
                                            label: vendor.name
                                        }))}
                                    value={formData.vendorId ? {
                                        value: formData.vendorId,
                                        label: vendors.find(v => v._id === formData.vendorId)?.name || ''
                                    } : null}
                                    onChange={(selectedOption) => {
                                        handleChange({
                                            target: {
                                                name: 'vendorId',
                                                value: selectedOption?.value || ''
                                            }
                                        });
                                    }}
                                    isLoading={isVendorsLoading}
                                    isClearable
                                    placeholder={isVendorsLoading ? "Loading vendors..." : "Search vendor..."}
                                    noOptionsMessage={() => "No vendors found"}
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                />
                            </div>

                            {/* Date Range */}
                            <div className="w-100">
                                <label htmlFor="fromDate" className="form-label">From Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fromDate"
                                    name="fromDate"
                                    value={formData.fromDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="w-100">
                                <label htmlFor="toDate" className="form-label">To Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="toDate"
                                    name="toDate"
                                    value={formData.toDate}
                                    onChange={handleChange}
                                    min={formData.fromDate}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="w-100 d-flex justify-content-center mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary px-4"
                                    disabled={isLoading || !formData.vendorId}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Generating...
                                        </>
                                    ) : 'Generate Report'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Vendor Name and Summary */}
                    {reportData.length > 0 && (
                        <div className="mb-4">
                            {selectedVendorName && (
                                <h5 className="mb-3">Vendor: {selectedVendorName}</h5>
                            )}

                            <div className="d-flex flex-wrap gap-4 mb-3">
                                <div className="bg-light p-3 rounded flex-grow-1">
                                    <div className="text-muted small">Total Amount</div>
                                    <div className="h4 text-primary mb-0">
                                        ₹{calculateSummary().totalAmount.toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="bg-light p-3 rounded flex-grow-1">
                                    <div className="text-muted small">Paid Amount</div>
                                    <div className="h4 text-success mb-0">
                                        ₹{calculateSummary().paidAmount.toLocaleString('en-IN')}
                                    </div>
                                </div>
                                <div className="bg-light p-3 rounded flex-grow-1">
                                    <div className="text-muted small">Balance Amount</div>
                                    <div className="h4 text-danger mb-0">
                                        ₹{calculateSummary().balanceAmount.toLocaleString('en-IN')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Report Table */}
                    {reportData.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>S.No</th>
                                        <th>Order ID</th>
                                        <th>Vendor Name</th>
                                        <th>Purchase Date</th>
                                        <th>Total Amount</th>
                                        <th>Paid Amount</th>
                                        <th>Balance Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((item, index) => (
                                        <tr key={item._id || index}>
                                            <td>{index + 1}</td>
                                            <td>{item.orderId || '-'}</td>
                                            <td>{item.vendorName || '-'}</td>
                                            <td>{formatDate(item.createdAt)}</td>
                                            <td>₹{(item.totalPrice || 0).toLocaleString('en-IN')}</td>
                                            <td>₹{(item.amountPaid || 0).toLocaleString('en-IN')}</td>
                                            <td>
                                                {(item.amountPending || 0) > 0 ? (
                                                    <span className="badge bg-danger-subtle text-danger">
                                                        ₹{(item.amountPending || 0).toLocaleString('en-IN')}
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-success-subtle text-success">
                                                        ₹0
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-5 border rounded bg-light">
                            {isLoading ? (
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <span>Loading report data...</span>
                                </div>
                            ) : (
                                <div className="alert alert-info mb-0">
                                    No report data available. Please select filters and click "Generate Report".
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default VendorReport;
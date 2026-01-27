import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import apiProvider from '../apiProvider/api';
import apiProvider from '../apiProvider/api';
import { IMAGE_URL } from '../../src/network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import { NavLink, useLocation } from "react-router-dom";
import Swal from 'sweetalert2';
import salesApi from '../apiProvider/salesapi';
import ReactTableComponent from '../table/ReactTableComponent';
const ItemsPerPage = 10; // Number of items per page


const SalesmanReport = () => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [formErrors, setFormErrors] = useState({});
    const [performancepageIndex, setperformancePageIndex] = useState(0);
    const [performancetotalPages, setperformanceTotalPages] = useState(1);
    const [performancepageSize, setperformancePageSize] = useState(10);
    const [performancefilters, setperformanceFilters] = useState([]);
    const [performancedata, setperformancedata] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [loading, setLoading] = useState(false);

    // incentive report 
    const [incentivePageIndex, setIncentivePageIndex] = useState(0);
    const [incentiveTotalPages, setIncentiveTotalPages] = useState(1);
    const [incentivePageSize, setIncentivePageSize] = useState(10);
    const [incentiveFilters, setIncentiveFilters] = useState({});
    const [incentiveData, setIncentiveData] = useState([]);
    const [incentiveLoading, setIncentiveLoading] = useState(false);
    // client data
    const [clientPageIndex, setClientPageIndex] = useState(0);
    const [clientTotalPages, setClientTotalPages] = useState(1);
    const [clientPageSize, setClientPageSize] = useState(10);
    const [clientFilters, setClientFilters] = useState({});
    const [clientData, setClientData] = useState([]);
    const clientSearchColumns = ["clientName", "clientMobileNumber", "clientType", "salesmanName"];
    useEffect(() => {
        fetchPerformance();
    }, [performancepageIndex]);

    const fetchPerformance = async () => {
        setLoading(true);
        const input = {
            page: performancepageIndex,
            limit: performancepageSize,
            filters: performancefilters
            // search: filters ? filters : ''
        };
        // const params = { page: pageIndex + 1, limit: pageSize };
        const res = await salesApi.getSalesPerformance();
        if (res.status && res.response?.data) {
            setperformancedata(res.response.data);
            setperformanceTotalPages(res.response.totalPages || 1);
        }
        setLoading(false);
    };
    const performancecolumns = [
        { header: 'S.No', accessorKey: 'sno', cell: info => info.row.index + 1 + performancepageIndex * performancepageSize },
        { header: 'Salesman Name', accessorKey: 'salesmanName' },
        { header: 'Total Orders Managed', accessorKey: 'totalOrdersManaged' },
        { header: 'Total Sales Value', accessorKey: 'totalSalesValue', cell: info => `₹${info.getValue()}` },
        { header: 'New Clients Added', accessorKey: 'newClientsAdded' },
        { header: 'Last Order Date', accessorKey: 'lastOrderDate', cell: info => info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '-' },
        { header: 'Sales Target Achieved', accessorKey: 'salesTargetAchieved' },
        { header: 'Incentives Earned', accessorKey: 'incentivesEarned', cell: info => `₹${info.getValue()}` },
        {
            header: 'Performance Rating', accessorKey: 'performanceRating', cell: info => (
                <span className={`badge badge-pill ${info.getValue() === 'Good' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} font-size-12`}>{info.getValue()}</span>
            )
        },
    ];
    const performancehandleNextPage = () => {
        if (performancepageIndex + 1 < performancetotalPages) setperformancePageIndex(prev => prev + 1);
    };

    const performancehandlePreviousPage = () => {
        if (performancepageIndex > 0) setperformancePageIndex(prev => prev - 1);
    };
    useEffect(() => {
        fetchIncentiveData();
    }, [incentivePageIndex, incentivePageSize, incentiveFilters]);

    const fetchIncentiveData = async () => {
        setIncentiveLoading(true);
        try {
            const input = {
                page: incentivePageIndex,
                limit: incentivePageSize,
                filters: incentiveFilters
            };

            const res = await salesApi.getSalesIncentiveReport(input);

            if (res.status && res.response?.data) {
                setIncentiveData(res.response.data);
                setIncentiveTotalPages(res.response.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching incentive data:", error);
        } finally {
            setIncentiveLoading(false);
        }
    };

    const incentiveColumns = [
        {
            header: 'S.No',
            cell: info => info.row.index + 1 + incentivePageIndex * incentivePageSize,
            width: 70
        },
        {
            header: 'Salesman Name',
            accessorKey: 'salemanName',
            cell: info => info.getValue() || 'N/A'
        },
        {
            header: 'Target Period',
            accessorKey: 'targetPeriod',
            cell: info => info.getValue() || 'N/A'
        },
        {
            header: 'Target Amount',
            accessorKey: 'targetSalesAmount',
            cell: info => `₹${info.getValue()?.toLocaleString('en-IN') || '0'}`
        },
        {
            header: 'Incentive Amount',
            accessorKey: 'incentiveAmount',
            cell: info => `₹${info.getValue()?.toLocaleString('en-IN') || '0'}`
        },
        {
            header: 'Status',
            accessorKey: 'salesTargetAchieved',
            cell: info => (
                <span className={`badge ${info.getValue() === 'Achieved' ? 'bg-success' : 'bg-warning'
                    }`}>
                    {info.getValue()}
                </span>
            )
        },
    ];

    const handleIncentiveNextPage = () => {
        if (incentivePageIndex + 1 < incentiveTotalPages) {
            setIncentivePageIndex(prev => prev + 1);
        }
    };

    const handleIncentivePrevPage = () => {
        if (incentivePageIndex > 0) {
            setIncentivePageIndex(prev => prev - 1);
        }
    };

    const handlePageSizeChange = (e) => {
        setIncentivePageSize(Number(e.target.value));
        setIncentivePageIndex(0); // Reset to first page when page size changes
    };
    useEffect(() => {
        fetchClientData();
    }, [clientPageIndex, clientPageSize, clientFilters]);

    const fetchClientData = async () => {
        setLoading(true);
        try {
            const input = {
                page: clientPageIndex,
                limit: clientPageSize,
                filters: clientFilters
            };

            const res = await salesApi.getSalesclientData(input);
            console.log(res, "res")
            if (res.status && res.response?.data) {
                setClientData(res.response.data);
                setClientTotalPages(res.response.totalPages || 1);
            }
        } catch (error) {
            console.error("Error fetching client data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Column definitions (same pattern as performance model)
    const clientColumns = [
        {
            header: 'S.No',
            cell: info => info.row.index + 1 + clientPageIndex * clientPageSize,
            width: 70
        },
        {
            header: 'Client Name',
            accessorKey: 'clientName',
            cell: info => info.getValue() || 'N/A'
        },
        {
            header: 'Mobile',
            accessorKey: 'clientMobileNumber',
            cell: info => info.getValue() || 'N/A'
        },
        {
            header: 'Type',
            accessorKey: 'clientType',
            cell: info => (
                <span className={`badge ${info.getValue() === 'Wholesaler' ? 'bg-primary' : 'bg-secondary'
                    }`}>
                    {info.getValue()}
                </span>
            )
        },
        {
            header: 'Join Date',
            accessorKey: 'clientCreatedAt',
            cell: info => new Date(info.getValue()).toLocaleDateString('en-IN') || 'N/A'
        },
        {
            header: 'Salesman',
            accessorKey: 'salesmanName',
            cell: info => info.getValue() || 'N/A'
        },
        {
            header: 'Email',
            accessorKey: 'salesmanEmail',
            cell: info => info.getValue() || 'N/A'
        }
    ];

    // Pagination handlers (same pattern as performance model)
    const handleClientNextPage = () => {
        if (clientPageIndex + 1 < clientTotalPages) {
            setClientPageIndex(prev => prev + 1);
        }
    };

    const handleClientPrevPage = () => {
        if (clientPageIndex > 0) {
            setClientPageIndex(prev => prev - 1);
        }
    };

    const handleClientPageSizeChange = (e) => {
        setClientPageSize(Number(e.target.value));
        setClientPageIndex(0);
    };

    return (
        <div>
            <div className="col-xxl-12">
                <div className="card p-0 overflow-hidden position-relative radius-12 h-100">
                    <div className="card-body p-24 pt-10">
                        <ul
                            className="nav focus-tab nav-pills nav-justified mb-16"
                            id="pills-tab-two"
                            role="tablist"
                        >
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link fw-semibold text-primary-light radius-4 px-16 py-10 active"
                                    id="pills-focus-home-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-focus-home"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-focus-home"
                                    aria-selected="true"
                                >
                                    Sales Performance Report
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link fw-semibold text-primary-light radius-4 px-16 py-10"
                                    id="pills-focus-details-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-focus-details"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-focus-details"
                                    aria-selected="false"
                                >
                                    Client Acquisition Report
                                </button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link fw-semibold text-primary-light radius-4 px-16 py-10"
                                    id="pills-focus-profile-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-focus-profile"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-focus-profile"
                                    aria-selected="false"
                                >
                                    Incentive Report
                                </button>
                            </li>
                        </ul>
                        <div className="tab-content" id="pills-tab-twoContent">
                            <div
                                className="tab-pane fade show active"
                                id="pills-focus-home"
                                role="tabpanel"
                                aria-labelledby="pills-focus-home-tab"
                                tabIndex={0}
                            >
                                <div>

                                    <div className="card h-100 p-0 radius-12">
                                        <div className="card-header border-bottom bg-base py-16 px-24 d-flex  flex-wrap gap-3 justify-content-start">
                                            <div className="paymenthistorytitlee">
                                                <h5>Orders handled by each salesman</h5>
                                            </div>
                                            <div className="table-responsive scroll-sm">
                                                <ReactTableComponent
                                                    data={performancedata}
                                                    columns={performancecolumns}
                                                    pageIndex={performancepageIndex}
                                                    totalPages={performancetotalPages}
                                                    onNextPage={performancehandleNextPage}
                                                    onPreviousPage={performancehandlePreviousPage}
                                                    filters={performancefilters}
                                                    setFilters={setperformanceFilters}
                                                />
                                            </div>

                                        </div>

                                        <div className="card-body p-24">

                                        </div>




                                    </div>

                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="pills-focus-details"
                                role="tabpanel"
                                aria-labelledby="pills-focus-details-tab"
                                tabIndex={0}
                            >

                                <div className="card h-100 p-0 radius-12">
                                    <div className="card-header border-bottom bg-base py-16 px-24 d-flex  flex-wrap gap-3 justify-content-start">
                                        <div className="paymenthistorytitlee">
                                            <h5>New wholesalers/retailers added   </h5>
                                        </div>
                                        <div className="table-responsive scroll-sm">
                                            <ReactTableComponent
                                                columns={clientColumns}
                                                data={clientData}
                                                pageIndex={clientPageIndex}
                                                filterableColumns={clientSearchColumns}
                                                totalPages={clientTotalPages}
                                                onNextPage={handleClientNextPage}
                                                onPreviousPage={handleClientPrevPage}
                                                onPageSizeChange={handleClientPageSizeChange}
                                                pageSize={clientPageSize}
                                                filters={clientFilters}
                                                setFilters={setClientFilters}
                                            />
                                        </div>
                                    </div>

                                    <div className="card-body p-24">

                                    </div>

                                </div>


                            </div>
                            <div
                                className="tab-pane fade"
                                id="pills-focus-profile"
                                role="tabpanel"
                                aria-labelledby="pills-focus-profile-tab"
                                tabIndex={0}
                            >

                                <div className="card h-100 p-0 radius-12">
                                    <div className="card-header border-bottom bg-base py-16 px-24 d-flex  flex-wrap gap-3 justify-content-start">
                                        <div className="paymenthistorytitlee">
                                            <h5>Achieved targets and bonus amounts</h5>
                                        </div>
                                        <div className=''>
                                            <ReactTableComponent
                                                data={incentiveData}
                                                columns={incentiveColumns}
                                                loading={incentiveLoading}
                                                pageIndex={incentivePageIndex}
                                                totalPages={incentiveTotalPages}
                                                onNextPage={handleIncentiveNextPage}
                                                onPreviousPage={handleIncentivePrevPage}
                                                onPageSizeChange={handlePageSizeChange}
                                                pageSize={incentivePageSize}
                                                filters={incentiveFilters}
                                                setFilters={setIncentiveFilters}
                                                emptyMessage="No incentive records found"
                                            />
                                        </div>
                                    </div>

                                    <div className="card-body p-24">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>







        </div>


    )
}

export default SalesmanReport;
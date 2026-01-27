// import React, { useEffect, useState } from 'react';
// import "./styles/nalsuvaiDashboardLayer.css"
// import dashboardApi from '../apiProvider/dashboardApi';
// import { IMAGE_BASE_URL } from '../network/apiClient';

// export default function NalsuvaiDashboardLayer() {

//     const [hoveredBar, setHoveredBar] = useState(null);
//     const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
//     const [newCustomer, setNewCustomers] = useState([]);
//     const [topSellingPeriod, setTopSellingPeriod] = useState('Yearly');
//     const [topSellingProducts, setTopSellingProducts] = useState([]);
//     const [overAllSales, setOverAllSales] = useState([]);
//     const [overview, setOverview] = useState([]);
//     const [invoices, setInvoices] = useState([]);





//     const monthlyData = [
//         { month: "Jan", value: 4 },
//         { month: "Feb", value: 6 },
//         { month: "Mar", value: 10 },
//         { month: "Apr", value: 17 },
//         { month: "May", value: 15 },
//         { month: "Jun", value: 19 },
//         { month: "Jul", value: 23 },
//         { month: "Aug", value: 27 },
//         { month: "Sep", value: 29 },
//         { month: "Oct", value: 25 },
//         { month: "Nov", value: 32 },
//         { month: "Dec", value: 35 }
//     ];

//     const handleBarHover = (index, event) => {
//         setHoveredBar(index);
//         const barRect = event.currentTarget.getBoundingClientRect();
//         const containerRect = event.currentTarget.closest('.chart-container').getBoundingClientRect();

//         setTooltipPosition({
//             x: barRect.left - containerRect.left + barRect.width / 2,
//             y: barRect.top - containerRect.top - 40
//         });
//     };
//     // const invoices = [
//     //     {
//     //         id: "#562354",
//     //         name: "praveena",
//     //         date: "10 Dec",
//     //         status: "Paid",
//     //         avatar: "https://taslim.oceansoftwares.in/nalsuvai/public/build/images/users/avatar-1.jpg",
//     //     },
//     //     {
//     //         id: "#485625",
//     //         name: "Connie Franco",
//     //         date: "10 Dec",
//     //         status: "Paid",
//     //         avatar: "https://taslim.oceansoftwares.in/nalsuvai/public/build/images/users/avatar-2.jpg",
//     //     },
//     //     {
//     //         id: "#321458",
//     //         name: "Adella Perez",
//     //         date: "12 Dec",
//     //         status: "Unpaid",
//     //         avatar: "https://taslim.oceansoftwares.in/nalsuvai/public/build/images/users/avatar-3.jpg",
//     //     },
//     //     {
//     //         id: "#214569",
//     //         name: "Theresa Mayers",
//     //         date: "21 Dec",
//     //         status: "Paid",
//     //         avatar: "https://taslim.oceansoftwares.in/nalsuvai/public/build/images/users/avatar-4.jpg",
//     //     },
//     //     {
//     //         id: "#565423",
//     //         name: "Oliver Gonzales",
//     //         date: "25 Dec",
//     //         status: "Unpaid",
//     //         avatar: "https://taslim.oceansoftwares.in/nalsuvai/public/build/images/users/avatar-5.jpg",
//     //     },
//     //     {
//     //         id: "#565423",
//     //         name: "Willie Verner",
//     //         date: "30 Dec",
//     //         status: "Paid",
//     //         avatar: "https://taslim.oceansoftwares.in/nalsuvai/public/build/images/users/avatar-6.jpg",
//     //     },
//     // ];

//     //     useEffect(() => {
//     //         getLatestCustomer();
//     //         getTopSellingProducts(topSellingPeriod);
//     //     }, [topSellingPeriod]);

//     //     const getLatestCustomer = async()=>{
//     //  const response = await dashboardApi.getLatestCustomer()
//     //  console.log(response,'dashboardApi-response');
//     //  if(response && response.status){
//     //     const datas = response?.response?.data?.slice(0,4)
//     //     if(datas){
//     //         setNewCustomers(datas)
//     //     }
//     //  }

//     //     }

//     //     const getTopSellingProducts = async (period) => {
//     //         const response = await dashboardApi.getTopSelling(period);
//     //         if (response && response.status) {
//     //             const datas = response?.response?.data;
//     //             if (datas) {
//     //                 setTopSellingProducts(datas);
//     //             }
//     //         }
//     //     };
//     console.log(topSellingProducts, "topSellingProducts");
//     useEffect(() => {
//         getLatestCustomer();
//         getTopSellingProducts(topSellingPeriod);
//         fetchOverAllSales();
//         fetchOverview();
//         fetchInvoices();
//     }, [topSellingPeriod]);

//     const getLatestCustomer = async () => {
//         const response = await dashboardApi.getLatestCustomer()
//         console.log(response, 'dashboardApi-response');
//         if (response && response.status) {
//             const datas = response?.response?.data?.slice(0, 4)
//             if (datas) {
//                 setNewCustomers(datas)
//             }
//         }

//     }

//     const getTopSellingProducts = async (period) => {
//         const response = await dashboardApi.getTopSelling(period);
//         if (response && response.status) {
//             const datas = response?.response?.data;
//             if (datas) {
//                 setTopSellingProducts(datas);
//             }
//         }
//     };
//     console.log(topSellingProducts, "topSellingProducts");

//     const fetchOverAllSales = async () => {
//         try {
//             const data = await dashboardApi.getOverAllSales();
//             setOverAllSales(data);
//             if (data && data.status) {
//                 setOverAllSales(data.response.data);
//             }
//         } catch (error) {
//             setOverAllSales(null);
//         }
//     };

//     const fetchOverview = async () => {
//         try {
//             const data = await dashboardApi.getOverview();
//             // setOverview(data);
//             if (data && data.status) {
//                 setOverview(data.response.data);
//             }
//         } catch (error) {
//             setOverview(null);
//         }
//     };

//     const fetchInvoices = async () => {
//         try {
//             const data = await dashboardApi.getInvoice();
//             if (data && data.status) {
//                 setInvoices(data.response.data);
//             }

//         } catch (error) {
//             setInvoices([]);
//         }
//     };
//     console.log(invoices, "invoices");
//     console.log(overview, "overview");
//     console.log(overAllSales, "overAllSales");


//     return (
//         <div className="main-content">
//             <div className="page-content">
//                 <div className="container-fluid">
//                     <div className="row mb-5">
//                         {/* Sales Overview */}
//                         <div className="col-xl-6">
//                             <div className="card">
//                                 <div className="card-body pb-0">
//                                     <div className="d-flex align-items-start justify-content-between">
//                                         <h5 className="card-title mb-4">Sales Overview</h5>
//                                         <div className="dropdown">
//                                             <button className="btn dropdown-toggle text-reset" data-bs-toggle="dropdown">
//                                                 <span className="fw-semibold">Sort By: </span>
//                                                 <span className="text-muted">Yearly <i className="mdi mdi-chevron-down ms-1" /></span>
//                                             </button>
//                                             <div className="dropdown-menu dropdown-menu-end">
//                                                 <button className="dropdown-item">Yearly</button>
//                                                 <button className="dropdown-item">Monthly</button>
//                                                 <button className="dropdown-item">Weekly</button>
//                                                 <button className="dropdown-item">Today</button>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
//                                         <div style={{ width: '100%', overflowX: 'auto' }}>
//                                             <div className="apex-chart" style={{ minWidth: '600px', minHeight: '300px', position: 'relative' }}>
//                                                 <svg
//                                                     width="100%"
//                                                     height="300"
//                                                     viewBox="0 0 1000 300"
//                                                     preserveAspectRatio="xMidYMid meet"
//                                                     style={{ overflow: 'visible' }}
//                                                 >
//                                                     {/* Y-axis */}
//                                                     <g className="apexcharts-yaxis" transform="translate(50, 20)">
//                                                         {[0, 10, 20, 30, 40].map((value, i) => (
//                                                             <text
//                                                                 key={i}
//                                                                 x="20"
//                                                                 y={260 - (value * 6.5)}
//                                                                 textAnchor="end"
//                                                                 fontSize="11px"
//                                                                 fill="#373d3f"
//                                                             >
//                                                                 {value}
//                                                             </text>
//                                                         ))}
//                                                     </g>

//                                                     {/* Chart area */}
//                                                     <g className="apexcharts-inner" transform="translate(80, 20)">
//                                                         {/* Grid lines */}
//                                                         <g className="apexcharts-grid">
//                                                             {[0, 10, 20, 30, 40].map((_, i) => (
//                                                                 <line
//                                                                     key={i}
//                                                                     x1="0"
//                                                                     y1={260 - (i * 65)}
//                                                                     x2="900"
//                                                                     y2={260 - (i * 65)}
//                                                                     stroke="#e0e0e0"
//                                                                     strokeDasharray="0"
//                                                                 />
//                                                             ))}
//                                                         </g>

//                                                         {/* Bars */}
//                                                         <g className="apexcharts-bar-series">
//                                                             {monthlyData.map((data, i) => {
//                                                                 const height = data.value * 7.4;
//                                                                 const y = 260 - height;
//                                                                 const isHovered = hoveredBar === i;
//                                                                 const fillColor = i < 9 ? "#d6043b2e" : "#d62263";

//                                                                 return (
//                                                                     <g key={i}>
//                                                                         <rect
//                                                                             x={i * 75}
//                                                                             y={y}
//                                                                             width="60"
//                                                                             height={height}
//                                                                             fill={fillColor}
//                                                                             rx="2"
//                                                                             style={{
//                                                                                 transition: 'all 0.3s ease',
//                                                                                 transformOrigin: 'center bottom',
//                                                                                 transform: isHovered ? 'scaleY(1.05) translateY(-2px)' : 'scaleY(1)',
//                                                                                 opacity: isHovered ? 0.9 : 1,
//                                                                             }}
//                                                                             onMouseEnter={(e) => handleBarHover(i, e)}
//                                                                             onMouseLeave={() => setHoveredBar(null)}
//                                                                         />
//                                                                         {/* Value labels */}
//                                                                         <text
//                                                                             x={i * 75 + 30}
//                                                                             y={y - 5}
//                                                                             textAnchor="middle"
//                                                                             fontSize="11px"
//                                                                             fill="#373d3f"
//                                                                         >
//                                                                             {data.value}
//                                                                         </text>
//                                                                     </g>
//                                                                 );
//                                                             })}
//                                                         </g>

//                                                         {/* X-axis labels */}
//                                                         <g className="apexcharts-xaxis" transform="translate(0, 260)">
//                                                             {monthlyData.map((data, i) => (
//                                                                 <text
//                                                                     key={i}
//                                                                     x={i * 75 + 30}
//                                                                     y="20"
//                                                                     textAnchor="middle"
//                                                                     fontSize="12px"
//                                                                     fill="#373d3f"
//                                                                 >
//                                                                     {data.month}
//                                                                 </text>
//                                                             ))}
//                                                         </g>
//                                                     </g>
//                                                 </svg>

//                                                 {/* Tooltip - positioned near the bar */}
//                                                 {hoveredBar !== null && (
//                                                     <div
//                                                         className="chart-tooltip"
//                                                         style={{
//                                                             position: 'absolute',
//                                                             left: `${tooltipPosition.x}px`,
//                                                             top: `${tooltipPosition.y}px`,
//                                                             background: 'white',
//                                                             padding: '8px 12px',
//                                                             borderRadius: '4px',
//                                                             boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                                                             zIndex: 100,
//                                                             pointerEvents: 'none',
//                                                             minWidth: '120px',
//                                                             transform: 'translateX(-100%)',
//                                                             transition: 'opacity 0.2s ease'
//                                                         }}
//                                                     >
//                                                         <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
//                                                             {monthlyData[hoveredBar].month}
//                                                         </div>
//                                                         <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//                                                             <span>Sales:</span>
//                                                             <span style={{ fontWeight: '600' }}>{monthlyData[hoveredBar].value}</span>
//                                                         </div>
//                                                         <div style={{
//                                                             width: '100%',
//                                                             height: '3px',
//                                                             background: hoveredBar < 9 ? "#d6043b" : "#d62263",
//                                                             marginTop: '6px',
//                                                             borderRadius: '2px'
//                                                         }} />
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Total Sales & Orders */}
//                         <div className="col-xl-6">
//                             <div className='card' style={{ minHeight: "360px" }}>
//                                 <div className="d-flex align-items-start justify-content-end mt-3">
//                                     {/* <h5 className="card-title">Sales Overview</h5> */}
//                                     <div className="dropdown">
//                                         <button className="btn dropdown-toggle text-reset" data-bs-toggle="dropdown">
//                                             <span className="fw-semibold">Sort By: </span>
//                                             <span className="text-muted">Yearly <i className="mdi mdi-chevron-down ms-1" /></span>
//                                         </button>
//                                         <div className="dropdown-menu dropdown-menu-end">
//                                             <button className="dropdown-item">Yearly</button>
//                                             <button className="dropdown-item">Monthly</button>
//                                             <button className="dropdown-item">Weekly</button>
//                                             <button className="dropdown-item">Today</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="row" style={{ marginTop: "20px" }}>
//                                     {/* Total Sales */}

//                                     <div className="col-xl-6">
//                                         <div className="card">
//                                             <div className="card-body">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <div className="d-flex align-items-center">
//                                                         <div className="avatar">
//                                                             <div className="avatar-title rounded bg-primary-subtle">
//                                                                 <i className="bx bx-check-shield font-size-24 text-primary" />
//                                                             </div>
//                                                         </div>
//                                                         <div className="ms-3">
//                                                             <h6 className="mb-0 font-size-15">Total Sales</h6>
//                                                         </div>
//                                                     </div>
//                                                     <div className="dropdown">
//                                                         {/* <button className="btn dropdown-toggle" data-bs-toggle="dropdown">
//                                                         <i className="bx bx-dots-horizontal text-muted font-size-22" />
//                                                     </button> */}
//                                                         {/* <div className="dropdown-menu dropdown-menu-end">
//                                                         <button className="dropdown-item">This Year</button>
//                                                         <button className="dropdown-item">This Month</button>
//                                                         <button className="dropdown-item">This Week</button>
//                                                         <button className="dropdown-item">Today</button>
//                                                     </div> */}
//                                                     </div>
//                                                 </div>

//                                                 <h4 className="mt-4 pt-1 mb-0 font-size-22">
//                                                     ₹34,123 <span className="text-success fw-medium font-size-13 align-middle"> <i className="mdi mdi-arrow-up" /> 8.34%</span>
//                                                 </h4>
//                                                 <p className="text-muted mb-0 mt-1">Total value of sales</p>
//                                                 <div id="mini-1" className="apex-charts" style={{ minHeight: '35px' }}>
//                                                     {/* Mini Chart 1 */}

//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Total Orders */}
//                                     <div className="col-xl-6">
//                                         <div className="card">
//                                             <div className="card-body">
//                                                 <div className="d-flex align-items-center justify-content-between">
//                                                     <div className="d-flex align-items-center">
//                                                         <div className="avatar">
//                                                             <div className="avatar-title rounded bg-primary-subtle">
//                                                                 <i className="bx bx-cart-alt font-size-24 text-primary" />
//                                                             </div>
//                                                         </div>
//                                                         <div className="ms-3">
//                                                             <h6 className="mb-0 font-size-15">Total Orders</h6>
//                                                         </div>
//                                                     </div>
//                                                     <div className="dropdown">
//                                                         {/* <button className="btn dropdown-toggle" data-bs-toggle="dropdown">
//                                                         <i className="bx bx-dots-horizontal text-muted font-size-22" />
//                                                     </button> */}
//                                                         {/* <div className="dropdown-menu dropdown-menu-end">
//                                                         <button className="dropdown-item">Total</button>
//                                                         <button className="dropdown-item">Completed</button>
//                                                         <button className="dropdown-item">Transit</button>
//                                                         <button className="dropdown-item">Pending</button>
//                                                     </div> */}
//                                                     </div>
//                                                 </div>

//                                                 <h4 className="mt-4 pt-1 mb-0 font-size-22">
//                                                     63,234 <span className="text-danger fw-medium font-size-13 align-middle"> <i className="mdi mdi-arrow-down" /> 3.68%</span>
//                                                 </h4>
//                                                 <p className="text-muted mb-0 mt-1">Total number of orders</p>
//                                                 <div id="mini-2" className="apex-charts" style={{ minHeight: '35px' }}>
//                                                     {/* Mini Chart 2 */}
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     </div>




//                                 </div>
//                                 <div className="row mt-1">
//                                     {/* Today Products Sold */}
//                                     <div className="col-xl-6">
//                                         <div className="card">
//                                             <div className="card-body">
//                                                 <div>
//                                                     <div className="d-flex align-items-center">
//                                                         <div className="avatar">
//                                                             <div className="avatar-title rounded bg-primary-subtle">
//                                                                 <i className="bx bx-package font-size-24 mb-0 text-primary" />
//                                                             </div>
//                                                         </div>

//                                                         <div className="flex-grow-1 ms-3">
//                                                             <h6 className="mb-0 font-size-15">Today Products Sold</h6>
//                                                         </div>

//                                                         <div className="flex-shrink-0">
//                                                             <div className="dropdown">
//                                                                 {/* <a className="dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                                                 <i className="bx bx-dots-horizontal text-muted font-size-22" />
//                                                             </a> */}
//                                                                 {/* <div className="dropdown-menu dropdown-menu-end">
//                                                                 <a className="dropdown-item" href="#">This Year</a>
//                                                                 <a className="dropdown-item" href="#">This Month</a>
//                                                                 <a className="dropdown-item" href="#">This Week</a>
//                                                                 <a className="dropdown-item" href="#">Today</a>
//                                                             </div> */}
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     <div>
//                                                         <h4 className="mt-4 pt-1 mb-0 font-size-22">42,534 <span className="text-danger fw-medium font-size-13 align-middle"> <i className="mdi mdi-arrow-down" /> 2.64% </span> </h4>
//                                                         <div className="d-flex mt-1 align-items-end overflow-hidden">
//                                                             <div className="flex-grow-1">
//                                                                 <p className="text-muted mb-0 text-truncate">Total Number of products sold</p>
//                                                             </div>
//                                                             <div className="flex-shrink-0">
//                                                                 <div id="mini-3" data-colors='["#1f58c7"]' className="apex-charts" style={{ minHeight: '35px' }}>
//                                                                     {/* ApexCharts Placeholder */}
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>


//                                     {/* New customers */}
//                                     <div className="col-xl-6">
//                                         <div className="card">
//                                             <div className="card-body">
//                                                 <div>
//                                                     <div className="d-flex align-items-center">
//                                                         <div className="avatar">
//                                                             <div className="avatar-title rounded bg-primary-subtle">
//                                                                 <i className="bx bx-rocket font-size-24 mb-0 text-primary"></i>
//                                                             </div>
//                                                         </div>

//                                                         <div className="flex-grow-1 ms-3">
//                                                             <h6 className="mb-0 font-size-15">New customers</h6>
//                                                         </div>

//                                                         <div className="flex-shrink-0">
//                                                             <div className="dropdown">
//                                                                 {/* <a
//                                                                 className="dropdown-toggle"
//                                                                 href="#"
//                                                                 data-bs-toggle="dropdown"
//                                                                 aria-haspopup="true"
//                                                                 aria-expanded="false"
//                                                             >
//                                                                 <i className="bx bx-dots-horizontal text-muted font-size-22"></i>
//                                                             </a> */}
//                                                                 {/* <div className="dropdown-menu dropdown-menu-end">
//                                                                 <a className="dropdown-item" href="#">This Year</a>
//                                                                 <a className="dropdown-item" href="#">This Month</a>
//                                                                 <a className="dropdown-item" href="#">This Week</a>
//                                                                 <a className="dropdown-item" href="#">Today</a>
//                                                             </div> */}
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     <div>
//                                                         <h4 className="mt-4 pt-1 mb-0 font-size-22">
//                                                             6,482 <span className="text-success fw-medium font-size-13 align-middle">
//                                                                 <i className="mdi mdi-arrow-up"></i> 5.79%
//                                                             </span>
//                                                         </h4>
//                                                         <div className="d-flex mt-1 align-items-end overflow-hidden">
//                                                             <div className="flex-grow-1">
//                                                                 <p className="text-muted mb-0 text-truncate">
//                                                                     Total Number of first-time customers in the selected period
//                                                                 </p>
//                                                             </div>
//                                                             <div className="flex-shrink-0">
//                                                                 <div
//                                                                     id="mini-4"
//                                                                     className="apex-charts"
//                                                                     style={{ minHeight: '35px' }}
//                                                                 >
//                                                                     <div id="apexchartsooxflywq" className="apexcharts-canvas" style={{ width: '110px', height: '35px' }}>
//                                                                         <svg
//                                                                             id="SvgjsSvg6255"
//                                                                             width="110"
//                                                                             height="35"
//                                                                             xmlns="http://www.w3.org/2000/svg"
//                                                                             className="apexcharts-svg"
//                                                                         >
//                                                                             <foreignObject x="0" y="0" width="110" height="35">
//                                                                                 <div className="apexcharts-legend"></div>
//                                                                             </foreignObject>
//                                                                             <g className="apexcharts-inner apexcharts-graphical" transform="translate(0, 1)">
//                                                                                 {/* Add your SVG chart path or chart content here */}
//                                                                             </g>
//                                                                         </svg>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>

//                                 </div>
//                             </div>
//                         </div>
//                     </div>


//                     {/* Add more rows below as needed */}

//                     <div className="row mb-5">
//                         <div className="col-xxl-12">
//                             <div className="row">
//                                 <div className="col-xl-7">
//                                     <div className="card">
//                                         <div className="card-body">
//                                             <div className="d-flex align-items-start mb-2">
//                                                 <div className="flex-grow-1">
//                                                     <h5 className="card-title">Top Selling Products</h5>
//                                                 </div>
//                                                 <div className="flex-shrink-0">
//                                                     <div className="dropdown">
//                                                         <button className="dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                                             {topSellingPeriod.charAt(0).toUpperCase() + topSellingPeriod.slice(1)}<i className="mdi mdi-chevron-down ms-1"></i>
//                                                         </button>
//                                                         <div className="dropdown-menu dropdown-menu-end">
//                                                             <button className="dropdown-item" onClick={() => setTopSellingPeriod('Yearly')}>Yearly</button>
//                                                             <button className="dropdown-item" onClick={() => setTopSellingPeriod('Monthly')}>Monthly</button>
//                                                             <button className="dropdown-item" onClick={() => setTopSellingPeriod('Weekly')}>Weekly</button>
//                                                             <button className="dropdown-item" onClick={() => setTopSellingPeriod('Today')}>Today</button>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             <div className="mx-n4 simplebar-scrollable-y" data-simplebar="init" style={{ maxHeight: '400px' }}>
//                                                 <div className="simplebar-content-wrapper" style={{ paddingTop: '20px' }}>
//                                                     <div className="simplebar-content">
//                                                         <div className="row align-items-center">
//                                                             {topSellingProducts.map((product, idx) => (
//                                                                 <div className="col-12" key={product._id}>
//                                                                     <div className="popular-product-box rounded my-2 pb-4 d-flex align-items-center">
//                                                                         <div className="popular-product-img p-2" style={{ minWidth: 100 }}>
//                                                                             <img
//                                                                                 src={product.productImage && product.productImage[0] ? `${IMAGE_BASE_URL}/${product.productImage[0].docPath}/${product.productImage[0].docName}` : '/assets/images/admin_profile.png'}
//                                                                                 alt={product.productName}
//                                                                                 style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 25 }}
//                                                                             />
//                                                                         </div>
//                                                                         <div className="flex-grow-1 ms-3 overflow-hidden">
//                                                                             <h5 className="mb-1 text-truncate">
//                                                                                 <span className="font-size-15 text-body">{product.productName}</span>
//                                                                             </h5>
//                                                                             <p className="text-muted fw-semibold mb-0 text-truncate">₹ {product.price}</p>
//                                                                         </div>
//                                                                         <div className="flex-shrink-0 text-end ms-3">
//                                                                             <h5 className="mb-1 font-size-15 text-body">₹{product.totalPriceSold.toLocaleString()}</h5>
//                                                                             <p className="text-muted fw-semibold mb-0">{product.totalQuantitySold} Sales</p>
//                                                                         </div>
//                                                                     </div>
//                                                                 </div>
//                                                             ))}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="col-xl-5">
//                                     <div className="card" style={{ maxHeight: '450px' }}>
//                                         <div className="card-body" >
//                                             <div className="d-flex align-items-start mb-2">
//                                                 <div className="flex-grow-1">
//                                                     <h5 className="card-title">Recent Customers</h5>
//                                                 </div>
//                                                 {/* <div className="flex-shrink-0 m-4 p-2">
//                                                     <div className="dropdown">
//                                                         <button className="dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//                                                             <i className="bx bx-dots-horizontal font-size-22"></i>
//                                                         </button>
//                                                         <div className="dropdown-menu dropdown-menu-end">
//                                                             <a className="dropdown-item" href="#">Yearly</a>
//                                                             <a className="dropdown-item" href="#">Monthly</a>
//                                                             <a className="dropdown-item" href="#">Weekly</a>
//                                                             <a className="dropdown-item" href="#">Today</a>
//                                                         </div>
//                                                     </div>
//                                                 </div> */}
//                                             </div>


//                                             <div className="mx-n4 simplebar-scrollable-y" data-simplebar="init" style={{ maxHeight: '400px' }}>
//                                                 <div className="simplebar-content-wrapper" style={{ padding: 0 }}>
//                                                     <div className="simplebar-content">
//                                                         {/* Dynamic customer list mapping using newCustomer state */}
//                                                         {newCustomer.map((customer, index) => (
//                                                             <div
//                                                                 key={customer._id}
//                                                                 className={`${index !== newCustomer.length - 1 ? 'border-bottom' : ''} loyal-customers-box ${index === 0 ? 'pt-2' : index === newCustomer.length - 1 ? 'py-3' : ''}`}
//                                                             >
//                                                                 <div className="d-flex align-items-center">
//                                                                     <img
//                                                                         src={`/assets/images/admin_profile.png`}
//                                                                         className="rounded-circle avatar img-thumbnail"
//                                                                         alt={customer.name}
//                                                                     />
//                                                                     <div className="flex-grow-1 ms-3 overflow-hidden">
//                                                                         <h5 className="font-size-15 mb-1 text-truncate">{customer.name}</h5>
//                                                                         <p className="text-muted text-truncate mb-0">
//                                                                             {customer.email || `${customer.phone}${customer.address ? `, ${customer.address.split(',')[0]}` : ''}`}
//                                                                         </p>
//                                                                     </div>
//                                                                     {/* Rating section commented out as per original */}
//                                                                     {/* <div className="flex-shrink-0">
//                   <h5 className="font-size-14 mb-0 text-truncate w-xs bg-light p-2 rounded text-center">
//                     4.7 <i className="bx bxs-star font-size-14 text-primary ms-1"></i>
//                   </h5>
//                 </div> */}
//                                                                 </div>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="card">
//                         <div className="card-body">
//                             <div className="d-flex flex-wrap align-items-center mb-3">
//                                 <h5 className="card-title me-2">Recent Invoices</h5>
//                                 <div className="ms-auto">
//                                     {/* <div className="dropdown">
//                                         <a
//                                             className="dropdown-toggle text-reset"
//                                             href="#"
//                                             data-bs-toggle="dropdown"
//                                         >
//                                             <span className="text-muted text-xs">Sort By: </span>
//                                             <span className="fw-medium">Weekly <i className="mdi mdi-chevron-down ms-1" /></span>
//                                         </a>
//                                         <div className="dropdown-menu dropdown-menu-end">
//                                             <a className="dropdown-item" href="#">Monthly</a>
//                                             <a className="dropdown-item" href="#">Yearly</a>
//                                         </div>
//                                     </div> */}
//                                 </div>
//                             </div>

//                             <div className="table-responsive" style={{ maxHeight: 332, overflowY: "auto" }}>
//                                 <table className="table table-striped table-centered align-middle table-nowrap mb-0">
//                                     <thead>
//                                         <tr>
//                                             <th style={{ width: 30 }}>
//                                                 <input type="checkbox" className="form-check-input" />
//                                             </th>
//                                             <th>Order ID</th>
//                                             <th style={{ width: 190 }}>Customer Name</th>
//                                             <th>Date</th>
//                                             <th>Payment Status</th>
//                                             <th>Action</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody>
//                                         {invoices.map((invoice, index) => (
//                                             <tr key={index}>
//                                                 <td>
//                                                     <input type="checkbox" className="form-check-input" />
//                                                 </td>
//                                                 <td className="fw-semibold">{invoice.id}</td>
//                                                 <td>
//                                                     <div className="d-flex align-items-center">
//                                                         <img
//                                                             src={invoice.avatar}
//                                                             alt={invoice.name}
//                                                             className="rounded-circle avatar-sm"
//                                                         />
//                                                         <div className="ms-3">{invoice.name}</div>
//                                                     </div>
//                                                 </td>
//                                                 <td>{invoice.date}</td>
//                                                 <td>
//                                                     <div
//                                                         className={`badge font-size-12 ${invoice.status === "Paid"
//                                                             ? "bg-success-subtle text-success"
//                                                             : "bg-danger-subtle text-danger"
//                                                             }`}
//                                                     >
//                                                         {invoice.status}
//                                                     </div>
//                                                 </td>
//                                                 <td>
//                                                     <div className="dropdown">
//                                                         <a
//                                                             className="text-muted dropdown-toggle font-size-18"
//                                                             data-bs-toggle="dropdown"
//                                                             role="button"
//                                                         >
//                                                             <i className="mdi mdi-dots-horizontal"></i>
//                                                         </a>
//                                                         <div className="dropdown-menu dropdown-menu-end">
//                                                             <a className="dropdown-item" href="#">View</a>
//                                                             <a className="dropdown-item" href="#">Print</a>
//                                                             <a className="dropdown-item" href="#">Delete</a>
//                                                         </div>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </div>
//                     </div>




//                 </div>
//             </div>
//         </div>
//     );
// }

import React, { useEffect, useState } from 'react';
import "./styles/nalsuvaiDashboardLayer.css"
import dashboardApi from '../apiProvider/dashboardApi';
import { IMAGE_BASE_URL } from '../network/apiClient';

export default function NalsuvaiDashboardLayer() {
    const [hoveredBar, setHoveredBar] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [newCustomer, setNewCustomers] = useState([]);
    const [topSellingPeriod, setTopSellingPeriod] = useState('Yearly');
    const [topOverAllViewPeriod, setOverAllViewPeriod] = useState('Yearly');
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [overAllSales, setOverAllSales] = useState([]);
    const [overview, setOverview] = useState({
        totalSales: { value: 0, percentage: 0 },
        totalOrders: { value: 0, percentage: 0 },
        totalProductsSold: { value: 0, percentage: 0 },
        newCustomers: { value: 0, percentage: 0 }
    });
    const [invoices, setInvoices] = useState([]);

    // Generate monthly data from overAllSales API response
    const generateMonthlyData = () => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.map(month => {
            const found = overAllSales.find(item => item.month === month);
            return {
                month,
                value: found ? Math.round(found.totalSalesAmount / 1000) : 0 // Convert to thousands for display
            };
        });
    };

    const monthlyData = generateMonthlyData();

    const handleBarHover = (index, event) => {
        setHoveredBar(index);
        const barRect = event.currentTarget.getBoundingClientRect();
        const containerRect = event.currentTarget.closest('.chart-container').getBoundingClientRect();

        setTooltipPosition({
            x: barRect.left - containerRect.left + barRect.width / 2,
            y: barRect.top - containerRect.top - 40
        });
    };

    useEffect(() => {
        getLatestCustomer();
        getTopSellingProducts(topSellingPeriod);
        fetchOverAllSales();
        fetchOverview(topOverAllViewPeriod);
        fetchInvoices();
    }, [topSellingPeriod, topOverAllViewPeriod]);

    const getLatestCustomer = async () => {
        const response = await dashboardApi.getLatestCustomer();
        if (response && response.status) {
            const datas = response?.response?.data?.slice(0, 4);
            if (datas) {
                setNewCustomers(datas);
            }
        }
    };

    const getTopSellingProducts = async (period) => {
        const response = await dashboardApi.getTopSelling(period);
        if (response && response.status) {
            const datas = response?.response?.data;
            if (datas) {
                setTopSellingProducts(datas);
            }
        }
    };

    const fetchOverAllSales = async () => {
        try {
            const response = await dashboardApi.getOverAllSales();
            if (response && response.status) {
                setOverAllSales(response.response.data);
            }
        } catch (error) {
            setOverAllSales([]);
        }
    };

    const fetchOverview = async (period) => {
        try {
            const response = await dashboardApi.getOverview(period);
            if (response && response.status) {
                setOverview(response.response.data);
            }
        } catch (error) {
            setOverview({
                totalSales: { value: 0, percentage: 0 },
                totalOrders: { value: 0, percentage: 0 },
                totalProductsSold: { value: 0, percentage: 0 },
                newCustomers: { value: 0, percentage: 0 }
            });
        }
    };

    const fetchInvoices = async () => {
        try {
            const response = await dashboardApi.getInvoice();
            if (response && response.status) {
                // Map API response to match your UI structure
                const formattedInvoices = response.response.data.map(invoice => ({
                    id: invoice.orderId,
                    name: invoice.customerName || "Unknown Customer",
                    date: invoice.date,
                    status: invoice.paymentStatus,
                    avatar: "/assets/images/admin_profile.png" // Default avatar
                }));
                setInvoices(formattedInvoices);
            }
        } catch (error) {
            setInvoices([]);
        }
    };

    // Format currency with Indian Rupee symbol
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount).replace('₹', '₹ ');
    };

    return (
        <div className="main-content">
            <div className="page-content">
                <div className="container-fluid">
                    <div className="row mb-5">
                        {/* Sales Overview */}
                        <div className="col-xl-6">
                            <div className="card">
                                <div className="card-body pb-0">
                                    <div className="d-flex align-items-start justify-content-between">
                                        <h5 className="card-title mb-4">Sales Overview</h5>
                                        {/* <div className="dropdown">
                                            <button className="btn dropdown-toggle text-reset" data-bs-toggle="dropdown">
                                                <span className="fw-semibold">Sort By: </span>
                                                <span className="text-muted">Yearly <i className="mdi mdi-chevron-down ms-1" /></span>
                                            </button>
                                            <div className="dropdown-menu dropdown-menu-end">
                                                <button className="dropdown-item">Yearly</button>
                                                <button className="dropdown-item">Monthly</button>
                                                <button className="dropdown-item">Weekly</button>
                                                <button className="dropdown-item">Today</button>
                                            </div>
                                        </div> */}
                                    </div>

                                    <div className="chart-container" style={{ position: 'relative', height: '300px', width: '100%' }}>
                                        <div style={{ width: '100%', overflowX: 'auto' }}>
                                            <div className="apex-chart" style={{ minWidth: '600px', minHeight: '300px', position: 'relative' }}>
                                                <svg
                                                    width="100%"
                                                    height="300"
                                                    viewBox="0 0 1000 300"
                                                    preserveAspectRatio="xMidYMid meet"
                                                    style={{ overflow: 'visible' }}
                                                >
                                                    {/* Y-axis */}
                                                    <g className="apexcharts-yaxis" transform="translate(50, 20)">
                                                        {[0, 10, 20, 30, 40].map((value, i) => (
                                                            <text
                                                                key={i}
                                                                x="20"
                                                                y={260 - (value * 6.5)}
                                                                textAnchor="end"
                                                                fontSize="11px"
                                                                fill="#373d3f"
                                                            >
                                                                {value}k
                                                            </text>
                                                        ))}
                                                    </g>

                                                    {/* Chart area */}
                                                    <g className="apexcharts-inner" transform="translate(80, 20)">
                                                        {/* Grid lines */}
                                                        <g className="apexcharts-grid">
                                                            {[0, 10, 20, 30, 40].map((_, i) => (
                                                                <line
                                                                    key={i}
                                                                    x1="0"
                                                                    y1={260 - (i * 65)}
                                                                    x2="900"
                                                                    y2={260 - (i * 65)}
                                                                    stroke="#e0e0e0"
                                                                    strokeDasharray="0"
                                                                />
                                                            ))}
                                                        </g>

                                                        {/* Bars */}
                                                        <g className="apexcharts-bar-series">
                                                            {monthlyData.map((data, i) => {
                                                                const height = data.value * 6.5;
                                                                const y = 260 - height;
                                                                const isHovered = hoveredBar === i;
                                                                const fillColor = i < 9 ? "#d6043b2e" : "#d62263";

                                                                return (
                                                                    <g key={i}>
                                                                        <rect
                                                                            x={i * 75}
                                                                            y={y}
                                                                            width="60"
                                                                            height={height}
                                                                            fill={fillColor}
                                                                            rx="2"
                                                                            style={{
                                                                                transition: 'all 0.3s ease',
                                                                                transformOrigin: 'center bottom',
                                                                                transform: isHovered ? 'scaleY(1.05) translateY(-2px)' : 'scaleY(1)',
                                                                                opacity: isHovered ? 0.9 : 1,
                                                                            }}
                                                                            onMouseEnter={(e) => handleBarHover(i, e)}
                                                                            onMouseLeave={() => setHoveredBar(null)}
                                                                        />
                                                                        {/* Value labels */}
                                                                        <text
                                                                            x={i * 75 + 30}
                                                                            y={y - 5}
                                                                            textAnchor="middle"
                                                                            fontSize="11px"
                                                                            fill="#373d3f"
                                                                        >
                                                                            {data.value}k
                                                                        </text>
                                                                    </g>
                                                                );
                                                            })}
                                                        </g>

                                                        {/* X-axis labels */}
                                                        <g className="apexcharts-xaxis" transform="translate(0, 260)">
                                                            {monthlyData.map((data, i) => (
                                                                <text
                                                                    key={i}
                                                                    x={i * 75 + 30}
                                                                    y="20"
                                                                    textAnchor="middle"
                                                                    fontSize="12px"
                                                                    fill="#373d3f"
                                                                >
                                                                    {data.month}
                                                                </text>
                                                            ))}
                                                        </g>
                                                    </g>
                                                </svg>

                                                {/* Tooltip - positioned near the bar */}
                                                {hoveredBar !== null && (
                                                    <div
                                                        className="chart-tooltip"
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${tooltipPosition.x}px`,
                                                            top: `${tooltipPosition.y}px`,
                                                            background: 'white',
                                                            padding: '8px 12px',
                                                            borderRadius: '4px',
                                                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                                                            zIndex: 100,
                                                            pointerEvents: 'none',
                                                            minWidth: '120px',
                                                            transform: 'translateX(-100%)',
                                                            transition: 'opacity 0.2s ease'
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                                            {monthlyData[hoveredBar].month}
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                            <span>Sales:</span>
                                                            <span style={{ fontWeight: '600' }}>₹{monthlyData[hoveredBar].value * 1000}</span>
                                                        </div>
                                                        <div style={{
                                                            width: '100%',
                                                            height: '3px',
                                                            background: hoveredBar < 9 ? "#d6043b" : "#d62263",
                                                            marginTop: '6px',
                                                            borderRadius: '2px'
                                                        }} />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Sales & Orders */}
                        <div className="col-xl-6">
                            <div className='card' style={{ minHeight: "360px" }}>
                                <div className="d-flex align-items-start justify-content-end mt-3">
                                    <div className="dropdown">
                                        {/* <button className="btn dropdown-toggle text-reset" data-bs-toggle="dropdown">
                                            <span className="fw-semibold">Sort By: </span>
                                            <span className="text-muted">Yearly <i className="mdi mdi-chevron-down ms-1" /></span>
                                        </button> */}
                                        <button className="dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            {topOverAllViewPeriod.charAt(0).toUpperCase() + topOverAllViewPeriod.slice(1)}<i className="mdi mdi-chevron-down ms-1"></i>
                                        </button>
                                        {/* <div className="dropdown-menu dropdown-menu-end">
                                            <button className="dropdown-item">Yearly</button>
                                            <button className="dropdown-item">Monthly</button>
                                            <button className="dropdown-item">Weekly</button>
                                            <button className="dropdown-item">Today</button>
                                        </div> */}
                                        <div className="dropdown-menu dropdown-menu-end">
                                            <button className="dropdown-item" onClick={() => setOverAllViewPeriod('Yearly')}>Yearly</button>
                                            <button className="dropdown-item" onClick={() => setOverAllViewPeriod('Monthly')}>Monthly</button>
                                            <button className="dropdown-item" onClick={() => setOverAllViewPeriod('Weekly')}>Weekly</button>
                                            <button className="dropdown-item" onClick={() => setOverAllViewPeriod('Today')}>Today</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "20px" }}>
                                    {/* Total Sales */}
                                    <div className="col-xl-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar">
                                                            <div className="avatar-title rounded bg-primary-subtle">
                                                                <i className="bx bx-check-shield font-size-24 text-primary" />
                                                            </div>
                                                        </div>
                                                        <div className="ms-3">
                                                            <h6 className="mb-0 font-size-15">Total Sales</h6>
                                                        </div>
                                                    </div>
                                                </div>

                                                <h4 className="mt-4 pt-1 mb-0 font-size-22">
                                                    {formatCurrency(overview.totalSales.value)}
                                                    <span className={`fw-medium font-size-13 align-middle ${overview.totalSales.percentage >= 0 ? 'text-success' : 'text-danger'}`}>
                                                        <i className={`mdi mdi-arrow-${overview.totalSales.percentage >= 0 ? 'up' : 'down'}`} />
                                                        {Math.abs(overview.totalSales.percentage)}%
                                                    </span>
                                                </h4>
                                                <p className="text-muted mb-0 mt-1">Total value of sales</p>
                                                <div id="mini-1" className="apex-charts" style={{ minHeight: '35px' }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Orders */}
                                    <div className="col-xl-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar">
                                                            <div className="avatar-title rounded bg-primary-subtle">
                                                                <i className="bx bx-cart-alt font-size-24 text-primary" />
                                                            </div>
                                                        </div>
                                                        <div className="ms-3">
                                                            <h6 className="mb-0 font-size-15">Total Orders</h6>
                                                        </div>
                                                    </div>
                                                </div>

                                                <h4 className="mt-4 pt-1 mb-0 font-size-22">
                                                    {overview.totalOrders.value.toLocaleString()}
                                                    <span className={`fw-medium font-size-13 align-middle ${overview.totalOrders.percentage >= 0 ? 'text-success' : 'text-danger'}`}>
                                                        <i className={`mdi mdi-arrow-${overview.totalOrders.percentage >= 0 ? 'up' : 'down'}`} />
                                                        {Math.abs(overview.totalOrders.percentage)}%
                                                    </span>
                                                </h4>
                                                <p className="text-muted mb-0 mt-1">Total number of orders</p>
                                                <div id="mini-2" className="apex-charts" style={{ minHeight: '35px' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-1">
                                    {/* Today Products Sold */}
                                    <div className="col-xl-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <div>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar">
                                                            <div className="avatar-title rounded bg-primary-subtle">
                                                                <i className="bx bx-package font-size-24 mb-0 text-primary" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 ms-3">
                                                            <h6 className="mb-0 font-size-15">Total Products Sold</h6>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="mt-4 pt-1 mb-0 font-size-22">
                                                            {overview.totalProductsSold.value.toLocaleString()}
                                                            <span className={`fw-medium font-size-13 align-middle ${overview.totalProductsSold.percentage >= 0 ? 'text-success' : 'text-danger'}`}>
                                                                <i className={`mdi mdi-arrow-${overview.totalProductsSold.percentage >= 0 ? 'up' : 'down'}`} />
                                                                {Math.abs(overview.totalProductsSold.percentage)}%
                                                            </span>
                                                        </h4>
                                                        <div className="d-flex mt-1 align-items-end overflow-hidden">
                                                            <div className="flex-grow-1">
                                                                <p className="text-muted mb-0 text-truncate">Total Number of products sold</p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <div id="mini-3" data-colors='["#1f58c7"]' className="apex-charts" style={{ minHeight: '35px' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* New customers */}
                                    <div className="col-xl-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <div>
                                                    <div className="d-flex align-items-center">
                                                        <div className="avatar">
                                                            <div className="avatar-title rounded bg-primary-subtle">
                                                                <i className="bx bx-rocket font-size-24 mb-0 text-primary"></i>
                                                            </div>
                                                        </div>
                                                        <div className="flex-grow-1 ms-3">
                                                            <h6 className="mb-0 font-size-15">New customers</h6>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="mt-4 pt-1 mb-0 font-size-22">
                                                            {overview.newCustomers.value.toLocaleString()}
                                                            <span className={`fw-medium font-size-13 align-middle ${overview.newCustomers.percentage >= 0 ? 'text-success' : 'text-danger'}`}>
                                                                <i className={`mdi mdi-arrow-${overview.newCustomers.percentage >= 0 ? 'up' : 'down'}`} />
                                                                {Math.abs(overview.newCustomers.percentage)}%
                                                            </span>
                                                        </h4>
                                                        <div className="d-flex mt-1 align-items-end overflow-hidden">
                                                            <div className="flex-grow-1">
                                                                <p className="text-muted mb-0 text-truncate">
                                                                    Total Number of first-time customers in the selected period
                                                                </p>
                                                            </div>
                                                            <div className="flex-shrink-0">
                                                                <div id="mini-4" className="apex-charts" style={{ minHeight: '35px' }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Top Selling Products and Recent Customers */}
                    <div className="row mb-5">
                        <div className="col-xxl-12">
                            <div className="row">
                                <div className="col-xl-7">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex align-items-start mb-2">
                                                <div className="flex-grow-1">
                                                    <h5 className="card-title">Top Selling Products</h5>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <div className="dropdown">
                                                        <button className="dropdown-toggle text-muted" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            {topSellingPeriod.charAt(0).toUpperCase() + topSellingPeriod.slice(1)}<i className="mdi mdi-chevron-down ms-1"></i>
                                                        </button>
                                                        <div className="dropdown-menu dropdown-menu-end">
                                                            <button className="dropdown-item" onClick={() => setTopSellingPeriod('Yearly')}>Yearly</button>
                                                            <button className="dropdown-item" onClick={() => setTopSellingPeriod('Monthly')}>Monthly</button>
                                                            <button className="dropdown-item" onClick={() => setTopSellingPeriod('Weekly')}>Weekly</button>
                                                            <button className="dropdown-item" onClick={() => setTopSellingPeriod('Today')}>Today</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mx-n4 simplebar-scrollable-y" data-simplebar="init" style={{ maxHeight: '400px' }}>
                                                <div className="simplebar-content-wrapper" style={{ paddingTop: '20px' }}>
                                                    <div className="simplebar-content">
                                                        <div className="row align-items-center">
                                                            {topSellingProducts.map((product, idx) => (
                                                                <div className="col-12" key={product._id}>
                                                                    <div className="popular-product-box rounded my-2 pb-4 d-flex align-items-center">
                                                                        <div className="popular-product-img p-2" style={{ minWidth: 100 }}>
                                                                            <img
                                                                                src={product.productImage && product.productImage[0] ? `${IMAGE_BASE_URL}/${product.productImage[0].docPath}/${product.productImage[0].docName}` : '/assets/images/admin_profile.png'}
                                                                                alt={product.productName}
                                                                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 25 }}
                                                                            />
                                                                        </div>
                                                                        <div className="flex-grow-1 ms-3 overflow-hidden">
                                                                            <h5 className="mb-1 text-truncate">
                                                                                <span className="font-size-15 text-body">{product.productName}</span>
                                                                            </h5>
                                                                            <p className="text-muted fw-semibold mb-0 text-truncate">₹ {product.price}</p>
                                                                        </div>
                                                                        <div className="flex-shrink-0 text-end ms-3">
                                                                            <h5 className="mb-1 font-size-15 text-body">₹{product.totalPriceSold?.toLocaleString() || '0'}</h5>
                                                                            <p className="text-muted fw-semibold mb-0">{product.totalQuantitySold || '0'} Sales</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-5">
                                    <div className="card" style={{ maxHeight: '450px' }}>
                                        <div className="card-body">
                                            <div className="d-flex align-items-start mb-2">
                                                <div className="flex-grow-1">
                                                    <h5 className="card-title">Recent Customers</h5>
                                                </div>
                                            </div>

                                            <div className="mx-n4 simplebar-scrollable-y" data-simplebar="init" style={{ maxHeight: '400px' }}>
                                                <div className="simplebar-content-wrapper" style={{ padding: 0 }}>
                                                    <div className="simplebar-content">
                                                        {newCustomer.map((customer, index) => (
                                                            <div
                                                                key={customer._id}
                                                                className={`${index !== newCustomer.length - 1 ? 'border-bottom' : ''} loyal-customers-box ${index === 0 ? 'pt-2' : index === newCustomer.length - 1 ? 'py-3' : ''}`}
                                                            >
                                                                <div className="d-flex align-items-center">
                                                                    <img
                                                                        src="/assets/images/admin_profile.png"
                                                                        className="rounded-circle avatar img-thumbnail"
                                                                        alt={customer.name}
                                                                    />
                                                                    <div className="flex-grow-1 ms-3 overflow-hidden">
                                                                        <h5 className="font-size-15 mb-1 text-truncate">{customer.name}</h5>
                                                                        <p className="text-muted text-truncate mb-0">
                                                                            {customer.email || `${customer.phone}${customer.address ? `, ${customer.address.split(',')[0]}` : ''}`}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Invoices */}
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex flex-wrap align-items-center mb-3">
                                <h5 className="card-title me-2">Recent Invoices</h5>
                                <div className="ms-auto"></div>
                            </div>

                            <div className="table-responsive" style={{ maxHeight: 332, overflowY: "auto" }}>
                                <table className="table table-striped table-centered align-middle table-nowrap mb-0">
                                    <thead>
                                        <tr>
                                            <th style={{ width: 30 }}>
                                                <input type="checkbox" className="form-check-input" />
                                            </th>
                                            <th>Order ID</th>
                                            <th style={{ width: 190 }}>Customer Name</th>
                                            <th>Date</th>
                                            <th>Payment Status</th>
                                            {/* <th>Action</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((invoice, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input type="checkbox" className="form-check-input" />
                                                </td>
                                                <td className="fw-semibold">{invoice.id}</td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={invoice.avatar}
                                                            alt={invoice.name}
                                                            className="rounded-circle avatar-sm"
                                                        />
                                                        <div className="ms-3">{invoice.name}</div>
                                                    </div>
                                                </td>
                                                <td>{invoice.date}</td>
                                                <td>
                                                    <div
                                                        className={`badge font-size-12 ${invoice.status === "Paid"
                                                            ? "bg-success-subtle text-success"
                                                            : "bg-danger-subtle text-danger"
                                                            }`}
                                                    >
                                                        {invoice.status}
                                                    </div>
                                                </td>
                                                {/* <td>
                                                    <div className="dropdown">
                                                        <a
                                                            className="text-muted dropdown-toggle font-size-18"
                                                            data-bs-toggle="dropdown"
                                                            role="button"
                                                        >
                                                            <i className="mdi mdi-dots-horizontal"></i>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-end">
                                                            <a className="dropdown-item" href="#">View</a>
                                                            <a className="dropdown-item" href="#">Print</a>
                                                            <a className="dropdown-item" href="#">Delete</a>
                                                        </div>
                                                    </div>
                                                </td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

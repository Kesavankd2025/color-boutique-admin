import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import './styles/customerOrderLayer.css';
import { PlusCircle } from '@phosphor-icons/react';
import apiProvider from '../apiProvider/wholesaleorderapi';
import ReactTableComponent from '../table/ReactTableComponent';
import customerApi from '../apiProvider/customerorderapi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Icon } from '@iconify/react/dist/iconify.js';
import PosdApi from '../apiProvider/posapi';
import InvoiceTemplate from './InvoiceTemplate';
import { Download_URL } from '../network/apiClient';


function CrmOrderListLayer() {
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const searchFilter = ["name", "paymentMode"];
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [orderStatus, setOrderStatus] = useState();
    const [paymentStatus, setPaymentStatus] = useState();
    const [searchText, setSearchText] = useState('');
    const invoiceTemplateRef = useRef(null);

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, filters, searchText]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const input = {
                page: pageIndex,
                limit: pageSize,
                filters: filters,
                type: "crm",
                search: searchText.trim()
            };
            const result = await PosdApi.getCRMOrders(input);
            if (result?.status && result?.response?.data) {
                setOrders(result.response.data);
                setTotalPages(result.response.totalPages);
                setTotal(result.response.total);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleExport = async (format) => {

        try {
            const input = {
                type: "crm",
                format: "excel"
            };

            const response = await PosdApi.getCRMOrders(input);

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
    const fetchDetails = async (input) => {
        try {
            setLoading(true);
            const result = await customerApi.orderDetails(input);
            if (result?.status && result?.response?.data) {
                setSelectedOrder(result.response.data);
                setOrderStatus(result.response.data.status);
                setPaymentStatus(result.response.data.paymentStatus);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleNextPage = () => {
        if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (pageIndex > 0) setPageIndex(prev => prev - 1);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        setPageIndex(0);
    };

    const handleClearSearch = () => {
        setSearchText('');
        setPageIndex(0);
    };

    const handleDownloadInvoice = () => {
        setIsDownloading(true);

        // Get the invoice element
        const invoiceElement = invoiceTemplateRef.current;

        // Create a clone to avoid affecting the original DOM
        const clone = invoiceElement.cloneNode(true);

        // Apply styles for PDF
        clone.style.width = "80mm";
        clone.style.fontSize = "14px";
        clone.style.padding = "10px";
        clone.style.boxSizing = "border-box";
        clone.style.overflow = "visible";

        // Temporarily append to body
        clone.style.position = "absolute";
        clone.style.left = "-9999px";
        document.body.appendChild(clone);

        // Calculate total height for multi-page PDF
        const totalHeight = clone.scrollHeight;
        const pageHeight = 1000; // Approximate pixels per page
        const totalPages = Math.ceil(totalHeight / pageHeight);

        // Create PDF
        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: [clone.scrollWidth, pageHeight]
        });

        let currentPage = 1;

        // Function to capture and add page
        const capturePage = (yOffset) => {
            return html2canvas(clone, {
                scale: 2,
                useCORS: true,
                scrollY: -yOffset,
                windowHeight: pageHeight,
                height: pageHeight,
                width: clone.scrollWidth,
                y: yOffset
            });
        };

        // Process all pages
        const processPages = async () => {
            for (let i = 0; i < totalPages; i++) {
                const yOffset = i * pageHeight;
                const canvas = await capturePage(yOffset);
                const imgData = canvas.toDataURL("image/png");

                if (i > 0) {
                    pdf.addPage();
                }

                pdf.addImage(
                    imgData,
                    "PNG",
                    0,
                    0,
                    clone.scrollWidth,
                    pageHeight
                );

                currentPage++;
            }

            // Save the PDF
            pdf.save(`invoice-${selectedOrder?.orderCode || 'order'}.pdf`);

            // Clean up
            document.body.removeChild(clone);
            setIsDownloading(false);
        };

        processPages().catch(error => {
            console.error("Error generating PDF:", error);
            document.body.removeChild(clone);
            setIsDownloading(false);
        });
    };

    const handlePrint = useReactToPrint({
        content: () => invoiceTemplateRef.current,
        pageStyle: `
            @media print {
                body * {
                    visibility: hidden;
                }
                #invoice-section, #invoice-section * {
                    visibility: visible;
                }
                #invoice-section {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 80mm;
                    font-size: 14px;
                }
            }
        `,
        onAfterPrint: () => console.log("Printed PDF successfully!")
    });

    const columns = [
        {
            header: 'S.No', size: 70,
            id: 'sno',
            cell: info => info.row.index + (pageIndex * pageSize) + 1,
            size: 60,
        },
        {
            header: 'Order ID',
            accessorKey: 'invoiceId',
        },
        {
            header: 'Customer Name',
            accessorKey: 'userName',
            cell: ({ getValue }) => getValue() || 'N/A',
        },
        {
            header: 'CRM Name',
            accessorKey: 'createdByUserInfo.name',
        },
        {
            header: 'Order Date & Time',
            accessorKey: 'createdAt',
            cell: ({ getValue }) => formatDate(getValue()),
        },
        {
            header: 'Total Amount',
            accessorKey: 'breakdown.total',
            cell: ({ getValue }) => `₹ ${Number(getValue() || 0).toLocaleString('en-IN')}`,
        },
        {
            header: 'Payment Mode',
            accessorKey: 'paymentMode',
            cell: ({ getValue }) => getValue().toUpperCase() || 'COD',
        },
        {
            header: 'Order Status',
            accessorKey: 'status',
            cell: ({ getValue }) => getValue().toUpperCase() || 'PENDING',
        },

        {
            header: 'Invoice',
            accessorKey: '_id',
            cell: ({ row }) => (
                <button
                    type="button"
                    className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                    onClick={() => fetchDetails(row.original._id)}
                >
                    <Icon icon="majesticons:eye-line" className="icon text-xl" />
                </button>
            ),
            size: 80,
        }
    ];

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xl-12">
                    <div className="cards">
                        <div className="card-body">
                            <div className="card">
                                <div className="card-body">
                                    <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                                        <h5 className="card-title">CRM Order List</h5>
                                        <div className='d-flex'>
                                            <div style={{ position: 'relative', marginRight: "10px" }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search..."
                                                    value={searchText}
                                                    onChange={handleSearchChange}
                                                />
                                                <div className="search-icon" style={{ position: "absolute", right: "10px", top: "8px" }}>
                                                    <Icon
                                                        icon="ic:baseline-search"
                                                        className="icon text-xl line-height-1"
                                                    />
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                {/* Search input remains the same */}
                                                <button
                                                    className="btn btn-success me-2"

                                                    onClick={() => handleExport("excel")}
                                                >
                                                    Export Excel
                                                </button>
                                            </div>
                                            {searchText && (
                                                <button
                                                    className="btn btn-outline-secondary"
                                                    type="button"
                                                    onClick={handleClearSearch}
                                                >
                                                    <Icon icon="mdi:close" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <ReactTableComponent
                                            data={orders}
                                            columns={columns}
                                            filterableColumns={searchFilter}
                                            pageIndex={pageIndex}
                                            totalPages={totalPages}
                                            onNextPage={handleNextPage}
                                            onPreviousPage={handlePreviousPage}
                                            filters={filters}
                                            setFilters={setFilters}
                                            totalRecords={total}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectedOrder && (
                <div className="modal-backdrop" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1050,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '5px',
                        width: '90%',
                        maxWidth: '460px',
                        height: '90vh',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        position: 'relative',
                        padding: '20px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}>
                        <div id="invoice-section" style={{
                            height: 'calc(100% - 60px)',
                            overflow: 'auto',
                            padding: '10px'
                        }}>
                            <InvoiceTemplate
                                ref={invoiceTemplateRef}
                                orderData={selectedOrder}
                                paymentStatus={paymentStatus}
                            />
                        </div>

                        <div id="invoice-buttons" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 0',
                            borderTop: '1px solid #eee',
                            marginTop: '10px',
                            position: 'sticky',
                            bottom: 0,
                            backgroundColor: 'white'
                        }}>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="btn btn-danger"
                                style={{
                                    padding: '8px 16px',
                                    fontSize: '14px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                            <div>
                                {/* <button
                                    className="btn btn-success me-2"
                                    onClick={handlePrint}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    <i className="fa fa-print me-1"></i> Print
                                </button> */}
                                <button
                                    className="btn btn-primary"
                                    onClick={handleDownloadInvoice}
                                    disabled={isDownloading}
                                    style={{
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        borderRadius: '4px'
                                    }}
                                >
                                    {isDownloading ? (
                                        <span>Generating...</span>
                                    ) : (
                                        <>
                                            <i className="fa fa-download me-1"></i> Download
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CrmOrderListLayer;
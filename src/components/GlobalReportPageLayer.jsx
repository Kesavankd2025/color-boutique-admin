import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Select from 'react-select';
const GlobalReportPageLayer = () => {
    // Sample product data
    const sampleProducts = [
        {
            id: 1,
            name: "Premium Wireless Headphones",
            variants: [
                {
                    id: "1a",
                    name: "Black",
                    sku: "HP-BLK-001",
                    purchaseCount: 150,
                    sellingCount: 120,
                    currentStock: 30,
                    price: 129.99,
                    lastUpdated: "2023-05-15"
                },
                {
                    id: "1b",
                    name: "White",
                    sku: "HP-WHT-001",
                    purchaseCount: 90,
                    sellingCount: 85,
                    currentStock: 5,
                    price: 129.99,
                    lastUpdated: "2023-05-10"
                }
            ]
        },
        {
            id: 2,
            name: "Smart Fitness Tracker",
            variants: [
                {
                    id: "2a",
                    name: "Standard",
                    sku: "FT-STD-001",
                    purchaseCount: 200,
                    sellingCount: 180,
                    currentStock: 20,
                    price: 79.99,
                    lastUpdated: "2023-05-18"
                }
            ]
        },
        {
            id: 3,
            name: "Organic Cotton T-Shirt",
            variants: [
                {
                    id: "3a",
                    name: "Small",
                    sku: "TS-SM-001",
                    purchaseCount: 300,
                    sellingCount: 250,
                    currentStock: 50,
                    price: 24.99,
                    lastUpdated: "2023-05-12"
                },
                {
                    id: "3b",
                    name: "Medium",
                    sku: "TS-MD-001",
                    purchaseCount: 350,
                    sellingCount: 320,
                    currentStock: 30,
                    price: 24.99,
                    lastUpdated: "2023-05-14"
                }
            ]
        },
        {
            id: 4,
            name: "Stainless Steel Water Bottle",
            variants: [
                {
                    id: "4a",
                    name: "500ml",
                    sku: "WB-500-001",
                    purchaseCount: 180,
                    sellingCount: 150,
                    currentStock: 30,
                    price: 19.99,
                    lastUpdated: "2023-05-20"
                },
                {
                    id: "4b",
                    name: "750ml",
                    sku: "WB-750-001",
                    purchaseCount: 220,
                    sellingCount: 200,
                    currentStock: 20,
                    price: 24.99,
                    lastUpdated: "2023-05-22"
                }
            ]
        },
        {
            id: 5,
            name: "Bluetooth Speaker",
            variants: [
                {
                    id: "5a",
                    name: "Portable Mini",
                    sku: "BS-MINI-001",
                    purchaseCount: 120,
                    sellingCount: 100,
                    currentStock: 20,
                    price: 49.99,
                    lastUpdated: "2023-05-25"
                }
            ]
        },
        {
            id: 6,
            name: "Leather Wallet",
            variants: [
                {
                    id: "6a",
                    name: "Classic Brown",
                    sku: "WL-BRN-001",
                    purchaseCount: 150,
                    sellingCount: 130,
                    currentStock: 20,
                    price: 34.99,
                    lastUpdated: "2023-05-28"
                }
            ]
        },
        {
            id: 7,
            name: "Yoga Mat",
            variants: [
                {
                    id: "7a",
                    name: "Standard",
                    sku: "YG-STD-001",
                    purchaseCount: 90,
                    sellingCount: 80,
                    currentStock: 10,
                    price: 29.99,
                    lastUpdated: "2023-06-01"
                }
            ]
        },
        {
            id: 8,
            name: "Smartphone Case",
            variants: [
                {
                    id: "8a",
                    name: "iPhone 13",
                    sku: "SC-IP13-001",
                    purchaseCount: 200,
                    sellingCount: 190,
                    currentStock: 10,
                    price: 19.99,
                    lastUpdated: "2023-06-05"
                }
            ]
        },
        {
            id: 9,
            name: "Ceramic Coffee Mug",
            variants: [
                {
                    id: "9a",
                    name: "Standard",
                    sku: "CM-STD-001",
                    purchaseCount: 250,
                    sellingCount: 230,
                    currentStock: 20,
                    price: 12.99,
                    lastUpdated: "2023-06-10"
                }
            ]
        },
        {
            id: 10,
            name: "Wireless Charging Pad",
            variants: [
                {
                    id: "10a",
                    name: "Fast Charge",
                    sku: "WC-FAST-001",
                    purchaseCount: 110,
                    sellingCount: 100,
                    currentStock: 10,
                    price: 39.99,
                    lastUpdated: "2023-06-15"
                }
            ]
        },
        {
            id: 11,
            name: "Backpack",
            variants: [
                {
                    id: "11a",
                    name: "Daypack",
                    sku: "BP-DAY-001",
                    purchaseCount: 130,
                    sellingCount: 120,
                    currentStock: 10,
                    price: 59.99,
                    lastUpdated: "2023-06-20"
                }
            ]
        },
        {
            id: 12,
            name: "Desk Lamp",
            variants: [
                {
                    id: "12a",
                    name: "LED Adjustable",
                    sku: "DL-LED-001",
                    purchaseCount: 70,
                    sellingCount: 65,
                    currentStock: 5,
                    price: 45.99,
                    lastUpdated: "2023-06-25"
                }
            ]
        },
        {
            id: 13,
            name: "Scented Candle",
            variants: [
                {
                    id: "13a",
                    name: "Lavender",
                    sku: "SC-LAV-001",
                    purchaseCount: 180,
                    sellingCount: 170,
                    currentStock: 10,
                    price: 14.99,
                    lastUpdated: "2023-07-01"
                }
            ]
        },
        {
            id: 14,
            name: "Resistance Bands Set",
            variants: [
                {
                    id: "14a",
                    name: "5-Piece",
                    sku: "RB-5PC-001",
                    purchaseCount: 85,
                    sellingCount: 80,
                    currentStock: 5,
                    price: 29.99,
                    lastUpdated: "2023-07-05"
                }
            ]
        },
        {
            id: 15,
            name: "Electric Toothbrush",
            variants: [
                {
                    id: "15a",
                    name: "Basic",
                    sku: "TB-BSC-001",
                    purchaseCount: 120,
                    sellingCount: 110,
                    currentStock: 10,
                    price: 49.99,
                    lastUpdated: "2023-07-10"
                }
            ]
        },
        {
            id: 16,
            name: "Notebook Set",
            variants: [
                {
                    id: "16a",
                    name: "3-Pack",
                    sku: "NB-3PK-001",
                    purchaseCount: 150,
                    sellingCount: 140,
                    currentStock: 10,
                    price: 12.99,
                    lastUpdated: "2023-07-15"
                }
            ]
        },
        {
            id: 17,
            name: "Insulated Lunch Box",
            variants: [
                {
                    id: "17a",
                    name: "Standard",
                    sku: "LB-STD-001",
                    purchaseCount: 95,
                    sellingCount: 90,
                    currentStock: 5,
                    price: 22.99,
                    lastUpdated: "2023-07-20"
                }
            ]
        },
        {
            id: 18,
            name: "Phone Stand",
            variants: [
                {
                    id: "18a",
                    name: "Adjustable",
                    sku: "PS-ADJ-001",
                    purchaseCount: 110,
                    sellingCount: 100,
                    currentStock: 10,
                    price: 9.99,
                    lastUpdated: "2023-07-25"
                }
            ]
        },
        {
            id: 19,
            name: "Reusable Shopping Bag",
            variants: [
                {
                    id: "19a",
                    name: "Large",
                    sku: "SB-LG-001",
                    purchaseCount: 200,
                    sellingCount: 190,
                    currentStock: 10,
                    price: 7.99,
                    lastUpdated: "2023-08-01"
                }
            ]
        },
        {
            id: 20,
            name: "Aromatherapy Diffuser",
            variants: [
                {
                    id: "20a",
                    name: "Ultrasonic",
                    sku: "AD-ULT-001",
                    purchaseCount: 75,
                    sellingCount: 70,
                    currentStock: 5,
                    price: 34.99,
                    lastUpdated: "2023-08-05"
                }
            ]
        },
        {
            id: 21,
            name: "Wireless Earbuds",
            variants: [
                {
                    id: "21a",
                    name: "Pro",
                    sku: "EB-PRO-001",
                    purchaseCount: 180,
                    sellingCount: 160,
                    currentStock: 20,
                    price: 89.99,
                    lastUpdated: "2023-08-10"
                }
            ]
        },
        {
            id: 22,
            name: "Smart Watch",
            variants: [
                {
                    id: "22a",
                    name: "Series 5",
                    sku: "SW-S5-001",
                    purchaseCount: 95,
                    sellingCount: 85,
                    currentStock: 10,
                    price: 199.99,
                    lastUpdated: "2023-08-15"
                }
            ]
        },
        {
            id: 23,
            name: "Portable Charger",
            variants: [
                {
                    id: "23a",
                    name: "10000mAh",
                    sku: "PC-10K-001",
                    purchaseCount: 120,
                    sellingCount: 110,
                    currentStock: 10,
                    price: 29.99,
                    lastUpdated: "2023-08-20"
                }
            ]
        },
        {
            id: 24,
            name: "Gaming Mouse",
            variants: [
                {
                    id: "24a",
                    name: "RGB",
                    sku: "GM-RGB-001",
                    purchaseCount: 80,
                    sellingCount: 75,
                    currentStock: 5,
                    price: 49.99,
                    lastUpdated: "2023-08-25"
                }
            ]
        },
        {
            id: 25,
            name: "Mechanical Keyboard",
            variants: [
                {
                    id: "25a",
                    name: "Blue Switches",
                    sku: "MK-BLUE-001",
                    purchaseCount: 65,
                    sellingCount: 60,
                    currentStock: 5,
                    price: 79.99,
                    lastUpdated: "2023-09-01"
                }
            ]
        },
        {
            id: 26,
            name: "Laptop Stand",
            variants: [
                {
                    id: "26a",
                    name: "Adjustable",
                    sku: "LS-ADJ-001",
                    purchaseCount: 90,
                    sellingCount: 85,
                    currentStock: 5,
                    price: 24.99,
                    lastUpdated: "2023-09-05"
                }
            ]
        },
        {
            id: 27,
            name: "External SSD",
            variants: [
                {
                    id: "27a",
                    name: "1TB",
                    sku: "SSD-1TB-001",
                    purchaseCount: 55,
                    sellingCount: 50,
                    currentStock: 5,
                    price: 129.99,
                    lastUpdated: "2023-09-10"
                }
            ]
        },
        {
            id: 28,
            name: "Noise Cancelling Headphones",
            variants: [
                {
                    id: "28a",
                    name: "Over-Ear",
                    sku: "NC-OVER-001",
                    purchaseCount: 70,
                    sellingCount: 65,
                    currentStock: 5,
                    price: 149.99,
                    lastUpdated: "2023-09-15"
                }
            ]
        },
        {
            id: 29,
            name: "Webcam",
            variants: [
                {
                    id: "29a",
                    name: "HD 1080p",
                    sku: "WC-HD-001",
                    purchaseCount: 85,
                    sellingCount: 80,
                    currentStock: 5,
                    price: 59.99,
                    lastUpdated: "2023-09-20"
                }
            ]
        },
        {
            id: 30,
            name: "Smart Plug",
            variants: [
                {
                    id: "30a",
                    name: "WiFi",
                    sku: "SP-WIFI-001",
                    purchaseCount: 110,
                    sellingCount: 100,
                    currentStock: 10,
                    price: 19.99,
                    lastUpdated: "2023-09-25"
                }
            ]
        }
    ];

    const [products] = useState(sampleProducts);
    const [formData, setFormData] = useState({
        productId: "",
        fromDate: "",
        toDate: ""
    });
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedProductName, setSelectedProductName] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const [searchTerm, setSearchTerm] = useState('');
    const [sortedProducts, setSortedProducts] = useState([]);

    // Sort products alphabetically and filter by search term
    useEffect(() => {
        const filtered = [...products]
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        setSortedProducts(filtered);
    }, [products, searchTerm]);

    // Filter data based on selected product and date range
    const generateReport = () => {
        if (!formData.productId) {
            toast.warning("Please select a product");
            return;
        }

        setLoading(true);

        // Simulate API call delay
        setTimeout(() => {
            try {
                // Find the selected product
                const product = products.find(p => p.id.toString() === formData.productId);

                if (!product) {
                    toast.error("Product not found");
                    return;
                }

                // Set the selected product name for display
                setSelectedProductName(product.name);

                // Filter variants by date range if dates are selected
                let filteredVariants = [...product.variants];

                if (formData.fromDate || formData.toDate) {
                    filteredVariants = product.variants.filter(variant => {
                        const variantDate = new Date(variant.lastUpdated);
                        const fromCondition = !formData.fromDate || variantDate >= new Date(formData.fromDate);
                        const toCondition = !formData.toDate || variantDate <= new Date(formData.toDate);
                        return fromCondition && toCondition;
                    });
                }

                // Calculate total revenue for each variant
                const report = filteredVariants.map(variant => ({
                    ...variant,
                    totalRevenue: variant.sellingCount * variant.price
                }));

                setReportData(report);
                setTotal(report.length);
                setLoading(false);

            } catch (error) {
                console.error("Error generating report:", error);
                toast.error("Failed to generate report");
                setLoading(false);
            }
        }, 800); // Simulate network delay
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setPage(0); // Reset to first page when submitting new filters
        generateReport();
    };

    const handleReset = () => {
        setFormData({
            productId: "",
            fromDate: "",
            toDate: ""
        });
        setSelectedProductName("");
        setReportData([]);
        setPage(0);
    };

    // Get paginated data
    const paginatedData = reportData.slice(page * limit, (page + 1) * limit);

    return (
        <div className="card h-100 p-0 radius-12">
            <div className="card-header border-bottom bg-base py-16 px-24">
                <h5 className="mb-0">Product Sales Report</h5>
            </div>

            <div className="card-body p-24">
                {/* Filter Form */}
                <div className="row mb-4">
                    <div className="col-md-12">
                        <div className="card p-3 mb-4">
                            <form onSubmit={handleSubmit}>
                                <div className="d-flex flex-column align-items-center gap-3">
                                    {/* Product Select with Search */}
                                    <div className="w-100" style={{ maxWidth: "400px" }}>
                                        <label className="form-label">Select Product</label>
                                        <Select
                                            options={sortedProducts.map(product => ({
                                                value: product.id.toString(),  // Convert to string for consistency
                                                label: product.name
                                            }))}
                                            value={formData.productId ? {
                                                value: formData.productId,
                                                label: products.find(p => p.id.toString() === formData.productId)?.name || ''
                                            } : null}
                                            onChange={(selectedOption) => {
                                                handleChange({
                                                    target: {
                                                        name: 'productId',
                                                        value: selectedOption?.value || ''
                                                    }
                                                });
                                            }}
                                            onInputChange={(inputValue) => setSearchTerm(inputValue)}
                                            isSearchable
                                            placeholder="Search product..."
                                            noOptionsMessage={() => "No products found"}
                                            className="react-select-container"
                                            classNamePrefix="react-select"
                                            required
                                        />
                                    </div>

                                    {/* From Date */}
                                    {/* <div className="w-100" style={{ maxWidth: "400px" }}>
                                        <label className="form-label">From Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="fromDate"
                                            value={formData.fromDate}
                                            onChange={handleChange}
                                        />
                                    </div> */}

                                    {/* To Date */}
                                    {/* <div className="w-100" style={{ maxWidth: "400px" }}>
                                        <label className="form-label">To Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="toDate"
                                            value={formData.toDate}
                                            onChange={handleChange}
                                            min={formData.fromDate}
                                        />
                                    </div> */}

                                    {/* Buttons */}
                                    <div className="d-flex gap-2 mt-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Generating...
                                                </>
                                            ) : (
                                                "Generate Report"
                                            )}
                                        </button>
                                        {/* <button
                                            type="button"
                                            onClick={handleReset}
                                            className="btn btn-secondary"
                                            disabled={loading}
                                        >
                                            Reset
                                        </button> */}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <br></br>
                <br></br>
                <br></br>

                {/* Report Header */}
                {selectedProductName && (
                    <div className="mb-4">
                        <h6 className="mb-0">
                            Report for: <strong>{selectedProductName}</strong>
                            {formData.fromDate && (
                                <span> from <strong>{formData.fromDate}</strong></span>
                            )}
                            {formData.toDate && (
                                <span> to <strong>{formData.toDate}</strong></span>
                            )}
                        </h6>
                    </div>
                )}

                {/* Report Table */}
                {reportData.length > 0 && (
                    <>
                        <div className="table-responsive scroll-sm">
                            <table className="table bordered-table sm-table mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">S.No</th>
                                        <th scope="col">Variant</th>
                                        <th scope="col">SKU</th>
                                        <th scope="col">Purchase Customers</th>
                                        <th scope="col">Selling Count</th>
                                        <th scope="col">Current Stock</th>
                                        <th scope="col">Price</th>
                                        <th scope="col">Total Revenue</th>
                                        <th scope="col">Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedData.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{page * limit + index + 1}</td>
                                            <td>{item.name}</td>
                                            <td>{item.sku}</td>
                                            <td>{item.purchaseCount}</td>
                                            <td>{item.sellingCount}</td>
                                            <td>{item.currentStock}</td>
                                            <td>₹{item.price.toFixed(2)}</td>
                                            <td>₹{item.totalRevenue.toFixed(2)}</td>
                                            <td>{item.lastUpdated}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {total > limit && (
                            <div className="d-flex align-items-center mt-4 gap-3">
                                <button
                                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                    disabled={page === 0}
                                    className="btn btn-primary"
                                >
                                    Previous
                                </button>

                                <div className="d-flex align-items-center gap-2">
                                    <div>
                                        <span>Page {page + 1} of {Math.ceil(total / limit)}</span>
                                    </div>
                                    <div>
                                        <select
                                            className="form-select"
                                            value={limit}
                                            onChange={(e) => {
                                                setLimit(Number(e.target.value));
                                                setPage(0);
                                            }}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={25}>25</option>
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
                        )}
                    </>
                )}

                {reportData.length === 0 && !loading && selectedProductName && (
                    <div className="alert alert-warning">
                        No data found for the selected criteria
                    </div>
                )}

                {reportData.length === 0 && !loading && !selectedProductName && (
                    <div className="text-center py-5">
                        <Icon
                            icon="mdi:file-document-outline"
                            className="text-muted"
                            style={{ fontSize: "50px" }}
                        />
                        <p className="mt-3">No report data available. Please select a product and generate report.</p>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
};

export default GlobalReportPageLayer;
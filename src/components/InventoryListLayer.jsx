import React, { useState, useEffect } from 'react';
import UpdateStockModal from './UpdateStockModal';
import VendorApi from "../apiProvider/vendor"
import * as XLSX from 'xlsx';

export default function InventoryListLayer() {
    const [selectedWarehouse, setSelectedWarehouse] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewModalShow, setViewModalShow] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await VendorApi.getProductBasedOnVendor("all");

            if (response.status) {
                console.log(response, "API Response");
                setProducts(response.response.data || []);
                setTotal(response.response.total || 0);
            } else {
                console.error("Failed to fetch product list");
            }
        } catch (error) {
            console.error("Error fetching product list:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDropdownChange = (warehouse) => {
        setSelectedWarehouse(warehouse);
    };

    const handleView = (product) => {
        setSelectedProduct(product);
        setViewModalShow(true);
    };

    // Function to get the first image URL if available
    const getProductImage = (product) => {
        if (product.productImage && product.productImage.length > 0) {
            return product.productImage[0].docPath + '/' + product.productImage[0].docName;
        }
        return ''; // Return empty string or placeholder image
    };

    // Function to get all SKUs and stocks from attribute details
    const getProductVariants = (product) => {
        const variants = [];
        if (product.customerAttributeDetails && product.customerAttributeDetails.length > 0) {
            product.customerAttributeDetails.forEach(attr => {
                if (attr.value && attr.value.length > 0) {
                    attr.value.forEach(variant => {
                        variants.push({
                            sku: variant.sku,
                            stock: variant.stock,
                            value: variant.value,
                            price: variant.price
                        });
                    });
                }
            });
        }
        return variants;
    };

    // Function to get total stock for a product
    const getTotalStock = (product) => {
        let totalStock = 0;
        if (product.customerAttributeDetails && product.customerAttributeDetails.length > 0) {
            product.customerAttributeDetails.forEach(attr => {
                if (attr.value && attr.value.length > 0) {
                    attr.value.forEach(variant => {
                        totalStock += parseInt(variant.stock) || 0;
                    });
                }
            });
        }
        return totalStock;
    };

    useEffect(() => {
        if (viewModalShow) {
            // const modal = new window.bootstrap.Modal(document.getElementById('viewProductModal'));
            // modal.show();
        }
    }, [viewModalShow]);

    const exportToExcel = () => {
        // Prepare the data for export
        const exportData = products.flatMap(product => {
            const variants = getProductVariants(product);

            // If no variants, return one row with basic product info
            if (variants.length === 0) {
                return [{
                    'Product ID': product.productCode,
                    'Product Name': product.productName,
                    'Category': product.categoryName,
                    'Brand': product.vendorName,
                    'SKU': 'N/A',
                    'Variant': 'N/A',
                    'Stock Quantity': getTotalStock(product),
                    'Price': 'N/A',
                    'Status': getTotalStock(product) > 0 ? 'In stock' : 'Out of Stock'
                }];
            }

            // For each variant, create a row
            return variants.map(variant => ({
                'Product ID': product.productCode,
                'Product Name': product.productName,
                'Category': product.categoryName,
                'Brand': product.vendorName,
                'SKU': variant.sku,
                'Variant': variant.value,
                'Stock Quantity': variant.stock,
                'Price': variant.price ? `₹${variant.price}` : 'N/A',
                'Status': variant.stock > 0 ? 'In stock' : 'Out of Stock'
            }));
        });

        // Create a worksheet
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Create a workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Products");

        // Generate file and download
        const date = new Date().toISOString().split('T')[0];
        XLSX.writeFile(wb, `products_export_${date}.xlsx`);
    };

    // const getProductVariants = (product) => {
    //     const variants = [];
    //     if (product.customerAttributeDetails && product.customerAttributeDetails.length > 0) {
    //         product.customerAttributeDetails.forEach(attr => {
    //             if (attr.value && attr.value.length > 0) {
    //                 attr.value.forEach(variant => {
    //                     variants.push({
    //                         sku: variant.sku,
    //                         stock: variant.stock,
    //                         value: variant.value,
    //                         price: variant.price // Make sure your API returns price for each variant
    //                     });
    //                 });
    //             }
    //         });
    //     }
    //     return variants;
    // };

    // Get paginated products
    const paginatedProducts = products.slice(page * limit, (page + 1) * limit);

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-xxl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className='col-6'>
                                    <h5 className="card-title">Inventory List</h5>
                                </div>
                                {/* <div>
                                    <h5 className="card-title">Inventory List</h5>
                                    <div className="dropdown mt-3">
                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span>{selectedWarehouse}</span> <i className="mdi mdi-chevron-down"></i>
                                        </button>
                                        <div className="dropdown-menu">
                                            {['All', 'Warehouse A', 'Warehouse B', 'Warehouse C'].map(warehouse => (
                                                <a
                                                    key={warehouse}
                                                    className="dropdown-item"
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDropdownChange(warehouse);
                                                    }}
                                                >
                                                    {warehouse}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                </div> */}

                                <div className="text-end">
                                    {/* <button type="button" className="btn btn-success waves-effect waves-light" data-bs-toggle="modal" data-bs-target="#addInvoiceModalone">
                                        <i className="fas fa-arrow-circle-down font-size-16 align-middle me-2"></i>
                                        Import
                                    </button> */}
                                   
                                    <div className='text-end'>
                                        <button
                                            type="button"
                                            className="btn btn-success waves-effect waves-light"
                                            onClick={exportToExcel}
                                        >
                                            <i className="fas fa-arrow-circle-up font-size-16 align-middle me-2"></i>
                                            Export
                                        </button>
                                    </div>

                                    {/* <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => setShowModal(true)}>
                                        <i className="fa fa-plus-circle font-size-16 align-middle me-2"></i>
                                        Stock Update
                                    </button> */}
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                                            <thead>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Product ID</th>
                                                    <th style={{ width: '190px' }}>Product Name</th>
                                                    <th>Category</th>
                                                    <th>Brand</th>
                                                    <th>SKU</th>
                                                    <th>Stock Quantity</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedProducts.map((product, index) => {
                                                    const variants = getProductVariants(product);
                                                    const totalStock = getTotalStock(product);
                                                    const status = totalStock > 0 ? 'In stock' : 'Out of Stock';

                                                    return (
                                                        <tr key={product._id}>
                                                            <td>{page * limit + index + 1}.</td>
                                                            <td>{product.productCode}</td>
                                                            <td>{product.productName}</td>
                                                            <td>{product.categoryName}</td>
                                                            <td>{product.vendorName}</td>
                                                            <td>
                                                                {variants.length > 0 ? (
                                                                    variants.map((variant, i) => (
                                                                        <div key={i}>{variant.sku}</div>
                                                                    ))
                                                                ) : 'N/A'}
                                                            </td>
                                                            <td>{totalStock}</td>
                                                            <td>
                                                                <button
                                                                    type="button"
                                                                    className={`btn btn-sm waves-effect waves-light ${status === 'In stock' ? 'btn-subtle-success' : 'btn-subtle-danger'}`}
                                                                >
                                                                    {status}
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <div className="dropdown">
                                                                    <a className="text-muted dropdown-toggle font-size-18" role="button" data-bs-toggle="dropdown" aria-haspopup="true">
                                                                        <i className="mdi mdi-dots-horizontal"></i>
                                                                    </a>
                                                                    <div className="dropdown-menu dropdown-menu-end">
                                                                        <a className="dropdown-item" onClick={() => handleView(product)} data-bs-toggle="modal"
                                                                            data-bs-target="#viewProductModal">View</a>
                                                                        <a className="dropdown-item" onClick={() => setShowModal(true)}>Edit</a>
                                                                        <a className="dropdown-item" href="#">Delete</a>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
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
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* View Product Variants Modal */}

                <div className="modal fade" id="viewProductModal" tabIndex="-1" aria-labelledby="viewProductModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="viewProductModalLabel">
                                    {selectedProduct?.productName} Variants
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setViewModalShow(false)}></button>
                            </div>
                            <div className="modal-body">
                                {selectedProduct && (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-centered align-middle table-nowrap mb-0">
                                            <thead>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Product Name</th>
                                                    <th>Variant</th>
                                                    <th>Current Stock</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getProductVariants(selectedProduct).map((variant, index) => (
                                                    <tr key={variant.sku}>
                                                        <td>{index + 1}</td>
                                                        <td>{selectedProduct.productName}</td>
                                                        <td>{variant.value}</td>
                                                        <td>{variant.stock}</td>
                                                        <td>₹ {variant.price}{/* You'll need to add price to your variant data or get it from another source */}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => setViewModalShow(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="modal fade"
                    id="addInvoiceModalone"
                    tabIndex="-1"
                    aria-labelledby="addInvoiceModalLabel"
                    aria-hidden="true"
                    style={{ display: "none" }}
                >
                    {/* ... your existing modal content ... */}
                </div>

                <UpdateStockModal show={showModal} onClose={() => setShowModal(false)} />
            </div>
        </div>
    );
}



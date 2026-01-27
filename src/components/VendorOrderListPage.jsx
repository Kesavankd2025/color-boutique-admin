import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from "react-toastify";
import { Icon } from '@iconify/react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import VendorApi from "../apiProvider/vendor"
import ReactTableComponent from "../table/ReactTableComponent";

// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

const VendorOrderList = () => {
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [receivedQtyUpdates, setReceivedQtyUpdates] = useState({});
    const [sellingPriceUpdates, setSellingPriceUpdates] = useState({});
    const [buyingPriceUpdates, setBuyinggPriceUpdates] = useState({});
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const attributeFilter = ["vendorName", "products"]
    const [pageIndex, setPageIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filters, setFilters] = useState([]);
    const [sorting, setSorting] = useState([]);
    const [expiryDateUpdates, setExpiryDateUpdates] = useState({});

    // Sample data with all required fields
    // const [purchaseOrders, setPurchaseOrders] = useState([
    //     {
    //         id: "PO-1001",
    //         date: "2023-06-15T10:30:00",
    //         vendorName: "Beauty Supplies Co.",
    //         productCount: 3,
    //         orderNumber: "ORD-2023-1001",
    //         status: "Approved",
    //         items: [
    //             {
    //                 id: "101",
    //                 name: "Shampoo",
    //                 variant: "500ml",
    //                 quantity: 2,
    //                 receivedQuantity: 2,
    //                 price: 120,
    //                 sellingPrice: 150
    //             },
    //             {
    //                 id: "102",
    //                 name: "Conditioner",
    //                 variant: "500ml",
    //                 quantity: 1,
    //                 receivedQuantity: 1,
    //                 price: 150,
    //                 sellingPrice: 180
    //             },
    //             {
    //                 id: "103",
    //                 name: "Hair Oil",
    //                 variant: "200ml",
    //                 quantity: 2,
    //                 receivedQuantity: 2,
    //                 price: 200,
    //                 sellingPrice: 250
    //             }
    //         ]
    //     },
    //     {
    //         id: "PO-1002",
    //         date: "2023-06-14T14:45:00",
    //         vendorName: "Cosmetics Ltd.",
    //         productCount: 2,
    //         orderNumber: "ORD-2023-1002",
    //         status: "Stock Moved",
    //         items: [
    //             {
    //                 id: "201",
    //                 name: "Facial Cream",
    //                 variant: "50g",
    //                 quantity: 1,
    //                 receivedQuantity: 1,
    //                 price: 250,
    //                 sellingPrice: 300
    //             },
    //             {
    //                 id: "202",
    //                 name: "Hair Color",
    //                 variant: "Black",
    //                 quantity: 2,
    //                 receivedQuantity: 2,
    //                 price: 180,
    //                 sellingPrice: 220
    //             }
    //         ]
    //     },
    //     {
    //         id: "PO-1003",
    //         date: "2023-06-13T09:15:00",
    //         vendorName: "Beauty Supplies Co.",
    //         productCount: 2,
    //         orderNumber: "ORD-2023-1003",
    //         status: "Not Received",
    //         items: [
    //             {
    //                 id: "101",
    //                 name: "Shampoo",
    //                 variant: "500ml",
    //                 quantity: 3,
    //                 receivedQuantity: 0,
    //                 price: 120,
    //                 sellingPrice: 150
    //             },
    //             {
    //                 id: "103",
    //                 name: "Hair Oil",
    //                 variant: "200ml",
    //                 quantity: 1,
    //                 receivedQuantity: 0,
    //                 price: 200,
    //                 sellingPrice: 250
    //             }
    //         ]
    //     }
    // ]);
    const [purchaseOrders, setPurchaseOrders] = useState([]);

    const addPurchaseFromVendor = () => {
        navigate('/vendor-add-order-list');
    };

    const viewOrderDetails = (order) => {
        console.log(order, "orderorder");

        setSelectedOrder(order);
        const initialChecked = {};
        order.products.forEach(item => {
            initialChecked[item.id] = false;
        });
        setCheckedItems(initialChecked);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCheckedItems({});
        setReceivedQtyUpdates({});
        setSellingPriceUpdates({});
    };

    const handleCheckboxChange = (itemId) => {
        console.log(itemId, "itemId");
        setSelectedOrder(prev => ({
            ...prev,
            products: prev.products.map(product =>
                product._id === itemId
                    ? { ...product, isProductReceived: !product.isProductReceived }
                    : product
            ),
            // items: prev.items.map(item =>
            //     item._id === itemId
            //         ? { ...item, isProductReceived: !item.isProductReceived }
            //         : item
            // )
        }));
    };

    const handleReceivedQtyChange = (itemId, newQty) => {
        const quantity = Math.max(0, newQty); // Ensure not negative
        setReceivedQtyUpdates(prev => ({
            ...prev,
            [itemId]: quantity
        }));

        setSelectedOrder(prev => ({
            ...prev,
            products: prev.products.map(item =>
                item._id === itemId
                    ? { ...item, quantityReceived: quantity }
                    : item
            )
        }));
    };

    const handleSellingPriceChange = (itemId, newPrice) => {

        console.log(itemId, "itemId");
        console.log(newPrice, "newPrice");

        console.log(sellingPriceUpdates, "ssssss");

        const price = Math.max(0, newPrice); // Ensure not negative
        setSellingPriceUpdates(prev => ({
            ...prev,
            [itemId]: price
        }));

        setSelectedOrder(prev => ({
            ...prev,
            products: prev.products.map(item =>
                item._id === itemId
                    ? { ...item, sellingPrice: price }
                    : item
            )
        }));
    };

    const handleBuyingPriceChange = (itemId, newPrice) => {
        const price = Math.max(0, newPrice); // Ensure not negative
        setBuyinggPriceUpdates(prev => ({
            ...prev,
            [itemId]: price
        }));

        setSelectedOrder(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === itemId
                    ? { ...item, price: price }
                    : item
            )
        }));
    };

    const handleUpdateQuantitiesAndPrices = () => {
        // Update received quantities
        if (Object.keys(receivedQtyUpdates).length > 0) {
            setPurchaseOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === selectedOrder.id
                        ? {
                            ...order,
                            items: order.items.map(item => ({
                                ...item,
                                receivedQuantity: receivedQtyUpdates[item.id] !== undefined
                                    ? receivedQtyUpdates[item.id]
                                    : item.receivedQuantity
                            }))
                        }
                        : order
                )
            );
        }

        // Update selling prices
        if (Object.keys(sellingPriceUpdates).length > 0) {
            setPurchaseOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === selectedOrder.id
                        ? {
                            ...order,
                            items: order.items.map(item => ({
                                ...item,
                                sellingPrice: sellingPriceUpdates[item.id] !== undefined
                                    ? sellingPriceUpdates[item.id]
                                    : item.sellingPrice
                            }))
                        }
                        : order
                )
            );
        }

        // Clear updates
        setReceivedQtyUpdates({});
        setSellingPriceUpdates({});

        // toast.success("Quantities and prices updated successfully!");
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setPurchaseOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    // const approveSelectedItems = () => {
    //     if (selectedOrder) {
    //         let totalQuantity = 0;
    //         let receivedQuantity = 0;

    //         selectedOrder.items.forEach(item => {
    //             totalQuantity += item.quantity;
    //             if (checkedItems[item.id]) {
    //                 receivedQuantity += item.receivedQuantity || 0;
    //             }
    //         });

    //         if (receivedQuantity === totalQuantity) {
    //             updateOrderStatus(selectedOrder.id, "Approved");
    //             toast.success("Order fully approved!");
    //         } else if (receivedQuantity > 0) {
    //             updateOrderStatus(selectedOrder.id, "Partially Received");
    //             toast.warning("Order partially approved");
    //         } else {
    //             toast.error("Please verify at least one item before approving");
    //             return;
    //         }

    //         handleCloseModal();
    //     }
    // };
    // const transformOrderData = (originalOrder) => {
    //     return {
    //         products: originalOrder.products.map(product => ({
    //             id: product.id,
    //             quantity: product.quantity,
    //             buyingPrice: product.buyingPrice,
    //             sellingPrice: product.sellingPrice,
    //             quantityReceived: product.quantityReceived,
    //             isProductReceived: product.isProductReceived,
    //             attributes: product.attributes
    //         })),
    //         vendorId: originalOrder.vendorId,
    //         totalPrice: originalOrder.totalPrice
    //     };
    // };
    const transformOrderData = (originalOrder) => {
        console.log(originalOrder,"originalOrder")
        return {
            products: originalOrder.products.map(product => ({
                id: product.id,  // Make sure to use _id if that's what your backend expects
                productId: product.productId, // Include if needed
                quantity: product.quantity,
                buyingPrice: product.buyingPrice,
                sellingPrice: product.sellingPrice,
                quantityReceived: product.quantityReceived,
                isProductReceived: product.isProductReceived,
                attributes: product.attributes,
                expiryDate: product.expiryDate || null // Ensure expiryDate is included
            })),
            vendorId: originalOrder.vendorId,
            totalPrice: originalOrder.totalPrice,
            status: originalOrder.status
        };
    };
    const approveSelectedItems = async () => {
        if (selectedOrder) {
            const transformedData = transformOrderData(selectedOrder);
            console.log(transformedData, "transformedData");

            if (transformedData) {
                const stockUpdate = await VendorApi.stockUpdate(transformedData, selectedOrder?._id)
                console.log(stockUpdate, "stockUpdate");
                if (stockUpdate && stockUpdate.status) {
                    fetchData();
                    handleCloseModal();
                }
            }
        }
    };
    const calculateVerifiedQuantities = () => {
        let total = 0;
        let verified = 0;

        if (selectedOrder) {
            selectedOrder.products.forEach(item => {
                total += Number(item.quantity);
                if (checkedItems[item.id]) {
                    verified += Number(item.quantityReceived || 0);
                }
            });
        }

        return { total, verified };
    };

    const fetchData = async () => {
        const input = {
            page: pageIndex,
            limit: pageSize,
            filters: filters
        };

        try {
            const response = await VendorApi.getPurchaselist(input);

            if (response.status) {
                // Format any date fields if needed
                const formattedData = response.response.data.map(order => ({
                    ...order,
                    products: order.products.map(product => ({
                        ...product,
                        expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : null
                    }))
                }));
                console.log(formattedData, "formattedData")
                setPurchaseOrders(formattedData);
                setTotalPages(response.response.totalPages || 0);
            } else {
                console.error("Failed to fetch brand list");
            }
        } catch (error) {
            console.error("Error fetching brand list:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [pageIndex, pageSize, filters]);
    const handleExpiryDateChange = (itemId, newDate) => {
        setExpiryDateUpdates(prev => ({
            ...prev,
            [itemId]: newDate
        }));

        setSelectedOrder(prev => ({
            ...prev,
            products: prev.products.map(item =>
                item._id === itemId
                    ? { ...item, expiryDate: newDate }
                    : item
            )
        }));
    };
    const { total, verified } = calculateVerifiedQuantities();

    console.log(purchaseOrders, "purchaseOrders-render");
    console.log(selectedOrder, "selectedOrder");

    const columns = [
        {
            header: 'S.No',
            id: 'sno',
            size: 60,
            cell: info => info.row.index + 1,
        },
        {
            header: 'Purchase Date',
            accessorKey: 'createdAt',
            size: 130,
            cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
        },
        {
            header: 'Vendor Name',
            accessorKey: 'vendorName',
            size: 140,
        },
        {
            header: 'Qnt',
            accessorKey: 'products',
            size: 80,
            cell: ({ getValue }) => getValue().length,
        },
        {
            header: 'Order Number',
            accessorKey: 'orderId',
            size: 140,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            size: 120,
            cell: ({ getValue }) => {
                const status = getValue();
                const statusColor =
                    status === 'completed'
                        ? 'success'
                        : status === 'partially Completed'
                            ? 'warning'
                            : 'danger';

                return (
                    <button
                        type="button"
                        className={`btn btn-subtle-${statusColor} btn-sm waves-effect waves-light`}
                    >
                        {status}
                    </button>
                );
            },
        },
        {
            header: 'Action',
            id: 'action',
            size: 80,
            cell: ({ row }) => (
                <ul className="list-inline mb-0">
                    <li className="list-inline-item dropdown">
                        <a
                            className="text-muted font-size-18 px-2"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-haspopup="true"
                        >
                            <Icon icon="entypo:dots-three-horizontal" className="menu-icon" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                            <a
                                className="dropdown-item"
                                onClick={() => viewOrderDetails(row.original)}
                            >
                                View
                            </a>
                        </div>
                    </li>
                </ul>
            ),
        },
    ];
    const handleNextPage = () => {
        if (pageIndex + 1 < totalPages) setPageIndex(prev => prev + 1);
    };

    const handlePreviousPage = () => {
        if (pageIndex > 0) setPageIndex(prev => prev - 1);
    };
    return (
        <div className="container-fluid">
            <div className="card h-100 p-20 radius-12">
                <div className="card-body h-100 p-0 radius-12">
                    <div className="d-flex flex-wrap align-items-center mb-3">
                        <h5 className="card-title me-2">Vendor Purchase List</h5>
                        <div className="ms-auto d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-primary waves-effect waves-light"
                                onClick={addPurchaseFromVendor}
                            >
                                <i className="fa fa-shopping-cart font-size-16 align-middle me-2"></i>
                                Purchase from Vendor
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="table-responsive">
                            <ReactTableComponent data={purchaseOrders}
                                columns={columns}
                                filterableColumns={attributeFilter}
                                pageIndex={pageIndex}          // should be a number like 0, 1, 2...
                                totalPages={totalPages}        // should be a number like 5, 10, etc.
                                onNextPage={handleNextPage}
                                onPreviousPage={handlePreviousPage}
                                filters={filters}
                                setFilters={setFilters}
                                sorting={sorting}
                                setSorting={setSorting} />
                        </div>
                    </div>
                </div>
                {/* Pagination buttons */}

            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Order Details - {selectedOrder?.orderNumber}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* {selectedOrder && (
                        <div>
                            <div className="mb-3">
                                <p><strong>Vendor:</strong> {selectedOrder.vendorName}</p>
                                <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                                <p><strong>Total Items:</strong> {selectedOrder.productCount}</p>
                                <p><strong>Verified Items:</strong> {verified}/{total}</p>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th width="5%">S.No</th>
                                            <th width="10%">Check</th>
                                            <th width="25%">Product Name</th>
                                            <th width="15%">Variant</th>
                                            <th width="10%">Order Qty</th>
                                            <th width="10%">Received Qty</th>
                                            <th width="15%">Buying Price</th>
                                            <th width="15%">Selling Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    <input
                                                        type="checkbox"
                                                        checked={checkedItems[item.id] || false}
                                                        onChange={() => handleCheckboxChange(item.id)}
                                                        className="form-check-input"
                                                    />
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{item.variant || 'Standard'}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={item.receivedQuantity !== undefined ? item.receivedQuantity : item.quantity}
                                                        onChange={(e) => handleReceivedQtyChange(item.id, Number(e.target.value))}
                                                        min="0"
                                                        step="1"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        onChange={(e) => handleBuyingPriceChange(item.id, Number(e.target.value))}

                                                        value={item.price}
                                                    // readOnly
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={item.sellingPrice !== undefined ? item.sellingPrice : (item.price * 1.2)}
                                                        onChange={(e) => handleSellingPriceChange(item.id, Number(e.target.value))}
                                                        min="0"
                                                        // step="0.01"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleUpdateQuantitiesAndPrices}
                                    disabled={Object.keys(receivedQtyUpdates).length === 0 && Object.keys(sellingPriceUpdates).length === 0}
                                >
                                    Update Received Qty & Selling Prices
                                </button>
                            </div>
                        </div>
                    )} */}
                    {selectedOrder && (
                        <div>
                            <div className="mb-3">
                                <p><strong>Vendor:</strong> {selectedOrder.vendorName}</p>
                                <p><strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                <p><strong>Total Items:</strong> {selectedOrder.products.length}</p>
                                <p><strong>Verified Items:</strong> {verified}/{selectedOrder.products.length}</p>
                            </div>

                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th width="5%">S.No</th>
                                            <th width="10%">Check</th>
                                            <th width="25%">Product Name</th>
                                            <th width="20%">Variant</th>
                                            <th width="10%">Order Qty</th>
                                            <th width="10%">Received Qty</th>
                                            <th width="10%">Buying Price</th>
                                            <th width="10%">Expiry Date</th>
                                            <th width="10%" className="text-end">Selling Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.products.map((item, index) => {
                                            // Format variant details without IDs (just values)
                                            const variantDetails = Object.keys(item.attributes).map(key => key).join('-');

                                            return (
                                                <tr key={item._id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            checked={item.isProductReceived || false}
                                                            onChange={() => handleCheckboxChange(item._id)}
                                                            className="form-check-input"
                                                        />
                                                    </td>
                                                    <td>{item.productName}</td>
                                                    <td>{variantDetails || 'Standard'}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={receivedQtyUpdates[item._id] !== undefined ? receivedQtyUpdates[item._id] : item.quantityReceived}
                                                            onChange={(e) => handleReceivedQtyChange(item._id, Number(e.target.value))}
                                                            min="0"
                                                            max={item.quantity}
                                                            step="1"
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={item.buyingPrice}
                                                        // readOnly
                                                        />
                                                    </td>
                                                    <td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                className="form-control"
                                                                value={item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : ""}
                                                                onChange={e => handleExpiryDateChange(item._id, e.target.value)}
                                                                min={new Date().toISOString().split('T')[0]} // Optional: prevent past dates
                                                            />
                                                        </td>
                                                    </td>
                                                    <td className="text-end">
                                                        <input
                                                            type="number"
                                                            className="form-control text-end"
                                                            value={item.sellingPrice && item.sellingPrice > 0 ? item.sellingPrice : item.buyingPrice}
                                                            onChange={(e) => handleSellingPriceChange(item._id, Number(e.target.value))}
                                                            min="0"
                                                            style={{ width: '80px' }}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={approveSelectedItems}>
                        Approve Selected Items
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* <ToastContainer position="top-right" autoClose={3000} /> */}
        </div>
    );
};

export default VendorOrderList;
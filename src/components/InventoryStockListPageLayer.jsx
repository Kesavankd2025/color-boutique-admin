import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
// import { ToastContainer, toast } from "react-toastify";
import { Icon } from '@iconify/react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import VendorApi from "../apiProvider/vendor"
import { toast } from "react-toastify";


const InventoryStockListLayer = () => {
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});
    const [receivedQtyUpdates, setReceivedQtyUpdates] = useState({});
    const [sellingPriceUpdates, setSellingPriceUpdates] = useState({});
    const [buyingPriceUpdates, setBuyinggPriceUpdates] = useState({});
    const [expiryDateUpdates, setExpiryDateUpdates] = useState({});
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [purchaseOrders, setPurchaseOrders] = useState([]);

    const addPurchaseFromVendor = () => {
        navigate('/add-form-stock');
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
        setExpiryDateUpdates({});
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

        // Update expiry dates
        if (Object.keys(expiryDateUpdates).length > 0) {
            setPurchaseOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === selectedOrder.id
                        ? {
                            ...order,
                            items: order.items.map(item => ({
                                ...item,
                                expiryDate: expiryDateUpdates[item.id] !== undefined
                                    ? expiryDateUpdates[item.id]
                                    : item.expiryDate
                            }))
                        }
                        : order
                )
            );
        }

        // Clear updates
        setReceivedQtyUpdates({});
        setSellingPriceUpdates({});
        setExpiryDateUpdates({});

        // toast.success("Quantities and prices updated successfully!");
    };

    const updateOrderStatus = (orderId, newStatus) => {
        setPurchaseOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: newStatus } : order
            )
        );
    };

    const transformOrderData = (originalOrder) => {
        // Determine the overall status
        let status = "pending";
        const allCompleted = originalOrder.products.every(
            (product) => product.quantity === product.quantityReceived
        );
        const anyCompleted = originalOrder.products.some(
            (product) => product.quantity === product.quantityReceived
        );
        const anyPartial = originalOrder.products.some(
            (product) =>
                product.quantityReceived > 0 &&
                product.quantityReceived < product.quantity
        );

        if (allCompleted) {
            status = "completed";
        } else if (anyCompleted || anyPartial) {
            status = "partially completed";
        }

        return {
            products: originalOrder.products.map(product => ({
                id: product.id,
                quantity: product.quantity,
                buyingPrice: product.buyingPrice,
                sellingPrice: product.sellingPrice,
                quantityReceived: product.quantityReceived,
                isProductReceived: product.isProductReceived,
                attributes: product.attributes,
                expiryDate: product.expiryDate || "" // Ensure expiryDate is included
            })),
            vendorId: originalOrder?.vendorId || "",
            notVendorId: originalOrder?.notVendorId || "all",
            totalPrice: originalOrder.totalPrice,
            status: status // Add the calculated status
        };
    };
    const approveSelectedItems = async () => {
        if (selectedOrder) {

            const transformedData = transformOrderData(selectedOrder);

            console.log(transformedData, "transformedData");
            if (transformedData) {
                if (selectedOrder && selectedOrder.status !== "completed") {
                    const stockUpdate = await VendorApi.stockUpdate(transformedData, selectedOrder?._id)
                    console.log(stockUpdate, "stockUpdate");
                    if (stockUpdate && stockUpdate.status) {
                        fetchData()
                    }
                }
                else {
                    toast.error("Order already completed");
                }
            }

            let totalQuantity = 0;
            let quantityReceived = 0;

            // // Calculate total ordered quantity and received quantity of checked items
            // selectedOrder.products.forEach(item => {
            //     totalQuantity += item.quantity;
            //     if (checkedItems[item._id]) {
            //         // Use receivedQuantity if it exists, otherwise fall back to ordered quantity
            //         quantityReceived += item.quantityReceived !== undefined ? item.quantityReceived : item.quantity;
            //     }
            // });

            // console.log(sellingPriceUpdates, "seleing ppp");
            // console.log(receivedQtyUpdates, "receivedQtyUpdates ppp");


            // console.log(selectedOrder, "selectedOrder-------last");
            // const updatedSelectedProduct = updateSelectedProduct();
            // console.log(updatedSelectedProduct, "kesavan");
            return

            // Determine order status based on quantities
            if (quantityReceived === 0) {
                // toast.error("Please verify at least one item before approving");
                return;
            } else if (quantityReceived === totalQuantity) {
                updateOrderStatus(selectedOrder._id, "Approved");  // Changed from selectedOrder.id
                // toast.success("Order fully approved!");
            } else {
                updateOrderStatus(selectedOrder._id, "Partially Received");  // Changed from selectedOrder.id
                // toast.warning("Order partially approved");
            }

            handleCloseModal();
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
            // page,
            // limit,
            search,
        };

        try {
            const response = await VendorApi.getPurchaselist(input);
            console.log(response, "responseeeeeeeeeeeeee");

            if (response.status) {
                console.log(response.response.data, "dddddddddddd");
                setPurchaseOrders(response.response.data)
                // let verdorList = []
                // response.response?.data.map((ival) => {
                //     let label = ival.name
                //     let value = ival._id
                //     verdorList.push({ label, value })
                // })
                // setVendors(verdorList || []);
                // setTotal(response.response.total || 0);
            } else {
                console.error("Failed to fetch brand list");
            }
        } catch (error) {
            console.error("Error fetching brand list:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit, search]);

    const { total, verified } = calculateVerifiedQuantities();

    console.log(purchaseOrders, "purchaseOrders-render");
    console.log(selectedOrder, "selectedOrder");


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
                                Add Stock
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="table-responsive">
                            {/* <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Purchase Date</th>
                                        <th>Vendor Name</th>
                                        <th>Qnt</th>
                                        <th>Order Number</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrders.map((order, index) => (
                                        <tr key={order.id}>
                                            <td>{index + 1}</td>
                                            <td>{new Date(order.date).toLocaleDateString()}</td>
                                            <td>{order.vendorName}</td>
                                            <td>{order.productCount}</td>
                                            <td>{order.orderNumber}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className={`btn btn-subtle-${order.status === "Approved" ? "success" :
                                                        order.status === "Stock Moved" ? "primary" :
                                                            order.status === "Partially Received" ? "warning" :
                                                                "danger"
                                                        } btn-sm waves-effect waves-light`}
                                                >
                                                    {order.status}
                                                </button>
                                            </td>
                                            <td>
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
                                                                onClick={() => viewOrderDetails(order)}
                                                            >
                                                                View
                                                            </a>
                                                            <a
                                                                className="dropdown-item"
                                                                onClick={() => updateOrderStatus(order.id, "Not Received")}
                                                            >
                                                                Not Received
                                                            </a>
                                                            <a
                                                                className="dropdown-item"
                                                                onClick={() => updateOrderStatus(order.id, "Approved")}
                                                            >
                                                                Approved
                                                            </a>
                                                            <a
                                                                className="dropdown-item"
                                                                onClick={() => updateOrderStatus(order.id, "Stock Moved")}
                                                            >
                                                                Stock Moved
                                                            </a>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table> */}
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Purchase Date</th>
                                        <th>Vendor Name</th>
                                        <th>Qnt</th>
                                        <th>Order Number</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrders.map((order, index) => (
                                        <tr key={order._id}>  {/* Changed from order.id to order._id */}
                                            <td> {page * limit + index + 1}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td> {/* Changed from order.date */}
                                            <td>{order.vendorName}</td>
                                            <td>{order.products.length}</td> {/* Show count of products */}
                                            <td>{order.orderId}</td> {/* Changed from order.orderNumber */}
                                            <td>
                                                <button
                                                    type="button"
                                                    className={`btn btn-subtle-${order.status === "completed" ? "success" :
                                                        order.status === "partially Completed" ? "warning" :
                                                            "danger"
                                                        } btn-sm waves-effect waves-light`}
                                                >
                                                    {order.status}
                                                </button>
                                            </td>
                                            <td>
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
                                                                onClick={() => viewOrderDetails(order)}
                                                            >
                                                                View
                                                            </a>
                                                            {/* <a
                                                                className="dropdown-item"
                                                                onClick={() => updateOrderStatus(order._id, "Pending")}
                                                            >
                                                                Pending
                                                            </a>
                                                            <a
                                                                className="dropdown-item"
                                                                onClick={() => updateOrderStatus(order._id, "Completed")}
                                                            >
                                                                Completed
                                                            </a>
                                                            <a
                                                                className="dropdown-item"
                                                                onClick={() => updateOrderStatus(order._id, "Partially Received")}
                                                            >
                                                                Partially Received
                                                            </a> */}
                                                        </div>
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Pagination buttons */}
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
                        disabled={(page + 1) * limit >= total} // Optional check
                        className="btn btn-primary"
                    >
                        Next
                    </button>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} size="xl" dialogClassName="wide-modal">
                <Modal.Header closeButton>
                    <Modal.Title>Order Details - {selectedOrder?.orderNumber}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                                                        <input
                                                            type="date"
                                                            className="form-control"
                                                            value={item.expiryDate ? item.expiryDate : ''}
                                                            onChange={e => handleExpiryDateChange(item._id, e.target.value)}
                                                        />
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

export default InventoryStockListLayer;
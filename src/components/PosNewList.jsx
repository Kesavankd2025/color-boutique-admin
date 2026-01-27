import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import { IMAGE_URL } from '../network/apiClient'
import { ToastContainer, toast } from 'react-toastify';
import "./styles/posPage.css"
import PosdApi from '../apiProvider/posapi';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import customerapiProvider from '../apiProvider/customerorderapi';
import InvoiceTemplate from './InvoiceTemplate'; // Import the invoice component
import { useSelector } from "react-redux";
import customerApi from '../apiProvider/customerorderapi';

const POSSystem = () => {
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const productDropdownRef = useRef(null);
    const [searchInvoiceModal, setSearchInvoiceModal] = useState(false);
    const [invoiceSearchTerm, setInvoiceSearchTerm] = useState("NALC-");
    const [searchingInvoice, setSearchingInvoice] = useState(false);
    const [isAddingNewItem, setIsAddingNewItem] = useState(false);
    const [newItemSearchTerm, setNewItemSearchTerm] = useState('');
    const [newItemApiProducts, setNewItemApiProducts] = useState([]);
    const [loadingNewItemProducts, setLoadingNewItemProducts] = useState(false);
    const [newHighlightedIndex, setNewHighlightedIndex] = useState(-1);
    const newItemDropdownRef = useRef(null);
    const newItemInputRef = useRef(null);
    const [newItemDropdownStyle, setNewItemDropdownStyle] = useState({});
    const [showInvoice, setShowInvoice] = useState(false);
    const [currentInvoice, setCurrentInvoice] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null); // New state for order details
    const [isHoldLoading, setIsHoldLoading] = useState(false);
    const [retrievingOrder, setRetrievingOrder] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const { user } = useSelector((state) => state.auth);

    const thStyle = {
        border: "2px solid #dee2e6",
        padding: "12px",
        backgroundColor: "#f8f9fa",
        textAlign: "left",
        fontSize: "15px",
        fontWeight: "700",
        color: "#000000"
    };

    const tableCellRef = useRef(null);
    const [dropdownStyle, setDropdownStyle] = useState({});
    const editInputRef = useRef(null);

    const tdStyle = {
        border: "1px solid #dee2e6",
        padding: "12px",
        fontSize: "14px",
        fontWeight: "500",
        color: "#000000"
    };

    // Sample product data
    const productData = [
        { id: 'P001', name: 'Sugar', price: 45.0, variants: ['500g', '1kg', '5kg'], currentVariant: '1kg', stock: 100 },
        { id: 'P002', name: 'Rice', price: 60.0, variants: ['1kg', '5kg', '10kg'], currentVariant: '1kg', stock: 150 },
        { id: 'P003', name: 'Wheat Flour', price: 30.0, variants: ['500g', '1kg', '5kg'], currentVariant: '1kg', stock: 80 },
        { id: 'P004', name: 'Milk', price: 25.0, variants: ['500ml', '1L'], currentVariant: '500ml', stock: 50 },
        { id: 'P005', name: 'Eggs', price: 60.0, variants: ['6pcs', '12pcs'], currentVariant: '12pcs', stock: 30 },
    ];

    // Sample customer data
    const initialCustomers = [
        { id: 'C001', name: 'John Doe', mobile: '9876543210', address: '123 Main St', pincode: '600001' },
        { id: 'C002', name: 'Jane Smith', mobile: '8765432109', address: '456 Oak Ave', pincode: '600002' },
    ];

    // State management
    const [products, setProducts] = useState(productData);
    const [cartItems, setCartItems] = useState([]);
    const [customers, setCustomers] = useState(initialCustomers);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [customerSearchTerm, setCustomerSearchTerm] = useState('');

    const [apiProducts, setApiProducts] = useState([]);

    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [newCustomerModal, setNewCustomerModal] = useState(false);
    const [orderType, setOrderType] = useState('takeaway');
    const [deliveryPerson, setDeliveryPerson] = useState('');
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        mobile: '',
        address: '',
        pincode: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        mobile: '',
        address: '',
        pincode: ''
    });

    const [holdOrders, setHoldOrders] = useState([]);
    const [paymentModal, setPaymentModal] = useState(false);
    const [paymentMethods, setPaymentMethods] = useState([
        { method: 'Cash', amount: 0, reference: '' }
    ]);
    const [amountReceived, setAmountReceived] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
    const [selectedCustomerIndex, setSelectedCustomerIndex] = useState(-1);

    const [itemSearchTerm, setItemSearchTerm] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    // New state for pincode validation
    const [pincodeError, setPincodeError] = useState('');
    const [isValidatingPincode, setIsValidatingPincode] = useState(false);

    // Filter products based on search term
    const filteredProducts = apiProducts.filter(product => {
        const searchLower = searchTerm ? searchTerm.toLowerCase() : (itemSearchTerm ? itemSearchTerm.toLowerCase() : '');
        return (
            product.name.toLowerCase().includes(searchLower) ||
            product.id.toLowerCase().includes(searchLower) ||
            (product.originalProduct?.productCode?.toLowerCase().includes(searchLower)) ||
            (product.originalProduct?.categoryName?.toLowerCase().includes(searchLower)) ||
            (product.originalProduct?.brandName?.toLowerCase().includes(searchLower))
        );
    });

    // Filter customers based on search term
    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        customer.mobile.includes(customerSearchTerm)
    );

    // Update cart item quantity
    const updateQuantity = (id, variant, delta) => {
        const updatedCart = cartItems.map(item =>
            item.id === id && item.currentVariant === variant
                ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                : item
        );
        setCartItems(updatedCart);
    };

    // Remove item from cart
    const removeFromCart = (id, variant) => {
        setCartItems(cartItems.filter(item => !(item.id === id && item.currentVariant === variant)));
    };

    // Calculate totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalPrice = orderType === 'delivery' && deliveryCharge
        ? Math.max(0, subtotal - discount) + deliveryCharge
        : Math.max(0, subtotal - discount);

    // Calculate total amount received from all payment methods
    const totalAmountReceived = paymentMethods.reduce((sum, pm) => sum + (parseFloat(pm.amount) || 0), 0);

    // Correct balance and change logic
    const balance = totalAmountReceived >= totalPrice ? 0 : totalPrice - totalAmountReceived;
    const change = totalAmountReceived > totalPrice ? totalAmountReceived - totalPrice : 0;

    // Handle new customer form
    const handleNewCustomerChange = (e) => {
        const { name, value } = e.target;
        setNewCustomer(prev => ({ ...prev, [name]: value }));
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        // Name validation
        if (!newCustomer.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
            setErrors(newErrors);
            return isValid;
        } else if (newCustomer.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
            isValid = false;
            setErrors(newErrors);
            return isValid;
        }

        // Phone number validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!newCustomer.mobile) {
            newErrors.mobile = 'Mobile number is required';
            isValid = false;
            setErrors(newErrors);
            return isValid;
        } else if (!phoneRegex.test(newCustomer.mobile)) {
            newErrors.mobile = 'Phone number must be 10 digits';
            isValid = false;
            setErrors(newErrors);
            return isValid;
        }

        // Address validation
        // if (!newCustomer.address.trim()) {
        //     newErrors.address = 'Address is required';
        //     isValid = false;
        //     setErrors(newErrors);
        //     return isValid;
        // } else if (newCustomer.address.trim().length < 10) {
        //     newErrors.address = 'Address must be at least 10 characters';
        //     isValid = false;
        //     setErrors(newErrors);
        //     return isValid;
        // }

        // Pincode validation
        // const pincodeRegex = /^[0-9]{6}$/;
        // if (!newCustomer.pincode) {
        //     newErrors.pincode = 'Pincode is required';
        //     isValid = false;
        //     setErrors(newErrors);
        //     return isValid;
        // } else if (!pincodeRegex.test(newCustomer.pincode)) {
        //     newErrors.pincode = 'Pincode must be exactly 6 digits';
        //     isValid = false;
        //     setErrors(newErrors);
        //     return isValid;
        // }

        // If all validations pass
        setErrors(newErrors);
        return isValid;
    };

    const addNewCustomer = async () => {
        if (validateForm()) {
            const payload = {
                "name": newCustomer.name,
                "phoneNumber": newCustomer.mobile,
                "address": newCustomer.address,
                "pincode": newCustomer.pincode
            };

            const result = await PosdApi.addCustomer(payload);
            console.log(result, "rrrrrrrrrr");

            if (result && result.status) {
                let userId = result?.response?.data?._id;
                setCustomerSearchTerm("");
                if (userId) {
                    newCustomer.id = userId;
                }
                setSelectedCustomer(newCustomer);
            }

            setNewCustomer({ name: '', mobile: '', address: '', pincode: '' });
            setNewCustomerModal(false);
        }
    };

    // Handle payment
    const handlePayment = () => {
        if (cartItems.length === 0) {
            toast.error('Please add items to cart');
            return;
        }

        if (!selectedCustomer) {
            toast.error('Please select a customer');
            return;
        }

        // Reset payment methods when opening payment modal
        setPaymentMethods([{ method: "Cash", amount: 0, reference: "" }]);
        setPaymentModal(true);
    };
    useEffect(() => {
        fetchHoldOrders();
    }, []);

    // Fetch hold orders
    const fetchHoldOrders = async () => {
        try {
            setIsHoldLoading(true);
            const result = await PosdApi.getHoldOrders({ orderFrom: "pos" });
            if (result?.status && result?.response?.data) {
                setHoldOrders(result.response.data);
            }
        } catch (error) {
            console.error("Error fetching hold orders:", error);
            toast.error("Failed to fetch hold orders");
        } finally {
            setIsHoldLoading(false);
        }
    };
    // Hold order
    const holdOrder = async () => {
        try {
            if (cartItems.length === 0) {
                toast.error("Please add items to cart");
                return;
            }

            if (!selectedCustomer) {
                toast.error("Please select a customer");
                return;
            }

            // Transform cart items to the required format
            const items = cartItems.map(item => {
                const attributeDetails = item.originalProduct?.customerAttributeDetails?.[0];
                let attributes = {};

                // Try to find the variant ID for the current variant
                if (attributeDetails && attributeDetails.value) {
                    const variantObj = attributeDetails.value.find(
                        v => v.value === item.currentVariant
                    );

                    if (variantObj && variantObj._id) {
                        attributes = {
                            [item.currentVariant]: variantObj._id
                        };
                    } else {
                        // Fallback: use the variant name as key and value
                        attributes = {
                            [item.currentVariant]: item.currentVariant
                        };
                    }
                } else {
                    // If no attribute details, use variant name
                    attributes = {
                        [item.currentVariant]: item.currentVariant
                    };
                }

                return {
                    productId: item.id,
                    quantity: item.quantity,
                    unitPrice: item.price,
                    attributes: attributes,
                    discount: 0,
                    taxRate: 0
                };
            });

            // Prepare shipping address
            const shippingAddress = selectedCustomer?.address
                ? {
                    contactName: selectedCustomer.name || "",
                    contactNumber: selectedCustomer.mobile || "",
                    street: selectedCustomer.address || "",
                    city: "",
                    state: "",
                    postalCode: selectedCustomer.pincode || "",
                    country: ""
                }
                : {};

            // Calculate totals
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const totalAmount = orderType === 'delivery'
                ? Math.max(0, subtotal - discount) + deliveryCharge
                : Math.max(0, subtotal - discount);
            console.log(selectedCustomer, "selectedCustomer");

            // Create hold order payload
            const orderPayload = {
                placedByModel: "User",
                placedBy: selectedCustomer?.id,
                items: items,
                shippingAddress: shippingAddress,
                totalAmount: totalAmount,
                deliveryCharge: orderType === 'delivery' ? deliveryCharge : 0,
                discount: discount,
                paymentMode: paymentMethods[0]?.method || "Cash",
                orderType: orderType,
                status: "hold",
                orderFrom: "pos"
            };
            console.log(orderPayload, "orderPayload");

            const result = await PosdApi.holdOrderPurcahse(orderPayload);
            if (result && result.status) {
                toast.success("Order held successfully");
                setCartItems([]);
                setDiscount(0);
                setSelectedCustomer(null);
                fetchHoldOrders(); // Refresh hold orders list
            } else {
                toast.error("Failed to hold order");
            }
        } catch (error) {
            console.error("Error holding order:", error);
            toast.error("Failed to hold order");
        }
    };
    // Retrieve hold order
    const retrieveHoldOrder = async (order) => {
        console.log(order, "hold order to retrieve");
        setRetrievingOrder(true);

        try {
            // Get contact number from shipping address
            const contactNumber = order.shippingAddress?.contactNumber || "";

            // Search for customer by contact number
            let customerData = null;

            if (contactNumber) {
                try {
                    const searchResult = await PosdApi.searchCustomers(contactNumber);
                    if (searchResult?.status && searchResult.response.data.length > 0) {
                        const matchedCustomer = searchResult.response.data.find(customer =>
                            customer.phone === contactNumber || customer.mobile === contactNumber
                        );
                        if (matchedCustomer) {
                            customerData = {
                                id: matchedCustomer._id || matchedCustomer.id,
                                name: matchedCustomer.name || "",
                                mobile: matchedCustomer.phone || matchedCustomer.mobileNumber || contactNumber,
                                address: matchedCustomer.address || order.shippingAddress?.street || "",
                                pincode: matchedCustomer.pincode || order.shippingAddress?.postalCode || ""
                            };
                        }
                    }
                } catch (error) {
                    console.error("Error searching for customer:", error);
                }
            }

            // If customer search didn't find anything, use data from the hold order
            if (!customerData) {
                if (order.userInfo && order.userInfo.length > 0) {
                    const customerInfo = order.userInfo[0];
                    customerData = {
                        id: customerInfo._id,
                        name: customerInfo.name || "Walk-in Customer",
                        mobile: customerInfo.phone || contactNumber,
                        address: customerInfo.address || "",
                        pincode: customerInfo.pincode || ""
                    };
                } else if (order.placedByName) {
                    customerData = {
                        id: order.placedBy,
                        name: order.placedByName || "Walk-in Customer",
                        mobile: contactNumber,
                        address: order.shippingAddress?.street || "",
                        pincode: order.shippingAddress?.postalCode || ""
                    };
                }
            }

            // Convert hold order items to cart items format
            const cartItemsFromHold = order.items.map((itemData, index) => {
                const item = itemData.item || itemData;
                const product = itemData.product || {};

                // Get attribute information
                const customerAttribute = product.customerAttribute || {};
                const rowData = customerAttribute.rowData || [];

                // Get attribute details - these contain the mapping between variant IDs and names
                const attributeData = product.customerAttributeDetails || [];

                // Initialize variant data
                let currentVariant = 'default';
                let variants = ['default'];
                let variantPrices = { 'default': item.unitPrice || 0 };
                let shippingWeights = { 'default': 0 };
                const attributes = item.attributes || {};

                console.log("Processing item:", {
                    productName: product.productName,
                    itemAttributes: attributes,
                    attributeData: attributeData,
                    rowData: rowData
                });

                // Extract the saved variant information
                if (attributes && typeof attributes === 'object') {
                    const attributeEntries = Object.entries(attributes);

                    if (attributeEntries.length > 0) {
                        const [savedVariantName, savedVariantId] = attributeEntries[0];

                        // Get the attribute name dynamically (e.g., "Kilo Grams")
                        const attributeName = attributeData[0]?.name || '';

                        // STEP 1: Extract available variants from rowData dynamically
                        const availableVariants = [];
                        const variantPriceMap = {};
                        const weightMap = {};

                        rowData.forEach(row => {
                            // Dynamically find the variant ID field
                            let variantId = null;
                            let variantValue = null;

                            // Look for the attribute name field in row data
                            if (row[attributeName]) {
                                variantId = row[attributeName];
                            } else {
                                // Fallback: check common fields
                                const possibleFields = Object.keys(row);
                                for (const field of possibleFields) {
                                    // Skip non-ID fields
                                    if (['sku', 'price', 'stock', 'maxLimit', 'wholesalermrp', 'customermrp',
                                        'shippingWeight', 'mrp', 'silver', 'gold', 'platinum'].includes(field)) {
                                        continue;
                                    }

                                    // Check if this field contains an ID that looks like an ObjectId
                                    const fieldValue = row[field];
                                    if (fieldValue && typeof fieldValue === 'string' &&
                                        fieldValue.length >= 12 && !fieldValue.includes(' ')) {
                                        variantId = fieldValue;
                                        break;
                                    }
                                }
                            }

                            if (variantId) {
                                // Find the variant name from attributeData
                                if (attributeData.length > 0) {
                                    attributeData.forEach(attr => {
                                        const variantObj = attr.value?.find(v => v._id === variantId);
                                        if (variantObj) {
                                            variantValue = variantObj.value;

                                            // Add to available variants if not already added
                                            if (!availableVariants.includes(variantValue)) {
                                                availableVariants.push(variantValue);
                                            }

                                            // Set price and weight
                                            variantPriceMap[variantValue] = parseFloat(row.price) || item.unitPrice || 0;
                                            weightMap[variantValue] = parseFloat(row.shippingWeight) || 0;

                                            // Check if this is the current variant
                                            if (variantId === savedVariantId) {
                                                currentVariant = variantValue;
                                            }
                                        }
                                    });
                                }
                            }
                        });

                        // STEP 2: Set variants array (only include variants that exist in rowData)
                        if (availableVariants.length > 0) {
                            variants = availableVariants;
                            variantPrices = variantPriceMap;
                            shippingWeights = weightMap;
                        } else {
                            // Fallback: use all variants from attributeData
                            if (attributeData.length > 0) {
                                attributeData.forEach(attr => {
                                    if (attr.value && Array.isArray(attr.value)) {
                                        // Filter variants to only include those that have data in rowData
                                        const filteredVariants = attr.value.filter(variantObj => {
                                            // Check if this variant exists in rowData
                                            return rowData.some(row => {
                                                // Check all fields for this variant ID
                                                return Object.values(row).some(val =>
                                                    val === variantObj._id
                                                );
                                            });
                                        });

                                        variants = filteredVariants.map(v => v.value);

                                        // Set prices and weights for filtered variants
                                        filteredVariants.forEach(variantObj => {
                                            // Find corresponding row in rowData
                                            const row = rowData.find(r => {
                                                return Object.values(r).some(val => val === variantObj._id);
                                            });

                                            if (row) {
                                                variantPrices[variantObj.value] = parseFloat(row.price) || item.unitPrice || 0;
                                                shippingWeights[variantObj.value] = parseFloat(row.shippingWeight) || 0;
                                            } else {
                                                variantPrices[variantObj.value] = item.unitPrice || 0;
                                                shippingWeights[variantObj.value] = 0;
                                            }

                                            // Check if this is the current variant
                                            if (variantObj._id === savedVariantId) {
                                                currentVariant = variantObj.value;
                                            }
                                        });
                                    }
                                });
                            }
                        }

                        // If currentVariant not found in variants, use first variant
                        if (!variants.includes(currentVariant) && variants.length > 0) {
                            currentVariant = variants[0];
                        }
                    }
                }

                // If we still have default variant and rowData has entries
                if (variants.length === 1 && variants[0] === 'default' && rowData.length > 0) {
                    const variantSet = new Set();
                    const variantPriceMap = {};
                    const weightMap = {};

                    rowData.forEach(row => {
                        // Try to extract variant information dynamically
                        let variantId = null;
                        let variantName = 'default';

                        // Find the variant ID field
                        const possibleFields = Object.keys(row);
                        for (const field of possibleFields) {
                            // Skip common data fields
                            if (['sku', 'price', 'stock', 'maxLimit', 'wholesalermrp', 'customermrp',
                                'shippingWeight', 'mrp', 'silver', 'gold', 'platinum'].includes(field)) {
                                continue;
                            }

                            const fieldValue = row[field];
                            if (fieldValue && typeof fieldValue === 'string') {
                                // Check if it's likely an ID or a value
                                if (fieldValue.length >= 12 && !fieldValue.includes(' ')) {
                                    variantId = fieldValue;
                                } else if (fieldValue.length < 20) {
                                    variantName = fieldValue;
                                }
                            }
                        }

                        // If we found a variant ID, try to get its name from attributeData
                        if (variantId && attributeData.length > 0) {
                            attributeData.forEach(attr => {
                                const variantObj = attr.value?.find(v => v._id === variantId);
                                if (variantObj) {
                                    variantName = variantObj.value;
                                }
                            });
                        }

                        if (variantName !== 'default') {
                            variantSet.add(variantName);
                            variantPriceMap[variantName] = parseFloat(row.price) || item.unitPrice || 0;
                            weightMap[variantName] = parseFloat(row.shippingWeight) || 0;
                        }
                    });

                    if (variantSet.size > 0) {
                        variants = Array.from(variantSet);
                        variantPrices = variantPriceMap;
                        shippingWeights = weightMap;

                        // Determine current variant
                        if (attributes && Object.keys(attributes).length > 0) {
                            const savedVariantName = Object.keys(attributes)[0];
                            if (variants.includes(savedVariantName)) {
                                currentVariant = savedVariantName;
                            } else {
                                currentVariant = variants[0];
                            }
                        } else {
                            currentVariant = variants[0];
                        }
                    }
                }

                console.log("Final processed cart item:", {
                    name: product.productName,
                    currentVariant,
                    variants,
                    variantPrices,
                    price: variantPrices[currentVariant] || item.unitPrice || 0
                });

                return {
                    id: item.productId,
                    name: product.productName || `Product ${index + 1}`,
                    productCode: product.productCode || "",
                    price: variantPrices[currentVariant] || item.unitPrice || 0,
                    variants: variants,
                    currentVariant: currentVariant,
                    quantity: item.quantity || 1,
                    discount: item.discount || 0,
                    taxRate: item.taxRate || 0,
                    image: product.productImage?.[0]?.docPath
                        ? `${IMAGE_URL}/${product.productImage[0].docPath}/${product.productImage[0].docName}`
                        : null,
                    originalProduct: {
                        ...product,
                        // Filter attributeDetails to only include variants that exist in rowData
                        customerAttributeDetails: attributeData.map(attr => ({
                            ...attr,
                            value: attr.value?.filter(variantObj =>
                                rowData.some(row =>
                                    Object.values(row).some(val => val === variantObj._id)
                                )
                            ) || []
                        })).filter(attr => attr.value.length > 0) // Remove empty attributes
                    },
                    variantPrices: variantPrices,
                    shippingWeights: shippingWeights,
                    attributes: attributes
                };
            });

            // Set cart items
            setCartItems(cartItemsFromHold);

            // Set customer if found
            if (customerData) {
                setSelectedCustomer(customerData);
                setCustomerSearchTerm(customerData.mobile || customerData.name);
            }

            // Set order type and delivery charge
            setOrderType(order.orderType || "takeaway");
            setDeliveryCharge(order.deliveryCharge || 0);

            // Set payment method
            if (order.paymentMode) {
                setPaymentMethods([{ method: order.paymentMode, amount: 0, reference: "" }]);
            }

            // Set discount
            setDiscount(order.discount || 0);

            // Set amount received
            if (order.amountPaid) {
                setAmountReceived(order.amountPaid);
            }

            toast.success(`Order #${order.holdOrderId || order._id} retrieved successfully`);

        } catch (error) {
            console.error("Error retrieving hold order:", error);
            toast.error("Failed to retrieve order. Please try again.");
        } finally {
            setRetrievingOrder(false);
        }
    };
    // Delete hold order
    const deleteHoldOrder = async (holdOrderId) => {
        if (!holdOrderId) {
            toast.error("Hold order ID is required");
            return;
        }

        // Confirm before deleting
        if (!window.confirm("Are you sure you want to delete this hold order? This action cannot be undone.")) {
            return;
        }

        try {
            // Call API to delete hold order
            const result = await PosdApi.deleteHoldOrder(holdOrderId);

            if (result && result.status) {
                // Refresh hold orders list
                fetchHoldOrders();
                toast.success("Hold order deleted successfully");
            } else {
                toast.error(result?.message || "Failed to delete hold order");
            }
        } catch (error) {
            console.error("Error deleting hold order:", error);
            toast.error("Failed to delete hold order. Please try again.");
        }
    };
    const searchInvoice = async () => {
        if (!invoiceSearchTerm.trim()) {
            toast.error("Please enter an invoice number");
            return;
        }

        setSearchingInvoice(true);
        try {
            // Search for the order by order code
            const result = await customerApi.searchOrders(invoiceSearchTerm);

            if (result?.status && result?.response?.data) {
                const orderData = result.response.data;
                console.log("Order data received:", orderData);

                // Set the order as the selected order for editing
                setSelectedOrder(orderData);
                setEditingOrder(orderData);

                // Convert order items to cart items format for POS
                const cartItemsFromOrder = orderData.items.map((item, index) => {
                    // Find the corresponding product details
                    const productDetails = orderData.products?.find(
                        product => product._id === item.productId
                    ) || {};

                    console.log("Product Details:", productDetails);
                    console.log("Item Attributes:", item.attributes);

                    // Get attribute details
                    const attributeData = productDetails.attributeData || [];
                    const customerAttributeDetails = productDetails.customerAttributeDetails || [];
                    const customerAttribute = productDetails.customerAttribute || {};
                    const rowData = customerAttribute.rowData || [];

                    // Determine current variant from attributes
                    let currentVariant = 'default';
                    let variants = ['default'];
                    let variantPrices = { 'default': item.unitPrice || 0 };
                    let shippingWeights = { 'default': 0 };

                    // If item has attributes, extract the variant value
                    if (item.attributes && typeof item.attributes === 'object') {
                        // Get the attribute key (e.g., "2Kg", "200g")
                        const attributeKey = Object.keys(item.attributes)[0];
                        const attributeValueId = item.attributes[attributeKey];

                        console.log("Attribute key:", attributeKey, "Value ID:", attributeValueId);

                        if (attributeKey && attributeValueId) {
                            currentVariant = attributeKey;

                            // Use customerAttributeDetails to get all variants
                            if (customerAttributeDetails.length > 0) {
                                // Combine all variants from all attribute details
                                const allVariants = [];
                                const variantPriceMap = {};
                                const weightMap = {};

                                customerAttributeDetails.forEach(attr => {
                                    if (attr.value && Array.isArray(attr.value)) {
                                        // Add all variants from this attribute
                                        attr.value.forEach(variantObj => {
                                            allVariants.push(variantObj.value);

                                            // Find price and weight from rowData
                                            const matchingRow = rowData.find(row => {
                                                // Check if this variant ID exists in any field of the row
                                                return Object.values(row).some(val =>
                                                    val === variantObj._id
                                                );
                                            });

                                            if (matchingRow) {
                                                variantPriceMap[variantObj.value] = parseFloat(matchingRow.price) || item.unitPrice || 0;
                                                weightMap[variantObj.value] = parseFloat(matchingRow.shippingWeight) || 0;
                                            } else {
                                                // Fallback to item unit price
                                                variantPriceMap[variantObj.value] = item.unitPrice || 0;
                                                weightMap[variantObj.value] = 0;
                                            }
                                        });
                                    }
                                });

                                if (allVariants.length > 0) {
                                    variants = [...new Set(allVariants)]; // Remove duplicates
                                    variantPrices = variantPriceMap;
                                    shippingWeights = weightMap;
                                }
                            } else {
                                // Fallback to using rowData directly
                                const variantSet = new Set();
                                const variantPriceMap = {};
                                const weightMap = {};

                                rowData.forEach(row => {
                                    // Find variant ID in row
                                    let variantId = null;
                                    let variantName = null;

                                    // Check common attribute fields
                                    const possibleFields = ['Weights', 'Pack', 'Quantity', 'Kilo Grams', 'Grams', 'Weight'];
                                    for (const field of possibleFields) {
                                        if (row[field]) {
                                            variantId = row[field];

                                            // Try to find variant name from attributeData
                                            const variantObj = attributeData.find(attr =>
                                                attr.value?.find(v => v._id === variantId)
                                            )?.value?.find(v => v._id === variantId);

                                            variantName = variantObj?.value || `Variant_${variantId.substring(0, 4)}`;
                                            break;
                                        }
                                    }

                                    if (variantName) {
                                        variantSet.add(variantName);
                                        variantPriceMap[variantName] = parseFloat(row.price) || item.unitPrice || 0;
                                        weightMap[variantName] = parseFloat(row.shippingWeight) || 0;

                                        // Check if this is the current variant
                                        if (variantId === attributeValueId) {
                                            currentVariant = variantName;
                                        }
                                    }
                                });

                                if (variantSet.size > 0) {
                                    variants = Array.from(variantSet);
                                    variantPrices = variantPriceMap;
                                    shippingWeights = weightMap;
                                }
                            }

                            // Ensure currentVariant is in variants array
                            if (!variants.includes(currentVariant) && variants.length > 0) {
                                currentVariant = variants[0];
                            }
                        }
                    }

                    // If we still have default, try to extract from customerAttributeDetails
                    if (variants.length === 1 && variants[0] === 'default' && customerAttributeDetails.length > 0) {
                        const variantSet = new Set();
                        const variantPriceMap = {};
                        const weightMap = {};

                        customerAttributeDetails.forEach(attr => {
                            if (attr.value && Array.isArray(attr.value)) {
                                attr.value.forEach(variantObj => {
                                    variantSet.add(variantObj.value);

                                    // Find price and weight from rowData
                                    const matchingRow = rowData.find(row => {
                                        return Object.values(row).some(val =>
                                            val === variantObj._id
                                        );
                                    });

                                    if (matchingRow) {
                                        variantPriceMap[variantObj.value] = parseFloat(matchingRow.price) || item.unitPrice || 0;
                                        weightMap[variantObj.value] = parseFloat(matchingRow.shippingWeight) || 0;
                                    } else {
                                        variantPriceMap[variantObj.value] = item.unitPrice || 0;
                                        weightMap[variantObj.value] = 0;
                                    }
                                });
                            }
                        });

                        if (variantSet.size > 0) {
                            variants = Array.from(variantSet);
                            variantPrices = variantPriceMap;
                            shippingWeights = weightMap;

                            // Try to determine current variant
                            if (item.attributes && Object.keys(item.attributes).length > 0) {
                                const savedVariantKey = Object.keys(item.attributes)[0];
                                const savedVariantId = item.attributes[savedVariantKey];

                                // Find the variant name for this ID
                                customerAttributeDetails.forEach(attr => {
                                    const variantObj = attr.value?.find(v => v._id === savedVariantId);
                                    if (variantObj && variants.includes(variantObj.value)) {
                                        currentVariant = variantObj.value;
                                    }
                                });

                                if (!variants.includes(currentVariant)) {
                                    currentVariant = variants[0];
                                }
                            } else {
                                currentVariant = variants[0];
                            }
                        }
                    }

                    console.log("Processed Item:", {
                        name: productDetails?.productName,
                        currentVariant,
                        variants,
                        variantPrices,
                        price: variantPrices[currentVariant] || item.unitPrice || 0
                    });

                    return {
                        id: item.productId,
                        name: productDetails?.productName || `Product ${index + 1}`,
                        productCode: productDetails?.productCode || "",
                        price: variantPrices[currentVariant] || item.unitPrice || 0,
                        variants: variants,
                        currentVariant: currentVariant,
                        quantity: item.quantity || 1,
                        discount: item.discount || 0, // Use actual discount from item if available
                        taxRate: productDetails?.customerTax || 0, // Use tax rate from product
                        image: productDetails?.productImage?.[0]?.docPath
                            ? `${IMAGE_URL}/${productDetails.productImage[0].docPath}/${productDetails.productImage[0].docName}`
                            : null,
                        originalProduct: {
                            ...productDetails,
                            // Use the existing customerAttributeDetails
                            customerAttributeDetails: customerAttributeDetails
                        },
                        variantPrices: variantPrices,
                        shippingWeights: shippingWeights,
                        attributes: item.attributes || {}
                    };
                });

                console.log("Cart Items from Order:", cartItemsFromOrder);

                // Set cart items from order
                setCartItems(cartItemsFromOrder);

                // Set customer from order
                if (orderData.placedByName) {
                    if (typeof orderData.placedByName === 'object') {
                        setSelectedCustomer({
                            id: orderData.placedByName._id,
                            name: orderData.placedByName.name || "",
                            mobile: orderData.placedByName.phone || "",
                            address: orderData.placedByName.address || "",
                            pincode: orderData.placedByName.pincode || ""
                        });
                    } else {
                        setSelectedCustomer({
                            id: orderData.placedBy,
                            name: orderData.placedByName,
                            mobile: "",
                            address: "",
                            pincode: ""
                        });
                    }
                } else if (orderData.placedBy) {
                    setSelectedCustomer({
                        id: orderData.placedBy,
                        name: "Customer",
                        mobile: "",
                        address: "",
                        pincode: ""
                    });
                }

                // Set order type and delivery charge
                setOrderType(orderData.orderType || "takeaway");
                setDeliveryCharge(orderData.deliveryCharge || 0);
                setDiscount(orderData.discount || 0);

                // Set payment methods from order
                if (orderData.paymentDetails && Array.isArray(orderData.paymentDetails)) {
                    setPaymentMethods(orderData.paymentDetails.map(pm => ({
                        method: pm.method || "Cash",
                        amount: pm.amount || 0,
                        reference: pm.reference || ""
                    })));
                } else {
                    // Fallback to single payment method
                    setPaymentMethods([{
                        method: orderData.paymentMode || "Cash",
                        amount: orderData.amountPaid || 0,
                        reference: ""
                    }]);
                }

                // Set amount received
                setAmountReceived(orderData.amountPaid || 0);

                // Close the search modal
                setSearchInvoiceModal(false);
                setInvoiceSearchTerm("NALC-");

                toast.success("Order loaded successfully. You can now edit it.");
            } else {
                toast.error("Order not found. Please check the invoice number.");
            }
        } catch (error) {
            console.error("Error searching for invoice:", error);
            toast.error("Failed to search for invoice");
        } finally {
            setSearchingInvoice(false);
        }
    };
    const clearEditMode = () => {
        setEditingOrder(null);
        setCartItems([]);
        setSelectedCustomer(null);
        setDiscount(0);
        setPaymentMethods([{ method: "Cash", amount: 0, reference: "" }]);
        setAmountReceived(0);
        setOrderType('takeaway');
        setDeliveryCharge(0);
        setSearchTerm('');
        setCustomerSearchTerm('');
    };
    // Add a new payment method
    const addPaymentMethod = () => {
        setPaymentMethods([...paymentMethods, { method: "Cash", amount: 0, reference: "" }]);
    };

    // Remove a payment method
    const removePaymentMethod = (index) => {
        if (paymentMethods.length <= 1) {
            toast.error("At least one payment method is required");
            return;
        }

        const updatedMethods = [...paymentMethods];
        updatedMethods.splice(index, 1);
        setPaymentMethods(updatedMethods);
    };

    // Update a payment method
    const updatePaymentMethod = (index, field, value) => {
        const updatedMethods = [...paymentMethods];
        updatedMethods[index] = {
            ...updatedMethods[index],
            [field]: value
        };
        setPaymentMethods(updatedMethods);
    };

    const transformCartToOrderPayload = (cartItems, customerId, shippingAddress, orderType, deliveryCharge) => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalAmount = orderType === 'delivery'
            ? Math.max(0, subtotal - discount) + deliveryCharge
            : Math.max(0, subtotal - discount);

        const items = cartItems.map(item => {
            const attributeDetails = item.originalProduct?.customerAttributeDetails?.[0];
            const variantId = attributeDetails?.value?.find(
                v => v.value === item.currentVariant
            )?._id;

            const attributes = variantId ? {
                [item.currentVariant]: variantId
            } : {};

            return {
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
                attributes: attributes
            };
        });

        // Prepare payment details
        const paymentDetails = paymentMethods.map(pm => ({
            method: pm.method,
            amount: parseFloat(pm.amount) || 0,
            reference: pm.reference || ""
        }));

        const payload = {
            placedByModel: "User",
            items: items,
            totalAmount: totalAmount,
            shippingAddress: shippingAddress,
            paymentDetails: paymentDetails,
            paymentMode: paymentDetails[0]?.method ?? "Cash",
            placedBy: customerId,
            amountPaid: totalAmountReceived,
            date: new Date().toISOString(),
            orderType: orderType,
            deliveryCharge: orderType === 'delivery' ? deliveryCharge : 0,
            discount: discount
        };
        // If editing an existing order, include the reorderId
        if (editingOrder) {
            payload.reorderId = editingOrder._id;
        }

        return payload;
    };

    // Function to validate pincode
    const validatePincode = async (pincode) => {
        if (!pincode || pincode.length !== 6) {
            setPincodeError('Please enter a valid 6-digit pincode');
            return false;
        }

        setIsValidatingPincode(true);
        setPincodeError('');

        try {
            const result = await PosdApi.getPincodeDetails(pincode);

            if (result && result.status && result.response && result.response.data) {
                const pincodeDetails = result.response.data[0];

                // Check if pincode details exist and have variants
                if (!pincodeDetails) {
                    setPincodeError('This pincode is not available for delivery. Please contact admin to add this pincode.');
                    return false;
                }

                if (!pincodeDetails.variants || pincodeDetails.variants.length === 0) {
                    setPincodeError('Delivery variants not configured for this pincode. Please contact admin.');
                    return false;
                }

                return {
                    isValid: true,
                    pincodeDetails: pincodeDetails
                };
            } else {
                setPincodeError('This pincode is not available for delivery. Please contact admin to add this pincode.');
                return false;
            }
        } catch (error) {
            console.error("Error validating pincode:", error);
            setPincodeError('Error validating pincode. Please try again or contact admin.');
            return false;
        } finally {
            setIsValidatingPincode(false);
        }
    };

    // Calculate delivery charge for a single product
    const calculateProductDeliveryCharge = async (item, pincodeDetails) => {
        if (!pincodeDetails || !pincodeDetails.variants) return 0;

        // Get shipping weight from product attributes
        const shippingWeight = item.shippingWeight || 0;

        if (shippingWeight <= 0) return 0;

        try {
            const payload = {
                variants: pincodeDetails.variants,
                shippingWeight: parseFloat(shippingWeight),
                quantity: item.quantity
            };

            const result = await PosdApi.getDeliveryCharge(payload);
            if (result && result.status) {
                return result?.response?.deliveryCharge || 0;
            }
        } catch (error) {
            console.error("Error calculating delivery charge for product:", item.name, error);
        }

        return 0;
    };

    // Calculate total delivery charge for all cart items
    const calculateTotalDeliveryCharge = async (cartItems, pincodeDetails) => {
        if (!pincodeDetails) return 0;

        let totalDeliveryCharge = 0;

        for (const item of cartItems) {
            const itemCharge = await calculateProductDeliveryCharge(item, pincodeDetails);
            totalDeliveryCharge += itemCharge;
        }

        return totalDeliveryCharge;
    };

    // Fetch order details by ID
    const fetchOrderDetails = async (orderId) => {
        try {
            // Assuming you have an API to fetch order details by ID
            const response = await customerapiProvider.orderDetails(orderId);
            if (response && response.status) {
                return response.response.data;
            }
            return null;
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Failed to fetch order details");
            return null;
        }
    };

    const completePayment = async () => {
        try {
            // Validate payment methods
            for (let i = 0; i < paymentMethods.length; i++) {
                const pm = paymentMethods[i];

                // Check if amount is provided
                if (!pm.amount || parseFloat(pm.amount) <= 0) {
                    toast.error(`Please enter a valid amount for payment method ${i + 1}`);
                    return;
                }

                // Check if reference number is provided for card/UPI payments
                if ((pm.method === "Card" || pm.method === "QR Code") && !pm.reference.trim()) {
                    toast.error(`Please enter a reference number for ${pm.method.toUpperCase()} payment`);
                    return;
                }
            }

            // Check if total amount received is sufficient
            if (totalAmountReceived <= 0) {
                toast.error("Please enter payment amounts");
                return;
            }

            if (orderType === 'delivery') {
                if (!selectedCustomer?.address || !selectedCustomer?.pincode) {
                    toast.error('Please enter delivery address and pincode');
                    return;
                }

                // Validate pincode before calculating delivery charge
                const validationResult = await validatePincode(selectedCustomer.pincode);
                if (!validationResult) {
                    // Error message already set by validatePincode function
                    return;
                }

                const pincodeDetails = validationResult.pincodeDetails;
                const calculatedCharge = await calculateTotalDeliveryCharge(cartItems, pincodeDetails);
                setDeliveryCharge(calculatedCharge);

                // Recalculate total price with updated delivery charge
                const recalculatedTotal = Math.max(0, subtotal - discount) + calculatedCharge;
                if (recalculatedTotal !== totalPrice) {
                    toast.info(`Delivery charge updated: ₹${calculatedCharge.toFixed(2)}`);
                }
            }

            const orderPayload = transformCartToOrderPayload(
                cartItems,
                selectedCustomer?.id,
                selectedCustomer,
                orderType,
                deliveryCharge,
            );

            if (orderPayload) {
                const result = await PosdApi.orderPurcahse(orderPayload);
                if (result && result.status) {
                    console.log(result, "rrrrrrrr");

                    // Get the order ID from response
                    const orderId = result?.response?.orderdata?._id ||
                        result?.response?.data?.orderId ||
                        result?.response?.order?._id;
                    console.log(orderId, "oooooo");

                    if (orderId) {
                        // Fetch order details using the order ID
                        const orderDetails = await fetchOrderDetails(orderId);
                        if (orderDetails) {
                            setSelectedOrder(orderDetails);
                            setShowInvoice(true);

                            // Clear cart and reset states
                            setCartItems([]);
                            setPaymentModal(false);
                            setPaymentMethods([{ method: "Cash", amount: 0, reference: "" }]);
                            setDiscount(0);

                            toast.success('Order placed successfully!');
                        } else {
                            toast.error('Failed to fetch order details');
                        }
                    } else {
                        toast.error('Order ID not found in response');
                    }
                } else {
                    toast.error('Failed to place order');
                }
            }
        } catch (error) {
            console.error("Error completing payment:", error);
            toast.error("Failed to complete payment");
        }
    };

    // Handle customer search with keyboard navigation
    const handleCustomerKeyDown = (e) => {
        if (!customerSearchTerm || !filteredCustomers.length) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedCustomerIndex(prev => prev >= filteredCustomers.length - 1 ? 0 : prev + 1);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedCustomerIndex(prev => prev <= 0 ? filteredCustomers.length - 1 : prev - 1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedCustomerIndex >= 0 && selectedCustomerIndex < filteredCustomers.length) {
                    const selectedCustomer = filteredCustomers[selectedCustomerIndex];
                    setSelectedCustomer(selectedCustomer);
                    setCustomerSearchTerm('');
                    setSelectedCustomerIndex(-1);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setCustomerSearchTerm('');
                setSelectedCustomerIndex(-1);
                break;
            default:
                break;
        }
    };

    // Handle product search with keyboard navigation
    const handleKeyDown = (e) => {
        if (!searchTerm || !filteredProducts.length) return;

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setSelectedProductIndex((prev) => prev >= filteredProducts.length - 1 ? 0 : prev + 1);
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedProductIndex((prev) => prev <= 0 ? filteredProducts.length - 1 : prev - 1);
                break;
            case "Enter":
                e.preventDefault();
                if (selectedProductIndex >= 0 && selectedProductIndex < filteredProducts.length) {
                    addToCart(filteredProducts[selectedProductIndex]);
                    setSearchTerm("");
                    setSelectedProductIndex(-1);
                }
                break;
            default:
                break;
        }
    };

    const searchCustomers = async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 3) {
            setCustomers([]);
            return;
        }

        setLoadingCustomers(true);
        try {
            const response = await PosdApi.searchCustomers(searchTerm);
            if (response && response.status) {
                const apiCustomers = response.response.data.map(customer => ({
                    id: customer._id || `C${Math.random().toString(36).substr(2, 8)}`,
                    name: customer.name,
                    mobile: customer.phone,
                    address: customer.address,
                    pincode: customer.pincode
                }));
                setCustomers(apiCustomers);
            }
        } catch (error) {
            toast.error('Failed to search customers');
            console.error('Customer search error:', error);
        } finally {
            setLoadingCustomers(false);
        }
    };

    // Search products
    const searchProducts = async (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
            setApiProducts([]);
            return;
        }

        setLoadingProducts(true);
        try {
            const response = await PosdApi.searchProducts(searchTerm);
            if (response && response.response && response.response.data) {
                const transformedProducts = response.response.data.map(product => {
                    const attributeDetail = product.customerAttributeDetails?.[0];
                    const attributeName = attributeDetail?.name;
                    const variantPrices = {};
                    const shippingWeights = {};
                    const variantsSet = new Set();

                    if (product.customerAttribute?.rowData) {
                        product.customerAttribute.rowData.forEach(row => {
                            const variantId = row[attributeName];
                            if (!variantId) return;

                            const variantObj = attributeDetail.value.find(
                                v => v._id === variantId
                            );

                            if (!variantObj) return;

                            const variantName = variantObj.value;
                            variantsSet.add(variantName);

                            variantPrices[variantName] =
                                parseFloat(row.price) || product.customersellingPrice || 0;

                            shippingWeights[variantName] =
                                parseFloat(row.shippingWeight) || 0;
                        });
                    }

                    const variants = Array.from(variantsSet);
                    const defaultVariant = variants[0] || 'default';

                    return {
                        id: product._id || product.productCode || `P${Math.random().toString(36).substr(2, 8)}`,
                        name: product.productName || 'Unknown Product',
                        productCode: product.productCode,
                        price: variantPrices[defaultVariant] || product.customersellingPrice || 0,
                        variants: variants,
                        currentVariant: defaultVariant,
                        stock: product.customerAttribute?.rowData?.[0]?.stock ||
                            product.wholesalerAttribute?.rowData?.[0]?.stock ||
                            product.lowStockQuantity || 0,
                        image: product.productImage?.[0]?.docPath
                            ? `${IMAGE_URL}/${product.productImage[0].docPath}/${product.productImage[0].docName}`
                            : null,
                        originalProduct: product,
                        variantPrices: variantPrices,
                        shippingWeights: shippingWeights,
                        description: product.shortDescription,
                        packageType: product.packageType,
                        unitMeasurement: product.unitMeasurement
                    };
                });

                setApiProducts(transformedProducts);
            }
        } catch (error) {
            toast.error('Failed to search products');
            console.error('Product search error:', error);
        } finally {
            setLoadingProducts(false);
        }
    };

    // Add to cart
    const addToCart = (product) => {
        const variantPrice = product.variantPrices?.[product.currentVariant] || product.price;
        const shippingWeight = product.shippingWeights?.[product.currentVariant] || 0;

        const productToAdd = {
            ...product,
            price: variantPrice,
            shippingWeight: shippingWeight,
            variantPrices: product.variantPrices || {},
            shippingWeights: product.shippingWeights || {}
        };

        const existingItem = cartItems.find(item =>
            item.id === productToAdd.id &&
            item.currentVariant === productToAdd.currentVariant
        );

        if (existingItem) {
            const updatedCart = cartItems.map(item =>
                item.id === productToAdd.id && item.currentVariant === productToAdd.currentVariant
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
            setCartItems(updatedCart);
        } else {
            setCartItems([...cartItems, { ...productToAdd, quantity: 1 }]);
        }
    };

    // Auto-scroll to selected customer
    useEffect(() => {
        if (selectedCustomerIndex >= 0 && filteredCustomers.length > 0) {
            const selectedElement = document.querySelector(
                `.customer-dropdown .p-2:nth-child(${selectedCustomerIndex + 1})`
            );
            if (selectedElement) {
                selectedElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    }, [selectedCustomerIndex, filteredCustomers]);

    // Auto-scroll to selected product
    useEffect(() => {
        if (selectedProductIndex >= 0 && productDropdownRef.current) {
            const highlightedItem = productDropdownRef.current.children[selectedProductIndex];
            if (highlightedItem && highlightedItem.children[0]) {
                highlightedItem.children[0].scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                });
            }
        }
    }, [selectedProductIndex]);

    // Debounce product search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchProducts(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Debounce customer search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchCustomers(customerSearchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [customerSearchTerm]);

    // Fetch delivery charges
    useEffect(() => {
        const fetchDeliveryCharges = async () => {
            if (orderType === "delivery" && selectedCustomer?.pincode) {
                try {
                    const validationResult = await validatePincode(selectedCustomer.pincode);
                    if (validationResult) {
                        const pincodeDetails = validationResult.pincodeDetails;
                        const calculatedCharge = await calculateTotalDeliveryCharge(cartItems, pincodeDetails);
                        setDeliveryCharge(calculatedCharge);
                    } else {
                        setDeliveryCharge(0);
                    }
                } catch (error) {
                    console.error("Error fetching delivery charges:", error);
                    setDeliveryCharge(0);
                }
            }
        };

        fetchDeliveryCharges();
    }, [orderType, selectedCustomer, selectedCustomer?.pincode, cartItems]);

    // Download invoice
    const [isDownloading, setIsDownloading] = useState(false);
    const invoiceTemplateRef = useRef(null);

    // New item row search
    useEffect(() => {
        const search = async () => {
            if (!newItemSearchTerm || newItemSearchTerm.length < 2) {
                setNewItemApiProducts([]);
                return;
            }
            setLoadingNewItemProducts(true);
            try {
                const response = await PosdApi.searchProducts(newItemSearchTerm);
                if (response && response.response && response.response.data) {
                    const transformedProducts = response.response.data.map(product => {
                        const attributeDetail = product.customerAttributeDetails?.[0];
                        const attributeName = attributeDetail?.name;
                        const variantPrices = {};
                        const shippingWeights = {};
                        const variantsSet = new Set();

                        if (product.customerAttribute?.rowData) {
                            product.customerAttribute.rowData.forEach(row => {
                                const variantId = row[attributeName];
                                if (!variantId) return;

                                const variantObj = attributeDetail.value.find(
                                    v => v._id === variantId
                                );

                                if (!variantObj) return;

                                const variantName = variantObj.value;
                                variantsSet.add(variantName);

                                variantPrices[variantName] =
                                    parseFloat(row.price) || product.customersellingPrice || 0;

                                shippingWeights[variantName] =
                                    parseFloat(row.shippingWeight) || 0;
                            });
                        }

                        const variants = Array.from(variantsSet);
                        const defaultVariant = variants[0] || 'default';

                        return {
                            id: product._id || product.productCode || `P${Math.random().toString(36).substr(2, 8)}`,
                            name: product.productName || 'Unknown Product',
                            productCode: product.productCode,
                            price: variantPrices[defaultVariant] || product.customersellingPrice || 0,
                            variants: variants,
                            currentVariant: defaultVariant,
                            stock: product.customerAttribute?.rowData?.[0]?.stock ||
                                product.wholesalerAttribute?.rowData?.[0]?.stock ||
                                product.lowStockQuantity || 0,
                            image: product.productImage?.[0]?.docPath
                                ? `${IMAGE_URL}/${product.productImage[0].docPath}/${product.productImage[0].docName}`
                                : null,
                            originalProduct: product,
                            variantPrices: variantPrices,
                            shippingWeights: shippingWeights,
                            description: product.shortDescription,
                            packageType: product.packageType,
                            unitMeasurement: product.unitMeasurement
                        };
                    });

                    setNewItemApiProducts(transformedProducts);
                    // setApiProducts(transformedProducts);
                }
            } catch (error) {
                toast.error('Failed to search products');
            } finally {
                setLoadingNewItemProducts(false);
            }
        };

        const timer = setTimeout(search, 500);
        return () => clearTimeout(timer);
    }, [newItemSearchTerm]);

    const printDownload = async () => {
        // await setSinglePage(true)
        await window.print()
        // setTimeout(() => {
        //     setSinglePage(false)
        // }, 3000)
    }

    return (
        <div className="pos-container">
            {/* <ToastContainer /> */}

            {!showInvoice && <div className="card">
                <div className="card-body">
                    {/* Customer Section */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <p style={{ fontSize: "16px", fontWeight: "600", margin: 0 }}>
                            Sales name : {user?.name}
                            {editingOrder && (
                                <span className="badge bg-danger ms-2">
                                    Editing Order: {editingOrder.orderCode || editingOrder._id}
                                </span>
                            )}
                        </p>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => setSearchInvoiceModal(true)}
                            >
                                <Icon icon="mdi:search" className="me-1" />
                                Search Invoice
                            </button>
                            {editingOrder && (
                                <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => {
                                        setEditingOrder(null);
                                        setCartItems([]);
                                        setSelectedCustomer(null);
                                        setDiscount(0);
                                        setPaymentMethods([{ method: "Cash", amount: 0, reference: "" }]);
                                        toast.info("Edit mode cancelled");
                                    }}
                                >
                                    <Icon icon="mdi:close" className="me-1" />
                                    Cancel Edit
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="row g-3 align-items-center mb-3">
                        <div className="col-md-7">
                            <div className="search-box">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control bg-light border-light rounded"
                                        placeholder="Search customer by name or mobile..."
                                        value={customerSearchTerm}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                                            setCustomerSearchTerm(value);
                                            setSelectedCustomerIndex(-1);
                                        }}
                                        onKeyDown={handleCustomerKeyDown}
                                    />
                                    <Icon icon="mdi:search" className="menu-icon posicon search-icon position-absolute top-50 end-0 translate-middle-y me-3" />
                                </div>

                                {customerSearchTerm && (
                                    <div className="customer-dropdown bg-white border rounded mt-1 p-2" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                        {loadingCustomers ? (
                                            <div className="p-2 text-center text-muted">
                                                <Icon icon="eos-icons:loading" className="me-2" />
                                                Searching...
                                            </div>
                                        ) : filteredCustomers.length > 0 ? (
                                            filteredCustomers.map((customer, index) => (
                                                <div
                                                    key={customer.id}
                                                    className={`p-2 hover-bg cursor-pointer ${selectedCustomerIndex === index ? 'bg-primary text-white' : ''}`}
                                                    onClick={() => {
                                                        setSelectedCustomer(customer);
                                                        setCustomerSearchTerm('');
                                                        setSelectedCustomerIndex(-1);
                                                    }}
                                                    onMouseEnter={() => setSelectedCustomerIndex(index)}
                                                >
                                                    {customer.name} ({customer.mobile})
                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                className="p-2 hover-bg cursor-pointer text-primary"
                                                onClick={() => setNewCustomerModal(true)}
                                            >
                                                <Icon icon="ic:baseline-plus" className="me-2" />
                                                Add new customer: {customerSearchTerm}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-5">
                            {selectedCustomer ? (
                                <div className="customer-info bg-light p-2 rounded">
                                    <strong style={{ color: "#000000" }}>{selectedCustomer.name}</strong>
                                    <div style={{ color: "#000000" }}>{selectedCustomer.mobile}</div>
                                    <div className="text-muted small">{selectedCustomer.address}</div>
                                </div>
                            ) : (
                                <div className="text-muted">No customer selected</div>
                            )}
                        </div>
                    </div>

                    {/* Product Search and Selection */}
                    <div className="row g-3 align-items-center mb-3">
                        <div className="col-md-12">
                            <div className="search-box">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control bg-light border-light rounded"
                                        placeholder="Search products by name or code..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                            setSelectedProductIndex(-1);
                                        }}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Icon icon="mdi:search" className="menu-icon posicon search-icon position-absolute top-50 end-0 translate-middle-y me-3" />
                                </div>

                                {searchTerm && (
                                    <div className="product-dropdown bg-white border rounded mt-1 p-2" ref={productDropdownRef} style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {loadingProducts ? (
                                            <div className="p-2 text-center text-muted">
                                                <Icon icon="eos-icons:loading" className="me-2" />
                                                Searching products...
                                            </div>
                                        ) : filteredProducts.length > 0 ? (
                                            filteredProducts.map((product, index) => (
                                                <div key={product.id}>
                                                    <div
                                                        className={`p-2 hover-bg cursor-pointer d-flex justify-content-between align-items-center ${selectedProductIndex === index ? 'bg-primary text-white' : ''}`}
                                                        onClick={() => {
                                                            addToCart(product);
                                                            setSearchTerm('');
                                                        }}
                                                        onMouseEnter={() => setSelectedProductIndex(index)}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            {product.image && (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    style={{ width: '40px', height: '40px', marginRight: '10px' }}
                                                                />
                                                            )}
                                                            <div>
                                                                <div style={{ color: selectedProductIndex === index ? 'white' : '#000000' }}>{product.name}</div>
                                                                <small className={`${selectedProductIndex === index ? 'text-white' : 'text-muted'}`}>
                                                                    {product.productCode}
                                                                </small>
                                                            </div>
                                                        </div>
                                                        <div className={`${selectedProductIndex === index ? 'text-white' : ''}`}>
                                                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: selectedProductIndex === index ? 'white' : '#000000' }}>₹{product.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-2 text-center text-muted">
                                                No products found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cart Items Table - Updated with Add Item functionality */}
                    <div className="table-responsives mb-3">
                        <table className="table posalone table-bordered align-middle table-nowrap">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: "60px" }}>S.No</th>
                                    <th style={{ width: "400px" }}>Item Name</th>
                                    <th style={{ width: "120px" }}>Variant</th>
                                    <th style={{ width: "100px" }}>Quantity</th>
                                    <th style={{ width: "120px" }}>Price</th>
                                    <th style={{ width: "120px" }}>Total</th>
                                    <th style={{ width: "70px", textAlign: "center" }}>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {/* CART ITEMS */}
                                {cartItems.map((item, idx) => (
                                    <tr key={`${item.id}-${item.currentVariant}`}>
                                        <td className="align-middle">{idx + 1}</td>

                                        <td className="align-middle">
                                            {editingItem &&
                                                editingItem.id === item.id &&
                                                editingItem.currentVariant === item.currentVariant ? (
                                                <div className="position-relative" style={{ width: "100%" }}>
                                                    <input
                                                        ref={editInputRef}
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        placeholder="Search and select product..."
                                                        value={itemSearchTerm}
                                                        onChange={(e) => {
                                                            setItemSearchTerm(e.target.value);
                                                            searchProducts(e.target.value);
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (!filteredProducts.length) return;

                                                            if (e.key === "ArrowDown") {
                                                                e.preventDefault();
                                                                setHighlightedIndex(prev =>
                                                                    prev >= filteredProducts.length - 1 ? 0 : prev + 1
                                                                );
                                                            } else if (e.key === "ArrowUp") {
                                                                e.preventDefault();
                                                                setHighlightedIndex(prev =>
                                                                    prev <= 0 ? filteredProducts.length - 1 : prev - 1
                                                                );
                                                            } else if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                if (highlightedIndex >= 0 && filteredProducts[highlightedIndex]) {
                                                                    // Replace the current item with selected product
                                                                    const selectedProduct = filteredProducts[highlightedIndex];
                                                                    const variantPrice = selectedProduct.variantPrices?.[selectedProduct.currentVariant] || selectedProduct.price;

                                                                    setCartItems(cartItems.map(cartItem =>
                                                                        cartItem.id === item.id &&
                                                                            cartItem.currentVariant === item.currentVariant
                                                                            ? {
                                                                                ...selectedProduct,
                                                                                quantity: item.quantity,
                                                                                price: variantPrice,
                                                                                currentVariant: selectedProduct.currentVariant,
                                                                                variantPrices: selectedProduct.variantPrices || {},
                                                                                shippingWeights: selectedProduct.shippingWeights || {}
                                                                            }
                                                                            : cartItem
                                                                    ));

                                                                    setEditingItem(null);
                                                                    setItemSearchTerm('');
                                                                    setHighlightedIndex(-1);
                                                                }
                                                            } else if (e.key === "Escape") {
                                                                setEditingItem(null);
                                                                setItemSearchTerm('');
                                                                setHighlightedIndex(-1);
                                                            }
                                                        }}
                                                        autoFocus
                                                    />

                                                    {/* Dropdown for product selection when editing */}
                                                    {itemSearchTerm && (
                                                        <div
                                                            className="product-dropdown bg-white border rounded mt-1 position-absolute w-100 shadow"
                                                            style={{
                                                                maxHeight: 250,
                                                                overflowY: "auto",
                                                                zIndex: 1050,
                                                                top: "100%",
                                                                left: 0,
                                                                right: 0
                                                            }}
                                                            ref={productDropdownRef}
                                                        >
                                                            {loadingProducts ? (
                                                                <div className="p-2 text-center text-muted">
                                                                    <Icon icon="eos-icons:loading" className="me-2" />
                                                                    Searching...
                                                                </div>
                                                            ) : filteredProducts.length > 0 ? (
                                                                filteredProducts.map((product, index) => (
                                                                    <div
                                                                        key={product.id}
                                                                        className={`p-2 cursor-pointer d-flex justify-content-between align-items-center
                  ${index === highlightedIndex ? "bg-primary text-white" : "hover-bg"}`}
                                                                        onMouseEnter={() => setHighlightedIndex(index)}
                                                                        onClick={() => {
                                                                            // Replace the current item with selected product
                                                                            const variantPrice = product.variantPrices?.[product.currentVariant] || product.price;

                                                                            setCartItems(cartItems.map(cartItem =>
                                                                                cartItem.id === item.id &&
                                                                                    cartItem.currentVariant === item.currentVariant
                                                                                    ? {
                                                                                        ...product,
                                                                                        quantity: item.quantity,
                                                                                        price: variantPrice,
                                                                                        currentVariant: product.currentVariant,
                                                                                        variantPrices: product.variantPrices || {},
                                                                                        shippingWeights: product.shippingWeights || {}
                                                                                    }
                                                                                    : cartItem
                                                                            ));

                                                                            setEditingItem(null);
                                                                            setItemSearchTerm('');
                                                                            setHighlightedIndex(-1);
                                                                        }}
                                                                    >
                                                                        <div className="d-flex align-items-center">
                                                                            {product.image && (
                                                                                <img
                                                                                    src={product.image}
                                                                                    alt={product.name}
                                                                                    style={{
                                                                                        width: 30,
                                                                                        height: 30,
                                                                                        marginRight: 8,
                                                                                        borderRadius: 4,
                                                                                    }}
                                                                                />
                                                                            )}
                                                                            <div>
                                                                                <strong>{product.name}</strong>
                                                                                <div className="small text-muted">
                                                                                    {product.productCode}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <strong>₹{product.price}</strong>
                                                                            <div className="small text-muted">
                                                                                {product.variants?.[0] || 'default'}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="p-2 text-center text-muted">
                                                                    No products found
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="d-flex align-items-center">
                                                    {item.image && (
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            style={{
                                                                width: 40,
                                                                height: 40,
                                                                marginRight: 10,
                                                                borderRadius: 4,
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    )}
                                                    <div>
                                                        <strong>{item.name}</strong>
                                                        <div className="text-muted small">{item.productCode}</div>
                                                    </div>

                                                    <button
                                                        className="btn btn-sm btn-link ms-2 p-0 text-muted"
                                                        onClick={() => {
                                                            setEditingItem(item);
                                                            setItemSearchTerm(item.name);
                                                            setHighlightedIndex(-1);

                                                            // Focus on input after a small delay
                                                            setTimeout(() => {
                                                                editInputRef.current?.focus();
                                                                searchProducts(item.name);
                                                            }, 100);
                                                        }}
                                                    >
                                                        <Icon icon="mdi:pencil" width={16} />
                                                    </button>
                                                </div>
                                            )}
                                        </td>

                                        <td className="align-middle">
                                            <select
                                                className="form-control form-control-sm"
                                                value={item.currentVariant}
                                                onChange={(e) => {
                                                    const newVariant = e.target.value;
                                                    const newPrice =
                                                        item.variantPrices?.[newVariant] || item.price;

                                                    setCartItems(cartItems.map(cartItem =>
                                                        cartItem.id === item.id &&
                                                            cartItem.currentVariant === item.currentVariant
                                                            ? { ...cartItem, currentVariant: newVariant, price: newPrice }
                                                            : cartItem
                                                    ));
                                                }}
                                            >
                                                {item.variants.map(v => (
                                                    <option key={v} value={v}>{v}</option>
                                                ))}
                                            </select>
                                        </td>

                                        <td className="align-middle">
                                            <input
                                                type="number"
                                                className="form-control form-control-sm text-center"
                                                style={{ width: 70 }}
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    const val = Math.max(1, parseInt(e.target.value) || 1);
                                                    updateQuantity(item.id, item.currentVariant, val - item.quantity);
                                                }}
                                            />
                                        </td>

                                        <td className="align-middle fw-bold">
                                            ₹{item.price.toFixed(2)}
                                        </td>

                                        <td className="align-middle fw-bold">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </td>

                                        <td className="text-center align-middle">
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => removeFromCart(item.id, item.currentVariant)}
                                            >
                                                <Icon icon="mdi:delete" width={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {/* ADD ITEM SEARCH ROW */}
                                {isAddingNewItem && (
                                    <tr>
                                        <td>{cartItems.length + 1}</td>

                                        <td colSpan="1">
                                            <div className="position-relative w-100">
                                                <input
                                                    ref={newItemInputRef}
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    placeholder="Search and add product..."
                                                    value={newItemSearchTerm}
                                                    autoFocus
                                                    onChange={(e) => {
                                                        setNewItemSearchTerm(e.target.value);
                                                        setNewHighlightedIndex(-1);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (!newItemApiProducts.length) return;

                                                        if (e.key === "ArrowDown") {
                                                            e.preventDefault();
                                                            setNewHighlightedIndex(i =>
                                                                i < newItemApiProducts.length - 1 ? i + 1 : 0
                                                            );
                                                        } else if (e.key === "ArrowUp") {
                                                            e.preventDefault();
                                                            setNewHighlightedIndex(i =>
                                                                i > 0 ? i - 1 : newItemApiProducts.length - 1
                                                            );
                                                        } else if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            if (newHighlightedIndex >= 0) {
                                                                addToCart(newItemApiProducts[newHighlightedIndex]);
                                                                setIsAddingNewItem(false);
                                                                setNewItemSearchTerm("");
                                                            }
                                                        } else if (e.key === "Escape") {
                                                            setIsAddingNewItem(false);
                                                            setNewItemSearchTerm("");
                                                        }
                                                    }}
                                                />

                                                {/* 🔥 DROPDOWN RESTORED */}
                                                {newItemSearchTerm && (
                                                    <div
                                                        className="product-dropdown bg-white border rounded mt-1 position-absolute w-100 shadow"
                                                        style={{ maxHeight: 250, overflowY: "auto", zIndex: 1050 }}
                                                    >
                                                        {loadingNewItemProducts ? (
                                                            <div className="p-2 text-center text-muted">
                                                                <Icon icon="eos-icons:loading" className="me-2" />
                                                                Searching...
                                                            </div>
                                                        ) : newItemApiProducts.length > 0 ? (
                                                            newItemApiProducts.map((product, index) => (
                                                                <div
                                                                    key={product.id}
                                                                    className={`p-2 cursor-pointer d-flex justify-content-between align-items-center
                    ${index === newHighlightedIndex ? "bg-primary text-white" : "hover-bg"}`}
                                                                    onMouseEnter={() => setNewHighlightedIndex(index)}
                                                                    onClick={() => {
                                                                        addToCart(product);
                                                                        setIsAddingNewItem(false);
                                                                        setNewItemSearchTerm("");
                                                                    }}
                                                                >
                                                                    <div className="d-flex align-items-center">
                                                                        {product.image && (
                                                                            <img
                                                                                src={product.image}
                                                                                alt={product.name}
                                                                                style={{
                                                                                    width: 30,
                                                                                    height: 30,
                                                                                    marginRight: 8,
                                                                                    borderRadius: 4,
                                                                                }}
                                                                            />
                                                                        )}
                                                                        <div>
                                                                            <strong>{product.name}</strong>
                                                                            <div className="small text-muted">
                                                                                {product.productCode}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <strong>₹{product.price}</strong>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-2 text-center text-muted">
                                                                No products found
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>

                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => setIsAddingNewItem(false)}
                                            >
                                                <Icon icon="mdi:delete" width={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )}

                                {/* PLUS BUTTON ROW */}
                                <tr>
                                    <td colSpan="6"></td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => {
                                                setIsAddingNewItem(true);
                                                setTimeout(() => newItemInputRef.current?.focus(), 100);
                                            }}
                                            disabled={isAddingNewItem}
                                        >
                                            <Icon icon="mdi:plus" />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>

                    {/* Totals Section - Updated with black text */}
                    <div className="container my-3">
                        <div className="row text-center border rounded p-3 g-3">
                            <div className="col-md border-end">
                                <div className="fw-semibold" style={{ color: '#000000' }}>Items</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>{totalItems}</div>
                            </div>
                            <div className="col-md border-end">
                                <div className="fw-semibold" style={{ color: '#000000' }}>Subtotal</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>₹{subtotal.toFixed(2)}</div>
                            </div>
                            <div className="col-md border-end">
                                <div className="fw-semibold" style={{ color: '#000000' }}>Discount</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>
                                    -₹{discount.toFixed(2)}
                                </div>
                            </div>
                            {/* <div className="col-md border-end">
                                <div className="fw-semibold" style={{ color: '#000000' }}>Delivery</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>
                                    {orderType === 'delivery' ? `₹${deliveryCharge?.toFixed(2)}` : 'N/A'}
                                </div>
                            </div> */}
                            <div className="col-md text-start bg-light">
                                <div className="fw-semibold" style={{ fontSize: '16px', color: '#000000' }}>Total</div>
                                <small className="text-muted">{totalItems} items</small>
                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#000000' }}>
                                    ₹{totalPrice.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex justify-content-between">
                        <button
                            className="btn btn-danger w-100 me-2"
                            data-bs-toggle="modal"
                            data-bs-target="#cancelConfirmModal"
                        >
                            Cancel
                        </button>
                        <div
                            className="modal fade"
                            id="cancelConfirmModal"
                            tabIndex="-1"
                            aria-labelledby="cancelConfirmModalLabel"
                            aria-hidden="true"
                        >
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="cancelConfirmModalLabel">
                                            Confirm Cancel
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            data-bs-dismiss="modal"
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure you want to cancel this order? This will clear the cart and customer details.
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            data-bs-dismiss="modal"
                                        >
                                            No
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            data-bs-dismiss="modal"
                                            onClick={() => {
                                                setCartItems([]);
                                                setSelectedCustomer([]);
                                            }}
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button
                            className="btn btn-warning w-100 mx-2"
                            onClick={holdOrder}
                        >
                            Hold
                        </button>
                        <button
                            className="btn btn-success w-100 mx-2 d-block"
                            onClick={handlePayment}
                        >
                            Payment
                        </button>
                    </div>
                </div>
            </div>}

            {/* New Customer Modal */}
            {newCustomerModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ color: '#000000' }}>Add New Customer</h5>
                                <button type="button" className="btn-close" onClick={() => setNewCustomerModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: '#000000' }}>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={newCustomer.name}
                                        onChange={handleNewCustomerChange}
                                        required
                                    />
                                    {errors.name && <span className="error-message text-primary">{errors.name}</span>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: '#000000' }}>Mobile</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="mobile"
                                        value={newCustomer.mobile}
                                        onChange={handleNewCustomerChange}
                                        required
                                    />
                                    {errors.mobile && <span className="error-message text-primary">{errors.mobile}</span>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: '#000000' }}>Address</label>
                                    <textarea
                                        className="form-control"
                                        name="address"
                                        value={newCustomer.address}
                                        onChange={handleNewCustomerChange}
                                    />
                                    {errors.address && <span className="error-message text-primary">{errors.address}</span>}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: '#000000' }}>Pincode</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="pincode"
                                        value={newCustomer.pincode}
                                        onChange={handleNewCustomerChange}
                                    />
                                    {errors.pincode && <span className="error-message text-primary">{errors.pincode}</span>}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setNewCustomerModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={addNewCustomer}>
                                    Save Customer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal with Multiple Payment Methods - Updated with black text */}
            {paymentModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000' }}>
                                    {editingOrder ? "Edit Order Payment" : "Payment Details"}

                                </h5>
                                <button type="button" className="btn-close" onClick={() => setPaymentModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Discount</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                value={discount}
                                                onChange={e => setDiscount(Math.max(0, Number(e.target.value) || 0))}
                                                style={{ fontSize: '16px', padding: '10px', color: '#000000' }}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Order Type</label>
                                            <select
                                                className="form-select"
                                                value={orderType}
                                                onChange={(e) => setOrderType(e.target.value)}
                                                style={{ fontSize: '16px', padding: '10px', color: '#000000' }}
                                            >
                                                <option value="takeaway">Takeaway/Packing</option>
                                                <option value="delivery">Delivery</option>
                                            </select>
                                        </div>

                                        {orderType === 'delivery' && (
                                            <>
                                                <div className="mb-3">
                                                    <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Delivery Address*</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={selectedCustomer?.address || ''}
                                                        onChange={(e) => {
                                                            setSelectedCustomer(prev => ({
                                                                ...prev,
                                                                address: e.target.value
                                                            }));
                                                        }}
                                                        required
                                                        style={{ fontSize: '16px', padding: '10px', color: '#000000' }}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Pincode*</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={selectedCustomer?.pincode || ''}
                                                        onChange={async (e) => {
                                                            const pincode = e.target.value.replace(/\D/g, '').substring(0, 6);
                                                            setSelectedCustomer(prev => ({
                                                                ...prev,
                                                                pincode: pincode
                                                            }));

                                                            // Clear previous error
                                                            setPincodeError('');

                                                            // Only validate if pincode is 6 digits
                                                            if (pincode.length === 6) {
                                                                await validatePincode(pincode);
                                                            }
                                                        }}
                                                        required
                                                        style={{ fontSize: '16px', padding: '10px', color: '#000000' }}
                                                    />
                                                    {isValidatingPincode && (
                                                        <div className="text-info small mt-1">
                                                            <Icon icon="eos-icons:loading" className="me-1" />
                                                            Validating pincode...
                                                        </div>
                                                    )}
                                                    {pincodeError && (
                                                        <div className="text-danger small mt-1">
                                                            {pincodeError}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Multiple Payment Methods */}
                                        <div className="mb-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Payment Methods</label>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={addPaymentMethod}
                                                    style={{ fontSize: '14px', padding: '6px 12px', color: '#000000' }}
                                                >
                                                    <Icon icon="mdi:plus" className="me-1" />
                                                    Add Payment Method
                                                </button>
                                            </div>

                                            {paymentMethods.map((pm, index) => (
                                                <div key={index} className="border p-3 rounded mb-2">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <h6 className="mb-0" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Payment Method #{index + 1}</h6>
                                                        {paymentMethods.length > 1 && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => removePaymentMethod(index)}
                                                            >
                                                                <Icon icon="mdi:close" />
                                                            </button>
                                                        )}
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <label className="form-label" style={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>Method</label>
                                                            <select
                                                                className="form-select"
                                                                value={pm.method}
                                                                onChange={(e) => updatePaymentMethod(index, 'method', e.target.value)}
                                                                style={{ fontSize: '14px', padding: '8px', color: '#000000' }}
                                                            >
                                                                <option value="Cash">Cash</option>
                                                                <option value="Card">Card</option>
                                                                <option value="QR Code">QR Code</option>
                                                                <option value="Net Banking">Net Banking</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <label className="form-label" style={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>Amount*</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                min="0"
                                                                value={pm.amount}
                                                                onChange={(e) => updatePaymentMethod(index, 'amount', e.target.value)}
                                                                required
                                                                style={{ fontSize: '16px', padding: '8px', fontWeight: 'bold', color: '#000000' }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {(pm.method === "Card" || pm.method === "QR Code") && (
                                                        <div className="mt-2">
                                                            <label className="form-label" style={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>Reference Number*</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={pm.reference}
                                                                onChange={(e) => updatePaymentMethod(index, 'reference', e.target.value)}
                                                                placeholder="Enter reference/transaction number"
                                                                required
                                                                style={{ fontSize: '14px', padding: '8px', color: '#000000' }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="col-md-4 bg-light p-3 rounded">
                                        <h6 style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>Order Summary</h6>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>Subtotal:</span>
                                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>Discount:</span>
                                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>
                                                -₹{discount.toFixed(2)}
                                            </span>
                                        </div>
                                        {orderType === 'delivery' && (
                                            <div className="d-flex justify-content-between">
                                                <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>Delivery Charge:</span>
                                                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>₹{deliveryCharge?.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <hr />
                                        <div className="d-flex justify-content-between" style={{ fontSize: '18px', fontWeight: '700', color: '#000000' }}>
                                            <span>Total:</span>
                                            <span>₹{totalPrice.toFixed(2)}</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>Amount Received:</span>
                                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>₹{totalAmountReceived.toFixed(2)}</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between" style={{ fontSize: '16px', fontWeight: '700', color: '#000000' }}>
                                            <span>Balance:</span>
                                            <span>₹{balance.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between" style={{ fontSize: '16px', fontWeight: '700', color: '#000000' }}>
                                            <span>Change:</span>
                                            <span>₹{change.toFixed(2)}</span>
                                        </div>
                                        <hr />

                                        <h6 style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>Payment Methods</h6>
                                        {paymentMethods.map((pm, index) => (
                                            <div key={index} className="d-flex justify-content-between">
                                                <span style={{ fontSize: '14px', fontWeight: '600', color: '#000000' }}>{pm.method.toUpperCase()}:</span>
                                                <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#000000' }}>
                                                    ₹{(parseFloat(pm.amount) || 0).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setPaymentModal(false)}>
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={completePayment}
                                    disabled={balance > 0 ||
                                        (orderType === 'delivery' && (!selectedCustomer?.address || !selectedCustomer?.pincode || pincodeError))}
                                    style={{ fontSize: '16px', fontWeight: '600', padding: '10px 20px' }}
                                >
                                    {editingOrder ? "Update Order & Print" : "Complete Payment & Print"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Search Invoice Modal */}
            {searchInvoiceModal && (
                <div
                    className="modal"
                    style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Search Invoice</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setSearchInvoiceModal(false);
                                        setInvoiceSearchTerm("RTC-");
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Invoice Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter invoice number (e.g., RTC-12345)"
                                        value={invoiceSearchTerm}
                                        onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                searchInvoice();
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setSearchInvoiceModal(false);
                                        setInvoiceSearchTerm("NALC-");
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={searchInvoice}
                                    disabled={searchingInvoice || !invoiceSearchTerm.trim()}
                                >
                                    {searchingInvoice ? (
                                        <>
                                            <Icon icon="eos-icons:loading" className="me-2" />
                                            Searching...
                                        </>
                                    ) : (
                                        "Search"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Invoice Template Component */}
            {showInvoice && selectedOrder && (
                <>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            padding: "20px 0",
                        }}
                    >
                        <div id="invoice-section" style={{ gap: "20px" }}>

                            <div id="total-invoice-section" style={{ display: "flex", justifyContent: "center", pageBreakAfter: "always" }}>
                                <InvoiceTemplate
                                    orderData={selectedOrder}
                                    onClose={() => setShowInvoice(false)}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Download/Close Buttons */}
                    <div
                        style={{
                            bottom: "20px",
                            left: "0",
                            right: "0",
                            display: "flex",
                            justifyContent: "center",
                            gap: "15px",
                            zIndex: 1000,
                            padding: "8px",
                            backgroundColor: "rgba(255,255,255,0.9)",
                            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
                        }}
                    >
                        <button
                            className="btn btn-success me-2"
                            onClick={() => printDownload()}
                        >
                            <i className="fa fa-print me-1"></i> Print
                        </button>

                        <button
                            onClick={() => {
                                setShowInvoice(false);
                                setEditingOrder(null);
                                setCartItems([]);
                                setSelectedCustomer(null);
                                setDiscount(0);
                                setPaymentMethods([{ method: "Cash", amount: 0, reference: "" }]);
                            }}
                            className="btn btn-danger"
                            style={{
                                padding: "6px 12px",
                                fontSize: "12px",
                                borderRadius: "3px",
                                border: "none",
                                cursor: "pointer",
                                backgroundColor: "#dc3545",
                                color: "white",
                            }}
                        >
                            Close
                        </button>
                    </div>
                </>
            )}
            {holdOrders.length > 0 && (
                <div className="mt-4">
                    <h5 className="mb-3">
                        Hold Orders
                        <span className="badge bg-secondary ms-2">{holdOrders.length}</span>
                    </h5>
                    <div className="list-group">
                        {holdOrders.map((order) => (
                            <div
                                key={order._id || order.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-start mb-1">
                                        <strong className="text-primary">
                                            Order #{order.holdOrderId || order.id}
                                        </strong>
                                        {/* <span className="badge bg-warning text-dark">Hold</span> */}
                                    </div>
                                    <div className="mb-1">
                                        <span className="fw-medium">Customer:</span> {order.placedByName || "N/A"}
                                    </div>
                                    {/* <div className="mb-1">
                        <span className="fw-medium">Type:</span> {order.orderType || "Delivery"}
                      </div> */}
                                    <div className="mb-1">
                                        <span className="fw-medium">Items:</span> {order.items?.length || 0}
                                    </div>
                                    <small className="text-muted">
                                        {new Date(order.createdAt || order.date).toLocaleString()}
                                    </small>
                                </div>
                                <div className="d-flex flex-column align-items-end ms-3">
                                    <span className="fw-bold fs-5 mb-2">₹{order.totalAmount?.toFixed(2) || "0.00"}</span>
                                    <div className="btn-group" role="group">
                                        <button
                                            className="btn btn-sm btn-primary me-2 d-flex align-items-center"
                                            onClick={() => retrieveHoldOrder(order)}
                                        // disabled={!canEditCrmOrder}
                                        >
                                            <Icon icon="mdi:arrow-left" className="me-1" />
                                            {/* Retrieve */}
                                        </button>
                                        <button
                                            className="btn btn-sm btn-danger d-flex align-items-center"
                                            onClick={() => deleteHoldOrder(order._id)}
                                        // disabled={!canDeleteCrmOrder}
                                        >
                                            <Icon icon="mdi:delete" className="me-1" />
                                            {/* Delete */}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default POSSystem;
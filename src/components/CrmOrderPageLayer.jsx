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
import InvoiceTemplate from './InvoiceTemplate';
import { useDispatch, useSelector } from "react-redux";

const CrmOrderPageLayer = () => {
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const productDropdownRef = useRef(null);
    const { token, user } = useSelector((state) => state.auth);
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
    const [selectedOrder, setSelectedOrder] = useState(null);
    //   const [holdOrders, setHoldOrders] = useState([]);
    const [isHoldLoading, setIsHoldLoading] = useState(false);
    // New state for customer type
    const [customerType, setCustomerType] = useState('Wholesaler'); // 'wholesaler' or 'retailer'

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
    const [isRetrievingOrder, setIsRetrievingOrder] = useState(false);
    const [isOrderRetrieved, setIsOrderRetrieved] = useState(false);

    const [apiProducts, setApiProducts] = useState([]);

    const [loadingCustomers, setLoadingCustomers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const [newCustomerModal, setNewCustomerModal] = useState(false);
    const [orderType, setOrderType] = useState('delivery'); // Changed to always delivery
    const [deliveryPerson, setDeliveryPerson] = useState('');
    const [deliveryCharge, setDeliveryCharge] = useState(0);
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        mobile: '',
        address: '',
        pincode: '',
        customerType: 'Wholesaler' // Added customer type to new customer
    });
    const [errors, setErrors] = useState({
        name: '',
        mobile: '',
        address: '',
        pincode: ''
    });

    const [holdOrders, setHoldOrders] = useState([]);
    const [paymentModal, setPaymentModal] = useState(false);

    // Updated payment methods - only CREDIT and COD
    const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'CREDIT'
    const [amountReceived, setAmountReceived] = useState(0);

    // Removed multiple payment methods array
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
    const totalPrice = Math.max(0, subtotal - discount) + deliveryCharge;

    // Calculate balance based on payment method
    const balance = paymentMethod === 'COD' ? totalPrice - amountReceived : totalPrice;
    const change = paymentMethod === 'COD' && amountReceived > totalPrice ? amountReceived - totalPrice : 0;

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
        if (!newCustomer.address.trim()) {
            newErrors.address = 'Address is required';
            isValid = false;
            setErrors(newErrors);
            return isValid;
        } else if (newCustomer.address.trim().length < 10) {
            newErrors.address = 'Address must be at least 10 characters';
            isValid = false;
            setErrors(newErrors);
            return isValid;
        }

        // Pincode validation
        const pincodeRegex = /^[0-9]{6}$/;
        if (!newCustomer.pincode) {
            newErrors.pincode = 'Pincode is required';
            isValid = false;
            setErrors(newErrors);
            return isValid;
        } else if (!pincodeRegex.test(newCustomer.pincode)) {
            newErrors.pincode = 'Pincode must be exactly 6 digits';
            isValid = false;
            setErrors(newErrors);
            return isValid;
        }

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
                "pincode": newCustomer.pincode,
                "customerType": customerType // Add customer type to payload
            };

            const result = await PosdApi.addCustomer(payload);
            if (result && result.status) {
                let userId = result?.response?.data?._id;
                setCustomerSearchTerm("");
                if (userId) {
                    newCustomer.id = userId;
                    newCustomer.customerType = customerType;
                }
                setSelectedCustomer(newCustomer);
            }

            setNewCustomer({ name: '', mobile: '', address: '', pincode: '', customerType: customerType });
            setNewCustomerModal(false);
        }
    };

    useEffect(() => {
        fetchHoldOrders();
    }, []);

    // Fetch hold orders
    const fetchHoldOrders = async () => {
        try {
            setIsHoldLoading(true);
            const result = await PosdApi.getHoldOrders({ orderFrom: "crm" });
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

    const holdOrder = async () => {
        console.log(selectedCustomer, "selectedCustomer");

        try {
            if (cartItems.length === 0) {
                toast.error("Please add items to cart");
                return;
            }

            if (!selectedCustomer) {
                toast.error("Please select a customer");
                return;
            }
            // Validate pincode before calculating delivery charge
            const validationResult = await validatePincode(selectedCustomer.address.postalCode);
            if (!validationResult) {
                return;
            }

            const pincodeDetails = validationResult.pincodeDetails;
            const calculatedCharge = await calculateTotalDeliveryCharge(cartItems, pincodeDetails);
            setDeliveryCharge(calculatedCharge);

            const orderPayload = transformCartToOrderPayload(
                cartItems,
                selectedCustomer?.id,
                selectedCustomer,
                orderType,
                deliveryCharge
            );
            if (orderPayload) {
                orderPayload.orderFrom = "crm";
            }


            const result = await PosdApi.holdOrderPurcahse(orderPayload);
            if (result && result.status) {
                toast.success("Order held successfully");
                setCartItems([]);
                setDeliveryCharge(0);
                // setGlobalDiscount(0);
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

        // Check credit limit for CREDIT payment
        if (paymentMethod === 'CREDIT' && selectedCustomer) {
            // You would check credit limit here
            // For example: if (selectedCustomer.creditLimit < totalPrice) {
            //     toast.error('Credit limit exceeded');
            //     return;
            // }
        }

        // Reset amount received when opening payment modal
        setAmountReceived(0);
        setPaymentModal(true);
    };

    const transformCartToOrderPayload = (cartItems, customerId, shippingAddress, orderType, deliveryCharge) => {
        const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalAmount = Math.max(0, subtotal - discount) + deliveryCharge;

        const items = cartItems.map(item => {
            const attributeDetails = item.originalProduct?.wholesalerAttributeDetails?.[0];
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
        // Prepare shipping address object
        const shippingAddressObj = shippingAddress?.address
            ? {
                contactName: shippingAddress.company || shippingAddress.name,
                contactNumber: shippingAddress.mobile,
                street: shippingAddress.address.addressLine,
                city: shippingAddress.address.city,
                state: shippingAddress.address.state,
                postalCode: shippingAddress.address.postalCode,
                country: shippingAddress.address.country,
            }
            : {
                contactName: shippingAddress?.company || shippingAddress?.name || "Walk-in Customer",
                contactNumber: shippingAddress?.mobile || "",
                street: "",
                city: "",
                state: "",
                postalCode: "",
                country: "",
            };

        const payload = {
            placedByModel: customerType,
            items: items,
            totalAmount: totalAmount,
            shippingAddress: shippingAddressObj,
            paymentMode: paymentMethod.toUpperCase(), // Only CREDIT or COD
            placedBy: customerId,
            amountPaid: paymentMethod === 'COD' ? amountReceived : 0,
            date: new Date().toISOString(),
            orderType: orderType,
            deliveryCharge: deliveryCharge,
            discount: discount,
            customerType: customerType // Add customer type to order
        };

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
            // Validate payment for COD
            // if (paymentMethod === 'COD') {
            //     if (!amountReceived || parseFloat(amountReceived) <= 0) {
            //         toast.error('Please enter amount received for COD');
            //         return;
            //     }
            //     if (amountReceived < totalPrice) {
            //         toast.error('Amount received must be at least equal to total price for COD');
            //         return;
            //     }
            // }

            // Validate for delivery
            if (!selectedCustomer?.address || !selectedCustomer?.address?.postalCode) {
                toast.error('Please enter delivery address and pincode');
                return;
            }

            // Validate pincode before calculating delivery charge
            const validationResult = await validatePincode(selectedCustomer.address.postalCode);
            if (!validationResult) {
                return;
            }

            const pincodeDetails = validationResult.pincodeDetails;
            const calculatedCharge = await calculateTotalDeliveryCharge(cartItems, pincodeDetails);
            setDeliveryCharge(calculatedCharge);

            const orderPayload = transformCartToOrderPayload(
                cartItems,
                selectedCustomer?.id,
                selectedCustomer,
                orderType,
                deliveryCharge
            );

            if (orderPayload) {
                const result = await PosdApi.CrmorderPurcahse(orderPayload);

                if (result && result.status) {
                    setCustomerType('Wholesaler');
                    setSelectedCustomer(null);
                    setCustomerSearchTerm('');
                    setCustomers([]);
                    setCartItems([]);
                    setDeliveryCharge(0);
                    setPaymentModal(false);

                    // const orderId = result?.response?.orderdata?._id ||
                    //     result?.response?.data?.orderId ||
                    //     result?.response?.order?._id;

                    // if (orderId) {
                    //     const orderDetails = await fetchOrderDetails(orderId);
                    //     if (orderDetails) {
                    //         setSelectedOrder(orderDetails);
                    //         setShowInvoice(true);

                    //         // Clear cart and reset states
                    //         setCartItems([]);
                    //         setPaymentModal(false);
                    //         setDiscount(0);
                    //         setAmountReceived(0);

                    //         toast.success('Order placed successfully!');
                    //     } else {
                    //         toast.error('Failed to fetch order details');
                    //     }
                    // } else {
                    //     toast.error('Order ID not found in response');
                    // }
                } else {
                    // toast.error('Failed to place order');
                }
            }
        } catch (error) {
            console.error("Error completing payment:", error);
            // toast.error("Failed to complete payment");
        }
    };

    const retrieveHoldOrder = async (order) => {
        console.log(order, "hold order to retrieve");
        setIsRetrievingOrder(true);
        setIsOrderRetrieved(true); // Add this line

        try {
            // Get contact number from shipping address
            const contactNumber = order.shippingAddress?.contactNumber || "";

            // Search for customer by contact number
            let customerData = null;

            if (contactNumber) {
                try {
                    const searchResult = await PosdApi.searchWholesalerRetailer(contactNumber, order.placedByModel);
                    if (searchResult?.status && searchResult.response.data.length > 0) {
                        const matchedCustomer = searchResult.response.data.find(customer =>
                            customer.phone === contactNumber || customer.mobile === contactNumber
                        );
                        if (matchedCustomer) {
                            // Format the customer data as expected by your component
                            customerData = {
                                id: matchedCustomer._id || matchedCustomer.id,
                                name: matchedCustomer.name || matchedCustomer.contactPersonName || "",
                                mobile: matchedCustomer.phone || matchedCustomer.mobileNumber || contactNumber,
                                address: matchedCustomer.address || {
                                    addressLine: order.shippingAddress?.street || "",
                                    city: order.shippingAddress?.city || "",
                                    state: order.shippingAddress?.state || "",
                                    country: order.shippingAddress?.country || "",
                                    postalCode: order.shippingAddress?.postalCode || ""
                                },
                                company: matchedCustomer.companyName || matchedCustomer.company || "",
                                shopTypeName: matchedCustomer.shopTypeName || matchedCustomer.shopType || "",
                                creditLimit: matchedCustomer.creditLimit || "0",
                                creditPeriod: matchedCustomer.creditPeriod || "0",
                                customerVariantName: matchedCustomer.customerVariantName || "",
                                usedAmount: matchedCustomer.usedAmount || 0,
                                availableCredit: matchedCustomer.availableCredit || "",
                                remainingToPay: matchedCustomer.remainingToPay || 0,
                                lastPayment: matchedCustomer.lastPayment || matchedCustomer.lastPurchased || "",
                                currentCreditDetails: matchedCustomer.currentCreditDetails || {}
                            };
                        }
                    }
                } catch (error) {
                    console.error("Error searching for customer:", error);
                }
            }

            // If customer search didn't find anything, use data from the hold order
            if (!customerData) {
                if (order.wholesalerInfo && order.wholesalerInfo.length > 0) {
                    const customerInfo = order.wholesalerInfo[0];
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
                const wholesalerAttribute = product.wholesalerAttribute || {};
                const rowData = wholesalerAttribute.rowData || [];

                // Get attribute details - these contain the mapping between variant IDs and names
                const attributeData = product.wholesalerAttributeDetails || [];

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
                        wholesalerAttributeDetails: attributeData.map(attr => ({
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
            // setDeliveryCharge(order.deliveryCharge || 0);
            // Set customer if found
            if (customerData) {
                setSelectedCustomer(customerData);
                // setCustomerSearchTerm(customerData.mobile || customerData.name);
            }
            console.log(order, "okesava");

            // Set order type and delivery charge
            setOrderType(order.orderType || "takeaway");
            setDeliveryCharge(order.deliveryCharge || 0);

            // Set payment method


            // Set discount
            setDiscount(order.discount || 0);

            // Set amount received
            if (order.amountPaid) {
                setAmountReceived(order.amountPaid);
            }
            // Clear any pincode errors
            setPincodeError('');
            toast.success(`Order #${order.holdOrderId || order._id} retrieved successfully`);

        } catch (error) {
            console.error("Error retrieving hold order:", error);
            toast.error("Failed to retrieve order. Please try again.");
        } finally {
            setTimeout(() => {
                setIsRetrievingOrder(false);
                setIsOrderRetrieved(true);
            }, 1000); // Keep 1-second delay
        }
    };
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
            // Modified API call to include customer type
            const response = await PosdApi.searchWholesalerRetailer(searchTerm, customerType);
            console.log(response, "rrrrrrrrrr");

            if (response && response.status) {
                const apiCustomers = response.response.data.map(customer => ({
                    id: customer._id || `C${Math.random().toString(36).substr(2, 8)}`,
                    name: customer.name,
                    mobile: customer.phone,
                    address: customer.address,
                    pincode: customer.pincode,
                    company: customer.companyName || "",
                    shopTypeName: customer.shopTypeName || "",
                    creditLimit: customer.creditLimit || "0",
                    creditPeriod: customer.creditPeriod || "0",
                    customerVariantName: customer.customerVariantName || "",
                    usedAmount: customer.usedAmount || 0,
                    availableCredit: customer.availableCredit || "",
                    remainingToPay: customer.remainingToPay || 0,
                    lastPayment: customer.lastPayment || customer.lastPurchased || "",
                    currentCreditDetails: customer?.currentCreditDetails || ""
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
            // Modified API call to include customer type for pricing
            const response = await PosdApi.searchProductsByUserId(searchTerm, selectedCustomer?.id);
            if (response && response.response && response.response.data) {
                const transformedProducts = response.response.data.map(product => {
                    const attributeDetail = product.wholesalerAttributeDetails?.[0];
                    const attributeName = attributeDetail?.name;
                    const variantPrices = {};
                    const shippingWeights = {};
                    const variantsSet = new Set();

                    if (product.wholesalerAttribute?.rowData) {
                        product.wholesalerAttribute.rowData.forEach(row => {
                            const variantId = row[attributeName];
                            if (!variantId) return;

                            const variantObj = attributeDetail.value.find(
                                v => v._id === variantId
                            );

                            if (!variantObj) return;

                            const variantName = variantObj.value;
                            variantsSet.add(variantName);

                            // Adjust price based on customer type
                            let price = parseFloat(row.price) || product.customersellingPrice || 0;
                            if (customerType === 'Wholesaler') {
                                price = parseFloat(row.wholesalePrice) || price;
                            }

                            variantPrices[variantName] = price;
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
                        stock: product.wholesalerAttribute?.rowData?.[0]?.stock ||
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
    }, [searchTerm, customerType]); // Added customerType dependency

    // Debounce customer search
    useEffect(() => {
        const timer = setTimeout(() => {
            searchCustomers(customerSearchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [customerSearchTerm, customerType]); // Added customerType dependency

    // Fetch delivery charges
    // Fetch delivery charges
    // Keep only this useEffect (the first one at lines ~1197-1235) and modify it:
    useEffect(() => {
        const fetchDeliveryCharges = async () => {
            // Skip calculation if we're retrieving an order
            if (isRetrievingOrder || isOrderRetrieved) {
                console.log("Skipping delivery charge calculation - retrieving or just retrieved order");
                return;
            }

            // Only calculate if we have a valid pincode and cart items
            if (!selectedCustomer?.address?.postalCode || cartItems.length === 0) {
                console.log("No pincode or empty cart - skipping delivery charge calculation");
                return;
            }

            try {
                console.log("Calculating delivery charge...");
                const validationResult = await validatePincode(selectedCustomer.address.postalCode);
                if (validationResult) {
                    const pincodeDetails = validationResult.pincodeDetails;
                    const calculatedCharge = await calculateTotalDeliveryCharge(cartItems, pincodeDetails);
                    setDeliveryCharge(calculatedCharge);
                    console.log("Delivery charge calculated:", calculatedCharge);
                } else {
                    setDeliveryCharge(0);
                    console.log("Pincode validation failed - setting delivery charge to 0");
                }
            } catch (error) {
                console.error("Error fetching delivery charges:", error);
                setDeliveryCharge(0);
            }
        };

        // Add debounce to prevent rapid recalculations
        const timeoutId = setTimeout(() => {
            fetchDeliveryCharges();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [selectedCustomer, selectedCustomer?.address?.postalCode, cartItems, isRetrievingOrder, isOrderRetrieved]);

    useEffect(() => {
        // Reset the retrieved flag when cart changes significantly
        if (isOrderRetrieved) {
            setIsOrderRetrieved(false);
        }
    }, [cartItems, selectedCustomer]);
    // Add this function
    const calculateDeliveryManually = async () => {
        if (!selectedCustomer?.address?.postalCode) {
            toast.error("Please select a customer with valid pincode");
            return;
        }

        if (cartItems.length === 0) {
            toast.error("Please add items to cart");
            return;
        }

        try {
            setIsValidatingPincode(true);
            const validationResult = await validatePincode(selectedCustomer.address.postalCode);

            if (validationResult) {
                const pincodeDetails = validationResult.pincodeDetails;
                const calculatedCharge = await calculateTotalDeliveryCharge(cartItems, pincodeDetails);
                setDeliveryCharge(calculatedCharge);
                toast.success(`Delivery charge calculated: ₹${calculatedCharge}`);
            } else {
                setDeliveryCharge(0);
                toast.error("Invalid pincode. Delivery charge set to 0.");
            }
        } catch (error) {
            console.error("Error calculating delivery charge:", error);
            toast.error("Failed to calculate delivery charge");
            setDeliveryCharge(0);
        } finally {
            setIsValidatingPincode(false);
        }
    };
    const calculateAndSetDeliveryCharge = async () => {
        if (!selectedCustomer?.address?.postalCode || cartItems.length === 0) {
            setDeliveryCharge(0);
            return 0;
        }

        try {
            const validationResult = await validatePincode(selectedCustomer.address.postalCode);
            if (validationResult) {
                const pincodeDetails = validationResult.pincodeDetails;
                const calculatedCharge = await calculateTotalDeliveryCharge(cartItems, pincodeDetails);
                setDeliveryCharge(calculatedCharge);
                return calculatedCharge;
            } else {
                setDeliveryCharge(0);
                return 0;
            }
        } catch (error) {
            console.error("Error calculating delivery charge:", error);
            setDeliveryCharge(0);
            return 0;
        }
    };

    // New item row search
    useEffect(() => {
        const search = async () => {
            if (!newItemSearchTerm || newItemSearchTerm.length < 2) {
                setNewItemApiProducts([]);
                return;
            }
            setLoadingNewItemProducts(true);
            try {
                const response = await PosdApi.searchProductsByUserId(newItemSearchTerm, selectedCustomer?.id);
                if (response && response.response && response.response.data) {
                    const transformedProducts = response.response.data.map(product => {
                        const attributeDetail = product.wholesalerAttributeDetails?.[0];
                        const attributeName = attributeDetail?.name;
                        const variantPrices = {};
                        const shippingWeights = {};
                        const variantsSet = new Set();

                        if (product.wholesalerAttribute?.rowData) {
                            product.wholesalerAttribute.rowData.forEach(row => {
                                const variantId = row[attributeName];
                                if (!variantId) return;

                                const variantObj = attributeDetail.value.find(
                                    v => v._id === variantId
                                );

                                if (!variantObj) return;

                                const variantName = variantObj.value;
                                variantsSet.add(variantName);

                                // Adjust price based on customer type
                                let price = parseFloat(row.price) || product.customersellingPrice || 0;
                                if (customerType === 'Wholesaler') {
                                    price = parseFloat(row.wholesalePrice) || price;
                                }

                                variantPrices[variantName] = price;
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
                            stock: product.wholesalerAttribute?.rowData?.[0]?.stock ||
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
                }
            } catch (error) {
                toast.error('Failed to search products');
            } finally {
                setLoadingNewItemProducts(false);
            }
        };

        const timer = setTimeout(search, 500);
        return () => clearTimeout(timer);
    }, [newItemSearchTerm, customerType]);

    const printDownload = async () => {
        await window.print()
    }
    console.log(selectedCustomer, "selectedCustomer");

    return (
        <div className="pos-container">
            {/* <ToastContainer /> */}

            {!showInvoice && <div className="card">
                <div className="card-body">
                    <p style={{ fontSize: "16px", fontWeight: "600", color: "#000000" }}>
                        Sales name : {user?.name}
                    </p>
                    {/* Customer Type Selection */}
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <div className="customer-type-selector">
                                <label className="form-label" style={{ fontSize: "16px", fontWeight: "600", color: "#000000", marginRight: "15px" }}>
                                    Customer Type:
                                </label>
                                <div className="btn-group" role="group" style={{ height: "40px" }}>
                                    <button
                                        type="button"
                                        className={`btn ${customerType === 'Wholesaler' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => {
                                            setCustomerType('Wholesaler');
                                            setSelectedCustomer(null);
                                            setCustomerSearchTerm('');
                                            setCustomers([]);
                                            setCartItems([]);
                                            setDeliveryCharge(0);
                                        }}
                                    >
                                        Wholesaler
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${customerType === 'Retailer' ? 'btn-primary' : 'btn-outline-primary'}`}
                                        onClick={() => {
                                            setCustomerType('Retailer');
                                            setSelectedCustomer(null);
                                            setCustomerSearchTerm('');
                                            setCustomers([]);
                                            setCartItems([]);
                                            setDeliveryCharge(0);
                                        }}
                                    >
                                        Retailer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Section */}
                    <div className="row g-3 align-items-center mb-3">
                        <div className="col-md-7">
                            <div className="search-box">
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        className="form-control bg-light border-light rounded"
                                        placeholder={`Search ${customerType} by name or mobile...`}
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
                                                    {customer.name} ({customer.mobile}) -{" "}
                                                    {customer.company || "No Company"}-
                                                    {customer.shopType || "No Shop Type"}                                                </div>
                                            ))
                                        ) : (
                                            <div
                                                className="p-2 hover-bg cursor-pointer text-primary"
                                            // onClick={() => setNewCustomerModal(true)}
                                            >
                                                User not found
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-md-5">
                            {selectedCustomer ? (
                                <div className="customer-card bg-light rounded border">
                                    {/* Customer Basic Info Section */}
                                    <div className="p-3 border-bottom">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="fw-bold mb-1 text-primary">
                                                    {selectedCustomer?.company?.toUpperCase()} -
                                                    {selectedCustomer?.shopType?.toUpperCase()}
                                                </h6>
                                                <h5 className="fw-bold mb-1">{selectedCustomer.name}</h5>
                                                <div className="text-muted" style={{ fontSize: "20px" }}>
                                                    <Icon icon="mdi:phone" className="me-1" />
                                                    {selectedCustomer.mobile}
                                                </div>
                                            </div>
                                            <span className="badge bg-info fs-12">
                                                {selectedCustomer.customerVariantName || 'Standard'}
                                            </span>
                                        </div>

                                        {selectedCustomer.address && (
                                            <div className="mt-2 p-2 bg-white rounded small">
                                                <div className="fw-medium text-muted mb-1">Address:</div>
                                                <div>
                                                    {selectedCustomer.address.addressLine},<br />
                                                    {selectedCustomer.address.city}, {selectedCustomer.address.state},<br />
                                                    {selectedCustomer.address.country} - {selectedCustomer.address.postalCode}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Credit Information Section */}
                                    <div className="p-3">
                                        <h6 className="mb-3 border-bottom pb-2 fw-semibold">Credit Information</h6>
                                        <div className="credit-details">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-medium text-muted">Total credit:</span>
                                                <span className="fw-semibold">₹{selectedCustomer?.currentCreditDetails?.creditLimit || '0'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-medium text-muted">Used amount:</span>
                                                <span className="fw-semibold text-danger">₹{selectedCustomer?.currentCreditDetails?.usedCreditAmount || '0'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-medium text-muted">Available credit:</span>
                                                <span className="fw-semibold text-success">₹{selectedCustomer?.currentCreditDetails?.availableCreditAmount || '0'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-medium text-muted">Remaining to pay:</span>
                                                <span className="fw-semibold">₹{selectedCustomer?.currentCreditDetails?.usedCreditAmount || '0'}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-medium text-muted">Credit period:</span>
                                                <span className="fw-semibold">{selectedCustomer.creditPeriod || '0'} days</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-medium text-muted">Last payment:</span>
                                                <span className="fw-semibold text-wrap text-end" style={{ maxWidth: '150px', fontSize: '0.85rem' }}>
                                                    {selectedCustomer.lastPayment
                                                        ? new Date(selectedCustomer.lastPayment).toLocaleString("en-IN", {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            timeZone: "Asia/Kolkata",
                                                        })
                                                        : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-muted p-4 bg-light rounded border text-center">
                                    <Icon icon="mdi:account-search" className="fs-1 mb-2 text-muted opacity-50" />
                                    <p className="mb-0">No customer selected</p>
                                    <small className="text-muted">Search for a customer above</small>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Search and Selection */}
                    <div className="row g-3 align-items-center mb-3">
                        <div className="col-md-12">
                            <div className="search-box">
                                <div className="position-relative">
                                    {pincodeError && (
                                        <small className="text-danger d-block mb-2">
                                            {pincodeError}
                                        </small>
                                    )}
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
                                        disabled={pincodeError}
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
                            <div className="col-md border-end">
                                <div className="fw-semibold" style={{ color: '#000000' }}>Delivery</div>
                                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000000' }}>
                                    ₹{deliveryCharge?.toFixed(2)}
                                </div>
                            </div>
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

            {/* New Customer Modal - Updated with customer type */}
            {newCustomerModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ color: '#000000' }}>Add New {customerType.charAt(0).toUpperCase() + customerType.slice(1)}</h5>
                                <button type="button" className="btn-close" onClick={() => setNewCustomerModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label" style={{ color: '#000000' }}>Customer Type</label>
                                    <div className="form-control bg-light" style={{ color: '#000000', fontWeight: 'bold' }}>
                                        {customerType.charAt(0).toUpperCase() + customerType.slice(1)}
                                    </div>
                                </div>
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
                                    Save {customerType.charAt(0).toUpperCase() + customerType.slice(1)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal - Updated with CREDIT/COD only */}
            {paymentModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" style={{ fontSize: '20px', fontWeight: 'bold', color: '#000000' }}>Payment Details</h5>
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

                                        {/* Always delivery - no dropdown */}
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Order Type</label>
                                            <div className="form-control bg-light" style={{ fontSize: '16px', padding: '10px', color: '#000000', fontWeight: 'bold' }}>
                                                Delivery
                                            </div>
                                        </div>

                                        {/* Delivery Address Fields */}
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Delivery Address*</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedCustomer?.address?.addressLine || ''}
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
                                                value={selectedCustomer?.address?.postalCode || ''}
                                                onChange={async (e) => {
                                                    const pincode = e.target.value.replace(/\D/g, '').substring(0, 6);
                                                    setSelectedCustomer(prev => ({
                                                        ...prev,
                                                        pincode: pincode
                                                    }));

                                                    setPincodeError('');

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

                                        {/* Payment Method - Only CREDIT/COD */}
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Payment Method*</label>
                                            <select
                                                className="form-select"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                style={{ fontSize: '16px', padding: '10px', color: '#000000' }}
                                            >
                                                <option value="COD">Cash on Delivery (COD)</option>
                                                <option value="CREDIT">Credit</option>
                                            </select>
                                        </div>

                                        {/* Amount Received - Only for COD */}
                                        {/* {paymentMethod === 'COD' && (
                                            <div className="mb-3">
                                                <label className="form-label" style={{ fontSize: '16px', fontWeight: '600', color: '#000000' }}>Amount Received*</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    min="0"
                                                    step="0.01"
                                                    value={amountReceived}
                                                    onChange={(e) => setAmountReceived(parseFloat(e.target.value) || 0)}
                                                    required
                                                    style={{ fontSize: '16px', padding: '10px', color: '#000000' }}
                                                />
                                                <small className="text-muted">
                                                    Enter the amount received from customer
                                                </small>
                                            </div>
                                        )} */}

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
                                        <div className="d-flex justify-content-between">
                                            <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>Delivery Charge:</span>
                                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>₹{deliveryCharge?.toFixed(2)}</span>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between" style={{ fontSize: '18px', fontWeight: '700', color: '#000000' }}>
                                            <span>Total:</span>
                                            <span>₹{totalPrice.toFixed(2)}</span>
                                        </div>
                                        <hr />

                                        {/* Payment Summary */}
                                        <div className="d-flex justify-content-between">
                                            <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>Payment Method:</span>
                                            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>{paymentMethod}</span>
                                        </div>

                                        {paymentMethod === 'COD' && (
                                            <>
                                                <div className="d-flex justify-content-between">
                                                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#000000' }}>Amount Received:</span>
                                                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000000' }}>₹{amountReceived.toFixed(2)}</span>
                                                </div>
                                                <hr />
                                                <div className="d-flex justify-content-between" style={{ fontSize: '16px', fontWeight: '700', color: '#000000' }}>
                                                    <span>Balance:</span>
                                                    <span>₹{balance.toFixed(2)}</span>
                                                </div>
                                                <div className="d-flex justify-content-between" style={{ fontSize: '16px', fontWeight: '700', color: '#28a745' }}>
                                                    <span>Change:</span>
                                                    <span>₹{change.toFixed(2)}</span>
                                                </div>
                                            </>
                                        )}

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
                                    disabled={(!selectedCustomer?.address || !selectedCustomer?.address?.postalCode || pincodeError)}
                                    style={{ fontSize: '16px', fontWeight: '600', padding: '10px 20px' }}
                                >
                                    {paymentMethod === 'COD' ? 'Complete Payment & Print' : 'Place Credit Order'}
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
                            onClick={() => setShowInvoice(false)}
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

            {/* Hold Orders Section */}
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

export default CrmOrderPageLayer;
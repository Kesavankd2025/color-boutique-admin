// import React, { useState, useEffect, useRef } from "react";
// import Select from "react-select";
// import { toast, ToastContainer } from "react-toastify";
// import { useReactToPrint } from 'react-to-print';

// const InventoryAddOrderListPageLayer = () => {
//     // State for vendors and selection
//     const [vendors, setVendors] = useState([]);
//     const [selectedVendor, setSelectedVendor] = useState(null);

//     // State for products
//     const [vendorProducts, setVendorProducts] = useState([]);
//     const [selectedProducts, setSelectedProducts] = useState([]);

//     // State for purchase order
//     const [purchaseItems, setPurchaseItems] = useState([]);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // State for order confirmation
//     const [orderConfirmed, setOrderConfirmed] = useState(false);
//     const [currentOrder, setCurrentOrder] = useState(null);

//     // Ref for printable content
//     const componentRef = useRef();

//     // Print handler
//     const handlePrint = useReactToPrint({
//         content: () => componentRef.current,
//         pageStyle: `
//             @page {
//                 size: A4;
//                 margin: 10mm;
//             }
//             @media print {
//                 body {
//                     padding: 20px;
//                     background: white;
//                     color: black;
//                 }
//                 .print-only {
//                     display: block;
//                 }
//                 .no-print {
//                     display: none;
//                 }
//                 table {
//                     width: 100%;
//                     border-collapse: collapse;
//                 }
//                 th, td {
//                     border: 1px solid #ddd;
//                     padding: 8px;
//                     text-align: left;
//                 }
//                 th {
//                     background-color: #f2f2f2;
//                 }
//             }
//         `,
//         onAfterPrint: () => toast.success("Print successful!"),
//         onPrintError: (err) => toast.error("Print failed: " + err)
//     });

//     // Sample data
//     const sampleVendors = [
//         { id: "1", name: "Beauty Supplies Co.", contact: "9876543210" },
//         { id: "2", name: "Cosmetics Ltd.", contact: "9876543211" },
//         { id: "3", name: "Hair Care Solutions", contact: "9876543212" },
//     ];

//     const sampleProducts = [
//         // Vendor 1 - 25 Products (Beauty Supplies Co.)
//         { id: "101", vendorId: "1", name: "Shampoo - Moisturizing", category: "Hair Care", variants: [{ size: "200ml", price: 120, lastPurchaseDate: "2023-05-10" }, { size: "500ml", price: 250, lastPurchaseDate: "2023-05-15" }], stock: 50 },
//         { id: "102", vendorId: "1", name: "Conditioner - Repair", category: "Hair Care", variants: [{ size: "200ml", price: 150, lastPurchaseDate: "2023-05-12" }, { size: "400ml", price: 280, lastPurchaseDate: "2023-05-18" }], stock: 30 },
//         { id: "103", vendorId: "1", name: "Hair Oil - Argan", category: "Hair Care", variants: [{ size: "100ml", price: 200, lastPurchaseDate: "2023-05-08" }, { size: "250ml", price: 450, lastPurchaseDate: "2023-05-18" }], stock: 20 },
//         { id: "104", vendorId: "1", name: "Hair Mask - Keratin", category: "Hair Care", variants: [{ size: "150ml", price: 350, lastPurchaseDate: "2023-05-20" }], stock: 25 },
//         { id: "105", vendorId: "1", name: "Hair Serum - Heat Protectant", category: "Hair Care", variants: [{ size: "100ml", price: 300, lastPurchaseDate: "2023-05-15" }], stock: 40 },
//         { id: "106", vendorId: "1", name: "Shampoo - Anti-Dandruff", category: "Hair Care", variants: [{ size: "200ml", price: 140, lastPurchaseDate: "2023-05-11" }, { size: "400ml", price: 260, lastPurchaseDate: "2023-05-19" }], stock: 35 },
//         { id: "107", vendorId: "1", name: "Hair Spray - Strong Hold", category: "Styling", variants: [{ size: "200ml", price: 220, lastPurchaseDate: "2023-05-14" }, { size: "400ml", price: 400, lastPurchaseDate: "2023-05-22" }], stock: 30 },
//         { id: "108", vendorId: "1", name: "Hair Gel - Extra Firm", category: "Styling", variants: [{ size: "150g", price: 180, lastPurchaseDate: "2023-05-09" }], stock: 45 },
//         { id: "109", vendorId: "1", name: "Hair Wax - Matte Finish", category: "Styling", variants: [{ size: "80g", price: 250, lastPurchaseDate: "2023-05-16" }], stock: 20 },
//         { id: "110", vendorId: "1", name: "Dry Shampoo - Volumizing", category: "Hair Care", variants: [{ size: "150ml", price: 280, lastPurchaseDate: "2023-05-13" }], stock: 30 },
//         { id: "111", vendorId: "1", name: "Hair Color - Black", category: "Coloring", variants: [{ size: "60ml", price: 150, lastPurchaseDate: "2023-05-17" }], stock: 50 },
//         { id: "112", vendorId: "1", name: "Hair Color - Brown", category: "Coloring", variants: [{ size: "60ml", price: 150, lastPurchaseDate: "2023-05-17" }], stock: 50 },
//         { id: "113", vendorId: "1", name: "Hair Bleach Kit", category: "Coloring", variants: [{ size: "Kit", price: 350, lastPurchaseDate: "2023-05-21" }], stock: 15 },
//         { id: "114", vendorId: "1", name: "Scalp Massager", category: "Tools", variants: [{ size: "1pc", price: 120, lastPurchaseDate: "2023-05-07" }], stock: 40 },
//         { id: "115", vendorId: "1", name: "Wide Tooth Comb", category: "Tools", variants: [{ size: "1pc", price: 80, lastPurchaseDate: "2023-05-05" }], stock: 60 },
//         { id: "116", vendorId: "1", name: "Hair Clips - Set of 10", category: "Accessories", variants: [{ size: "Set", price: 150, lastPurchaseDate: "2023-05-12" }], stock: 25 },
//         { id: "117", vendorId: "1", name: "Hair Ties - Elastic", category: "Accessories", variants: [{ size: "Pack of 50", price: 100, lastPurchaseDate: "2023-05-10" }], stock: 40 },
//         { id: "118", vendorId: "1", name: "Hair Brush - Round", category: "Tools", variants: [{ size: "Medium", price: 180, lastPurchaseDate: "2023-05-14" }, { size: "Large", price: 220, lastPurchaseDate: "2023-05-20" }], stock: 30 },
//         { id: "119", vendorId: "1", name: "Hair Brush - Paddle", category: "Tools", variants: [{ size: "1pc", price: 200, lastPurchaseDate: "2023-05-16" }], stock: 25 },
//         { id: "120", vendorId: "1", name: "Hair Dryer - Professional", category: "Electronics", variants: [{ size: "2000W", price: 2500, lastPurchaseDate: "2023-05-22" }], stock: 10 },
//         { id: "121", vendorId: "1", name: "Flat Iron - Ceramic", category: "Electronics", variants: [{ size: "1 inch", price: 1800, lastPurchaseDate: "2023-05-18" }, { size: "2 inch", price: 2200, lastPurchaseDate: "2023-05-24" }], stock: 8 },
//         { id: "122", vendorId: "1", name: "Curling Wand", category: "Electronics", variants: [{ size: "19mm", price: 2000, lastPurchaseDate: "2023-05-19" }, { size: "25mm", price: 2100, lastPurchaseDate: "2023-05-25" }], stock: 12 },
//         { id: "123", vendorId: "1", name: "Hair Clips - Butterfly", category: "Accessories", variants: [{ size: "Set of 12", price: 120, lastPurchaseDate: "2023-05-11" }], stock: 35 },
//         { id: "124", vendorId: "1", name: "Headband - Satin", category: "Accessories", variants: [{ size: "1pc", price: 90, lastPurchaseDate: "2023-05-09" }], stock: 50 },
//         { id: "125", vendorId: "1", name: "Hair Net - Black", category: "Accessories", variants: [{ size: "Pack of 5", price: 60, lastPurchaseDate: "2023-05-07" }], stock: 40 },

//         // Vendor 2 - 27 Products (Cosmetics Ltd.)
//         { id: "201", vendorId: "2", name: "Facial Cream - Moisturizing", category: "Skin Care", variants: [{ size: "50g", price: 250, lastPurchaseDate: "2023-05-05" }, { size: "100g", price: 450, lastPurchaseDate: "2023-05-15" }], stock: 40 },
//         { id: "202", vendorId: "2", name: "Hair Color - Blonde", category: "Coloring", variants: [{ size: "60ml", price: 180, lastPurchaseDate: "2023-05-14" }], stock: 25 },
//         { id: "203", vendorId: "2", name: "Serum - Vitamin C", category: "Skin Care", variants: [{ size: "30ml", price: 300, lastPurchaseDate: "2023-05-18" }], stock: 15 },
//         { id: "204", vendorId: "2", name: "Face Wash - Foaming", category: "Skin Care", variants: [{ size: "100ml", price: 220, lastPurchaseDate: "2023-05-10" }, { size: "200ml", price: 380, lastPurchaseDate: "2023-05-20" }], stock: 35 },
//         { id: "205", vendorId: "2", name: "Toner - Rose Water", category: "Skin Care", variants: [{ size: "150ml", price: 280, lastPurchaseDate: "2023-05-12" }], stock: 30 },
//         { id: "206", vendorId: "2", name: "Sunscreen - SPF 50", category: "Skin Care", variants: [{ size: "50ml", price: 320, lastPurchaseDate: "2023-05-16" }], stock: 25 },
//         { id: "207", vendorId: "2", name: "Lipstick - Matte Red", category: "Makeup", variants: [{ size: "3.5g", price: 250, lastPurchaseDate: "2023-05-08" }], stock: 50 },
//         { id: "208", vendorId: "2", name: "Mascara - Volumizing", category: "Makeup", variants: [{ size: "10ml", price: 280, lastPurchaseDate: "2023-05-11" }], stock: 40 },
//         { id: "209", vendorId: "2", name: "Eyeliner - Liquid", category: "Makeup", variants: [{ size: "2ml", price: 200, lastPurchaseDate: "2023-05-09" }], stock: 45 },
//         { id: "210", vendorId: "2", name: "Foundation - Liquid", category: "Makeup", variants: [{ size: "30ml", price: 350, lastPurchaseDate: "2023-05-14" }], stock: 30 },
//         { id: "211", vendorId: "2", name: "Concealer - Cream", category: "Makeup", variants: [{ size: "5g", price: 220, lastPurchaseDate: "2023-05-13" }], stock: 35 },
//         { id: "212", vendorId: "2", name: "Blush - Powder", category: "Makeup", variants: [{ size: "5g", price: 180, lastPurchaseDate: "2023-05-07" }], stock: 40 },
//         { id: "213", vendorId: "2", name: "Eyeshadow Palette", category: "Makeup", variants: [{ size: "12 colors", price: 450, lastPurchaseDate: "2023-05-17" }], stock: 20 },
//         { id: "214", vendorId: "2", name: "Makeup Brushes - Set", category: "Tools", variants: [{ size: "8pc", price: 380, lastPurchaseDate: "2023-05-19" }], stock: 15 },
//         { id: "215", vendorId: "2", name: "Makeup Sponge", category: "Tools", variants: [{ size: "2pc", price: 120, lastPurchaseDate: "2023-05-11" }], stock: 50 },
//         { id: "216", vendorId: "2", name: "Nail Polish - Red", category: "Nails", variants: [{ size: "10ml", price: 150, lastPurchaseDate: "2023-05-10" }], stock: 60 },
//         { id: "217", vendorId: "2", name: "Nail Polish - Nude", category: "Nails", variants: [{ size: "10ml", price: 150, lastPurchaseDate: "2023-05-10" }], stock: 60 },
//         { id: "218", vendorId: "2", name: "Nail Polish Remover", category: "Nails", variants: [{ size: "100ml", price: 100, lastPurchaseDate: "2023-05-08" }], stock: 40 },
//         { id: "219", vendorId: "2", name: "Nail File - Glass", category: "Nails", variants: [{ size: "1pc", price: 80, lastPurchaseDate: "2023-05-06" }], stock: 70 },
//         { id: "220", vendorId: "2", name: "Cuticle Oil", category: "Nails", variants: [{ size: "15ml", price: 120, lastPurchaseDate: "2023-05-12" }], stock: 30 },
//         { id: "221", vendorId: "2", name: "Face Mask - Clay", category: "Skin Care", variants: [{ size: "100g", price: 200, lastPurchaseDate: "2023-05-15" }], stock: 25 },
//         { id: "222", vendorId: "2", name: "Eye Cream - Anti-Aging", category: "Skin Care", variants: [{ size: "15ml", price: 350, lastPurchaseDate: "2023-05-18" }], stock: 20 },
//         { id: "223", vendorId: "2", name: "Makeup Remover", category: "Skin Care", variants: [{ size: "150ml", price: 220, lastPurchaseDate: "2023-05-13" }], stock: 35 },
//         { id: "224", vendorId: "2", name: "Lip Balm - Moisturizing", category: "Skin Care", variants: [{ size: "4g", price: 90, lastPurchaseDate: "2023-05-09" }], stock: 60 },
//         { id: "225", vendorId: "2", name: "BB Cream", category: "Makeup", variants: [{ size: "30ml", price: 300, lastPurchaseDate: "2023-05-16" }], stock: 30 },
//         { id: "226", vendorId: "2", name: "Highlighter - Liquid", category: "Makeup", variants: [{ size: "5ml", price: 250, lastPurchaseDate: "2023-05-14" }], stock: 25 },
//         { id: "227", vendorId: "2", name: "Setting Spray", category: "Makeup", variants: [{ size: "100ml", price: 280, lastPurchaseDate: "2023-05-17" }], stock: 20 },

//         // Vendor 3 - 30 Products (Hair Care Solutions)
//         { id: "301", vendorId: "3", name: "Hair Styling Gel", category: "Styling", variants: [{ size: "100g", price: 220, lastPurchaseDate: "2023-05-11" }, { size: "250g", price: 450, lastPurchaseDate: "2023-05-21" }], stock: 35 },
//         { id: "302", vendorId: "3", name: "Hair Mousse - Volumizing", category: "Styling", variants: [{ size: "200ml", price: 280, lastPurchaseDate: "2023-05-13" }], stock: 30 },
//         { id: "303", vendorId: "3", name: "Hair Spray - Flexible Hold", category: "Styling", variants: [{ size: "250ml", price: 240, lastPurchaseDate: "2023-05-15" }], stock: 25 },
//         { id: "304", vendorId: "3", name: "Hair Clay - Matte Finish", category: "Styling", variants: [{ size: "75g", price: 300, lastPurchaseDate: "2023-05-18" }], stock: 20 },
//         { id: "305", vendorId: "3", name: "Hair Pomade - Shine", category: "Styling", variants: [{ size: "100g", price: 320, lastPurchaseDate: "2023-05-20" }], stock: 15 },
//         { id: "306", vendorId: "3", name: "Hair Spray - Extra Strong", category: "Styling", variants: [{ size: "300ml", price: 260, lastPurchaseDate: "2023-05-16" }], stock: 30 },
//         { id: "307", vendorId: "3", name: "Hair Wax - Strong Hold", category: "Styling", variants: [{ size: "90g", price: 280, lastPurchaseDate: "2023-05-14" }], stock: 25 },
//         { id: "308", vendorId: "3", name: "Hair Cream - Defining", category: "Styling", variants: [{ size: "100ml", price: 250, lastPurchaseDate: "2023-05-12" }], stock: 35 },
//         { id: "309", vendorId: "3", name: "Hair Paste - Medium Hold", category: "Styling", variants: [{ size: "85g", price: 270, lastPurchaseDate: "2023-05-19" }], stock: 20 },
//         { id: "310", vendorId: "3", name: "Hair Spray - Humidity Resistant", category: "Styling", variants: [{ size: "250ml", price: 290, lastPurchaseDate: "2023-05-22" }], stock: 25 },
//         { id: "311", vendorId: "3", name: "Hair Gel - Extreme Hold", category: "Styling", variants: [{ size: "200g", price: 230, lastPurchaseDate: "2023-05-17" }], stock: 30 },
//         { id: "312", vendorId: "3", name: "Hair Foam - Curl Enhancing", category: "Styling", variants: [{ size: "200ml", price: 260, lastPurchaseDate: "2023-05-20" }], stock: 20 },
//         { id: "313", vendorId: "3", name: "Hair Spray - Travel Size", category: "Styling", variants: [{ size: "100ml", price: 150, lastPurchaseDate: "2023-05-11" }], stock: 40 },
//         { id: "314", vendorId: "3", name: "Hair Gel - Natural Look", category: "Styling", variants: [{ size: "150g", price: 200, lastPurchaseDate: "2023-05-14" }], stock: 35 },
//         { id: "315", vendorId: "3", name: "Hair Wax - Low Shine", category: "Styling", variants: [{ size: "80g", price: 240, lastPurchaseDate: "2023-05-18" }], stock: 25 },
//         { id: "316", vendorId: "3", name: "Hair Spray - Flexible Finish", category: "Styling", variants: [{ size: "200ml", price: 220, lastPurchaseDate: "2023-05-15" }], stock: 30 },
//         { id: "317", vendorId: "3", name: "Hair Cream - Smoothing", category: "Styling", variants: [{ size: "100ml", price: 280, lastPurchaseDate: "2023-05-19" }], stock: 25 },
//         { id: "318", vendorId: "3", name: "Hair Gel - Ultra Strong", category: "Styling", variants: [{ size: "200g", price: 250, lastPurchaseDate: "2023-05-16" }], stock: 20 },
//         { id: "319", vendorId: "3", name: "Hair Spray - Light Hold", category: "Styling", variants: [{ size: "250ml", price: 210, lastPurchaseDate: "2023-05-13" }], stock: 35 },
//         { id: "320", vendorId: "3", name: "Hair Wax - Texturizing", category: "Styling", variants: [{ size: "90g", price: 290, lastPurchaseDate: "2023-05-21" }], stock: 15 },
//         { id: "321", vendorId: "3", name: "Hair Gel - Mega Hold", category: "Styling", variants: [{ size: "250g", price: 270, lastPurchaseDate: "2023-05-22" }], stock: 20 },
//         { id: "322", vendorId: "3", name: "Hair Spray - Volume Boost", category: "Styling", variants: [{ size: "300ml", price: 240, lastPurchaseDate: "2023-05-18" }], stock: 25 },
//         { id: "323", vendorId: "3", name: "Hair Cream - Styling", category: "Styling", variants: [{ size: "120ml", price: 260, lastPurchaseDate: "2023-05-20" }], stock: 30 },
//         { id: "324", vendorId: "3", name: "Hair Gel - Firm Hold", category: "Styling", variants: [{ size: "150g", price: 230, lastPurchaseDate: "2023-05-17" }], stock: 35 },
//         { id: "325", vendorId: "3", name: "Hair Spray - Workable Hold", category: "Styling", variants: [{ size: "250ml", price: 250, lastPurchaseDate: "2023-05-19" }], stock: 25 },
//         { id: "326", vendorId: "3", name: "Hair Wax - Strong Finish", category: "Styling", variants: [{ size: "100g", price: 300, lastPurchaseDate: "2023-05-21" }], stock: 20 },
//         { id: "327", vendorId: "3", name: "Hair Gel - Extreme Shine", category: "Styling", variants: [{ size: "200g", price: 240, lastPurchaseDate: "2023-05-16" }], stock: 30 },
//         { id: "328", vendorId: "3", name: "Hair Spray - All-Day Hold", category: "Styling", variants: [{ size: "300ml", price: 270, lastPurchaseDate: "2023-05-22" }], stock: 25 },
//         { id: "329", vendorId: "3", name: "Hair Cream - Defining", category: "Styling", variants: [{ size: "100ml", price: 290, lastPurchaseDate: "2023-05-20" }], stock: 20 },
//         { id: "330", vendorId: "3", name: "Hair Gel - Professional", category: "Styling", variants: [{ size: "250g", price: 310, lastPurchaseDate: "2023-05-23" }], stock: 15 }
//     ];

//     // Fetch vendors
//     useEffect(() => {
//         const vendorOptions = sampleVendors.map(v => ({
//             value: v.id,
//             label: v.name,
//             contact: v.contact
//         }));

//         // Add "OTHERS" option at the end
//         vendorOptions.push({
//             value: "others",
//             label: "OTHERS",
//             contact: ""
//         });

//         setVendors(vendorOptions);
//     }, []);

//     // Handle vendor selection
//     const handleVendorSelect = (selectedOption) => {
//         setSelectedVendor(selectedOption);
//         setSelectedProducts([]);
//         setOrderConfirmed(false);

//         if (selectedOption.value === "others") {
//             // Show all products for "OTHERS" vendor
//             setVendorProducts(sampleProducts);
//         } else {
//             // Show only vendor-specific products
//             const vendorProducts = sampleProducts.filter(
//                 p => p.vendorId === selectedOption.value
//             );
//             setVendorProducts(vendorProducts);
//         }
//     };

//     // Toggle product selection
//     const toggleProductSelection = (productId) => {
//         setSelectedProducts(prev => {
//             if (prev.includes(productId)) {
//                 return prev.filter(id => id !== productId);
//             } else {
//                 return [...prev, productId];
//             }
//         });
//     };

//     // Proceed to order details
//     const proceedToOrder = () => {
//         if (selectedProducts.length === 0) {
//             toast.error("Please select at least one product");
//             return;
//         }

//         const items = [];
//         vendorProducts
//             .filter(p => selectedProducts.includes(p.id))
//             .forEach(product => {
//                 product.variants.forEach(variant => {
//                     items.push({
//                         ...product,
//                         variant: variant,
//                         quantity: 0,
//                         total: 0
//                     });
//                 });
//             });

//         setPurchaseItems(items);
//         setOrderConfirmed(true);
//     };

//     // Submit purchase order
//     const submitPurchaseOrder = () => {
//         setIsSubmitting(true);

//         const orderedItems = purchaseItems.filter(item => item.quantity > 0);

//         if (orderedItems.length === 0) {
//             toast.error("Please enter quantity for at least one item");
//             setIsSubmitting(false);
//             return;
//         }

//         const order = {
//             orderId: `PO-${Date.now()}`,
//             vendorId: selectedVendor.value,
//             vendorName: selectedVendor.label,
//             vendorContact: selectedVendor.contact,
//             date: new Date().toISOString(),
//             items: orderedItems.map(item => ({
//                 productId: item.id,
//                 productName: item.name,
//                 variant: item.variant.size,
//                 price: item.variant.price,
//                 quantity: item.quantity,
//                 total: item.variant.price * item.quantity
//             })),
//             totalAmount: orderedItems.reduce(
//                 (sum, item) => sum + (item.variant.price * item.quantity),
//                 0
//             )
//         };

//         setTimeout(() => {
//             setCurrentOrder(order);
//             setIsSubmitting(false);
//             // toast.success("Purchase order created successfully!");
//         }, 1000);
//     };

//     // Start new order
//     const startNewOrder = () => {
//         setSelectedVendor(null);
//         setSelectedProducts([]);
//         setPurchaseItems([]);
//         setOrderConfirmed(false);
//         setCurrentOrder(null);
//     };

//     return (
//         <div className="container-fluid">
//             <ToastContainer position="top-right" autoClose={3000} />

//             {!currentOrder ? (
//                 <div className="row">
//                     <div className="col-12">
//                         <div className="card">
//                             <div className="card-body">
//                                 <h4 className="card-title">Stock Update</h4>

//                                 {!orderConfirmed ? (
//                                     <>
//                                         {/* Step 1: Select Vendor */}
//                                         <div className="mb-4">
//                                             <label className="form-label">Select Vendor</label>
//                                             <Select
//                                                 options={vendors}
//                                                 value={selectedVendor}
//                                                 onChange={handleVendorSelect}
//                                                 placeholder="Search and select vendor..."
//                                                 isClearable
//                                             />
//                                         </div>

//                                         {/* Step 2: Select Products (if vendor selected) */}
//                                         {selectedVendor && (
//                                             <div className="mt-4">
//                                                 <h6>Products from {selectedVendor.label}</h6>
//                                                 <div className="table-responsive">
//                                                     <table className="table table-hover">
//                                                         <thead>
//                                                             <tr>
//                                                                 <th width="50px">Select</th>
//                                                                 <th>S.No</th>
//                                                                 <th>Product Name</th>
//                                                                 <th>Category</th>
//                                                                 <th>Last Purchase</th>
//                                                                 <th>Stock</th>
//                                                             </tr>
//                                                         </thead>
//                                                         <tbody>
//                                                             {vendorProducts.map((product, index) => (
//                                                                 <tr key={product.id}>
//                                                                     <td>
//                                                                         <input
//                                                                             type="checkbox"
//                                                                             checked={selectedProducts.includes(product.id)}
//                                                                             onChange={() => toggleProductSelection(product.id)}
//                                                                         />
//                                                                     </td>
//                                                                     <td>{index + 1}</td>
//                                                                     <td>{product.name}</td>
//                                                                     <td>{product.category}</td>
//                                                                     <td>
//                                                                         {new Date(
//                                                                             product.variants[0].lastPurchaseDate
//                                                                         ).toLocaleDateString()}
//                                                                     </td>
//                                                                     <td>{product.stock}</td>
//                                                                 </tr>
//                                                             ))}
//                                                         </tbody>
//                                                     </table>
//                                                 </div>

//                                                 <div className="text-end mt-3">
//                                                     <button
//                                                         className="btn btn-primary"
//                                                         onClick={proceedToOrder}
//                                                         disabled={selectedProducts.length === 0}
//                                                     >
//                                                         Proceed to Order Details
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </>
//                                 ) : (
//                                     <>
//                                         {/* Step 3: Order Details */}
//                                         <div className="mt-4">
//                                             <h6>Stock Update Details for {selectedVendor.label}</h6>
//                                             <div className="table-responsive">
//                                                 <table className="table table-hover">
//                                                     <thead>
//                                                         <tr>
//                                                             <th>S.No</th>
//                                                             <th>Product Name</th>
//                                                             <th>Variant</th>
//                                                             <th>Received Qty</th>
//                                                             <th>Buying Price</th>
//                                                             <th>Selling Price</th>
//                                                             <th>Last Price</th>
//                                                             <th>Total</th>
//                                                         </tr>
//                                                     </thead>
//                                                     <tbody>
//                                                         {purchaseItems.map((item, index) => (
//                                                             <tr key={`${item.id}-${item.variant.size}`}>
//                                                                 <td>{index + 1}</td>
//                                                                 <td>{item.name}</td>
//                                                                 <td>{item.variant.size}</td>

//                                                                 {/* Received Quantity */}
//                                                                 <td>
//                                                                     <input
//                                                                         type="number"
//                                                                         className="form-control"
//                                                                         min="0"
//                                                                         value={item.receivedQty || 0}
//                                                                         onChange={(e) => {
//                                                                             const qty = parseInt(e.target.value) || 0;
//                                                                             const updatedItems = [...purchaseItems];
//                                                                             updatedItems[index].receivedQty = qty;
//                                                                             updatedItems[index].total = qty * (item.buyingPrice || item.variant.price);
//                                                                             setPurchaseItems(updatedItems);
//                                                                         }}
//                                                                     />
//                                                                 </td>

//                                                                 {/* Buying Price */}
//                                                                 <td>
//                                                                     <input
//                                                                         type="number"
//                                                                         className="form-control"
//                                                                         min="0"
//                                                                         // step="0.01"
//                                                                         value={item.buyingPrice || item.variant.price}
//                                                                         onChange={(e) => {
//                                                                             const price = parseFloat(e.target.value) || 0;
//                                                                             const updatedItems = [...purchaseItems];
//                                                                             updatedItems[index].buyingPrice = price;
//                                                                             updatedItems[index].total = (item.receivedQty || 0) * price;
//                                                                             setPurchaseItems(updatedItems);
//                                                                         }}
//                                                                     />
//                                                                 </td>

//                                                                 {/* Selling Price */}
//                                                                 <td>
//                                                                     <input
//                                                                         type="number"
//                                                                         className="form-control"
//                                                                         min="0"
//                                                                         // step="0.01"
//                                                                         value={item.sellingPrice || item.variant.sellingPrice || item.variant.price * 1.2} // Default 20% markup
//                                                                         onChange={(e) => {
//                                                                             const price = parseFloat(e.target.value) || 0;
//                                                                             const updatedItems = [...purchaseItems];
//                                                                             updatedItems[index].sellingPrice = price;
//                                                                             setPurchaseItems(updatedItems);
//                                                                         }}
//                                                                     />
//                                                                 </td>

//                                                                 <td>₹{item.variant.price}</td>
//                                                                 <td>₹{(item.receivedQty || 0) * (item.buyingPrice || item.variant.price)}</td>
//                                                             </tr>
//                                                         ))}
//                                                     </tbody>
//                                                     <tfoot>
//                                                         <tr>
//                                                             <td colSpan="7" className="text-end"><strong>Grand Total</strong></td>
//                                                             <td>
//                                                                 <strong>
//                                                                     ₹{purchaseItems.reduce((sum, item) => sum + ((item.receivedQty || 0) * (item.buyingPrice || item.variant.price)), 0)}
//                                                                 </strong>
//                                                             </td>
//                                                         </tr>
//                                                     </tfoot>
//                                                 </table>
//                                             </div>

//                                             <div className="d-flex justify-content-between mt-3">
//                                                 <button
//                                                     className="btn btn-secondary"
//                                                     onClick={() => setOrderConfirmed(false)}
//                                                 >
//                                                     Back to Product Selection
//                                                 </button>

//                                                 <div className="text-end">
//                                                     <button
//                                                         className="btn btn-primary mt-2"
//                                                         onClick={submitPurchaseOrder}
//                                                         disabled={purchaseItems.filter(i => (i.receivedQty || 0) > 0).length === 0}
//                                                     >
//                                                         {isSubmitting ? "Submitting..." : "Submit Stock Update"}
//                                                     </button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 /* Order Confirmation/Print View */
//                 <div className="row">
//                     <div className="col-12">
//                         <div className="card">
//                             <div className="card-body">
//                                 {/* Printable content */}
//                                 <div className="d-none">
//                                     <div ref={componentRef} className="p-4">
//                                         <div className="text-center mb-4">
//                                             <h3>Purchase Order</h3>
//                                             <p className="mb-1">Order ID: {currentOrder.orderId}</p>
//                                             <p className="mb-1">Date: {new Date(currentOrder.date).toLocaleString()}</p>
//                                         </div>

//                                         <div className="row mb-4">
//                                             <div className="col-md-6">
//                                                 <h5>Vendor Details:</h5>
//                                                 <p className="mb-1"><strong>Name:</strong> {currentOrder.vendorName}</p>
//                                                 <p className="mb-1"><strong>Contact:</strong> {currentOrder.vendorContact}</p>
//                                             </div>
//                                             <div className="col-md-6 text-md-end">
//                                                 <h5>Stock Summary:</h5>
//                                                 <p className="mb-1"><strong>Total Items:</strong> {currentOrder.items.length}</p>
//                                                 <p className="mb-1"><strong>Total Amount:</strong> ₹{currentOrder.totalAmount}</p>
//                                             </div>
//                                         </div>

//                                         <div className="table-responsive">
//                                             <table className="table table-bordered">
//                                                 <thead>
//                                                     <tr>
//                                                         <th>S.No</th>
//                                                         <th>Product Name</th>
//                                                         <th>Variant</th>
//                                                         <th>Price</th>
//                                                         <th>Quantity</th>
//                                                         <th>Total</th>
//                                                     </tr>
//                                                 </thead>
//                                                 <tbody>
//                                                     {currentOrder.items.map((item, index) => (
//                                                         <tr key={index}>
//                                                             <td>{index + 1}</td>
//                                                             <td>{item.productName}</td>
//                                                             <td>{item.variant}</td>
//                                                             <td>₹{item.price}</td>
//                                                             <td>{item.quantity}</td>
//                                                             <td>₹{item.total}</td>
//                                                         </tr>
//                                                     ))}
//                                                 </tbody>
//                                                 <tfoot>
//                                                     <tr>
//                                                         <th colSpan="5" className="text-end">Grand Total</th>
//                                                         <th>₹{currentOrder.totalAmount}</th>
//                                                     </tr>
//                                                 </tfoot>
//                                             </table>
//                                         </div>

//                                         <div className="mt-4 pt-4 border-top text-center">
//                                             <p>Thank you for your business!</p>
//                                             <p>Please deliver the above items as soon as possible.</p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Preview of printable content (visible on screen) */}
//                                 <div className="border p-4 mb-4 bg-white">
//                                     <div className="text-center mb-4">
//                                         <h3>Update Stocks</h3>
//                                         <p className="mb-1">Order ID: {currentOrder.orderId}</p>
//                                         <p className="mb-1">Date: {new Date(currentOrder.date).toLocaleString()}</p>
//                                     </div>

//                                     <div className="row mb-4">
//                                         <div className="col-md-6">
//                                             <h5>Vendor Details:</h5>
//                                             <p className="mb-1"><strong>Name:</strong> {currentOrder.vendorName}</p>
//                                             <p className="mb-1"><strong>Contact:</strong> {currentOrder.vendorContact}</p>
//                                         </div>
//                                         <div className="col-md-6 text-md-end">
//                                             <h5>Stock Summary:</h5>
//                                             <p className="mb-1"><strong>Total Items:</strong> {currentOrder.items.length}</p>
//                                             <p className="mb-1"><strong>Total Amount:</strong> ₹{currentOrder.totalAmount}</p>
//                                         </div>
//                                     </div>

//                                     <div className="table-responsive">
//                                         <table className="table table-bordered">
//                                             <thead>
//                                                 <tr>
//                                                     <th>S.No</th>
//                                                     <th>Product Name</th>
//                                                     <th>Variant</th>
//                                                     <th>Price</th>
//                                                     <th>Quantity</th>
//                                                     <th>Total</th>
//                                                 </tr>
//                                             </thead>
//                                             <tbody>
//                                                 {currentOrder.items.map((item, index) => (
//                                                     <tr key={index}>
//                                                         <td>{index + 1}</td>
//                                                         <td>{item.productName}</td>
//                                                         <td>{item.variant}</td>
//                                                         <td>₹{item.price}</td>
//                                                         <td>{item.quantity}</td>
//                                                         <td>₹{item.total}</td>
//                                                     </tr>
//                                                 ))}
//                                             </tbody>
//                                             <tfoot>
//                                                 <tr>
//                                                     <th colSpan="5" className="text-end">Grand Total</th>
//                                                     <th>₹{currentOrder.totalAmount}</th>
//                                                 </tr>
//                                             </tfoot>
//                                         </table>
//                                     </div>

//                                     <div className="mt-4 pt-4 border-top text-center">
//                                         <p>Thank you for your business!</p>
//                                         <p>Please deliver the above items as soon as possible.</p>
//                                     </div>
//                                 </div>

//                                 <div className="d-flex justify-content-center gap-3 mt-4 no-print">
//                                     <button
//                                         className="btn btn-primary"
//                                         onClick={handlePrint}
//                                     >
//                                         Print Order
//                                     </button>
//                                     <button
//                                         className="btn btn-success"
//                                         onClick={startNewOrder}
//                                     >
//                                         Create New Order
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default InventoryAddOrderListPageLayer;


import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
// import { toast, ToastContainer } from "react-toastify";
import { useReactToPrint } from 'react-to-print';
import VendorApi from "../apiProvider/vendor"

const InventoryAddOrderListPageLayer = () => {
    // State for vendors and selection
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [showAllProducts, setShowAllProducts] = useState(false);

    // State for products
    const [vendorProducts, setVendorProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    // State for purchase order
    const [purchaseItems, setPurchaseItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for order confirmation
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    // Ref for printable content
    const componentRef = useRef();

    // Print handler
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        pageStyle: `
            @page {
                size: A4;
                margin: 10mm;
            }
            @media print {
                body {
                    padding: 20px;
                    background: white;
                    color: black;
                }
                .print-only {
                    display: block;
                }
                .no-print {
                    display: none;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
            }
        `,
        // onAfterPrint: () => toast.success("Print successful!"),
        // onPrintError: (err) => toast.error("Print failed: " + err)
    });

    // Fetch vendors
    useEffect(() => {
        // setVendors(sampleVendors.map(v => ({
        //     value: v.id,
        //     label: v.name,
        //     contact: v.contact
        // })));
    }, []);

    // Handle vendor selection
    // Handle vendor selection
    const handleVendorSelect = async (selectedOption) => {
        setSelectedVendor(selectedOption);
        setSelectedProducts([]);
        setOrderConfirmed(false);
        setShowAllProducts(false);

        if (selectedOption.isAllProducts) {
            // Handle "All Products" selection
            setShowAllProducts(true);

            try {
                // Call API to get all products
                const result = await VendorApi.getProductBasedOnVendor(selectedOption.value);

                if (result && result.status) {
                    // Format the response to match the vendorProducts structure
                    setVendorProducts({
                        products: result.response.data || [],
                        phoneNumber: "N/A" // No specific vendor contact for all products
                    });
                }
            } catch (error) {
                console.error("Error fetching all products:", error);
                setVendorProducts({ products: [] });
            }
        } else {
            // Handle specific vendor selection (original logic)
            try {
                const result = await VendorApi.getProductBasedOnVendor(selectedOption.value);

                if (result && result.status) {
                    setVendorProducts(result?.response?.data[0] || { products: [] });
                }
            } catch (error) {
                console.error("Error fetching vendor products:", error);
                setVendorProducts({ products: [] });
            }
        }
    };

    // Toggle product selection
    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev => {
            if (prev.includes(productId)) {
                return prev.filter(id => id !== productId);
            } else {
                return [...prev, productId];
            }
        });
    };

    function calculateFinalVariantStock(data) {
        let totalStock = 0;

        function traverse(items) {
            items.forEach(item => {
                if (item.attributes && Array.isArray(item.attributes)) {
                    item.attributes.forEach(attr => {
                        if (attr.value && Array.isArray(attr.value)) {
                            traverse(attr.value); // go deeper
                        }
                    });
                } else if (!item.attributes && item.stock) {
                    // Final variant level (no more nested attributes)
                    totalStock += Number(item.stock);
                }
            });
        }

        data.forEach(level1 => {
            if (level1.value && Array.isArray(level1.value)) {
                traverse(level1.value);
            }
        });

        return totalStock;
    }


    // Proceed to order details
    const proceedToOrder = () => {
        // console.log(selectedProducts, "selectedProducts");
        console.log(vendorProducts, "vendorProducts");


        if (selectedProducts.length === 0) {
            alert("Please select at least one product")
            // toast.error("Please select at least one product");
            return;
        }

        const items = [];
        // Create a map of products from vendorProducts.products for quick lookup
        vendorProducts.products
            .filter(p => selectedProducts.includes(p._id))
            .forEach(product => {
                // For products without variants (unchanged)
                if (!product.customerAttributeDetails || !Array.isArray(product.customerAttributeDetails)) {
                    items.push({
                        productId: product._id,
                        productName: product.productName,
                        categoryName: product.categoryName,
                        variantId: product._id,
                        variantType: 'Standard',
                        variantValue: 'Single',
                        sku: product.productCode || '',
                        price: product.customersellingPrice || 0,
                        currentStock: product.stock || 0,
                        maxLimit: product.maxLimit || 0,
                        quantity: 0,
                        total: 0,
                        productImage: product.productImage?.[0]?.docName
                    });
                    return;
                }

                // Recursive function to generate all combinations
                const generateCombinations = (attributes, variantPath = [], inheritedValues = {}) => {
                    if (attributes.length === 0) {
                        const lastVariant = variantPath[variantPath.length - 1];

                        // Get the most specific values (deepest level overrides parent levels)
                        const finalSku = lastVariant.sku || inheritedValues.sku;
                        const finalPrice = lastVariant.price || inheritedValues.price;
                        const finalStock = lastVariant.stock || inheritedValues.stock;
                        const finalMaxLimit = lastVariant.maxLimit || inheritedValues.maxLimit;

                        // Create an object with separate IDs for each attribute level
                        const variantIds = {};
                        variantPath.forEach(v => {
                            variantIds[`${v.type.toLowerCase()}Id`] = v._id;
                        });

                        items.push({
                            productId: product._id,
                            productName: product.productName,
                            categoryName: product.categoryName,
                            ...variantIds,
                            variantId: lastVariant._id,
                            variantType: variantPath.map(v => v.type).join('-'),
                            variantValue: variantPath.map(v => v.value).join('-'),
                            sku: finalSku,
                            price: parseFloat(finalPrice) || 0,
                            currentStock: parseInt(finalStock) || 0,
                            maxLimit: parseInt(finalMaxLimit) || 0,
                            quantity: 0,
                            total: 0,
                            productImage: product.productImage?.[0]?.docName
                        });
                        return;
                    }

                    const [currentAttr, ...remainingAttrs] = attributes;

                    if (currentAttr.value && Array.isArray(currentAttr.value)) {
                        currentAttr.value.forEach(variant => {
                            // Create new values object with current level values overriding inherited ones
                            const currentValues = {
                                ...inheritedValues, // Parent values as fallback
                                sku: variant.sku || inheritedValues.sku,
                                price: variant.price || inheritedValues.price,
                                stock: variant.stock || inheritedValues.stock,
                                maxLimit: variant.maxLimit || inheritedValues.maxLimit
                            };

                            const newVariantPath = [
                                ...variantPath,
                                {
                                    type: currentAttr.name,
                                    value: variant.value,
                                    _id: variant._id,
                                    sku: variant.sku,
                                    price: variant.price,
                                    stock: variant.stock,
                                    maxLimit: variant.maxLimit
                                }
                            ];

                            // Process nested attributes if they exist
                            const nestedAttrs = variant.attributes || [];
                            generateCombinations(
                                [...remainingAttrs, ...nestedAttrs],
                                newVariantPath,
                                currentValues
                            );
                        });
                    }
                };

                // Start combination generation
                generateCombinations(product.customerAttributeDetails);
            });
        setPurchaseItems(items);
        setOrderConfirmed(true);
    };



    function transformOrderData(originalOrder) {
        const products = originalOrder.items.map(item => {
            const variantParts = item.variantValue.split('-');
            const variantTypes = item.variantType.split('-');

            const attributes = {};
            variantTypes.forEach((type, index) => {
                const value = variantParts[index];
                const idField = `${type.toLowerCase()}Id`;
                attributes[value] = item[idField] || value;
            });

            return {
                id: item.productId,
                quantity: item.quantity,
                buyingPrice: parseFloat(item.price),
                sellingPrice: parseFloat(item.price) * 1.1, // Example: 10% markup
                quantityReceived: 0, // Default: 0 (can be updated later)
                isProductReceived: false, // Default: false
                attributes: attributes,
                variantId: item.variantId // Include variantId if needed
            };
        });

        const totalPrice = products.reduce((sum, product) => {
            return sum + (product.buyingPrice * product.quantity);
        }, 0);
        if (originalOrder.vendorId === "all") {
            // originalOrder.vendorId = "all";
            return {
                products,
                notVendor: originalOrder.vendorId,
                totalPrice
            }
        } else {
            return {
                products,
                vendorId: originalOrder.vendorId,
                totalPrice
            };
        }

    }

    const submitPurchaseOrder = async () => {
        setIsSubmitting(true);

        const orderedItems = purchaseItems.filter(item => item.quantity > 0);

        if (orderedItems.length === 0) {
            alert("Please enter quantity for at least one item")
            // toast.error("Please enter quantity for at least one item");
            setIsSubmitting(false);
            return;
        }
        console.log(orderedItems, "orderedItems");

        const order = {
            orderId: `PO-${Date.now()}`,
            vendorId: selectedVendor.value,
            vendorName: selectedVendor.label,
            vendorContact: vendorProducts.phoneNumber,
            date: new Date().toISOString(),
            items: orderedItems.map(item => {
                const baseItem = {
                    productId: item.productId,
                    productName: item.productName,
                    variantType: item.variantType,
                    variantValue: item.variantValue,
                    sku: item.sku,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity
                };

                // Add all properties that end with "Id"
                for (const key in item) {
                    if (key.endsWith('Id') && !(key in baseItem)) {
                        baseItem[key] = item[key];
                    }
                }

                return baseItem;
            }),
            totalAmount: orderedItems.reduce(
                (sum, item) => sum + (item.price * item.quantity),
                0
            )
        };

        console.log(order, "order");
        // return
        // Example usage with your data
        const transformedOrder = transformOrderData(order);
        console.log(transformedOrder, "ddddddddddsssssd");

        // return

        const purchaseCreate = await VendorApi.vendorPurchase(transformedOrder)
        console.log(purchaseCreate, "purchaseCreate");
        if (purchaseCreate && purchaseCreate.status) {

            setTimeout(() => {
                setCurrentOrder(order);
                setIsSubmitting(false);
                // alert("Purchase order created successfully!")
                // toast.success("Purchase order created successfully!");
            }, 1000);
        }
        // return



    };


    // Start new order
    const startNewOrder = () => {
        setSelectedVendor(null);
        setSelectedProducts([]);
        setPurchaseItems([]);
        setOrderConfirmed(false);
        setCurrentOrder(null);
    };

    const fetchData = async () => {
        const input = {
            search,
        };

        try {
            const response = await VendorApi.vendorList(input);

            if (response.status) {
                let vendorList = response.response?.data.map(vendor => ({
                    label: vendor.name,
                    value: vendor._id,
                    contact: vendor.contact
                })) || [];

                // Add "All Products" option at the beginning
                vendorList.unshift({
                    label: "All Products",
                    value: "all",
                    isAllProducts: true
                });

                setVendors(vendorList);
            } else {
                console.error("Failed to fetch vendor list");
            }
        } catch (error) {
            console.error("Error fetching vendor list:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page, limit, search]);

    console.log(vendorProducts, "vendorProducts");
    console.log(currentOrder, "currentOrder----");



    return (
        <div className="container-fluid">
            {/* <ToastContainer position="top-right" autoClose={3000} /> */}

            {!currentOrder ? (
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Stock Update</h4>

                                {!orderConfirmed ? (
                                    <>

                                        {/* Step 1: Select Vendor */}
                                        <div className="mb-4">
                                            <label className="form-label">Select Vendor</label>
                                            <Select
                                                options={vendors}
                                                value={selectedVendor}
                                                onChange={handleVendorSelect}
                                                placeholder="Search and select vendor..."
                                                isClearable
                                            />
                                        </div>

                                        {(selectedVendor || showAllProducts) && (
                                            <div className="mt-4">
                                                <h6>
                                                    {showAllProducts
                                                        ? "All Products"
                                                        : `Products from ${selectedVendor.label}`}
                                                </h6>
                                                <div className="table-responsive">
                                                    <table className="table table-hover">
                                                        <thead>
                                                            <tr>
                                                                <th width="50px">Select</th>
                                                                <th>S.No</th>
                                                                <th>Product Name</th>
                                                                <th>Category</th>
                                                                <th>Vendor</th>
                                                                <th>Last Purchase</th>
                                                                <th>Stock</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {vendorProducts && vendorProducts.products && vendorProducts.products.map((product, index) => {
                                                                let totalStock = 0;
                                                                if (product.customerAttributeDetails) {
                                                                    totalStock = calculateFinalVariantStock(product.customerAttributeDetails);
                                                                }

                                                                return (
                                                                    <tr key={product._id}>
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedProducts.includes(product._id)}
                                                                                onChange={() => toggleProductSelection(product._id)}
                                                                            />
                                                                        </td>
                                                                        <td>{index + 1}</td>
                                                                        <td>{product.productName}</td>
                                                                        <td>{product.categoryName || '-'}</td>
                                                                        <td>{showAllProducts ? (product.vendorName || '-') : selectedVendor.label}</td>
                                                                        <td>
                                                                            {product.lastPurchasedDate ? new Date(product.lastPurchasedDate).toLocaleDateString() : '-'}
                                                                        </td>
                                                                        <td>{totalStock}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="text-end mt-3">
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={proceedToOrder}
                                                        disabled={selectedProducts.length === 0}
                                                    >
                                                        Proceed to Order Details
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <>

                                        <div className="mt-4">
                                            <h6>Order Details for {selectedVendor.label}</h6>
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead>
                                                        <tr>
                                                            <th>S.No</th>
                                                            <th>Product Name</th>
                                                            <th>Variant</th>
                                                            <th>Current Stock</th>
                                                            <th>Price</th>
                                                            <th>Quantity</th>
                                                            {/* <th>Total</th> */}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {purchaseItems.map((item, index) => (
                                                            <tr key={`${item.productId}-${item.variantId}`}>
                                                                <td>{index + 1}</td>
                                                                <td>{item.productName}</td>
                                                                <td>
                                                                    {item.variantType} - {item.variantValue}
                                                                </td>
                                                                <td>{item.currentStock}</td>
                                                                <td>₹{item.price}</td>
                                                                <td>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        min="0"
                                                                        max={item.currentStock}
                                                                        value={item.quantity || 0}
                                                                        onChange={(e) => {
                                                                            const qty = parseInt(e.target.value) || 0;
                                                                            const updatedItems = [...purchaseItems];
                                                                            updatedItems[index].quantity = qty;
                                                                            updatedItems[index].total = qty * item.price;
                                                                            setPurchaseItems(updatedItems);
                                                                        }}
                                                                    />
                                                                </td>
                                                                {/* <td>₹{(item.quantity || 0) * item.price}</td> */}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>

                                                    </tfoot>
                                                </table>
                                            </div>

                                            <div className="d-flex justify-content-between mt-3">
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => setOrderConfirmed(false)}
                                                >
                                                    Back to Product Selection
                                                </button>

                                                <div className="text-end">
                                                    <button
                                                        className="btn btn-primary mt-2"
                                                        onClick={submitPurchaseOrder}
                                                        disabled={purchaseItems.filter(i => (i.quantity || 0) > 0).length === 0}
                                                    >
                                                        {isSubmitting ? "Submitting..." : "Submit Purchase Order"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div >
            ) : (
                /* Order Confirmation/Print View */
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body">
                                {/* Printable content */}
                                <div className="d-none">
                                    <div ref={componentRef} className="p-4">
                                        <div className="text-center mb-4">
                                            <h3>Purchase Order</h3>
                                            <p className="mb-1">Order ID: {currentOrder.orderId}</p>
                                            <p className="mb-1">Date: {new Date(currentOrder.date).toLocaleString()}</p>
                                        </div>

                                        <div className="row mb-4">
                                            <div className="col-md-6">
                                                <h5>Vendor Details:</h5>
                                                <p className="mb-1"><strong>Name:</strong> {currentOrder.vendorName}</p>
                                                <p className="mb-1"><strong>Contact:</strong> {currentOrder.vendorContact}</p>
                                            </div>
                                            <div className="col-md-6 text-md-end">
                                                <h5>Order Summary:</h5>
                                                <p className="mb-1"><strong>Total Items:</strong> {currentOrder.items.length}</p>
                                                {/* <p className="mb-1"><strong>Total Amount:</strong> ₹{currentOrder.totalAmount}</p> */}
                                            </div>
                                        </div>

                                        <div className="table-responsive">
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th>S.No</th>
                                                        <th>Product Name</th>
                                                        <th>Variant</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        {/* <th>Total</th> */}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentOrder.items.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.productName}</td>
                                                            <td>{item.variantValue}</td>
                                                            <td>₹{item.price}</td>
                                                            <td>{item.quantity}</td>
                                                            {/* <td>₹{item.total}</td> */}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot>

                                                </tfoot>
                                            </table>
                                        </div>

                                        <div className="mt-4 pt-4 border-top text-center">
                                            <p>Thank you for your business!</p>
                                            <p>Please deliver the above items as soon as possible.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Preview of printable content (visible on screen) */}
                                <div className="border p-4 mb-4 bg-white">
                                    <div className="text-center mb-4">
                                        <h3>Purchase Order</h3>
                                        <p className="mb-1">Order ID: {currentOrder.orderId}</p>
                                        <p className="mb-1">Date: {new Date(currentOrder.date).toLocaleString()}</p>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <h5>Vendor Details:</h5>
                                            <p className="mb-1"><strong>Name:</strong> {currentOrder.vendorName}</p>
                                            <p className="mb-1"><strong>Contact:</strong> {currentOrder.vendorContact}</p>
                                        </div>
                                        <div className="col-md-6 text-md-end">
                                            <h5>Order Summary:</h5>
                                            <p className="mb-1"><strong>Total Items:</strong> {currentOrder.items.length}</p>
                                            {/* <p className="mb-1"><strong>Total Amount:</strong> ₹{currentOrder.totalAmount}</p> */}
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>S.No</th>
                                                    <th>Product Name</th>
                                                    <th>Variant</th>
                                                    <th>Price</th>
                                                    <th>Quantity</th>
                                                    {/* <th>Total</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentOrder.items.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.productName}</td>
                                                        <td>{item.variantValue}</td>
                                                        <td>₹{item.price}</td>
                                                        <td>{item.quantity}</td>
                                                        {/* <td>₹{item.total}</td> */}
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                {/* <tr>
                                                    <th colSpan="5" className="text-end">Grand Total</th>
                                                    <th>₹{currentOrder.totalAmount}</th>
                                                </tr> */}
                                            </tfoot>
                                        </table>
                                    </div>

                                    <div className="mt-4 pt-4 border-top text-center">
                                        <p>Thank you for your business!</p>
                                        <p>Please deliver the above items as soon as possible.</p>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center gap-3 mt-4 no-print">
                                    <button
                                        className="btn btn-primary"
                                        // onClick={handlePrint}
                                        onClick={() => window.print()}
                                    >
                                        Print Order
                                    </button>
                                    <button
                                        className="btn btn-success"
                                        onClick={startNewOrder}
                                    >
                                        Create New Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default InventoryAddOrderListPageLayer;
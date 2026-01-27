import React from 'react';

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

const formatTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });
};

const LooseInvoiceTemplate = React.forwardRef(({ orderData }, ref) => {
    if (!orderData) return null;

    // Calculate total loose items and weight
    const totalLooseItems = orderData.products.filter(product => product.looseKg > 0).length;
    const totalLooseWeight = orderData.products.reduce((total, product) => {
        return total + (product.looseKg || 0);
    }, 0);

    return (
        <div
            ref={ref}
            className="invoice-template"
            style={{
                width: "4in",
                fontFamily: "Arial, sans-serif",
                fontSize: "14px",
                padding: "10px 15px",
                lineHeight: "1.4",
                boxSizing: "border-box",
                borderRadius: "6px",
                fontWeight: "bold",
            }}
        >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "16px" }}>RAMESH TRADERS</div>
                <div>442, A.V.G. COMPLEX, RANGAI GOWDER STREET</div>
                <div>COIMBATORE - 641001</div>
                <div>PH : 7550223510,11,12,13</div>

                <div
                    style={{
                        marginTop: "6px",
                        fontSize: "15px",
                        borderTop: "1px solid #000",
                        borderBottom: "1px solid #000",
                        padding: "4px 0",
                    }}
                >
                    LOOSE QUANTITY BILL
                </div>

                <div style={{ marginTop: "5px", fontSize: "14px" }}>
                    <span>Order Code: </span>
                    <span>{orderData.orderCode}</span>
                </div>
            </div>

            {/* Customer Info */}
            <div
                style={{
                    marginBottom: "10px",
                    borderTop: "1px dashed #000",
                    paddingTop: "6px",
                    fontSize: "14px",
                    fontFamily: "Arial, sans-serif",
                }}
            >
                {/* Row: Customer Name */}
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ width: "120px", fontWeight: "bold" }}>Customer Name</div>
                    <div>: {orderData.shippingAddress?.contactName || orderData.userName}</div>
                </div>

                {/* Row: Address */}
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ width: "120px", fontWeight: "bold" }}>Address</div>
                    <div>
                        <div>: {orderData.shippingAddress?.street}</div>
                        <div style={{ marginLeft: "10px" }}>
                            {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} -{" "}
                            {orderData.shippingAddress?.postalCode}
                        </div>
                    </div>
                </div>

                {/* Row: Phone */}
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ width: "120px", fontWeight: "bold" }}>Phone</div>
                    <div>: {orderData.shippingAddress?.contactNumber}</div>
                </div>

                {/* Row: Date */}
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ width: "120px", fontWeight: "bold" }}>Date</div>
                    <div>: {formatDate(orderData.createdAt)}</div>
                </div>

                {/* Row: Time */}
                <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ width: "120px", fontWeight: "bold" }}>Time</div>
                    <div>: {formatTime(orderData.createdAt)}</div>
                </div>
            </div>


            {/* Products Table */}
            <div
                style={{
                    marginBottom: "8px",
                    borderTop: "1px dashed #000",
                    paddingTop: "5px",
                }}
            >
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        borderBottom: "1px solid #000",
                        padding: "5px 0",
                    }}
                >
                    <span style={{ width: "10%", textAlign: "right" }}>S.No</span>
                    <span style={{ width: "50%", paddingLeft: "5px" }}>Products</span>
                    <span style={{ width: "20%", textAlign: "right" }}>Rate</span>
                    <span style={{ width: "20%", textAlign: "right" }}>Loose Qty</span>
                </div>

                {/* Rows */}
                {orderData.products?.map((product, index) => {
                    const item = orderData.items[index];
                    if (product.looseKg > 0) {
                        return (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    padding: "6px 0",
                                    borderBottom: "1px dashed #ccc",
                                }}
                            >
                                <span style={{ width: "10%", textAlign: "right" }}>
                                    {index + 1}
                                </span>
                                <span style={{ width: "50%", paddingLeft: "5px" }}>
                                    {product.productName}
                                </span>
                                <span style={{ width: "20%", textAlign: "right" }}>
                                    {item.unitPrice.toFixed(2)}
                                </span>
                                <span style={{ width: "20%", textAlign: "right" }}>
                                    {product.looseKg.toFixed(3)}
                                </span>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {/* Totals */}
            <div
                style={{
                    marginBottom: "8px",
                    borderTop: "1px dashed #000",
                    paddingTop: "5px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "13px",
                    }}
                >
                    <span>Total Items</span>
                    <span>{totalLooseItems}</span>
                </div>
            </div>

            {/* Footer */}
            <div
                style={{
                    textAlign: "center",
                    borderTop: "1px solid #000",
                    paddingTop: "6px",
                    marginTop: "5px",
                    fontSize: "11px",
                }}
            >
                <div>LOOSE QUANTITY INVOICE</div>
                <div>Thank you for your business!</div>
                <div style={{ marginTop: "2px" }}>GSTIN: 33AAFFR5104D1ZS</div>
            </div>
        </div>
    );


});

export default LooseInvoiceTemplate;
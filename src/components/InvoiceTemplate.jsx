
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

const InvoiceTemplate = React.forwardRef(({ orderData, paymentStatus }, ref) => {
  if (!orderData) return null;

  // Calculate values
  const subtotal = orderData.breakdown?.subTotal ||
    orderData.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);

  const totalDiscount = orderData.breakdown?.discount || orderData.totalDiscount || orderData.discount || 0;
  const totalTax = orderData.breakdown?.tax || orderData.totalTax || 0;
  const deliveryCharge = orderData.breakdown?.shippingCharge || orderData.deliveryCharge || 0;
  const finalTotal = orderData.breakdown?.total || orderData.totalAmount;
  console.log(orderData, "orderDataorderData");

  return (
    <div
      ref={ref}
      className="invoice-template"
      style={{
        width: "4in",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        fontWeight: "bold",
        lineHeight: "1.3",
        boxSizing: "border-box",
        padding: "8px 12px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "6px" }}>
        <div style={{ fontWeight: "bold", fontSize: "15px" }}>NALSUVAI</div>
        <div>26, IDAIKARI ROAD, THUDIYALUR</div>
        <div>COIMBATORE - 641034</div>
        <div>PH : 97919 90991</div>
        <div
          style={{
            marginTop: "6px",
            fontWeight: "bold",
            fontSize: "15px",
            borderTop: "1px dashed #000",
            borderBottom: "1px dashed #000",
            padding: "3px 0",
          }}
        >
          Order Code: {orderData.orderCode}
        </div>
      </div>

      <div
        style={{
          marginBottom: "6px",
          borderTop: "1px dashed #000",
          paddingTop: "4px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ maxWidth: "55%" }}>
          <div>
            <span style={{ fontWeight: "bold" }}>Customer: </span>
            {orderData.shippingAddress?.contactName || orderData.placedByName.name}
          </div>
          <div>{orderData.shippingAddress?.street}</div>
          <div>
            {orderData.shippingAddress?.city}, {orderData.shippingAddress?.state} -{" "}
            {orderData.shippingAddress?.postalCode}
          </div>
          <div>
            <span style={{ fontWeight: "bold" }}>PH: </span>
            {orderData.shippingAddress?.contactNumber || orderData.placedByName.phone}
          </div>
        </div>

        {/* Order By */}
        <div style={{ textAlign: "right", maxWidth: "40%" }}>
          <div style={{ fontWeight: "bold" }}>Order By</div>
          <div>{orderData.user?.name || orderData.userName}</div>
          <div>
            <span style={{ fontWeight: "bold" }}>PH: </span>
            {orderData.user?.phoneNumber || orderData.user?.mobileNumber}
          </div>
        </div>
      </div>

      {/* Invoice Info */}
      <div
        style={{
          marginBottom: "6px",
          borderTop: "1px dashed #000",
          paddingTop: "4px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold" }}>Invoice No:</span>
          <span>{orderData.invoiceId}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold" }}>Date:</span>
          <span>{formatDate(orderData.createdAt)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold" }}>Time:</span>
          <span>{formatTime(orderData.createdAt)}</span>
        </div>
      </div>

      {/* Products Table */}
      <div
        style={{
          marginBottom: "6px",
          borderTop: "1px dashed #000",
          paddingTop: "4px",
        }}
      >
        {/* Header Row */}
        <div
          style={{
            display: "flex",
            fontWeight: "bold",
            borderBottom: "1px solid #000",
            padding: "5px 0"
          }}
        >
          <span style={{ width: "8%", textAlign: "right" }}>S.No</span>
          <span style={{ width: "44%", paddingLeft: "5px" }}>Products</span>
          <span style={{ width: "16%", textAlign: "right" }}>Rate</span>
          <span style={{ width: "12%", textAlign: "right" }}>Qty</span>
          <span style={{ width: "20%", textAlign: "right" }}>Amount</span>
        </div>

        {/* Rows */}
        {orderData.items?.map((item, index) => {
          const variantName = item.attributes
            ? Object.keys(item.attributes)[0]
            : "";
          return (

            <div
              key={index}
              style={{
                display: "flex",
                borderBottom: "1px dashed #ccc",
                padding: "6px 0",
              }}
            >
              {/* {console.log(orderData?.attributes[index], "orderData.attributes[index]")} */}
              <span style={{ width: "8%", textAlign: "right" }}>{index + 1}</span>
              <span style={{ width: "44%", paddingLeft: "5px" }}>
                {orderData.products[index].productName}
                {variantName && ` (${variantName})`}
              </span>
              <span style={{ width: "16%", textAlign: "right" }}>
                {item.unitPrice.toFixed(2)}
              </span>
              <span style={{ width: "12%", textAlign: "right" }}>
                {item.quantity}
              </span>
              <span style={{ width: "20%", textAlign: "right" }}>
                {(item.unitPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Totals */}
      <div
        style={{
          marginBottom: "6px",
          borderTop: "1px dashed #000",
          paddingTop: "4px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total Items:</span>
          <span>{orderData.items?.length || 0}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total Weight:</span>
          <span>{orderData.totalWeightinKg || 0}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Discount:</span>
          <span>-{totalDiscount.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Tax:</span>
          <span>{totalTax.toFixed(2)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Delivery:</span>
          <span>{deliveryCharge.toFixed(2)}</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "13px",
            borderTop: "1px solid #000",
            marginTop: "4px",
            paddingTop: "4px",
          }}
        >
          <span>Net Amount:</span>
          <span>{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Info */}
      <div
        style={{
          marginBottom: "6px",
          borderTop: "1px dashed #000",
          paddingTop: "4px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold" }}>Payment Mode:</span>
          <span>{orderData.paymentMode}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontWeight: "bold" }}>Status:</span>
          <span>{paymentStatus?.toUpperCase() || orderData.paymentStatus?.toUpperCase()}</span>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          textAlign: "center",
          borderTop: "1px dashed #000",
          paddingTop: "5px",
          fontSize: "11px",
        }}
      >
        <div style={{ fontWeight: "bold" }}>Thank you for your business!</div>
        <div>GSTIN: 33AAFFR5104D1ZS</div>
      </div>
    </div>
  );


});

export default InvoiceTemplate;
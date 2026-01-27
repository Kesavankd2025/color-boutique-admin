import React from "react";
import { ProductQRCode } from "../utils/qr";

const InvoiceTemplate = ({ orderData, InvoiceData }) => {
  if (!orderData) return null;
  console.log(InvoiceData, "InvoiceDataInvoiceDataInvoiceData");
  // Style constants
  const thStyle = {
    border: "1px solid #000",
    fontWeight: "bold",
  };

  const tdStyle = {
    borderLeft: "1px solid #000",
    borderRight: "1px solid #000",
    padding: "2px",
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  const formatCurrency = (amount) => {
    return parseFloat(amount || 0)?.toFixed(2);
  };

  const getAmountInWords = (num) => {
    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    function convertLessThanOneThousand(num) {
      if (num === 0) return "";
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100)
        return (
          tens[Math.floor(num / 10)] +
          (num % 10 !== 0 ? " " + ones[num % 10] : "")
        );
      return (
        ones[Math.floor(num / 100)] +
        " Hundred" +
        (num % 100 !== 0 ? " and " + convertLessThanOneThousand(num % 100) : "")
      );
    }

    if (num === 0) return "Zero Rupees Only";
    let result = "";
    if (Math.floor(num / 10000000) > 0) {
      result +=
        convertLessThanOneThousand(Math.floor(num / 10000000)) + " Crore ";
      num %= 10000000;
    }
    if (Math.floor(num / 100000) > 0) {
      result += convertLessThanOneThousand(Math.floor(num / 100000)) + " Lakh ";
      num %= 100000;
    }
    if (Math.floor(num / 1000) > 0) {
      result +=
        convertLessThanOneThousand(Math.floor(num / 1000)) + " Thousand ";
      num %= 1000;
    }
    if (num > 0) {
      result += convertLessThanOneThousand(num);
    }
    return result + " Rupees Only";
  };

  // Extract data from order
  const {
    orderCode = "",
    createdAt = "",
    shippingAddress = {},
    user = {},
    items = [],
    products = [],
    breakdown = {},
    paymentMode = "",
    invoiceId = "",
    discount: orderDiscount = 0,
    // itemDiscount,
    totalDiscount,
    gstNumber,
  } = orderData.data || orderData;

  const {
    subTotal = 0,
    discount = 0,
    roundoff = 0,
    subtotalAfterDiscount = 0,
    tax = 0,
    shippingCharge = 0,
    total = 0,
  } = breakdown;
  const totalGross = subTotal + tax;
  const totalSubTotal = subtotalAfterDiscount + tax;
  const itemDiscounts = items.reduce(
    (total, item) => total + (item.discount || 0),
    0
  );
  const lessFrightChargee = totalDiscount;
  const overAllDiscount = itemDiscounts + lessFrightChargee;
  // Calculate tax breakdown for the new GST table
  const taxGroups = items.reduce((acc, item, index) => {
    const product = products[index] || {};
    const taxRate = item.taxRate || 0;

    if (!acc[taxRate]) {
      acc[taxRate] = { totalAmount: 0, totalTax: 0, count: 0 };
    }

    const itemTotal =
      (item.unitPrice || 0) * (item.quantity || 0) - item.discount;

    const itemDiscount = item.discount;
    const taxableAmount = itemTotal;
    const taxAmount = (taxableAmount * taxRate) / 100;
    const priceBeforeTax = taxableAmount - taxAmount;

    acc[taxRate].totalAmount += priceBeforeTax;
    acc[taxRate].totalTax += taxAmount;
    acc[taxRate].count += 1;

    return acc;
  }, {});

  // Calculate total item discounts
  // const totalItemDiscounts = items.reduce((total, item) => {
  //   const itemTotal = (item.unitPrice || 0) * (item.quantity || 0);
  //   const itemDiscount = ((item.discount || 0) / 100) * itemTotal;
  //   return total + itemDiscount;
  // }, 0);

  // Map products with their details
  const productDetails = items.map((item, index) => {
    const product = products[index] || {};
    const taxRate = product.taxRate || item.taxRate || 0;
    const itemTotal = item.unitPrice * item.quantity;
    const itemDiscount = item.discount;
    const taxableAmount = itemTotal - itemDiscount;
    const taxAmount = taxableAmount * (taxRate / 100);

    return {
      ...item,
      ...product,
      index: index + 1,
      itemTotal: itemTotal,
      itemDiscount: itemDiscount,
      taxAmount: taxAmount,
    };
  });

  // Calculate total weight
  const totalWeight = productDetails.reduce((total, product) => {
    return total + (product.quantity || 0);
  }, 0);

  const calculateItemsPerPage = () => {
    const footerHeight = 120;
    const headerHeight = 40;
    const customerDetailsHeight = 15;
    const pageHeight = 210;
    const availableHeight =
      pageHeight - headerHeight - customerDetailsHeight - footerHeight;
    const rowHeight = 3.2;
    return Math.max(1, Math.floor(availableHeight / rowHeight) - 1);
  };

  const itemsPerPage = calculateItemsPerPage();
  const totalPages = Math.ceil(productDetails.length / itemsPerPage);
  const lastPageCount = productDetails.length % itemsPerPage || itemsPerPage;

  // If last page is full OR last page has too few rows left for footer → push footer to new page
  const needsExtraPage =
    lastPageCount === itemsPerPage || lastPageCount > itemsPerPage - 2;

  // Function to render a single page
  const renderPage = (pageNumber, isFooterOnlyPage = false) => {
    const startIndex = pageNumber * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, productDetails.length);
    const pageProducts = productDetails.slice(startIndex, endIndex);

    const emptyRows = itemsPerPage - pageProducts.length;

    // If this is the last "real" page of products
    let isLastPage = pageNumber === totalPages - 1 && !isFooterOnlyPage;

    // If no empty space is left (products filled the page fully),
    // skip footer on this page and push it to a new page
    if (isLastPage && (emptyRows === 0 || emptyRows < 2)) {
      isLastPage = false; // force footer onto a new page
    }

    console.log(pageProducts, "pageProducts");

    return (
      <div
        key={pageNumber}
        style={{
          width: "148mm",
          height: "210mm",
          margin: "0 auto",
          padding: "3mm",
          fontFamily: "Arial",
          backgroundColor: "white",
          fontSize: "8px",
          lineHeight: "1.4",
          boxSizing: "border-box",
          border: "2px solid #000",
          pageBreakAfter: "always",
          position: "relative",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBottom: "5px",
            marginBottom: "8px",
            borderBottom: "1px solid #000",
            flexShrink: 0,
          }}
        >
          {/* Left: Company Logo */}
          <div style={{ width: "25%", textAlign: "left" }}>
            <img
              src="/assets/images/logo/ramesh-traders-logo-invoice.jpg"
              alt="Company Logo"
              style={{
                height: "70px",
                width: "160px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Center: Company Details */}
          <div style={{ textAlign: "center", width: "50%" }}>
            <div
              style={{
                fontSize: "14px",
                fontWeight: "bold",
                marginBottom: "3px",
              }}
            >
              RAMESH TRADERS
            </div>
            <div style={{ fontSize: "9px", lineHeight: "1.3" }}>
              <div>442-A.V.G. COMPLEX, RANGAI GOWDER STREET,</div>
              <div>COIMBATORE - 641001</div>
              <div>
                <strong>GSTIN:</strong> 33AAFFR5104D1ZS
              </div>
              <div>
                <strong>Ph:</strong> 7550223510 / 3511 / 3512 / 3513
              </div>
            </div>
          </div>

          {/* Right: FSSAI */}
          <div style={{ width: "25%", textAlign: "right", fontSize: "9px" }}>
            <img
              src="/assets/images/logo/fssi-logo.png"
              alt="FSSAI Logo"
              style={{
                height: "40px",
                width: "70px",
                objectFit: "contain",
                marginBottom: "3px",
              }}
            />
            <div>
              <strong>FSSAI: 12419003002919</strong>
            </div>
          </div>
        </div>
        {/* Customer Details */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "start",
            gap: "5px",
            border: "1px solid #000",
            padding: "10px",
            marginBottom: "10px",
            fontSize: "10px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "8px 12px",
              fontSize: "10px",
            }}
          >
            {/* COLUMN 1 */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div>
                <strong>Name:</strong>{" "}
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {shippingAddress.contactName || "N/A"}
                </span>
              </div>
              <div>
                <strong>Address:</strong>{" "}
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {shippingAddress.street || "N/A"}
                </span>
              </div>
              <div>
                <strong>Ph:</strong>{" "}
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {shippingAddress.contactNumber || "N/A"}
                </span>
              </div>
              <div>
                <strong>GSTIN:</strong>{" "}
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {shippingAddress.gstin || gstNumber || "N/A"}
                </span>
              </div>
              {InvoiceData && (
                <>
                  <div>
                    <strong>ACK NO:</strong>{" "}
                    <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                      {InvoiceData?.AckNo || "N/A"}
                    </span>
                  </div>
                  <div>
                    <strong>ACK Date:</strong>{" "}
                    <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                      {InvoiceData?.AckDt || "N/A"}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "4px" }}
            >
              <div>
                <strong>Inv. No:</strong>{" "}
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {invoiceId || orderCode}
                </span>
              </div>
              <div>
                <strong>Bill Date:</strong>{" "}
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {formatDate(createdAt)}
                </span>
              </div>
              <div>
                <strong>Bill Type:</strong>{" "}
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {paymentMode}
                </span>
              </div>
              <div>
                <strong>Area:</strong>{" "}
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {shippingAddress.city || "N/A"}
                </span>
              </div>
              <div>
                <strong>Order BY:</strong>{" "}
                <span style={{ fontWeight: "bold", fontSize: "11px" }}>
                  {user?.name || "N/A"}
                </span>
              </div>
            </div>
          </div>
          {InvoiceData && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "5px",
              }}
            >
              <ProductQRCode
                productUrl={InvoiceData?.SignedQRCode}
                size={100}
              />
            </div>
          )}
        </div>

        {/* Products Table */}
        <div style={{ marginBottom: "10px", flexGrow: 1, overflow: "hidden" }}>
          <table
            className="gstTable"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "9px",
              border: "1px solid #000",
              tableLayout: "fixed",
              height: "100%",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f0f0f0",
                  borderBottom: "1px solid #000",
                }}
              >
                <th style={{ ...thStyle, width: "6%" }}>S.No</th>
                <th style={{ ...thStyle, width: "28%", textAlign: "left" }}>
                  Product
                </th>
                <th style={{ ...thStyle, width: "9%" }}>HSN</th>
                <th style={{ ...thStyle, width: "7%" }}>GST</th>
                <th style={{ ...thStyle, width: "7%" }}>Pack</th>
                <th style={{ ...thStyle, width: "7%" }}>BQty</th>
                <th style={{ ...thStyle, width: "7%" }}>LQty</th>
                <th style={{ ...thStyle, width: "9%" }}>Rate</th>
                <th style={{ ...thStyle, width: "7%" }}>Disc</th>
                <th style={{ ...thStyle, width: "11%" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {pageProducts.map((product, index) => (
                <tr key={index}>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {product.index}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "left",
                      fontWeight: "bold",
                      fontSize: "10px",
                    }}
                  >
                    {product.productName}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {product.hsn || "N/A"}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {product.taxRate}%
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {product?.packingType?.toUpperCase()}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "10px",
                    }}
                  >
                    {product.fullPacks}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "10px",
                    }}
                  >
                    {product.looseKg?.toFixed(2)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {formatCurrency(product.unitPrice)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {product.discount}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "10px",
                    }}
                  >
                    {formatCurrency(product.itemTotal)}
                  </td>
                </tr>
              ))}
              {[...Array(emptyRows)].map((_, index) => (
                <tr key={`empty-${index}`} style={{ height: "12px" }}>
                  {Array(10)
                    .fill(null)
                    .map((_, i) => (
                      <td key={i} style={tdStyle}></td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer only on last real page or footer-only page */}
        {((isLastPage && !needsExtraPage) || isFooterOnlyPage) && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "9px",
              border: "1px solid #000",
              padding: "5px",
              gap: "5px",
              flexShrink: 0,
            }}
          >
            {/* Left Column */}
            <div style={{ width: "50%" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Total Items: {productDetails.length}</strong>
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>
                  Total Weight:{" "}
                  {orderData.totalWeight || totalWeight.toFixed(2)} kg
                </strong>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <div>
                  <strong>Amount in Words:</strong>
                </div>
                <div>{getAmountInWords(total)}</div>
              </div>

              {/* New GST Table */}
              <div style={{ marginBottom: "8px" }}>
                <table
                  className="gstTable"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "8px",
                    border: "1px solid #000",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f5f5f5" }}>
                      <th style={{ ...thStyle, padding: "2px" }}>GST%</th>
                      <th style={{ ...thStyle, padding: "2px" }}>Sale Amt</th>
                      <th style={{ ...thStyle, padding: "2px" }}>GST</th>
                      <th style={{ ...thStyle, padding: "2px" }}>CGST</th>
                      <th style={{ ...thStyle, padding: "2px" }}>SGST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(taxGroups)
                      .filter(([rate]) => parseFloat(rate) > 0)
                      .map(([rate, data]) => {
                        const gstRate = parseFloat(rate);
                        const saleAmount = data.totalAmount;
                        const totalGst = data.totalTax;
                        const cgst = totalGst / 2;
                        const sgst = totalGst / 2;

                        return (
                          <tr key={`tax-${gstRate}`}>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "center",
                                padding: "2px",
                              }}
                            >
                              {gstRate}%
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                padding: "2px",
                              }}
                            >
                              ₹{formatCurrency(saleAmount)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                padding: "2px",
                              }}
                            >
                              ₹{formatCurrency(totalGst)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                padding: "2px",
                              }}
                            >
                              ₹{formatCurrency(cgst)}
                            </td>
                            <td
                              style={{
                                ...tdStyle,
                                textAlign: "right",
                                padding: "2px",
                              }}
                            >
                              ₹{formatCurrency(sgst)}
                            </td>
                          </tr>
                        );
                      })}
                    {Object.keys(taxGroups).filter(
                      (rate) => parseFloat(rate) > 0
                    ).length === 0 && (
                      <tr>
                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "center",
                            padding: "2px",
                          }}
                        >
                          0%
                        </td>
                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          ₹{formatCurrency(subTotal)}
                        </td>
                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          ₹0.00
                        </td>
                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          ₹0.00
                        </td>
                        <td
                          style={{
                            ...tdStyle,
                            textAlign: "right",
                            padding: "2px",
                          }}
                        >
                          ₹0.00
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div style={{ marginBottom: "5px" }}>
                <div>
                  <strong>Bank: HDFC BANK</strong>
                </div>
                <div>
                  <strong>A/C No:</strong> 50200065787602
                </div>
                <div>
                  <strong>IFSC:</strong> HDFC0002407
                </div>
              </div>

              <div style={{ fontSize: "7px" }}>
                <div>Any Legal dispute solved by 1996 Arbitration act</div>
                <div>in coimbatore jurisdiction only.</div>
                <div>
                  <strong>Declaration:</strong> We declare that this invoice
                  shows the actual price of
                </div>
                <div>the goods and all particulars are true and correct.</div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ width: "40%" }}>
              <div style={{ textAlign: "right", marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span>Total Amount (Gross) :</span>
                  <span>₹{formatCurrency(totalGross)}</span>
                </div>

                {/* Item Discounts */}
                {/* {itemDiscounts > 0 && ( */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span>Item Discounts :</span>
                  <span>-₹{formatCurrency(itemDiscounts)}</span>
                </div>
                {/* )} */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span>Sub Total :</span>
                  <span>₹{formatCurrency(totalSubTotal)}</span>
                </div>
                {/* Order Discount */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span>Fright :</span>
                  <span>₹{formatCurrency(shippingCharge)}</span>
                </div>
                {lessFrightChargee > 0 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "2px",
                    }}
                  >
                    <span>Less Fright :</span>
                    <span>-₹{formatCurrency(lessFrightChargee)}</span>
                  </div>
                )}

                {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span>Total Tax Amt :</span>
                  <span>₹{formatCurrency(tax)}</span>
                </div> */}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "2px",
                  }}
                >
                  <span>Round Off :</span>
                  <span>₹{formatCurrency(roundoff)}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: "1px solid #000",
                    paddingTop: "3px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    marginTop: "5px",
                  }}
                >
                  <span>Net Amount :</span>
                  <span>₹{formatCurrency(total)}</span>
                </div>
                <div style={{ textAlign: "right", marginTop: "3px" }}>
                  <strong>for RAMESH TRADERS</strong>
                </div>
              </div>

              {/* QR Code */}
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  border: "1px solid #000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "5px auto",
                }}
              >
                <img
                  src="/assets/images/logo/RT-QR.jpg"
                  alt="QR Code"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "15px",
                  paddingTop: "15px",
                  fontSize: "10px",
                }}
              >
                <div style={{ textAlign: "left" }}>RECEIVER SIGN</div>
                <div style={{ textAlign: "right" }}>
                  <strong>Authorized Signatory</strong>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Page number */}
        <div
          style={{
            textAlign: "center",
            marginTop: "5px",
            fontSize: "9px",
            flexShrink: 0,
          }}
        >
          Page {pageNumber + 1} of {totalPages + (needsExtraPage ? 1 : 0)}
        </div>
      </div>
    );
  };

  return (
    <div style={{ fontFamily: "Arial" }}>
      {Array.from({ length: totalPages }, (_, i) => renderPage(i))}
      {needsExtraPage && renderPage(totalPages, true)}{" "}
      {/* extra empty page for footer */}
    </div>
  );
};

export default InvoiceTemplate;

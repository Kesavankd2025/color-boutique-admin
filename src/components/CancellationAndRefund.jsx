import React from 'react';
import { Link } from 'react-router-dom';
import './CancellationRefunds.css';

const CancellationRefunds = () => {
  return (
    <div className="cancellation-refunds-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-sm">
              <div className="card-header bg-white py-4">
                <div className="text-center mb-4">
                  <Link to="/" className="d-block auth-logo">
                    <img
                      src="/assets/images/logo/ramesh-traders-logo.jpg"
                      alt="Ramesh Traders Logo"
                      height="80"
                      className="img-fluid"
                      style={{width:"100px"}}
                    />
                  </Link>
                </div>
                <h1 className="text-center h2 mb-3">Cancellation and Refunds Policy</h1>
                <p className="text-muted text-center mb-0">
                  {/* Effective Date: {new Date().toLocaleDateString()} */}
                </p>
              </div>
              <div className="card-body p-5">
                <div className="cancellation-content">
                  <p className="lead">
                    At Ramesh Traders, we strive to ensure complete customer satisfaction. This policy outlines the terms and conditions for order cancellations and refunds. Please read this policy carefully before making a purchase.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">1. Order Cancellation</h2>
                  <p>
                    You can cancel your order under the following circumstances:
                  </p>
                  <ul>
                    <li><strong>Before Shipment:</strong> Orders can be cancelled free of charge if the cancellation request is made before the order is processed for shipping.</li>
                    <li><strong>After Shipment:</strong> Once the order has been shipped, cancellation is not possible. In this case, you can choose to return the product after delivery as per our return policy.</li>
                  </ul>
                  <p>
                    To cancel an order, please contact our customer support team with your order details at <strong>support@Ramesh Traders.com</strong> or call us at <strong>(+91) 98765 43210</strong>.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">2. Eligibility for Refunds</h2>
                  <p>
                    Refunds are issued in the following cases:
                  </p>
                  <ul>
                    <li>Product received is damaged, defective, or incorrect</li>
                    <li>Return of the product as per our return policy</li>
                    <li>Order cancellation before shipment</li>
                    <li>Non-delivery of the product due to reasons attributable to Ramesh Traders or our shipping partners</li>
                  </ul>
                  <p>
                    Note: Refunds are not provided for products that are damaged due to misuse, normal wear and tear, or if the product is not in the same condition as when delivered.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">3. Return Process</h2>
                  <p>
                    To initiate a return, please follow these steps:
                  </p>
                  <ol>
                    <li>Contact our customer support within <strong>7 days</strong> of delivery to request a return</li>
                    <li>Provide your order number and details of the issue</li>
                    <li>Our team will verify the eligibility and provide a Return Authorization Number</li>
                    <li>Package the product securely in its original packaging with all accessories</li>
                    <li>Ship the product to the address provided by our customer support team</li>
                  </ol>
                  <p>
                    Once we receive and inspect the returned product, we will process your refund within 5-7 business days.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">4. Refund Methods</h2>
                  <p>
                    Refunds are processed using the original payment method:
                  </p>
                  <div className="table-responsive mt-4">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Payment Method</th>
                          <th>Refund Processing Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Credit/Debit Card</td>
                          <td>7-10 business days</td>
                        </tr>
                        <tr>
                          <td>Net Banking</td>
                          <td>5-7 business days</td>
                        </tr>
                        <tr>
                          <td>UPI</td>
                          <td>3-5 business days</td>
                        </tr>
                        <tr>
                          <td>Wallet Payments</td>
                          <td>24-48 hours</td>
                        </tr>
                        <tr>
                          <td>Cash on Delivery (COD)</td>
                          <td>Bank transfer (provided bank details required)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3">
                    <strong>Note:</strong> The refund processing time may vary depending on your bank's policies. The amount will be credited to the original source of payment.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">5. Non-Returnable Products</h2>
                  <p>
                    Certain products cannot be returned or exchanged for hygiene and safety reasons:
                  </p>
                  <ul>
                    <li>Perishable goods (food items, flowers, etc.)</li>
                    <li>Personal care products</li>
                    <li>Items marked as "Non-returnable" on the product page</li>
                    <li>Products with tampered or missing serial numbers/UPCs</li>
                    <li>Digital products and software</li>
                    <li>Products with damaged packaging due to customer mishandling</li>
                  </ul>
                  
                  <h2 className="h4 mt-5 mb-3">6. Partial Refunds</h2>
                  <p>
                    Partial refunds may be issued in certain cases:
                  </p>
                  <ul>
                    <li>If only part of your order is returned</li>
                    <li>If the product has minor defects that don't significantly affect its functionality</li>
                    <li>If the original packaging is missing or damaged</li>
                    <li>For bundled products, if only some items from the bundle are returned</li>
                  </ul>
                  
                  <h2 className="h4 mt-5 mb-3">7. Exchange Policy</h2>
                  <p>
                    We offer exchanges for products in the following cases:
                  </p>
                  <ul>
                    <li>Size/color exchanges for apparel and footwear</li>
                    <li>Defective products replaced with the same product</li>
                    <li>Wrong product delivered</li>
                  </ul>
                  <p>
                    Exchanges are subject to product availability. If the desired product is not available, we will issue a refund.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">8. Shipping Charges for Returns</h2>
                  <p>
                    Return shipping charges are handled as follows:
                  </p>
                  <ul>
                    <li><strong>Free Returns:</strong> We provide free return shipping for defective, damaged, or incorrect products</li>
                    <li><strong>Customer-Paid Returns:</strong> For returns due to change of mind or wrong size/color selection, the customer bears the return shipping cost</li>
                    <li><strong>Pickup Services:</strong> In major cities, we offer pickup services for returns at no additional cost</li>
                  </ul>
                  
                  <h2 className="h4 mt-5 mb-3">9. Timeframe for Refunds</h2>
                  <p>
                    The complete refund process typically takes:
                  </p>
                  <ul>
                    <li><strong>Return Processing:</strong> 1-2 business days after we receive the returned product</li>
                    <li><strong>Refund Initiation:</strong> Within 24 hours of return approval</li>
                    <li><strong>Amount Credit:</strong> As per the payment method timelines mentioned above</li>
                  </ul>
                  <p>
                    You will receive email notifications at each stage of the refund process.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">10. Contact Us</h2>
                  <p>
                    For any questions regarding cancellations, returns, or refunds, please contact our customer service team:
                  </p>
                  <div className="contact-info mt-4 p-4 bg-light rounded">
                    <p className="mb-2">
                      <strong>Email:</strong> support@Ramesh Traders.com
                    </p>
                    <p className="mb-2">
                      <strong>Phone:</strong> (+91) 98765 43210
                    </p>
                    <p className="mb-0">
                      <strong>Hours:</strong> Monday to Saturday, 9:00 AM to 6:00 PM IST
                    </p>
                  </div>
                  
                  <div className="alert alert-info mt-4">
                    <strong>Note:</strong> This cancellation and refunds policy is subject to change without prior notice. Please check back periodically for updates.
                  </div>
                </div>
                
                <div className="text-center mt-5">
                  <Link to="/" className="btn btn-primary">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-4 py-3">
              <div className="footer-links mb-2">
                <Link to="/terms-and-conditions" className="text-muted text-decoration-none mx-2">
                  Terms and Conditions
                </Link>
                <span className="text-muted">|</span>
                <Link to="/privacy-policy" className="text-muted text-decoration-none mx-2">
                  Privacy Policy
                </Link>
                <span className="text-muted">|</span>
                <Link to="/shipping-policy" className="text-muted text-decoration-none mx-2">
                  Shipping Policy
                </Link>
                <span className="text-muted">|</span>
                <Link to="/contact-us" className="text-muted text-decoration-none mx-2">
                  Contact Us
                </Link>
                <span className="text-muted">|</span>
                <Link to="/cancellation-refunds" className="text-dark text-decoration-none mx-2 fw-bold">
                  Cancellation and Refunds
                </Link>
              </div>
              
              <p className="text-muted mb-0">
                © {new Date().getFullYear()} Ramesh Traders. All Rights Reserved. Developed &amp; Maintained
                By Ocean Softwares
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefunds;
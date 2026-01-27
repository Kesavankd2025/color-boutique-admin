import React from 'react';
import { Link } from 'react-router-dom';
import './ShippingPolicy.css';

const ShippingPolicy = () => {
    return (
        <div className="shipping-policy-page">
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
                                            style={{ width: "100px" }} />
                                    </Link>
                                </div>
                                <h1 className="text-center h2 mb-3">Shipping Policy</h1>
                                <p className="text-muted text-center mb-0">
                                    {/* Effective Date: {new Date().toLocaleDateString()} */}
                                </p>
                            </div>
                            <div className="card-body p-5">
                                <div className="shipping-content">
                                    <p className="lead">
                                        At Ramesh Traders, we are committed to delivering your orders in a timely and efficient manner. This Shipping Policy outlines our processes, timelines, and responsibilities regarding order fulfillment and delivery.
                                    </p>

                                    <h2 className="h4 mt-5 mb-3">1. Order Processing</h2>
                                    <p>
                                        All orders are processed within <strong>1-2 business days</strong> (Monday to Friday, excluding public holidays) after payment verification. Orders placed after 2:00 PM IST or on weekends will be processed on the next business day.
                                    </p>
                                    <p>
                                        Once your order is processed, you will receive a confirmation email with your order details and tracking information when available.
                                    </p>

                                    <h2 className="h4 mt-5 mb-3">2. Shipping Methods & Carriers</h2>
                                    <p>
                                        We partner with reputable shipping carriers to ensure your orders are delivered safely and efficiently. Our primary shipping partners include:
                                    </p>
                                    <ul>
                                        <li>India Post</li>
                                        <li>Delhivery</li>
                                        <li>Blue Dart</li>
                                        <li>DTDC</li>
                                        <li>Ecom Express</li>
                                    </ul>
                                    <p>
                                        The carrier used for your shipment will depend on your location and the nature of the products ordered.
                                    </p>

                                    <h2 className="h4 mt-5 mb-3">3. Shipping Destinations</h2>
                                    <p>
                                        We currently ship to all major cities and towns across India. We are also expanding our services to include international shipping to select countries. Please contact our customer service for international shipping inquiries.
                                    </p>
                                    <p>
                                        Some remote locations may have limited shipping options or require additional delivery time.
                                    </p>

                                    <h2 className="h4 mt-5 mb-3">4. Shipping Timeframes</h2>
                                    <p>
                                        Estimated delivery times vary based on your location:
                                    </p>
                                    <div className="table-responsive mt-4">
                                        <table className="table table-bordered">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Destination</th>
                                                    <th>Estimated Delivery Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Metro Cities (Delhi, Mumbai, Bangalore, etc.)</td>
                                                    <td>3-5 business days</td>
                                                </tr>
                                                <tr>
                                                    <td>Tier 2 Cities</td>
                                                    <td>5-7 business days</td>
                                                </tr>
                                                <tr>
                                                    <td>Tier 3 Cities & Towns</td>
                                                    <td>7-10 business days</td>
                                                </tr>
                                                <tr>
                                                    <td>Remote Areas</td>
                                                    <td>10-14 business days</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="mt-3">
                                        <strong>Note:</strong> These are estimated timeframes and actual delivery may vary due to factors beyond our control such as weather conditions, transportation delays, or customs clearance for international orders.
                                    </p>

                                    <h2 className="h4 mt-5 mb-3">5. Shipping Costs</h2>
                                    <p>
                                        Shipping costs are calculated based on the following factors:
                                    </p>
                                    <ul>
                                        <li>Delivery destination</li>
                                        <li>Package weight and dimensions</li>
                                        <li>Shipping speed selected</li>
                                    </ul>
                                    <p>
                                        Free shipping is available on orders above ₹999. For orders below this amount, shipping charges will be applied at checkout based on your location.
                                    </p>

                                    <h2 className="h4 mt-5 mb-3">6. Order Tracking</h2>
                                    <p>
                                        Once your order is shipped, you will receive a confirmation email with a tracking number and a link to track your package. You can also track your order by logging into your account on our website.
                                    </p>
                                    <p>
                                        If you experience any issues with tracking your order, please contact our customer support team for assistance.
                                    </p>

                                    <h2 className="h4 mt-5 mb-3">7. Delivery Issues</h2>
                                    <p>
                                        In the event that your order is delayed, lost, or damaged during transit, please contact us immediately. We will work with the shipping carrier to resolve the issue promptly.
                                    </p>
                                    <p>
                                        Common delivery issues and our response:
                                    </p>
                                    <ul>
                                        <li><strong>Failed Delivery Attempts:</strong> If the carrier attempts delivery but is unsuccessful, they will typically try again or leave a notification. Please follow the instructions on the notification.</li>
                                        <li><strong>Incorrect Address:</strong> Please ensure your shipping address is correct at the time of order placement. We are not responsible for orders shipped to incorrect addresses provided by customers.</li>
                                        <li><strong>Refused Delivery:</strong> If you refuse delivery of your order, you will be responsible for the return shipping charges and any restocking fees.</li>
                                    </ul>

                                    <h2 className="h4 mt-5 mb-3">8. International Shipping</h2>
                                    <p>
                                        For international orders, please note:
                                    </p>
                                    <ul>
                                        <li>Additional customs fees, import duties, or taxes may apply and are the responsibility of the recipient.</li>
                                        <li>International delivery times may vary significantly based on destination country and customs processing.</li>
                                        <li>Some products may not be available for international shipping due to regulatory restrictions.</li>
                                    </ul>

                                    <h2 className="h4 mt-5 mb-3">9. Shipping Restrictions</h2>
                                    <p>
                                        Certain items may have special shipping requirements or restrictions:
                                    </p>
                                    <ul>
                                        <li>Fragile items require special packaging and handling</li>
                                        <li>Perishable goods have limited shipping options and shorter delivery windows</li>
                                        <li>High-value items may require signature confirmation upon delivery</li>
                                    </ul>

                                    <h2 className="h4 mt-5 mb-3">10. Contact Us</h2>
                                    <p>
                                        If you have any questions about our shipping policy or need assistance with an order, please contact our customer service team:
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
                                        <strong>Note:</strong> This shipping policy is subject to change without prior notice. Please check back periodically for updates.
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
                                <Link to="/shipping-policy" className="text-dark text-decoration-none mx-2 fw-bold">
                                    Shipping Policy
                                </Link>
                                <span className="text-muted">|</span>
                                <Link to="/contact-us" className="text-muted text-decoration-none mx-2">
                                    Contact Us
                                </Link>
                                <span className="text-muted">|</span>
                                <Link to="/cancellation-refunds" className="text-muted text-decoration-none mx-2">
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

export default ShippingPolicy;
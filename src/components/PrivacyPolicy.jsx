import React from 'react';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-sm">
              <div className="card-header bg-white py-4">
                <div className="text-center mb-4">
                  <Link to="/" className="d-block auth-logo">
                    <img
                      src="/assets/images/logo/ramesh-traders-logo.jpg"
                      alt="Nalsuvai Logo"
                      height="50"
                      className="img-fluid"
                      style={{height:"100px"}}
                    />
                  </Link>
                </div>
                <h1 className="text-center h2 mb-3">Privacy Policy</h1>
                <p className="text-muted text-center mb-0">
                  {/* Last Updated: {new Date().toLocaleDateString()} */}
                </p>
              </div>
              <div className="card-body p-5">
                <div className="privacy-content">
                  <p className="lead">
                    This Privacy Policy outlines in detail how Nalsuvai (“we”, “us”, or “our”), a trader and commerce-focused business, collects, utilizes, discloses, and protects your personal information when you visit or interact with our website, make a purchase, or otherwise use any of our services (collectively referred to as the “Services”).
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">Changes to This Privacy Policy</h2>
                  <p>
                    We reserve the right to update, amend, or revise this Privacy Policy periodically in order to reflect changes in our operations, technological advancements, regulatory requirements, or for any other business-related purposes. Any changes we make to this policy will be posted on our Site along with a new effective date at the top of the document. We encourage you to review this Privacy Policy regularly to stay informed about how we handle your personal data. Your continued use of the Services following any updates indicates your acceptance of those changes.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">How We Collect and Use Your Personal Information</h2>
                  <p>
                    To facilitate the smooth operation of our business and deliver quality services and support to our customers, we collect personal data from various sources and for a number of legitimate reasons. These may include direct interactions you have with us, automated technologies, and third-party vendors or platforms. We may collect personal data when you make inquiries, place orders, sign up for an account, browse our website, or engage in customer support activities.
                  </p>
                  <p>
                    We utilize the collected data to:
                  </p>
                  <ul>
                    <li>Fulfill orders and deliver products or services you request</li>
                    <li>Communicate order status, shipping updates, or returns</li>
                    <li>Improve the quality and usability of our website and services</li>
                    <li>Manage our internal records and ensure proper business operation</li>
                    <li>Prevent fraud, enhance security, and comply with legal requirements</li>
                  </ul>
                  
                  <h2 className="h4 mt-5 mb-3">What Personal Information We Collect</h2>
                  <p>
                    Depending on how you engage with our Site and Services, we may collect the following types of personal data:
                  </p>
                  
                  <h3 className="h5 mt-4 mb-3">Information Provided Directly by You</h3>
                  <p>
                    This includes information you intentionally provide when you:
                  </p>
                  <ul>
                    <li>Fill out contact forms</li>
                    <li>Place an order</li>
                    <li>Create an account</li>
                    <li>Communicate with our support team</li>
                  </ul>
                  <p>Examples:</p>
                  <ul>
                    <li>Your full name, email address, physical address, and phone number</li>
                    <li>Order-specific data like product selections, billing and shipping information, and payment confirmation</li>
                    <li>Account details such as your username, password, and answers to security questions</li>
                    <li>Customer service interactions or feedback provided to us</li>
                  </ul>
                  
                  <h3 className="h5 mt-4 mb-3">Information Collected Automatically</h3>
                  <p>
                    When you use our Site, we automatically collect technical information related to your interaction, using tools such as cookies and tracking pixels.
                  </p>
                  <p>This data includes:</p>
                  <ul>
                    <li>IP address and general location</li>
                    <li>Browser type and version</li>
                    <li>Device identifiers and operating system</li>
                    <li>Pages visited, time spent, and navigation behavior on our Site</li>
                  </ul>
                  <p>
                    This helps us improve user experience, troubleshoot problems, and optimize our website's performance.
                  </p>
                  
                  <h3 className="h5 mt-4 mb-3">Information from Third Parties</h3>
                  <p>
                    We may receive relevant data about you from third-party services that help us operate effectively. These sources include:
                  </p>
                  <ul>
                    <li>Our website and eCommerce platform provider (e.g., Shopify)</li>
                    <li>Payment gateways (for processing secure payments)</li>
                    <li>Shipping and logistics providers</li>
                    <li>Marketing or advertising partners that assist with outreach and promotions</li>
                  </ul>
                  <p>
                    All third-party data is handled in accordance with this Privacy Policy and applicable law.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">How We Use Your Personal Information</h2>
                  <p>
                    We use your personal data for a variety of reasons aligned with business necessity and legal compliance. Key uses include:
                  </p>
                  
                  <h3 className="h5 mt-4 mb-3">To Fulfill Transactions and Deliver Services</h3>
                  <ul>
                    <li>Processing and confirming your orders</li>
                    <li>Packaging and delivering products to your designated address</li>
                    <li>Facilitating returns or replacements if needed</li>
                    <li>Sending order-related updates and status alerts</li>
                    <li>Managing your account and maintaining historical order data</li>
                  </ul>
                  
                  <h3 className="h5 mt-4 mb-3">For Communication Purposes</h3>
                  <ul>
                    <li>Providing customer support or answering your queries</li>
                    <li>Informing you of changes to our terms, conditions, or services</li>
                    <li>Sending follow-ups regarding feedback or complaints</li>
                  </ul>
                  
                  <h3 className="h5 mt-4 mb-3">For Marketing and Promotions</h3>
                  <ul>
                    <li>Sending promotional offers, newsletters, or new product announcements (with your consent)</li>
                    <li>Displaying personalized advertisements or content based on browsing behavior</li>
                    <li>Conducting surveys or special campaigns to enhance customer engagement</li>
                  </ul>
                  
                  <h3 className="h5 mt-4 mb-3">For Safety, Security, and Legal Compliance</h3>
                  <ul>
                    <li>Monitoring for suspicious activity or potential fraud</li>
                    <li>Ensuring account integrity and security</li>
                    <li>Meeting our obligations under applicable laws and regulations</li>
                  </ul>
                  
                  <h2 className="h4 mt-5 mb-3">Disclosure of Personal Information</h2>
                  <p>
                    We may share your information with trusted entities who help us deliver our Services effectively. These include:
                  </p>
                  
                  <div className="table-responsive mt-4">
                    <table className="table table-bordered">
                      <thead className="table-light">
                        <tr>
                          <th>Category of Data</th>
                          <th>Recipients</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Identifiers (name, contact info, account credentials)</td>
                          <td>Service providers, shipping companies, marketing partners</td>
                        </tr>
                        <tr>
                          <td>Order history and shopping data</td>
                          <td>Advertising networks, analytics providers</td>
                        </tr>
                        <tr>
                          <td>Technical interaction data (cookies, device IDs)</td>
                          <td>Web analytics and marketing platforms</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <p className="mt-4">
                    We do not share sensitive personal information for profiling or behavioral advertising purposes.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">User-Generated Content</h2>
                  <p>
                    Our website may allow you to leave product reviews, comments, or feedback. Any information you voluntarily submit to be viewed by others may be publicly visible and indexed by search engines. You are solely responsible for the content you post, and we cannot guarantee how it will be used by third parties. Please avoid sharing sensitive or private data in such areas.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">Third-Party Websites and External Links</h2>
                  <p>
                    From time to time, we may include hyperlinks on our Site that redirect you to external websites or platforms. These are provided for informational or commercial convenience. However, once you leave our Site, you are subject to that third party's privacy practices, which may differ from ours. We encourage you to read their privacy policies and terms before providing any data.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">Children's Privacy</h2>
                  <p>
                    Our services are designed for use by adults and are not intended for individuals under the age of 16. We do not knowingly collect personal information from minors. If we become aware that a child has submitted personal data without parental consent, we will take steps to delete such data promptly. Parents or legal guardians may contact us to request removal of such information.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">Security and Retention of Your Information</h2>
                  <p>
                    We employ commercially reasonable administrative, technical, and physical security measures to protect your personal information from loss, theft, unauthorized access, and misuse. However, no digital system is fully immune to breach or error.
                  </p>
                  <p>
                    We retain your personal data only for as long as necessary to fulfill our business purposes, satisfy legal obligations, or resolve disputes. Once it is no longer required, we securely delete or anonymize the data.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">Your Rights and Choices</h2>
                  <p>
                    Depending on your jurisdiction, you may have several rights concerning your personal data, such as:
                  </p>
                  <ul>
                    <li><strong>Access:</strong> Request a copy of your data and details on how it's used.</li>
                    <li><strong>Correction:</strong> Request updates to inaccurate or incomplete information.</li>
                    <li><strong>Deletion:</strong> Ask us to delete your personal data.</li>
                    <li><strong>Portability:</strong> Receive your data in a readable format or transfer it to another provider.</li>
                    <li><strong>Opt-Out:</strong> Say no to marketing emails or targeted advertising.</li>
                    <li><strong>Restrict Processing:</strong> Ask us to stop using your data for certain purposes.</li>
                    <li><strong>Withdraw Consent:</strong> Revoke consent for optional data uses at any time.</li>
                    <li><strong>Appeal:</strong> Appeal a denied request related to your data rights.</li>
                  </ul>
                  <p>
                    To exercise any of these rights, please contact us using the information provided in the "Contact" section below. We may ask for verification to confirm your identity before fulfilling your request.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">International Data Transfers</h2>
                  <p>
                    As part of our operations, your information may be stored and processed in countries outside of your own, including the United States or India. When we transfer your data internationally, we ensure appropriate safeguards are in place, such as standard contractual clauses approved by relevant authorities or equivalent measures.
                  </p>
                  
                  <h2 className="h4 mt-5 mb-3">Contact Us</h2>
                  <p>
                    If you have any questions about this Privacy Policy or would like to exercise your data rights, please contact us at:
                  </p>
                  <div className="contact-info mt-4 p-4 bg-light rounded">
                    <p className="mb-2">
                      <strong>Address:</strong> 102, Anna nagar, Coimbatore
                    </p>
                    <p className="mb-2">
                      <strong>Call Us:</strong> (+91) 98765 43221
                    </p>
                    <p className="mb-0">
                      <strong>Email:</strong>  support@Ramesh Traders.com
                    </p>
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
                <Link to="/privacy-policy" className="text-dark text-decoration-none mx-2 fw-bold">
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

export default PrivacyPolicy;
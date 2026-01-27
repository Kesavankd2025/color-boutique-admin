import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Thank you for your message. We will get back to you soon!');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-us-page">
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
                      style={{height:"100px"}}
                    />
                  </Link>
                </div>
                <h1 className="text-center h2 mb-3">Contact Us</h1>
                <p className="text-muted text-center mb-0">
                  We'd love to hear from you. Get in touch with us!
                </p>
              </div>
              <div className="card-body p-5">
                <div className="row">
                  {/* <div className="col-lg-6">
                    <div className="contact-info">
                      <h3 className="h4 mb-4">Get in Touch</h3>
                      
                      <div className="d-flex mb-4">
                        <div className="me-4">
                          <div className="icon-circle bg-primary text-white">
                            <i className="fas fa-map-marker-alt"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="h6">Address</h5>
                          <p className="text-muted mb-0">
                            442, A.V.G. COMPLEX,<br />
                            RANGAI GOWDER STREET,<br />
                            COIMBATORE - 641001
                          </p>
                        </div>
                      </div>
                      
                      <div className="d-flex mb-4">
                        <div className="me-4">
                          <div className="icon-circle bg-primary text-white">
                            <i className="fas fa-phone"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="h6">Phone Numbers</h5>
                          <p className="text-muted mb-0">
                            7550223510<br />
                            7550223511<br />
                            7550223512<br />
                            7550223513
                          </p>
                        </div>
                      </div>
                      
                      <div className="d-flex mb-4">
                        <div className="me-4">
                          <div className="icon-circle bg-primary text-white">
                            <i className="fas fa-envelope"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="h6">Email</h5>
                          <p className="text-muted mb-0">
                            info@rameshtraders.com<br />
                            support@rameshtraders.com
                          </p>
                        </div>
                      </div>
                      
                      <div className="d-flex">
                        <div className="me-4">
                          <div className="icon-circle bg-primary text-white">
                            <i className="fas fa-clock"></i>
                          </div>
                        </div>
                        <div>
                          <h5 className="h6">Business Hours</h5>
                          <p className="text-muted mb-0">
                            Monday - Saturday: 9:00 AM - 6:00 PM<br />
                            Sunday: Closed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className='col-lg-2'></div>
                  
                  <div className="col-lg-6">
                    <div className="contact-form">
                      <h3 className="h4 mb-4">Send us a Message</h3>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label">Full Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email Address</label>
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="phone" className="form-label">Phone Number</label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="subject" className="form-label">Subject</label>
                          <input
                            type="text"
                            className="form-control"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="message" className="form-label">Message</label>
                          <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            rows="4"
                            value={formData.message}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                        
                        <button type="submit" className="btn btn-primary w-100">
                          Send Message
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className='col-lg-2'></div>
                </div>
                
                <div className="mt-5">
                  <h3 className="h4 mb-4">Find Us on Map</h3>
                  <div className="map-container rounded shadow-sm">
                    <iframe
                      title="Ramesh Traders Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15665.218442027795!2d76.95565216977536!3d11.012599999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu%20641001!5e0!3m2!1sen!2sin!4v1661235760665!5m2!1sen!2sin"
                      width="100%"
                      height="300"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
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
                <Link to="/contact-us" className="text-dark text-decoration-none mx-2 fw-bold">
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

export default ContactUs;
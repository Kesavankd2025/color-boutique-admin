import React, { useState } from 'react';
import "./styles/LoginPageLayer.css"
import { useNavigate } from 'react-router-dom';
import apiProvider from '../apiProvider/api';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
import adminUserApi from '../apiProvider/adminuserapi';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';

export default function LoginPageLayer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phoneNumber: '',
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [formErrors, setFormErros] = useState({})
  // email:admin@rameshtraders.in
  // password:Ramesh@1490
  // Forgot password states
  const [forgotPasswordActive, setForgotPasswordActive] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    phoneNumber: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userId, setUserId] = useState("")
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormErros({})
    if (name === 'phoneNumber' && (value.length > 10 || !/^\d*$/.test(value))) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;

    // Validation based on field name
    if (name === 'phoneNumber' && (value.length > 10 || !/^\d*$/.test(value))) {
      return;
    }

    if ((name === 'newPassword' || name === 'confirmPassword') &&
      (value.length > 4 || !/^\d*$/.test(value))) {
      return;
    }

    if (name === 'otp' && (value.length > 6 || !/^\d*$/.test(value))) {
      return;
    }

    setForgotPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    let errors = {}
    // Basic validations
    if (!formData.email) {
      errors.email = ("Email is required");
      setFormErros(errors)
      return;
    }

    // Email format validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = ("Please enter a valid email address");
      setFormErros(errors)
      return;
    }

    if (!formData.password) {
      errors.password = ("Password is required");
      setFormErros(errors)
      return;
    }

    try {
      const response = await apiProvider.adminLogin({
        email: formData.email,
        password: formData.password,
      });

      if (response.status) {
        const token = response.data.data.token;
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const userData = await adminUserApi.Userbyid(userId);

        if (userData.status) {
          dispatch(login({ token: token, user: userData.response.data }));

          // Reset form
          setFormData({
            email: "",
            password: "",
            phoneNumber: "",
          });

          navigate("/dashboard");
        } else {
          alert("Failed to fetch user data.");
        }
      } else {
        alert("Login failed. Please check credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      // alert("Something went wrong. Please try again later.");
    }
  };


  const handleAdminUsersSubmit = async (e) => {
    e.preventDefault();
    let errors = {}
    if (formData.phoneNumber.length !== 10) {
      errors.phoneNumber = ("Please enter a valid 10-digit phone number");
      setFormErros(errors)
      return;
    }
    if (formData.password.length !== 4) {
      errors.password = ("PIN must be 4 digits");
      setFormErros(errors)
      return;
    }

    try {
      const response = await apiProvider.adminLogin({
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      if (response.status) {
        const token = response.data.data.token;
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const userData = await adminUserApi.Userbyid(userId);

        if (userData.status) {
          dispatch(login({ token: token, user: userData.response.data }));
          setFormData({
            email: '',
            password: '',
            phoneNumber: '',
          })
          navigate("/dashboard");
        } else {
          alert("Failed to fetch user data.");
        }
      } else {
        alert("Login failed. Please check phone number and PIN.");
      }
    } catch (error) {
      console.error("Login error:", error);
      // toast.error("Please enter the valid email & password")
    }
  };

  // Handle send OTP for forgot password
  const handleSendOtp = async () => {

    if (forgotPasswordData.phoneNumber.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    try {
      const response = await apiProvider.adminForgotPasword(forgotPasswordData.phoneNumber)
      console.log(response, "response")
      console.log(response?.response?.data?.data?.userId)
      if (response.status) {
        toast(response?.response?.data?.message)
        setUserId(response?.response?.data?.data?.userId)
        setTimeout(() => {
          // const otp = Math.floor(100000 + Math.random() * 900000).toString();
          setGeneratedOtp("1234");
          // console.log("Generated OTP:", otp);
          setOtpSent(true);
          alert(`OTP has been sent to ${forgotPasswordData.phoneNumber}. Check console for OTP.`);
        }, 2000);
      }
    } catch (error) {
      console.error("Login error:", error);
      // toast.error("Please enter the valid email & password")
    }
  };

  // Handle OTP verification
  const handleVerifyOtp = () => {
    if (forgotPasswordData.otp === generatedOtp) {
      setOtpVerified(true);
      alert("OTP verified successfully. You can now reset your PIN.");
    } else {
      alert("Invalid OTP. Please try again.");
    }
  };

  // Handle password reset
  const handleResetPassword = async () => {
    if (forgotPasswordData.newPassword.length !== 4) {
      alert("New PIN must be 4 digits");
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      alert("PINs do not match");
      return;
    }

    try {
      let input = {
        userId: userId,
        newPassword: forgotPasswordData.newPassword
      }
      const response = await apiProvider.changePassword(input)
      console.log(response, "response")
      console.log("Password reset data:", {
        phoneNumber: forgotPasswordData.phoneNumber,
        newPassword: forgotPasswordData.newPassword
      });

      alert("PIN reset successfully. You can now login with your new PIN.");

      // Reset the forgot password flow
      setForgotPasswordActive(false);
      setOtpSent(false);
      setOtpVerified(false);
      setForgotPasswordData({
        phoneNumber: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error("Password reset error:", error);
      alert("An error occurred while resetting your PIN. Please try again.");
    }
  };

  return (
    <div className="authentication-bg min-vh-100 colors-boutique-login">
      <div className="bg-overlay"></div>
      <div className="container">
        <div className="d-flex flex-column min-vh-100 px-3 pt-4">
          <div className="row justify-content-center my-auto">
            <div className="col-md-8 col-lg-6 col-xl-5">
              {/* Logo removed from here to place inside card */}

              <div className="card">
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <a href="index" className="d-block d-flex justify-content-center auth-logo">
                      <img
                        src="/assets/images/logo/Colors-logo.jpg"
                        alt="COLOURS BOUTIQUE"
                        height="80"
                        className="img auth-logo-dark"
                      />
                    </a>
                  </div>
                  <div className="card-header bg-transparent border-bottom-0 p-0 mb-4">
                    {!forgotPasswordActive ? (
                      <ul className="nav nav-tabs nav-tabs-custom nav-justified">
                        <li className="nav-item" style={{ display: "flex", justifyContent: "center" }}>
                          <button
                            className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                            onClick={() => {
                              toggleTab('admin');
                              setFormData({
                                email: '',
                                password: '',
                                phoneNumber: '',
                              })
                            }}
                          >
                            Admin
                          </button>
                        </li>
                        <li className="nav-item" style={{ display: "flex", justifyContent: "center" }}>
                          <button
                            className={`nav-link ${activeTab === 'adminUsers' ? 'active' : ''}`}
                            onClick={() => {
                              toggleTab('adminUsers');
                              setFormData({
                                email: '',
                                password: '',
                                phoneNumber: '',
                              })
                            }}
                          >
                            Admin User
                          </button>
                        </li>
                      </ul>
                    ) : (
                      <div className="text-center">
                        <h5>Reset Your PIN</h5>
                      </div>
                    )}
                  </div>
                  {/* End of card header section, still inside card-body */}


                  {!forgotPasswordActive ? (
                    <>
                      <div className="text-center mt-2">
                        <h5>Welcome Back!</h5>
                        <p className="text-muted">Sign in to continue to COLOURS BOUTIQUE.</p>
                      </div>

                      <div className="p-2 mt-4">
                        <form
                          onSubmit={handleAdminSubmit}
                          className={`auth-input ${activeTab === 'admin' ? '' : 'd-none'}`}
                          style={{
                            transition: 'all 0.3s ease',
                            opacity: isTransitioning ? 0 : 1,
                            transform: isTransitioning ? 'translateX(-20px)' : 'translateX(0)'
                          }}
                        >
                          <div className="mb-2">
                            <label htmlFor="email" className="form-label">
                              Email <span className="text-danger">*</span>
                            </label>
                            <input
                              id="email"
                              type="email"
                              className="form-control"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              autoComplete="email"
                              autoFocus
                            />
                            {formErrors.email ? <><p className='text-white'>{formErrors.email}</p></> : <></>}
                          </div>

                          <div className="mb-3">
                            {/* <div className="float-end">
                              <a
                                href="/password/reset"
                                className="text-muted text-decoration-underline"
                              >
                                Forgot password?
                              </a>
                            </div> */}
                            <label className="form-label" htmlFor="password-input">
                              Password <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative auth-pass-inputgroup input-custom-icon">
                              <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Enter password"
                                id="password-input"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                              />
                              {formErrors.password ? <><p className='text-white'>{formErrors.password}</p></> : <></>}
                              <button
                                type="button"
                                className="btn btn-link d-flex align-items-center justify-content-center position-absolute end-0 top-0 h-100 px-3"
                                id="password-addon"
                                onClick={togglePassword}
                                tabIndex={-1}
                              >
                                <i className={`mdi ${showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'} font-size-18 text-muted`}></i>
                              </button>
                            </div>
                          </div>

                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              name="remember"
                              id="remember"
                            />
                            <label className="form-check-label" htmlFor="remember">
                              Remember me
                            </label>
                          </div>

                          <div className="mt-4">
                            <button className="btn btn-primary w-100" type="submit">
                              Sign In
                            </button>
                          </div>
                        </form>

                        <form
                          onSubmit={handleAdminUsersSubmit}
                          className={`auth-input ${activeTab === 'adminUsers' ? '' : 'd-none'}`}
                          style={{
                            transition: 'all 0.3s ease',
                            opacity: isTransitioning ? 0 : 1,
                            transform: isTransitioning ? 'translateX(20px)' : 'translateX(0)'
                          }}
                        >
                          <div className="mb-2">
                            <label htmlFor="phoneNumber" className="form-label">
                              Phone Number <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative auth-pass-inputgroup input-custom-icon">
                              <input
                                id="phoneNumber"
                                type="text"
                                className="form-control"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                placeholder="Enter 10-digit phone number"
                                maxLength="10"
                                pattern="\d{10}"
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="float-end">
                              <button
                                type="button"
                                className="text-muted text-decoration-underline btn btn-link p-0"
                                onClick={() => setForgotPasswordActive(true)}
                              >
                                Forgot PIN?
                              </button>
                            </div>
                            <label className="form-label" htmlFor="pin-input">
                              PIN <span className="text-danger">*</span>
                            </label>
                            <div className="position-relative auth-pass-inputgroup input-custom-icon">
                              <input
                                type="password"
                                className="form-control"
                                placeholder="Enter 4-digit PIN"
                                id="pin-input"
                                name="password"
                                value={formData.password}
                                onChange={(e) => {
                                  // Allow only numbers and restrict to 4 digits
                                  const numericValue = e.target.value.replace(/\D/g, "").slice(0, 4);
                                  handleChange({
                                    target: {
                                      name: "password",
                                      value: numericValue,
                                    },
                                  });
                                }}
                                required
                                maxLength={4}
                              />

                            </div>
                          </div>

                          <div className="mt-4">
                            <button className="btn btn-primary w-100" type="submit">
                              Sign In
                            </button>
                          </div>
                        </form>
                      </div>
                    </>
                  ) : (
                    <div className="p-2 mt-4">
                      {!otpSent ? (
                        <div className="forgot-password-step">
                          <p className="text-muted mb-4">Enter your registered phone number to reset your PIN</p>
                          <div className="mb-3">
                            <label htmlFor="forgotPhoneNumber" className="form-label">
                              Phone Number <span className="text-danger">*</span>
                            </label>
                            <input
                              id="forgotPhoneNumber"
                              type="text"
                              className="form-control"
                              name="phoneNumber"
                              value={forgotPasswordData.phoneNumber}
                              onChange={handleForgotPasswordChange}
                              required
                              placeholder="Enter 10-digit phone number"
                              maxLength="10"
                              pattern="\d{10}"
                            />
                          </div>
                          <div className="mt-4 d-flex gap-2">
                            <button
                              className="btn btn-secondary w-50"
                              type="button"
                              onClick={() => setForgotPasswordActive(false)}
                            >
                              Back to Login
                            </button>
                            <button
                              className="btn btn-primary w-50"
                              type="button"
                              onClick={handleSendOtp}
                            >
                              Send OTP
                            </button>
                          </div>
                        </div>
                      ) : !otpVerified ? (
                        <div className="forgot-password-step">
                          <p className="text-muted mb-4">
                            OTP sent to {forgotPasswordData.phoneNumber.slice(0, 5)}xxxxx
                            {forgotPasswordData.phoneNumber.slice(9)}
                          </p>
                          <div className="mb-3">
                            <label htmlFor="otpInput" className="form-label">
                              Enter OTP <span className="text-danger">*</span>
                            </label>
                            <input
                              id="otpInput"
                              type="text"
                              className="form-control"
                              name="otp"
                              value={forgotPasswordData.otp}
                              onChange={handleForgotPasswordChange}
                              required
                              placeholder="Enter 6-digit OTP"
                              maxLength="6"
                              pattern="\d{6}"
                            />
                          </div>
                          <div className="mt-4 d-flex gap-2">
                            <button
                              className="btn btn-secondary w-50"
                              type="button"
                              onClick={() => {
                                setOtpSent(false);
                                setForgotPasswordData(prev => ({ ...prev, otp: '' }));
                              }}
                            >
                              Change Number
                            </button>
                            <button
                              className="btn btn-primary w-50"
                              type="button"
                              onClick={handleVerifyOtp}
                            >
                              Verify OTP
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="forgot-password-step">
                          <p className="text-muted mb-4">Set your new 4-digit PIN</p>
                          <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">
                              New PIN <span className="text-danger">*</span>
                            </label>
                            <input
                              id="newPassword"
                              type="password"
                              className="form-control"
                              name="newPassword"
                              value={forgotPasswordData.newPassword}
                              onChange={handleForgotPasswordChange}
                              required
                              placeholder="Enter 4-digit PIN"
                              maxLength="4"
                              pattern="\d{4}"
                            />
                          </div>
                          <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">
                              Confirm PIN <span className="text-danger">*</span>
                            </label>
                            <input
                              id="confirmPassword"
                              type="password"
                              className="form-control"
                              name="confirmPassword"
                              value={forgotPasswordData.confirmPassword}
                              onChange={handleForgotPasswordChange}
                              required
                              placeholder="Confirm 4-digit PIN"
                              maxLength="4"
                              pattern="\d{4}"
                            />
                          </div>
                          <div className="mt-4 d-flex gap-2">
                            <button
                              className="btn btn-secondary w-50"
                              type="button"
                              onClick={() => {
                                setOtpVerified(false);
                                setForgotPasswordData(prev => ({
                                  ...prev,
                                  newPassword: '',
                                  confirmPassword: ''
                                }));
                              }}
                            >
                              Back
                            </button>
                            <button
                              className="btn btn-primary w-50"
                              type="button"
                              onClick={handleResetPassword}
                            >
                              Reset PIN
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              <div className="text-center p-4">
                {/* Footer Links */}
                {/* <div className="footer-links mb-2">
                  <a href="/terms-and-conditions" className="text-muted text-decoration-none mx-2">
                    Terms and Conditions
                  </a>
                  <span className="text-muted">|</span>
                  <a href="/privacy-policy" className="text-muted text-decoration-none mx-2">
                    Privacy Policy
                  </a>
                  <span className="text-muted">|</span>
                  <a href="/shipping-policy" className="text-muted text-decoration-none mx-2">
                    Shipping Policy
                  </a>
                  <span className="text-muted">|</span>
                  <a href="/contact-us" className="text-muted text-decoration-none mx-2">
                    Contact Us
                  </a>
                  <span className="text-muted">|</span>
                  <a href="/cancellation-refunds" className="text-muted text-decoration-none mx-2">
                    Cancellation and Refunds
                  </a>
                </div> */}

                <p className="text-muted mb-0">
                  © {new Date().getFullYear()} COLOURS BOUTIQUE. All Rights Reserved. Developed &amp; Maintained
                  By Ocean Softwares
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div >
  );
}
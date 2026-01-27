import React, { useEffect, useState } from "react";
import "./styles/createProductListLayer.css";
import { useLocation, useNavigate } from "react-router-dom";
import apiProvider from "../apiProvider/wholesalerapi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import AttribiteApis from "../apiProvider/attribute";

const CreateRetailerLayer = () => {
    const { state } = useLocation();
    const Retailer = state?.Retailer;

    const [isGeneralOpen, setIsGeneralOpen] = useState(true);
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [isAddressOpen, setIsAddressOpen] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [otp, setOtp] = useState("");
    const [shopTypes, setShopTypes] = useState([]);
    const [EditMode, setEditMode] = useState(!Retailer);
    const [otpState, setOtpState] = useState({
        isSending: false,
        isVerifying: false,
        isSent: false,
        isVerified: false,
        error: "",
        countdown: 0,
        retryAvailable: false,
    });

    const [formData, setFormData] = useState({
        name: "",
        contactPersonName: "",
        designation: "",
        email: "",
        phone: "",
        mobileNumber: "",
        address: {
            country: "India",
            state: "Tamilnadu",
            city: "",
            addressLine: "",
            postalCode: ""
        },
        customerType: "Retailer",
        companyName: "",
        gstNumber: "",
        creditLimit: "",
        creditPeriod: "",
        outstandingBalance: "",
        discount: "",
        uploadProof: "",
        paymentTerm: "",
        preferredPaymentMode: "",
        shopType: "",
        isActive: true
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (Retailer) {
            console.log(Retailer, "Retailer")
            setFormData({
                name: Retailer.companyName || "",
                contactPersonName: Retailer.contactPersonName || "",
                designation: Retailer.designation || "",
                email: Retailer.email || "",
                phone: Retailer.phone || "",
                mobileNumber: Retailer.mobileNumber || "",
                address: Retailer.address || {
                    country: "India",
                    state: "Tamilnadu",
                    city: "",
                    addressLine: "",
                    postalCode: ""
                },
                customerType: Retailer.customerType || "",
                companyName: Retailer.companyName || "",
                shopType: Retailer.shopType || "",
                gstNumber: Retailer.gstNumber || "",
                creditLimit: Retailer.creditLimit || "",
                creditPeriod: Retailer.creditPeriod || "",
                outstandingBalance: Retailer.outstandingBalance || "",
                discount: Retailer.discount || "",
                paymentTerm: Retailer.paymentTerm || "",
                preferredPaymentMode: Retailer.preferredPaymentMode || "",
                isActive: Retailer.isActive !== undefined ? Retailer.isActive : true
            });
        }
    }, [Retailer]);

    // Fetch shop types when component mounts
    useEffect(() => {
        const fetchShopTypes = async () => {
            try {
                const response = await AttribiteApis.shoptypeList({
                    page: 0,
                    limit: 100,
                    filters: {}
                });

                if (response.status) {
                    setShopTypes(response.response.data || []);
                }
            } catch (error) {
                console.error("Error fetching shop types:", error);
            }
        };

        fetchShopTypes();
    }, []);

    // GST Validation Function
    const validateGSTNumber = (gstNumber) => {
        if (!gstNumber || gstNumber.trim() === '') return true; // Empty is allowed since it's optional

        // Remove spaces and convert to uppercase
        const cleanGST = gstNumber.replace(/\s+/g, '').toUpperCase();

        // Check length first
        if (cleanGST.length !== 15) {
            return "GST number must be exactly 15 characters";
        }

        // GST number format: 2 characters (state code) + 10 characters (PAN) + 1 character (entity) + 1 character (Z) + 1 character (check digit)
        const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

        if (!gstRegex.test(cleanGST)) {
            return "Invalid GST number format. Expected: 2-digit state code + 10-digit PAN + 3-character checksum";
        }

        // Validate state code (first 2 digits should be between 01-37)
        const stateCode = parseInt(cleanGST.substring(0, 2));
        if (stateCode < 1 || stateCode > 37) {
            return "Invalid state code in GST number. Must be between 01-37";
        }

        return true;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone" || name === "mobileNumber") {
            if (!/^\d*$/.test(value) || value.length > 10) {
                return;
            }
        }

        // GST number validation on change
        if (name === "gstNumber") {
            // Allow only alphanumeric characters and spaces
            const cleanValue = value.replace(/[^a-zA-Z0-9\s]/g, '');

            setFormData(prev => ({
                ...prev,
                [name]: cleanValue.toUpperCase(), // Convert to uppercase for consistency
            }));

            // Validate GST in real-time and set error immediately
            if (cleanValue.trim() !== '') {
                const gstValidation = validateGSTNumber(cleanValue);
                if (gstValidation !== true) {
                    setErrors(prev => ({
                        ...prev,
                        gstNumber: gstValidation
                    }));
                } else {
                    // Clear GST error if valid
                    setErrors(prev => ({
                        ...prev,
                        gstNumber: ""
                    }));
                }
            } else {
                // Clear GST error if empty
                setErrors(prev => ({
                    ...prev,
                    gstNumber: ""
                }));
            }
            return;
        }

        if (name.startsWith("address.")) {
            const addressField = name.split(".")[1];
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // Toggle function for active/inactive status
    const handleToggleActive = () => {
        setFormData(prev => ({
            ...prev,
            isActive: !prev.isActive
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.customerType)
            newErrors.customerType = "Customer type is required";
        if (!formData.companyName.trim())
            newErrors.companyName = "Company name is required";
        const alphabetRegex = /^[A-Za-z\s]+$/;

        if (!formData.contactPersonName.trim()) {
            newErrors.contactPersonName = "Contact person name is required";
        } else if (!alphabetRegex.test(formData.contactPersonName)) {
            newErrors.contactPersonName =
                "Contact person name must contain only alphabets";
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Mobile number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Mobile number must be 10 digits";
        }

        if (!formData.address.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.address.addressLine.trim()) {
            newErrors.addressLine = "Street address is required";
        }

        if (!formData.address.postalCode.trim()) {
            newErrors.postalCode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.address.postalCode)) {
            newErrors.postalCode = "Pincode must be 6 digits";
        }

        if (!formData.creditLimit)
            newErrors.creditLimit = "Credit limit is required";
        if (!formData.creditPeriod)
            newErrors.creditPeriod = "Credit period is required";

        // GST Number Validation - only validate if GST is provided
        if (formData.gstNumber && formData.gstNumber.trim()) {
            const gstValidation = validateGSTNumber(formData.gstNumber);
            if (gstValidation !== true) {
                newErrors.gstNumber = gstValidation;
            }
        }

        // Email validation (only if email is provided)
        if (formData.email.trim() && !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        setOtpState((prev) => ({ ...prev, error: "" }));

        if (!formData.mobileNumber) {
            setOtpState((prev) => ({ ...prev, error: "Mobile number is required" }));
            return;
        }

        if (!/^\d{10}$/.test(formData.mobileNumber)) {
            setOtpState((prev) => ({
                ...prev,
                error: "Mobile number must be 10 digits",
            }));
            return;
        }

        try {
            setOtpState((prev) => ({ ...prev, isSending: true }));

            const response = await apiProvider.sendOtp({
                phone: formData.mobileNumber,
            });

            if (response.status === true) {
                setOtpState((prev) => ({
                    ...prev,
                    isSending: false,
                    isSent: true,
                    countdown: 60,
                    retryAvailable: false,
                }));

                const timer = setInterval(() => {
                    setOtpState((prev) => {
                        if (prev.countdown <= 1) {
                            clearInterval(timer);
                            return { ...prev, countdown: 0, retryAvailable: true };
                        }
                        return { ...prev, countdown: prev.countdown - 1 };
                    });
                }, 1000);
            } else {
                setOtpState((prev) => ({
                    ...prev,
                    isSending: false,
                    error: response.message || "Failed to send OTP",
                }));
            }
        } catch (error) {
            setOtpState((prev) => ({
                ...prev,
                isSending: false,
                error: error.message || "Unexpected error occurred",
            }));
        }
    };

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 4) {
            setOtpState((prev) => ({ ...prev, error: "Please enter a 4-digit OTP" }));
            return;
        }

        setOtpState((prev) => ({ ...prev, isVerifying: true, error: "" }));

        try {
            const response = await apiProvider.verifyOtp({
                phone: formData.mobileNumber,
                otp: otp,
            });

            if (response.status) {
                setOtpState((prev) => ({
                    ...prev,
                    isVerifying: false,
                    isVerified: true,
                    error: "",
                }));
            } else {
                throw new Error(response.message || "OTP verification failed");
            }
        } catch (error) {
            setOtpState((prev) => ({
                ...prev,
                isVerifying: false,
                error: error.message || "OTP verification failed",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            let response;
            const payload = {
                ...formData,
                name: formData.companyName,
                address: {
                    country: formData.address?.country || '',
                    state: formData.address?.state || '',
                    city: formData.address?.city || '',
                    addressLine: formData.address?.addressLine || '',
                    postalCode: formData.address?.postalCode || ''
                },
                isActive: formData.isActive
            };

            if (Retailer?._id) {
                response = await apiProvider.updateWholesaler(Retailer._id, payload);
            } else {
                response = await apiProvider.createWholesaler(payload);
            }

            if (response && response.status) {
                const msg =
                    response.response?.data?.message ||
                    (Retailer?._id
                        ? "Retailer updated successfully"
                        : "Retailer created successfully");
                toast.success(msg);
                setShowModal(true);
                setTimeout(() => {
                    navigate("/retailers-list");
                }, 2000);
            } else {
                toast.error(response?.response?.data?.message || "Operation failed");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(
                error.response?.data?.message ||
                "An error occurred during the operation"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-content">
            <div className="card-body my-2">
                <div className="my-3 ms-4">
                    <h4>{Retailer?._id ? "Edit Retailer" : "Create Retailer"}</h4>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-lg-12">
                            <div id="addproduct-accordion" className="custom-accordion">
                                {/* General Info Accordion Section */}
                                <div className="card mb-20">
                                    <div
                                        className="text-body collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#addproduct-generalinfo-collapse"
                                        aria-expanded={isGeneralOpen}
                                        aria-controls="addproduct-generalinfo-collapse"
                                        onClick={() => setIsGeneralOpen(!isGeneralOpen)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="p-16">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 me-3">
                                                    <div className="avatar">
                                                        <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                                                            <h5 className="text-primary mb-0">01</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 custom-title overflow-hidden">
                                                    <h5 className="font-size-16 mb-1">Basic Details</h5>
                                                    <p className="text-muted text-truncate mb-0">
                                                        Fill all information below
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <i
                                                        className={`mdi ${isGeneralOpen
                                                            ? "mdi-chevron-up"
                                                            : "mdi-chevron-down"
                                                            } accor-down-icon font-size-24`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        id="addproduct-generalinfo-collapse"
                                        className={`collapse ${isGeneralOpen ? "show" : ""}`}
                                        data-bs-parent="#addproduct-accordion"
                                    >
                                        <div className="p-16 border-top">
                                            <form>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label
                                                                className="form-label"
                                                                htmlFor="customerType"
                                                            >
                                                                Customer Type{" "}
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                id="customerType"
                                                                name="customerType"
                                                                type="text"
                                                                className={`form-control ${errors.customerType ? "is-invalid" : ""
                                                                    }`}
                                                                value={formData.customerType}
                                                                onChange={handleChange}
                                                                readOnly
                                                                disabled
                                                            />
                                                            {errors.customerType && (
                                                                <div className="invalid-feedback">
                                                                    {errors.customerType}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="shopType" className="form-label">
                                                                Shop Type <span className="text-danger">*</span>
                                                            </label>
                                                            <select
                                                                id="shopType"
                                                                name="shopType"
                                                                className={`form-control ${errors.shopType ? 'is-invalid' : ''}`}
                                                                value={formData.shopType}
                                                                onChange={handleChange}
                                                            >
                                                                <option value="">Select shop type</option>
                                                                {shopTypes.map((shopType) => (
                                                                    <option key={shopType._id} value={shopType._id}>
                                                                        {shopType.name}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {errors.shopType && (
                                                                <div className="invalid-feedback">
                                                                    {errors.shopType}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="companyName" className="form-label">
                                                                Company Name{" "}
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                id="companyName"
                                                                name="companyName"
                                                                type="text"
                                                                className={`form-control ${errors.companyName ? "is-invalid" : ""
                                                                    }`}
                                                                value={formData.companyName}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.companyName && (
                                                                <div className="invalid-feedback">
                                                                    {errors.companyName}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="gstNumber" className="form-label">
                                                                GST Number (if applicable)
                                                            </label>
                                                            <input
                                                                id="gstNumber"
                                                                name="gstNumber"
                                                                type="text"
                                                                className={`form-control ${errors.gstNumber ? "is-invalid" : ""
                                                                    }`}
                                                                value={formData.gstNumber}
                                                                onChange={handleChange}
                                                                placeholder="e.g., 07AABCU9603R1ZM"
                                                                maxLength="15"
                                                            />
                                                            {errors.gstNumber && (
                                                                <div className="invalid-feedback d-block">
                                                                    {errors.gstNumber}
                                                                </div>
                                                            )}
                                                            <small className="text-muted">
                                                                Format: 2-digit state code + 10-digit PAN + 3-character checksum
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="designation">
                                                                Designation <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                id="designation"
                                                                name="designation"
                                                                type="text"
                                                                className={`form-control ${errors.designation ? "is-invalid" : ""}`}
                                                                value={formData.designation}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;

                                                                    // allow only alphabets and spaces
                                                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                                                        handleChange(e);
                                                                    }
                                                                }}
                                                            />

                                                            {errors.designation && (
                                                                <div className="invalid-feedback">
                                                                    {errors.designation}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label
                                                                htmlFor="contactPersonName"
                                                                className="form-label"
                                                            >
                                                                Contact Person Name{" "}
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                id="contactPersonName"
                                                                name="contactPersonName"
                                                                type="text"
                                                                className={`form-control ${errors.contactPersonName ? "is-invalid" : ""
                                                                    }`}
                                                                value={formData.contactPersonName}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.contactPersonName && (
                                                                <div className="invalid-feedback">
                                                                    {errors.contactPersonName}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="phone">
                                                                Mobile Number{" "}
                                                                <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                id="phone"
                                                                name="phone"
                                                                type="tel"
                                                                className={`form-control ${errors.phone ? "is-invalid" : ""
                                                                    }`}
                                                                value={formData.phone}
                                                                onChange={handleChange}
                                                                maxLength="10"
                                                            />
                                                            {errors.phone && (
                                                                <div className="invalid-feedback">
                                                                    {errors.phone}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="mb-3 position-relative">
                                                            <label
                                                                className="form-label"
                                                                htmlFor="mobileNumber"
                                                            >
                                                                Phone Number{" "}
                                                            </label>
                                                            <div className="input-group">
                                                                <input
                                                                    id="mobileNumber"
                                                                    name="mobileNumber"
                                                                    type="tel"
                                                                    className={`form-control ${errors.mobileNumber ? "is-invalid" : ""
                                                                        } ${otpState.isVerified ? "is-valid" : ""}`}
                                                                    value={formData.mobileNumber}
                                                                    onChange={handleChange}
                                                                    maxLength="10"
                                                                    disabled={otpState.isVerified}
                                                                />
                                                            </div>
                                                            {errors.mobileNumber && (
                                                                <div className="invalid-feedback d-block">
                                                                    {errors.mobileNumber}
                                                                </div>
                                                            )}
                                                            {otpState.isVerified && (
                                                                <div className="valid-feedback d-block">
                                                                    Mobile number verified
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label htmlFor="email" className="form-label">
                                                                Email Address{" "}
                                                            </label>
                                                            <input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                className={`form-control ${errors.email ? "is-invalid" : ""
                                                                    }`}
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.email && (
                                                                <div className="invalid-feedback">
                                                                    {errors.email}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Active/Inactive Toggle Button */}
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label className="form-label">
                                                                Status <span className="text-danger">*</span>
                                                            </label>
                                                            <div className="d-flex align-items-center">
                                                                <div className="form-check form-switch">
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="checkbox"
                                                                        id="isActiveToggle"
                                                                        checked={formData.isActive}
                                                                        onChange={handleToggleActive}
                                                                        style={{
                                                                            width: '3rem',
                                                                            height: '1.5rem',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                    />
                                                                    <label
                                                                        className="form-check-label ms-2"
                                                                        htmlFor="isActiveToggle"
                                                                    >
                                                                        {formData.isActive ? 'Active' : 'Inactive'}
                                                                    </label>
                                                                </div>
                                                                <span
                                                                    className={`badge ms-3 ${formData.isActive ? 'bg-success' : 'bg-danger'}`}
                                                                >
                                                                    {formData.isActive ? 'ACTIVE' : 'INACTIVE'}
                                                                </span>
                                                            </div>
                                                            <small className="text-muted">
                                                                Toggle to set the Retailer status as active or inactive
                                                            </small>
                                                        </div>
                                                    </div>
                                                </div>
                                                {otpState.isSent && !otpState.isVerified && (
                                                    <div className="row">
                                                        <div className="col-lg-6 offset-lg-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">
                                                                    OTP Verification
                                                                </label>
                                                                <div className="d-flex gap-2">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        placeholder="Enter OTP"
                                                                        value={otp}
                                                                        onChange={(e) => setOtp(e.target.value)}
                                                                        maxLength="4"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-success"
                                                                        onClick={handleVerifyOtp}
                                                                        disabled={
                                                                            otpState.isVerifying || otp.length !== 4
                                                                        }
                                                                    >
                                                                        {otpState.isVerifying
                                                                            ? "Verifying..."
                                                                            : "Verify"}
                                                                    </button>
                                                                </div>
                                                                {otpState.error && (
                                                                    <div className="text-danger small mt-1">
                                                                        {otpState.error}
                                                                    </div>
                                                                )}
                                                                {otpState.countdown > 0 && (
                                                                    <div className="text-muted small mt-1">
                                                                        Resend OTP in {otpState.countdown} seconds
                                                                    </div>
                                                                )}
                                                                {otpState.retryAvailable && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link p-0 small mt-1"
                                                                        onClick={handleSendOtp}
                                                                    >
                                                                        Resend OTP
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </form>
                                        </div>
                                    </div>
                                </div>

                                {/* New Address Details Section */}
                                <div className="card mb-20">
                                    <div
                                        className="text-body collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#addproduct-address-collapse"
                                        aria-expanded={isAddressOpen}
                                        aria-controls="addproduct-address-collapse"
                                        onClick={() => setIsAddressOpen(!isAddressOpen)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="p-16">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 me-3">
                                                    <div className="avatar">
                                                        <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                                                            <h5 className="text-primary mb-0">02</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 custom-title overflow-hidden">
                                                    <h5 className="font-size-16 mb-1">Address Details</h5>
                                                    <p className="text-muted text-truncate mb-0">
                                                        Fill all information below
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <i
                                                        className={`mdi ${isAddressOpen
                                                            ? "mdi-chevron-up"
                                                            : "mdi-chevron-down"
                                                            } accor-down-icon font-size-24`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        id="addproduct-address-collapse"
                                        className={`collapse ${isAddressOpen ? "show" : ""}`}
                                        data-bs-parent="#addproduct-accordion"
                                    >
                                        <div className="p-16 border-top">
                                            <form>
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="country">
                                                                Country
                                                            </label>
                                                            <input
                                                                id="country"
                                                                name="address.country"
                                                                type="text"
                                                                className="form-control"
                                                                value={formData.address.country}
                                                                onChange={handleChange}
                                                                readOnly
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="state">
                                                                State
                                                            </label>
                                                            <input
                                                                id="state"
                                                                name="address.state"
                                                                type="text"
                                                                className="form-control"
                                                                value={formData.address.state}
                                                                onChange={handleChange}
                                                                readOnly
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="city">
                                                                City <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                id="city"
                                                                name="address.city"
                                                                type="text"
                                                                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                                                value={formData.address.city}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;

                                                                    // Allow only alphabets and spaces
                                                                    if (/^[A-Za-z\s]*$/.test(value)) {
                                                                        handleChange(e);
                                                                    }
                                                                }}
                                                            />

                                                            {errors.city && (
                                                                <div className="invalid-feedback">
                                                                    {errors.city}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="col-lg-6">
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="postalCode">
                                                                Pincode <span className="text-danger">*</span>
                                                            </label>
                                                            <input
                                                                id="postalCode"
                                                                name="address.postalCode"
                                                                type="text"
                                                                className={`form-control ${errors.postalCode ? "is-invalid" : ""
                                                                    }`}
                                                                value={formData.address.postalCode}
                                                                onChange={handleChange}
                                                                maxLength="6"
                                                            />
                                                            {errors.postalCode && (
                                                                <div className="invalid-feedback">
                                                                    {errors.postalCode}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="col-lg-12">
                                                        <div className="mb-3">
                                                            <label className="form-label" htmlFor="addressLine">
                                                                Street Address <span className="text-danger">*</span>
                                                            </label>
                                                            <textarea
                                                                id="addressLine"
                                                                name="address.addressLine"
                                                                className={`form-control ${errors.addressLine ? "is-invalid" : ""
                                                                    }`}
                                                                rows="3"
                                                                value={formData.address.addressLine}
                                                                onChange={handleChange}
                                                            />
                                                            {errors.addressLine && (
                                                                <div className="invalid-feedback">
                                                                    {errors.addressLine}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                {/* Price Accordion Section */}
                                <div className="card mb-20">
                                    <div
                                        className="text-body collapsed"
                                        data-bs-toggle="collapse"
                                        data-bs-target="#addproduct-img-collapse"
                                        aria-expanded={isPriceOpen}
                                        aria-controls="addproduct-img-collapse"
                                        onClick={() => setIsPriceOpen(!isPriceOpen)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="p-16">
                                            <div className="d-flex align-items-center">
                                                <div className="flex-shrink-0 me-3">
                                                    <div className="avatar">
                                                        <div className="avatar-title custom-avatar rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center">
                                                            <h5 className="text-primary mb-0">03</h5>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex-grow-1 custom-title overflow-hidden">
                                                    <h5 className="font-size-16 mb-1">
                                                        Credit and Payment Details
                                                    </h5>
                                                    <p className="text-muted text-truncate mb-0">
                                                        Fill all information below
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    <i
                                                        className={`mdi ${isPriceOpen ? "mdi-chevron-up" : "mdi-chevron-down"
                                                            } accor-down-icon font-size-24`}
                                                    ></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        id="addproduct-img-collapse"
                                        className={`collapse ${isPriceOpen ? "show" : ""}`}
                                        data-bs-parent="#addproduct-accordion"
                                    >
                                        <div className="p-16 border-top">
                                            <form>
                                                <div className="row">
                                                    <div className="col-lg-6 mb-3">
                                                        <label className="form-label">
                                                            Credit Limit <span className="text-danger">*</span>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            className={`form-control ${errors.creditLimit ? "is-invalid" : ""
                                                                }`}
                                                            name="creditLimit"
                                                            value={formData.creditLimit}
                                                            onChange={handleChange}
                                                        />
                                                        {errors.creditLimit && (
                                                            <div className="invalid-feedback">
                                                                {errors.creditLimit}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <label className="form-label">
                                                            Credit Period <span className="text-danger">*</span>
                                                        </label>
                                                        <select
                                                            className={`form-control ${errors.creditPeriod ? "is-invalid" : ""
                                                                }`}
                                                            name="creditPeriod"
                                                            value={formData.creditPeriod}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select credit period</option>
                                                            <option value="5">5 days</option>
                                                            <option value="7">7 days</option>
                                                            <option value="10">10 days</option>
                                                            <option value="15">15 days</option>

                                                        </select>
                                                        {errors.creditPeriod && (
                                                            <div className="invalid-feedback">
                                                                {errors.creditPeriod}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <label className="form-label">
                                                            Outstanding Balance
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            className="form-control"
                                                            name="outstandingBalance"
                                                            value={formData.outstandingBalance}
                                                            onChange={handleChange}
                                                        />
                                                    </div>

                                                    {/* Discount Field (Percentage) */}
                                                    <div className="col-lg-6 mb-3">
                                                        <label className="form-label">
                                                            Discount (%)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            step="0.01"
                                                            className="form-control"
                                                            name="discount"
                                                            value={formData.discount}
                                                            onChange={handleChange}
                                                            placeholder="Enter discount percentage (optional)"
                                                        />
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <label className="form-label">Upload Proof</label>
                                                        <input
                                                            type="file"
                                                            name="uploadProof"
                                                            className="form-control"
                                                            onChange={handleChange}
                                                        />
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <label className="form-label">Payment Terms</label>
                                                        <select
                                                            className="form-control"
                                                            name="paymentTerm"
                                                            value={formData.paymentTerm}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Prepaid">Prepaid</option>
                                                            <option value="Net-15">Net 15</option>
                                                            <option value="Net-30">Net 30</option>
                                                            <option value="Net-60">Net 60</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-lg-6 mb-3">
                                                        <label className="form-label">
                                                            Preferred Payment Mode
                                                        </label>
                                                        <select
                                                            className="form-control"
                                                            name="preferredPaymentMode"
                                                            value={formData.preferredPaymentMode}
                                                            onChange={handleChange}
                                                        >
                                                            <option value="">Select</option>
                                                            <option value="Bank-Transfer">Bank Transfer</option>
                                                            <option value="Upi">UPI</option>
                                                            <option value="Credit-Account">
                                                                Credit Account
                                                            </option>
                                                            <option value="Cash">Cash</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='form-group text-end'>
                        <button
                            onClick={() => navigate(-1)}
                            type='ffff'
                            className='form-wizard-next-btn btn btn-secondary me-1 px-32'
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type='ffff'
                            className='form-wizard-next-btn btn btn-primary px-32'
                            onClick={handleSubmit}
                        >
                            {Retailer?._id ? "Update" : "Create"}
                        </button>
                    </div>
                </div >
            </div>
        </div>
    );
};

export default CreateRetailerLayer;
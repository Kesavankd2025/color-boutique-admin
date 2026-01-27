import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiProvider from "../apiProvider/adminuserapi";
import rolesApiProvider from "../apiProvider/adminuserroleapi";
import { ToastContainer, toast } from "react-toastify";
import { IMAGE_BASE_URL } from "../network/apiClient"; // Import your image base URL
import { TrashIcon } from "@phosphor-icons/react";

export default function CreateUserLayer() {
  const location = useLocation();
  const navigate = useNavigate();

  const editUser = location.state?.editUser;

  const [roles, setRoles] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    roleId: "",
    password: "",
    confirmPassword: "",
    status: "",
    aadhar: "",
    dateOfBirth: "",
    dateOfJoining: "",
    salary: "",
    salesWithCollection: false,

    // New fields
    bloodGroup: "",
    permanentAddress: "",
    presentAddress: "",
    emergencyContactNumber: "",
    relationship: "",
    bankName: "",
    ifscCode: "",
    branch: "",
    accountNumber: "",
    // New permission fields
    orderStatusChangePermission: false,
    cashHandoverUser: false,
    returnOrderCollectedUser: false,
  });

  /** 🔹 Format date from ISO string to YYYY-MM-DD for input fields */
  const formatDateForInput = (isoDateString) => {
    if (!isoDateString) return "";

    try {
      const date = new Date(isoDateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "";

      // Format as YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  /** 🔹 Get profile image URL */
  const getProfileImageUrl = (profileImageArray) => {
    if (!profileImageArray || profileImageArray.length === 0) {
      return "";
    }

    const firstImage = profileImageArray[0];
    if (firstImage && firstImage.docPath && firstImage.docName) {
      return `${IMAGE_BASE_URL}/${firstImage.docPath}/${firstImage.docName}`;
    }

    return "";
  };

  /** 🔹 Load edit user if available */
  useEffect(() => {
    if (editUser && typeof editUser === "object") {
      setIsEditMode(true);
      setFormData({
        id: editUser._id,
        fullName: editUser.name || "",
        email: editUser.email || "",
        phoneNumber: editUser.phoneNumber || "",
        roleId: editUser.roleId || "",
        password: "",
        confirmPassword: "",
        status: editUser.isActive ? "Active" : "Inactive",
        aadhar: editUser.aadhar || "",
        dateOfBirth: formatDateForInput(editUser.dateOfBirth) || "",
        dateOfJoining: formatDateForInput(editUser.dateOfJoining) || "",
        salary: editUser.salary || "",
        salesWithCollection: editUser.salesWithCollection || false,

        // New fields
        bloodGroup: editUser.bloodGroup || "",
        permanentAddress: editUser.permanentAddress || "",
        presentAddress: editUser.presentAddress || "",
        emergencyContactNumber: editUser.emergencyContactNumber || "",
        relationship: editUser.relationship || "",
        bankName: editUser.bankName || "",
        ifscCode: editUser.ifscCode || "",
        branch: editUser.branch || "",
        accountNumber: editUser.accountNumber || "",
        // New permission fields
        orderStatusChangePermission:
          editUser.orderStatusChangePermission || false,
        cashHandoverUser: editUser.cashHandoverUser || false,
        returnOrderCollectedUser: editUser.returnOrderCollectedUser || false,
      });

      // Set profile image preview if exists
      if (editUser.profileImage && editUser.profileImage.length > 0) {
        const imageUrl = getProfileImageUrl(editUser.profileImage);
        setProfileImagePreview(imageUrl);
      }
    }
  }, [editUser]);

  /** 🔹 Handle input changes */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // For checkbox inputs
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // Restrict phone number to 10 digits
    if (name === "phoneNumber" && value.length > 10) return;

    // Restrict emergency contact number to 10 digits
    if (name === "emergencyContactNumber" && value.length > 10) return;

    // Restrict password to 4 numeric digits
    if (name === "password" || name === "confirmPassword") {
      if (value.length > 4) return;
      if (value && !/^\d*$/.test(value)) return;
    }

    // Restrict account number to numbers only and reasonable length
    if (name === "accountNumber") {
      if (value.length > 20) return;
      if (value && !/^\d*$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** 🔹 Handle profile image upload */
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!validTypes.includes(file.type)) {
        toast.error(
          "Please select a valid image file (JPEG, JPG, PNG, GIF, WEBP)"
        );
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes
      if (file.size > maxSize) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setProfileImage(file);

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setProfileImagePreview(previewUrl);
    }
  };

  /** 🔹 Remove profile image */
  const handleRemoveProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview("");
    // Clear file input
    const fileInput = document.getElementById("profileImage");
    if (fileInput) fileInput.value = "";

    // If in edit mode and there was an existing image, we need to handle deletion
    if (isEditMode && profileImagePreview) {
      // You might want to set a flag to delete the existing image on backend
      // For now, we'll just clear the preview
      console.log("Existing profile image should be deleted on server");
    }
  };

  /** 🔹 Check if selected role is Salesman */
  const isSalesmanRole = () => {
    if (!formData.roleId) return false;

    const selectedRole = roles.find((role) => role._id === formData.roleId);
    return (
      selectedRole && selectedRole.roleName.toLowerCase().includes("salesman")
    );
  };

  /** 🔹 Validate form before submit */
  const validateForm = () => {
    const newErrors = {};

    // Profile Image
    if (!profileImage && !profileImagePreview) {
      newErrors.profileImage = "Profile image is required";
    }

    // Full Name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full Name must be at least 3 characters";
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
      newErrors.fullName = "Full Name must contain only letters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must be 10 digits starting with 6-9";
    }

    // Role
    if (!formData.roleId) newErrors.roleId = "Role is required";

    // Password & Confirm Password (only for create mode)
    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (!/^\d{4}$/.test(formData.password)) {
        newErrors.password = "Password must be exactly 4 digits";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    // Status
    if (!formData.status) newErrors.status = "Status is required";

    // Aadhar
    if (!formData.aadhar.trim()) {
      newErrors.aadhar = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(formData.aadhar)) {
      newErrors.aadhar = "Aadhar must be exactly 12 digits";
    }

    // Date of Birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of Birth is required";
    } else {
      const dob = new Date(formData.dateOfBirth);
      if (dob >= new Date()) {
        newErrors.dateOfBirth = "Date of Birth must be in the past";
      }
    }

    // Date of Joining
    if (!formData.dateOfJoining) {
      newErrors.dateOfJoining = "Date of Joining is required";
    } else {
      const doj = new Date(formData.dateOfJoining);
      const dob = new Date(formData.dateOfBirth);
      if (doj > new Date()) {
        newErrors.dateOfJoining = "Date of Joining cannot be in the future";
      } else if (formData.dateOfBirth && doj < dob) {
        newErrors.dateOfJoining =
          "Date of Joining cannot be before Date of Birth";
      }
    }

    // Salary
    if (!formData.salary) {
      newErrors.salary = "Salary is required";
    } else if (isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.salary = "Salary must be a positive number";
    }

    // New fields validation
    if (!formData.bloodGroup) {
      newErrors.bloodGroup = "Blood Group is required";
    }

    if (!formData.permanentAddress.trim()) {
      newErrors.permanentAddress = "Permanent Address is required";
    } else if (formData.permanentAddress.trim().length < 10) {
      newErrors.permanentAddress =
        "Permanent Address must be at least 10 characters";
    }

    if (!formData.presentAddress.trim()) {
      newErrors.presentAddress = "Present Address is required";
    } else if (formData.presentAddress.trim().length < 10) {
      newErrors.presentAddress =
        "Present Address must be at least 10 characters";
    }

    if (!formData.emergencyContactNumber.trim()) {
      newErrors.emergencyContactNumber = "Emergency Contact Number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.emergencyContactNumber)) {
      newErrors.emergencyContactNumber =
        "Emergency Contact must be 10 digits starting with 6-9";
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship = "Relationship is required";
    }

    // Bank Name
    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank Name is required";
    }

    // IFSC Code
    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC Code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      newErrors.ifscCode = "Please enter a valid IFSC Code";
    }

    // Branch
    if (!formData.branch.trim()) {
      newErrors.branch = "Branch is required";
    }

    // Account Number
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account Number is required";
    } else if (!/^\d{9,18}$/.test(formData.accountNumber)) {
      newErrors.accountNumber = "Account Number must be between 9-18 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /** 🔹 Fetch roles list */
  useEffect(() => {
    fetchRoleData();
  }, []);

  const fetchRoleData = async () => {
    try {
      const result = await rolesApiProvider.getUserRoleList();

      if (result && result.status) {
        setRoles(result.response?.data || []);
      } else if (result?.response?.message === "Invalid token") {
        console.warn("Token invalid. Redirecting to login...");
        // localStorage.removeItem("authToken");
        // window.location.href = "/login";
      } else {
        console.error("Failed to fetch roles:", result);
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  /** 🔹 Handle form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const input = new FormData();
      input.append("name", formData.fullName);
      input.append("email", formData.email);
      input.append("phoneNumber", formData.phoneNumber);
      input.append("roleId", formData.roleId);
      input.append("aadhar", formData.aadhar);
      input.append("dateOfBirth", formData.dateOfBirth);
      input.append("dateOfJoining", formData.dateOfJoining);
      input.append("salary", formData.salary);
      input.append("isActive", formData.status === "Active");

      // New fields
      input.append("bloodGroup", formData.bloodGroup);
      input.append("permanentAddress", formData.permanentAddress);
      input.append("presentAddress", formData.presentAddress);
      input.append("emergencyContactNumber", formData.emergencyContactNumber);
      input.append("relationship", formData.relationship);
      input.append("bankName", formData.bankName);
      input.append("ifscCode", formData.ifscCode);
      input.append("branch", formData.branch);
      input.append("accountNumber", formData.accountNumber);

      // Add profile image if selected
      if (profileImage) {
        input.append("profileImage", profileImage);
      }
      input.append(
        "orderStatusChangePermission",
        formData.orderStatusChangePermission
      );
      input.append("cashHandoverUser", formData.cashHandoverUser);
      input.append(
        "returnOrderCollectedUser",
        formData.returnOrderCollectedUser
      );
      // Add salesWithCollection if the role is Salesman
      input.append("salesWithCollection", formData.salesWithCollection);
      if (formData.status === "Suspended") {
        input.append("isSuspended", true);
        input.append("isActive", false);
      }

      if (!editUser || formData.password) {
        if (!formData.password) {
          toast.error("Password is required");
          return;
        }
        input.append("password", formData.password);
      }

      if (isEditMode) input.append("id", formData.id);

      const response = isEditMode
        ? await apiProvider.updateUser(formData.id, input)
        : await apiProvider.createUser(input);

      if (response?.response?.data) {
        toast.success(
          response.response.data.message || "User saved successfully"
        );
        setTimeout(() => navigate("/users-list"), 2000);
      } else {
        toast.error("Something went wrong: No response data.");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("An error occurred while submitting the form");
    }
  };

  return (
    <div className="page-content">
      <div className="container-fluid gap-4">
        <div className="row ">
          <div className="col-lg-12">
            <div id="addproduct-accordion" className="custom-accordion">
              <div className="card">
                <div
                  className="collapse show"
                  data-bs-parent="#addproduct-accordion"
                >
                  <h5 className="card-title mx-3 my-2 py-3 px-2">
                    {editUser ? "Edit User" : "Create User"}
                  </h5>

                  <div className="p-4 border-top">
                    <form >
                      {/* Profile Image Upload */}
                      <div className="row mb-4">
                        <div className="col-lg-12">
                          <label className="form-label">Profile Picture </label>
                          <div className="d-flex align-items-center">
                            <div className="me-3">
                              {profileImagePreview ? (
                                <div className="position-relative">
                                  <img
                                    src={profileImagePreview}
                                    alt="Profile Preview"
                                    className="rounded-circle"
                                    style={{
                                      width: "120px",
                                      height: "120px",
                                      objectFit: "cover",
                                      border: "2px solid #dee2e6",
                                    }}
                                  />

                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                                    onClick={handleRemoveProfileImage}
                                    style={{
                                      transform: "translate(50%, -50%)",
                                      width: "30px",
                                      height: "30px",
                                      borderRadius: "50%",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      padding: 0,
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 256 256"
                                    >
                                      <g
                                        fill="#ffffff"
                                        fillRule="nonzero"
                                        stroke="none"
                                        strokeWidth="1"
                                        strokeLinecap="butt"
                                        strokeLinejoin="miter"
                                        strokeMiterlimit="10"
                                        style={{ mixBlendMode: "normal" }}
                                        transform="scale(8.53333)"
                                      >
                                        <path d="M7,4c-0.25587,0 -0.51203,0.09747 -0.70703,0.29297l-2,2c-0.391,0.391 -0.391,1.02406 0,1.41406l7.29297,7.29297l-7.29297,7.29297c-0.391,0.391 -0.391,1.02406 0,1.41406l2,2c0.391,0.391 1.02406,0.391 1.41406,0l7.29297,-7.29297l7.29297,7.29297c0.39,0.391 1.02406,0.391 1.41406,0l2,-2c0.391,-0.391 0.391,-1.02406 0,-1.41406l-7.29297,-7.29297l7.29297,-7.29297c0.391,-0.39 0.391,-1.02406 0,-1.41406l-2,-2c-0.391,-0.391 -1.02406,-0.391 -1.41406,0l-7.29297,7.29297l-7.29297,-7.29297c-0.1955,-0.1955 -0.45116,-0.29297 -0.70703,-0.29297z" />
                                      </g>
                                    </svg>
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "120px",
                                    height: "120px",
                                    border: "2px dashed #dee2e6",
                                  }}
                                >
                                  <i
                                    className="fas fa-user text-muted"
                                    style={{ fontSize: "2.5rem" }}
                                  ></i>
                                </div>
                              )}
                            </div>
                            <div>
                              <input
                                type="file"
                                id="profileImage"
                                name="profileImage"
                                accept="image/*"
                                className="form-control"
                                onChange={handleProfileImageChange}
                                style={{ maxWidth: "300px" }}
                              />
                              <small className="text-muted d-block mt-1">
                                Supported formats: JPG, JPEG, PNG, GIF, WEBP.
                                Max size: 5MB
                              </small>
                              {isEditMode && profileImagePreview && (
                                <small className="text-info d-block mt-1">
                                  Current image will be replaced with the new
                                  one
                                </small>
                              )}
                              {errors.profileImage && (
                                <div className="text-danger mt-2">
                                  {errors.profileImage}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Rest of your form fields */}
                      {/* Full Name & Email */}
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label" htmlFor="fullname">
                            Full Name
                          </label>
                          <input
                            id="fullname"
                            name="fullName"
                            type="text"
                            className={`form-control ${errors.fullName ? "is-invalid" : ""
                              }`}
                            value={formData.fullName}
                            onChange={handleChange}
                            autocomplete="off"
                          />
                          {errors.fullName && (
                            <div className="text-danger">{errors.fullName}</div>
                          )}
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="form-label" htmlFor="email">
                            Email Address
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            className={`form-control ${errors.email ? "is-invalid" : ""
                              }`}
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                          {errors.email && (
                            <div className="text-danger">{errors.email}</div>
                          )}
                        </div>
                      </div>

                      {/* Phone & Role */}
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label htmlFor="phone" className="form-label">
                            Phone Number
                          </label>
                          <input
                            id="phone"
                            name="phoneNumber"
                            type="tel"
                            maxLength="10"
                            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""
                              }`}
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                          {errors.phoneNumber && (
                            <div className="text-danger">
                              {errors.phoneNumber}
                            </div>
                          )}
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="roleId" className="form-label">
                            Roles
                          </label>
                          <select
                            id="roleId"
                            name="roleId"
                            className={`form-select ${errors.roleId ? "is-invalid" : ""
                              }`}
                            value={formData.roleId}
                            onChange={handleChange}
                          >
                            <option value="">Select option</option>
                            {roles.map((role) => (
                              <option key={role._id} value={role._id}>
                                {role.roleName}
                              </option>
                            ))}
                          </select>
                          {errors.roleId && (
                            <div className="text-danger">{errors.roleId}</div>
                          )}
                        </div>
                      </div>

                      {/* Aadhar & Blood Group */}
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">Aadhar Number</label>
                          <input
                            type="text"
                            name="aadhar"
                            maxLength="12"
                            className={`form-control ${errors.aadhar ? "is-invalid" : ""
                              }`}
                            value={formData.aadhar}
                            autoComplete="off"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d*$/.test(value)) {
                                handleChange(e);
                              }
                            }}
                          />
                          {errors.aadhar && (
                            <div className="text-danger">{errors.aadhar}</div>
                          )}
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="form-label">Blood Group</label>
                          <select
                            name="bloodGroup"
                            className={`form-select ${errors.bloodGroup ? "is-invalid" : ""
                              }`}
                            value={formData.bloodGroup}
                            onChange={handleChange}
                          >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                          {errors.bloodGroup && (
                            <div className="text-danger">
                              {errors.bloodGroup}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Salary & Emergency Contact */}
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">Salary</label>
                          <input
                            type="number"
                            min={1}
                            name="salary"
                            className={`form-control ${errors.salary ? "is-invalid" : ""
                              }`}
                            value={formData.salary}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                          {errors.salary && (
                            <div className="text-danger">{errors.salary}</div>
                          )}
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="form-label">
                            Emergency Contact Number
                          </label>
                          <input
                            type="tel"
                            name="emergencyContactNumber"
                            maxLength="10"
                            className={`form-control ${errors.emergencyContactNumber ? "is-invalid" : ""
                              }`}
                            value={formData.emergencyContactNumber}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                          {errors.emergencyContactNumber && (
                            <div className="text-danger">
                              {errors.emergencyContactNumber}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* DOB & DOJ */}
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">Date of Birth</label>
                          <input
                            type="date"
                            name="dateOfBirth"
                            className={`form-control ${errors.dateOfBirth ? "is-invalid" : ""
                              }`}
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                          {errors.dateOfBirth && (
                            <div className="text-danger">
                              {errors.dateOfBirth}
                            </div>
                          )}
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="form-label">Date of Joining</label>
                          <input
                            type="date"
                            name="dateOfJoining"
                            className={`form-control ${errors.dateOfJoining ? "is-invalid" : ""
                              }`}
                            value={formData.dateOfJoining}
                            onChange={handleChange}
                            autoComplete="off"
                          />
                          {errors.dateOfJoining && (
                            <div className="text-danger">
                              {errors.dateOfJoining}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Permanent Address & Present Address */}
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">
                            Permanent Address
                          </label>
                          <textarea
                            name="permanentAddress"
                            rows="3"
                            className={`form-control ${errors.permanentAddress ? "is-invalid" : ""
                              }`}
                            value={formData.permanentAddress}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter complete permanent address"
                          />
                          {errors.permanentAddress && (
                            <div className="text-danger">
                              {errors.permanentAddress}
                            </div>
                          )}
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="form-label">Present Address</label>
                          <textarea
                            name="presentAddress"
                            rows="3"
                            className={`form-control ${errors.presentAddress ? "is-invalid" : ""
                              }`}
                            value={formData.presentAddress}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter complete present address"
                          />
                          {errors.presentAddress && (
                            <div className="text-danger">
                              {errors.presentAddress}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Relationship & Bank Name */}
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">
                            Relationship with Emergency Contact
                          </label>
                          <input
                            type="text"
                            name="relationship"
                            className={`form-control ${errors.relationship ? "is-invalid" : ""
                              }`}
                            value={formData.relationship}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="e.g., Father, Mother, Spouse, etc."
                          />
                          {errors.relationship && (
                            <div className="text-danger">
                              {errors.relationship}
                            </div>
                          )}
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="form-label">Bank Name</label>
                          <input
                            type="text"
                            name="bankName"
                            className={`form-control ${errors.bankName ? "is-invalid" : ""
                              }`}
                            value={formData.bankName}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter bank name"
                          />
                          {errors.bankName && (
                            <div className="text-danger">{errors.bankName}</div>
                          )}
                        </div>
                      </div>

                      {/* Bank Details - IFSC Code & Branch */}
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">IFSC Code</label>
                          <input
                            type="text"
                            name="ifscCode"
                            className={`form-control ${errors.ifscCode ? "is-invalid" : ""
                              }`}
                            value={formData.ifscCode}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="e.g., SBIN0000123"
                            style={{ textTransform: "uppercase" }}
                          />
                          {errors.ifscCode && (
                            <div className="text-danger">{errors.ifscCode}</div>
                          )}
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label className="form-label">Branch</label>
                          <input
                            type="text"
                            name="branch"
                            className={`form-control ${errors.branch ? "is-invalid" : ""
                              }`}
                            value={formData.branch}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter branch name"
                          />
                          {errors.branch && (
                            <div className="text-danger">{errors.branch}</div>
                          )}
                        </div>
                      </div>

                      {/* Account Number */}
                      <div className="row">
                        <div className="col-lg-6 mb-3">
                          <label className="form-label">Account Number</label>
                          <input
                            type="text"
                            name="accountNumber"
                            className={`form-control ${errors.accountNumber ? "is-invalid" : ""
                              }`}
                            value={formData.accountNumber}
                            onChange={handleChange}
                            autoComplete="off"
                            placeholder="Enter account number"
                          />
                          {errors.accountNumber && (
                            <div className="text-danger">
                              {errors.accountNumber}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Password (only for create) */}
                      <div className="row">
                        {!isEditMode && (
                          <>
                            <div className="col-lg-4 mb-3">
                              <label htmlFor="password" className="form-label">
                                Password (4 digits)
                              </label>
                              <input
                                id="password"
                                name="password"
                                type="password"
                                maxLength="4"
                                className={`form-control ${errors.password ? "is-invalid" : ""
                                  }`}
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                              />
                              {errors.password && (
                                <div className="text-danger">
                                  {errors.password}
                                </div>
                              )}
                            </div>

                            <div className="col-lg-4 mb-3">
                              <label
                                htmlFor="confirmPassword"
                                className="form-label"
                              >
                                Confirm Password
                              </label>
                              <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                maxLength="4"
                                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""
                                  }`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                              />
                              {errors.confirmPassword && (
                                <div className="text-danger">
                                  {errors.confirmPassword}
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        <div className="col-md-4 mb-3 px-2">
                          <label htmlFor="status" className="form-label">
                            Status
                          </label>
                          <select
                            id="status"
                            name="status"
                            className={`form-select ${errors.status ? "is-invalid" : ""
                              }`}
                            value={formData.status}
                            onChange={handleChange}
                          >
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                          {errors.status && (
                            <div className="text-danger">{errors.status}</div>
                          )}
                        </div>
                      </div>

                      {/* Sales With Collection Checkbox (only for Salesman role) */}
                      {isSalesmanRole() && (
                        <div className="row">
                          <div className="col-lg-12 mb-3">
                            <div className="form-check">
                              <input
                                id="salesWithCollection"
                                name="salesWithCollection"
                                type="checkbox"
                                className="form-check-input"
                                checked={formData.salesWithCollection}
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="salesWithCollection"
                              >
                                Sales With Collection
                              </label>
                            </div>
                            <small className="text-muted">
                              Enable if this salesman should also handle
                              collections
                            </small>
                          </div>
                        </div>
                      )}
                      {/* New Permission Checkboxes (only for Salesman role) */}
                      {/* {isSalesmanRole() && ( */}
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="card-body">
                            <h6 className="card-title mb-3">
                              Additional Permissions
                            </h6>

                            {/* Order Status Change Permission */}
                            <div className="form-check mb-3">
                              <input
                                id="orderStatusChangePermission"
                                name="orderStatusChangePermission"
                                type="checkbox"
                                className="form-check-input"
                                checked={
                                  formData.orderStatusChangePermission ||
                                  false
                                }
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="orderStatusChangePermission"
                              >
                                Order Status Change Permission
                              </label>
                              <small className="text-muted d-block">
                                Allow user to change order status
                              </small>
                            </div>

                            {/* Cash Handover User */}
                            <div className="form-check mb-3">
                              <input
                                id="cashHandoverUser"
                                name="cashHandoverUser"
                                type="checkbox"
                                className="form-check-input"
                                checked={formData.cashHandoverUser || false}
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="cashHandoverUser"
                              >
                                Cash Handover User
                              </label>
                              <small className="text-muted d-block">
                                User can handle cash handover operations
                              </small>
                            </div>

                            {/* Return Order Collected User */}
                            <div className="form-check mb-3">
                              <input
                                id="returnOrderCollectedUser"
                                name="returnOrderCollectedUser"
                                type="checkbox"
                                className="form-check-input"
                                checked={
                                  formData.returnOrderCollectedUser || false
                                }
                                onChange={handleChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="returnOrderCollectedUser"
                              >
                                Return Order Collected User
                              </label>
                              <small className="text-muted d-block">
                                User can collect return orders
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* // )} */}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className='form-group text-end'>
          <button
            onClick={() => navigate('/users-list')} type='ffff'
            className='form-wizard-next-btn btn btn-secondary me-1 px-32'
          >
            Cancel
          </button>
          <button

            type='ffff'
            className='form-wizard-next-btn btn btn-primary px-32'
            onClick={handleSubmit}
          >
            {editUser ? "Update" : "Create"}
          </button>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import rolesApiProvider from "../apiProvider/adminuserroleapi";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/createRoleLayer.css";

export default function CreateRoleLayer() {
  const [roleName, setRoleName] = useState("");
  const location = useLocation();
  const editRole = location.state?.editRole;
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const MODULE_KEYS = [
    // Dashboard
    "dashboard",

    // Website
    "homePage",

    // Catalog
    "categories",
    "attributes",
    "brands",
    "products",
    "offerCreations",
    "rootCreation",
    "couponCreation",

    // Orders
    "orderList",
    "retailerOrderList",
    "customerOrder",
    "posOrder",
    "returnRequest",
    "orderReport",

    // Users
    "usersList",
    "userRolePermission",
    "passwordManagement",
    "userActivityLog",
    "usersReport",

    // POS
    "posNew",
    "posOrderHistroy",

    // Customer
    "customerList",
    "customerOrderHistroy",
    "customerReports",

    // Wholesalers
    "wholesalerList",
    "wholesalerOrderHistory",
    "wholesalerCreditManagement",
    "wholesalerPaymentDues",
    "wholesalerReports",

    // Retailers
    "retailersList",
    "retailerOrderHistory",
    "retailerCreditManagement",
    "retailerPaymentDues",
    "retailerReports",

    // Vendors
    "vendorList",
    "vendorOrderList",
    "vendorPayments",
    "vendorPaymentDues",
    "vendorReports",

    // Salesman
    "salesmanList",
    "salesmanTargetsIncentives",
    "salesCashSettlement",
    "salesmanPerformance",
    "salesmanOrderHistory",
    "salesmanReport",

    // Delivery
    "deliveryList",
    "deliveryTrackingUpdates",
    "deliveryPersonList",
    "deliveryPerformancePayroll",
    "deliveryReports",
    "deliveryManRequest",
    "deliveryManComplaint",

    // Payment & Credit
    "paymentTransactionList",
    "recordManualPayment",
    "outstandingPayment",
    "processRefund",
    "paymentCreditReport",

    // Inventory
    "addStock",
    "inventoryList",
    "inventoryLog",
    "inventoryReports",

    // Petty Cash
    "pettycashTransactionList",
    "pettyCashReport",

    // Tax
    "taxList",
  ];

  const handleCancel = () => {
    // Go back to previous page
    navigate(-1);
  };

  const defaultPermissions = MODULE_KEYS.reduce((acc, key) => {
    acc[key] = { view: false, add: false, edit: false, delete: false };
    return acc;
  }, {});

  // State for rolePermissions
  const [rolePermissions, setRolePermissions] = useState(defaultPermissions);

  useEffect(() => {
    if (editRole) {
      setIsEditMode(true);
      console.log("editRole :", editRole);
      setRoleName(editRole.roleName || "");

      const mergedPermissions = { ...defaultPermissions };
      console.log("mergedPermissions (before):", mergedPermissions);

      const rolePermissionsObject = {};
      (editRole.rolePermissions || []).forEach((permission) => {
        rolePermissionsObject[permission.feature] = {
          view: permission.view,
          add: permission.add,
          edit: permission.edit,
          delete: permission.delete,
        };
      });

      Object.keys(rolePermissionsObject).forEach((feature) => {
        if (mergedPermissions[feature]) {
          mergedPermissions[feature] = {
            ...mergedPermissions[feature],
            ...rolePermissionsObject[feature],
          };
        }
      });

      console.log("mergedPermissions (after):", mergedPermissions);
      setRolePermissions(mergedPermissions);
    }
  }, [editRole]);

  const validateForm = () => {
    const newErrors = {};

    if (!roleName.trim()) {
      newErrors.roleName = "Role name is required";
    }

    // Optionally: Ensure at least one permission is selected
    const hasPermission = Object.values(rolePermissions).some(
      (perms) => perms.view || perms.add || perms.edit || perms.delete
    );
    if (!hasPermission) {
      newErrors.permissions = "At least one permission should be selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleNameChange = (e) => {
    setRoleName(e.target.value);
  };

  const handlePermissionChange = (section, permission) => {
    setRolePermissions((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [permission]: !prev[section][permission],
      },
    }));
  };

  const handleSelectAll = (permissionType) => {
    const newrolePermissions = { ...rolePermissions };
    Object.keys(newrolePermissions).forEach((section) => {
      newrolePermissions[section][permissionType] = true;
    });
    setRolePermissions(newrolePermissions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Convert the rolePermissions object to an array

      const roleData = {
        roleName,
        rolePermissions: Object.entries(rolePermissions).map(
          ([key, perms]) => ({
            feature: key,
            ...perms,
          })
        ),
        ...(isEditMode && { id: editRole._id }),
      };

      const response = isEditMode
        ? await rolesApiProvider.updateRole(editRole._id, roleData)
        : await rolesApiProvider.createRole(roleData);

      if (response && response.status) {
        toast.success(
          response.response?.data?.message || "Role saved successfully"
        );
        setShowSuccessModal(true);
        navigate("/user-role-permission");
      } else {
        toast.error(response.response?.message || "Failed to save role");
      }
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(
        error.response?.data?.message || "An error occurred while saving"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="page-content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12">
            <div class="card">
              <div class="p-4 border-top">
                <form onSubmit={handleSubmit}>
                  <div class="row">
                    <div class="col-lg-6">
                      <div class="mb-3">
                        <h5 class="card-title me-2">Role Name</h5>
                        <input
                          id="roleName"
                          name="roleName"
                          type="text"
                          className="form-control"
                          value={roleName}
                          onChange={handleRoleNameChange}
                        //   disabled={isEditMode}
                          required
                        />
                        {errors.roleName && (
                          <div className="text-danger">{errors.roleName}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-xxl-12">
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-wrap align-items-center mb-3">
                  <h5 class="card-title me-2">Role Permissions </h5>
                </div>
                {errors.permissions && (
                  <div className="text-danger mb-2">{errors.permissions}</div>
                )}

                <div class="panel-body">
                  <div>
                    <table class="table table-striped table-centered align-middle table-nowrap mb-0 table-check">
                      <thead>
                        <tr>
                          <th className="th-title">Feature</th>
                          <th>
                            <div class="checkbox-replace">
                              <label class="i-checks align-checkbox">
                                <input
                                  type="checkbox"
                                  id="all_view"
                                  value="1"
                                  onChange={() => handleSelectAll("view")}
                                />
                                View
                              </label>
                            </div>
                          </th>
                          <th>
                            <div class="checkbox-replace">
                              <label class="i-checks align-checkbox">
                                <input
                                  type="checkbox"
                                  id="all_add"
                                  value="1"
                                  onChange={() => handleSelectAll("add")}
                                />
                                Add
                              </label>
                            </div>
                          </th>
                          <th>
                            <div class="checkbox-replace">
                              <label class="i-checks align-checkbox">
                                <input
                                  type="checkbox"
                                  id="all_edit"
                                  value="1"
                                  onChange={() => handleSelectAll("edit")}
                                />
                                Edit
                              </label>
                            </div>
                          </th>
                          <th>
                            <div class="checkbox-replace">
                              <label class="i-checks align-checkbox">
                                <input
                                  type="checkbox"
                                  id="all_delete"
                                  value="1"
                                  onChange={() => handleSelectAll("delete")}
                                />
                                Delete
                              </label>
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Dashboard */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Dashboard
                          </th>
                        </tr>
                        <tr>
                          <td>Dashboard</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`dashboard-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.dashboard[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "dashboard",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Website */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Website
                          </th>
                        </tr>
                        <tr>
                          <td>Home Banner</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`homePage-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={rolePermissions.homePage[permission]}
                                  onChange={() =>
                                    handlePermissionChange(
                                      "homePage",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Catalog */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Catalog
                          </th>
                        </tr>
                        <tr>
                          <td>Categories</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`categories-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.categories[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "categories",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Attributes</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`attributes-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.attributes[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "attributes",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Brands</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`brands-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={rolePermissions.brands[permission]}
                                  onChange={() =>
                                    handlePermissionChange("brands", permission)
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Products</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`products-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={rolePermissions.products[permission]}
                                  onChange={() =>
                                    handlePermissionChange(
                                      "products",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Offers</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`offerCreations-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.offerCreations[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "offerCreations",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Route Creation</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`rootCreation-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.rootCreation[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "rootCreation",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Coupon code</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`couponCreation-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.couponCreation[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "couponCreation",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Orders */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Orders
                          </th>
                        </tr>
                        <tr>
                          <td>Wholesale Orders</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`orderList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.orderList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "orderList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Retailer Orders</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`retailerOrderList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.retailerOrderList[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "retailerOrderList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Customer Orders</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`customerOrder-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.customerOrder[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "customerOrder",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>POS Orders</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`posOrder-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={rolePermissions.posOrder[permission]}
                                  onChange={() =>
                                    handlePermissionChange(
                                      "posOrder",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Return Request</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`returnRequest-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.returnRequest[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "returnRequest",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Order Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`orderReport-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.orderReport[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "orderReport",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Users */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Users
                          </th>
                        </tr>
                        <tr>
                          <td>User List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`usersList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.usersList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "usersList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>User Role & Permission</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`userRolePermission-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.userRolePermission[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "userRolePermission",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Password Management</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`passwordManagement-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.passwordManagement[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "passwordManagement",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>User Activity Logs</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`userActivityLog-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.userActivityLog[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "userActivityLog",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Users Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`usersReport-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.usersReport[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "usersReport",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* POS */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            POS
                          </th>
                        </tr>
                        <tr>
                          <td>POS</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`posNew-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={rolePermissions.posNew[permission]}
                                  onChange={() =>
                                    handlePermissionChange("posNew", permission)
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>POS Order History</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`posOrderHistroy-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.posOrderHistroy[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "posOrderHistroy",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Customer */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Customer
                          </th>
                        </tr>
                        <tr>
                          <td>Customer List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`customerList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.customerList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "customerList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Customer Order History</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`customerOrderHistroy-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.customerOrderHistroy[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "customerOrderHistroy",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Customer Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`customerReports-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.customerReports[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "customerReports",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Wholesalers */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Wholesalers
                          </th>
                        </tr>
                        <tr>
                          <td>Wholesaler List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`wholesalerList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.wholesalerList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "wholesalerList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Wholesaler Orders</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`wholesalerOrderHistory-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.wholesalerOrderHistory[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "wholesalerOrderHistory",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Credit Management</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td
                                key={`wholesalerCreditManagement-${permission}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.wholesalerCreditManagement[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "wholesalerCreditManagement",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Payment & Dues</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`wholesalerPaymentDues-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.wholesalerPaymentDues[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "wholesalerPaymentDues",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Wholesaler Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`wholesalerReports-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.wholesalerReports[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "wholesalerReports",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Retailers */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Retailers
                          </th>
                        </tr>
                        <tr>
                          <td>Retailers List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`retailersList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.retailersList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "retailersList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Retailer Orders</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`retailerOrderHistory-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.retailerOrderHistory[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "retailerOrderHistory",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Credit Management</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td
                                key={`retailerCreditManagement-${permission}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.retailerCreditManagement[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "retailerCreditManagement",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Payment & Dues</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`retailerPaymentDues-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.retailerPaymentDues[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "retailerPaymentDues",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Retailer Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`retailerReports-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.retailerReports[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "retailerReports",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Vendors */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Vendors
                          </th>
                        </tr>
                        <tr>
                          <td>Vendor List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`vendorList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.vendorList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "vendorList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Vendor Purchase List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`vendorOrderList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.vendorOrderList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "vendorOrderList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Vendor Payments</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`vendorPayments-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.vendorPayments[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "vendorPayments",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Payment & Dues</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`vendorPaymentDues-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.vendorPaymentDues[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "vendorPaymentDues",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Vendor Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`vendorReports-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.vendorReports[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "vendorReports",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Salesman */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Salesman
                          </th>
                        </tr>
                        <tr>
                          <td>Salesman List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`salesmanList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.salesmanList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "salesmanList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Targets & Incentives</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td
                                key={`salesmanTargetsIncentives-${permission}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.salesmanTargetsIncentives[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "salesmanTargetsIncentives",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Sales Cash Settlement</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`salesCashSettlement-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.salesCashSettlement[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "salesCashSettlement",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Salesman Performance</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`salesmanPerformance-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.salesmanPerformance[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "salesmanPerformance",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Salesman Order History</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`salesmanOrderHistory-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.salesmanOrderHistory[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "salesmanOrderHistory",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Salesman Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`salesmanReport-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.salesmanReport[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "salesmanReport",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Delivery */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Delivery
                          </th>
                        </tr>
                        <tr>
                          <td>Delivery List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`deliveryList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.deliveryList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "deliveryList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Delivery Tracking Updates</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`deliveryTrackingUpdates-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.deliveryTrackingUpdates[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "deliveryTrackingUpdates",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Delivery Person List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`deliveryPersonList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.deliveryPersonList[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "deliveryPersonList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Delivery Performance</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td
                                key={`deliveryPerformancePayroll-${permission}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.deliveryPerformancePayroll[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "deliveryPerformancePayroll",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Delivery Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`deliveryReports-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.deliveryReports[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "deliveryReports",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Delivery Man Request</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`deliveryManRequest-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.deliveryManRequest[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "deliveryManRequest",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Delivery Man Complaint</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`deliveryManComplaint-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.deliveryManComplaint[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "deliveryManComplaint",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Payment & Credit */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Payment & Credit
                          </th>
                        </tr>
                        <tr>
                          <td>Payment Transaction List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`paymentTransactionList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.paymentTransactionList[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "paymentTransactionList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Record Manual Payment</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`recordManualPayment-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.recordManualPayment[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "recordManualPayment",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Outstanding Payments</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`outstandingPayment-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.outstandingPayment[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "outstandingPayment",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Process Refund</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`processRefund-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.processRefund[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "processRefund",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Payments & Credit Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`paymentCreditReport-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.paymentCreditReport[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "paymentCreditReport",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Inventory */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Inventory
                          </th>
                        </tr>
                        <tr>
                          <td>Add stock</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`addStock-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={rolePermissions.addStock[permission]}
                                  onChange={() =>
                                    handlePermissionChange(
                                      "addStock",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Inventory List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`inventoryList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.inventoryList[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "inventoryList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Inventory Log</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`inventoryLog-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.inventoryLog[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "inventoryLog",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Inventory Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`inventoryReports-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.inventoryReports[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "inventoryReports",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Petty Cash */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Petty Cash
                          </th>
                        </tr>
                        <tr>
                          <td>Petty Cash Transaction List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td
                                key={`pettycashTransactionList-${permission}`}
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.pettycashTransactionList[
                                      permission
                                    ]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "pettycashTransactionList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                        <tr>
                          <td>Petty Cash Reports</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`pettyCashReport-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={
                                    rolePermissions.pettyCashReport[permission]
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      "pettyCashReport",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>

                        {/* Tax */}
                        <tr>
                          <th className="th-title" colSpan="5">
                            Tax
                          </th>
                        </tr>
                        <tr>
                          <td>Tax List</td>
                          {["view", "add", "edit", "delete"].map(
                            (permission) => (
                              <td key={`taxList-${permission}`}>
                                <input
                                  type="checkbox"
                                  checked={rolePermissions.taxList[permission]}
                                  onChange={() =>
                                    handlePermissionChange(
                                      "taxList",
                                      permission
                                    )
                                  }
                                />
                              </td>
                            )
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-8">
          <div className="col text-end">
            <button
              type="button"
              className="btn btn-secondary waves-effect me-2"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Save
            </button>
          </div>
        </div>

        <div
          class="modal fade"
          id="addInvoiceModal"
          tabindex="-1"
          aria-labelledby="addInvoiceModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-scrollable modal-lg modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="addInvoiceModalLabel">
                  Product Details
                </h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body p-4">
                <div class="card-body">
                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Product name : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"></span>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Slug : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"></span>
                    </div>
                  </div>
                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Brand : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"></span>
                    </div>
                  </div>

                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Category : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"></span>
                    </div>
                  </div>

                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Sub category : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"></span>
                    </div>
                  </div>

                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Child Category : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"></span>
                    </div>
                  </div>

                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Selling price : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"> </span>
                    </div>
                  </div>

                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Wholesaler price : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"> </span>
                    </div>
                  </div>

                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Name of Vendor : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"></span>
                    </div>
                  </div>

                  <div class="mb-3 row">
                    <div class="col-md-6">
                      <h5 class="font-size-14 py-2">Product status : </h5>
                    </div>

                    <div class="col-md-6">
                      <span class="float-end fw-normal text-body"></span>
                    </div>
                  </div>
                </div>

                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary waves-effect"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  {/* <!-- <button type="button" class="btn btn-primary waves-effect waves-light">Save changes</button> --> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

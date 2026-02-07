import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, NavLink, useLocation } from "react-router-dom";
import ThemeToggleButton from "../helper/ThemeToggleButton";
import { logout, setUser } from "../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import "boxicons/css/boxicons.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";
import adminUserApi from "../apiProvider/adminuserapi";
import usePermission from "../hook/usePermission";

const MasterLayout = ({ children }) => {
  let [sidebarActive, seSidebarActive] = useState(false);
  let [mobileMenu, setMobileMenu] = useState(false);
  const location = useLocation();
  const disPatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchUserOnRefresh = async () => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.id;
          const userData = await adminUserApi.Userbyid(userId);
          console.log(userData, "userDataertyuioiuytrewertyu");
          if (userData.status) {
            disPatch(setUser(userData.response.data));
          }
        } catch (error) {
          console.error("Error fetching user data on refresh:", error);
        }
      }
    };
    fetchUserOnRefresh();
  }, [token, disPatch]);


  useEffect(() => {
    const handleDropdownClick = (event) => {
      event.preventDefault();
      const clickedLink = event.currentTarget;
      const clickedDropdown = clickedLink.closest(".dropdown");

      if (!clickedDropdown) return;

      const isActive = clickedDropdown.classList.contains("open");

      // Close all dropdowns
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px"; // Collapse submenu
        }
      });

      // Toggle the clicked dropdown
      if (!isActive) {
        clickedDropdown.classList.add("open");
        const submenu = clickedDropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = `${submenu.scrollHeight}px`;
        }
      } else {
        // Dropdown is closing, no need to do anything specific
      }
    };

    // Attach click event listeners to all dropdown triggers
    // Use a timeout to ensure DOM is ready, especially after component mount
    const attachEventListeners = () => {
      const dropdownTriggers = document.querySelectorAll(
        ".sidebar-menu .dropdown > a"
      );

      if (dropdownTriggers.length === 0) {
        // Retry if elements not found yet
        setTimeout(attachEventListeners, 50);
        return;
      }

      dropdownTriggers.forEach((trigger) => {
        // Remove existing listener to prevent duplicates
        trigger.removeEventListener("click", handleDropdownClick);
        trigger.addEventListener("click", handleDropdownClick);
      });
    };

    attachEventListeners();

    const openActiveDropdown = () => {
      const allDropdowns = document.querySelectorAll(".sidebar-menu .dropdown");

      // If dropdowns are not found, retry after a short delay (for page refresh scenarios)
      if (allDropdowns.length === 0) {
        setTimeout(() => {
          openActiveDropdown();
        }, 100);
        return;
      }

      // Close all dropdowns first to ensure fresh state
      allDropdowns.forEach((dropdown) => {
        dropdown.classList.remove("open");
        const submenu = dropdown.querySelector(".sidebar-submenu");
        if (submenu) {
          submenu.style.maxHeight = "0px";
        }
      });

      // Try to find active dropdown based on current route
      allDropdowns.forEach((dropdown) => {
        const submenuLinks = dropdown.querySelectorAll(".sidebar-submenu li a");
        submenuLinks.forEach((link) => {
          if (
            link.getAttribute("href") === location.pathname ||
            link.getAttribute("to") === location.pathname
          ) {
            dropdown.classList.add("open");
            const submenu = dropdown.querySelector(".sidebar-submenu");
            if (submenu) {
              submenu.style.maxHeight = `${submenu.scrollHeight}px`; // Expand submenu
            }
          }
        });
      });
    };

    // Open the submenu that contains the active route
    // Use setTimeout to ensure DOM is fully rendered, especially on page refresh
    const timeoutId = setTimeout(() => {
      openActiveDropdown();
    }, 0);

    // Cleanup event listeners on unmount
    return () => {
      clearTimeout(timeoutId);
      // Clean up all dropdown event listeners
      const dropdownTriggers = document.querySelectorAll(
        ".sidebar-menu .dropdown > a"
      );
      dropdownTriggers.forEach((trigger) => {
        trigger.removeEventListener("click", handleDropdownClick);
      });
    };
  }, [location.pathname]);

  let sidebarControl = () => {
    seSidebarActive(!sidebarActive);
  };

  let mobileMenuControl = () => {
    setMobileMenu(!mobileMenu);
  };
  const logOutFunct = () => {
    disPatch(logout());
  };
  // Dashboard
  const canViewDashboard = usePermission("dashboard", "view");

  // Website
  const canViewHomePage = usePermission("homePage", "view");
  const canViewWebsite = canViewHomePage;

  // Catalog
  const canViewCategories = usePermission("categories", "view");
  const canViewAttributes = usePermission("attributes", "view");
  const canViewBrands = usePermission("brands", "view");
  const canViewProducts = usePermission("products", "view");
  const canViewOfferCreations = usePermission("offerCreations", "view");
  const canViewRootCreation = usePermission("rootCreation", "view");
  const canViewCouponCreation = usePermission("couponCreation", "view");
  const canViewCatalog = canViewCategories || canViewAttributes || canViewBrands || canViewProducts || canViewOfferCreations || canViewRootCreation || canViewCouponCreation;

  // Orders
  const canViewOrderList = usePermission("orderList", "view");
  const canViewRetailerOrderList = usePermission("retailerOrderList", "view");
  const canViewCustomerOrder = usePermission("customerOrder", "view");
  const canViewPosOrder = usePermission("posOrder", "view");
  const canViewReturnRequest = usePermission("returnRequest", "view");
  const canViewOrderReport = usePermission("orderReport", "view");
  const canViewOrders = canViewOrderList || canViewRetailerOrderList || canViewCustomerOrder || canViewPosOrder || canViewReturnRequest || canViewOrderReport;

  // Users
  const canViewUsersList = usePermission("usersList", "view");
  const canViewUserRolePermission = usePermission("userRolePermission", "view");
  const canViewPasswordManagement = usePermission("passwordManagement", "view");
  const canViewUserActivityLog = usePermission("userActivityLog", "view");
  const canViewUsersReport = usePermission("usersReport", "view");
  const canViewUsers = canViewUsersList || canViewUserRolePermission || canViewPasswordManagement || canViewUserActivityLog || canViewUsersReport;

  // POS
  const canViewPosNew = usePermission("posNew", "view");
  const canViewPosOrderHistroy = usePermission("posOrderHistroy", "view");
  const canViewPOS = canViewPosNew || canViewPosOrderHistroy;

  // CRM
  const canViewCrmUserList = usePermission("crmUserList", "view");
  const canViewCrmNew = usePermission("crmNew", "view");
  const canViewCrmOrderHistroy = usePermission("crmOrderHistroy", "view");
  const canViewCRM = canViewCrmUserList || canViewCrmNew || canViewCrmOrderHistroy;

  // Customer
  const canViewCustomerList = usePermission("customerList", "view");
  const canViewCustomerOrderHistroy = usePermission("customerOrderHistroy", "view");
  const canViewCustomerReports = usePermission("customerReports", "view");
  const canViewCustomer = canViewCustomerList || canViewCustomerOrderHistroy || canViewCustomerReports;

  // Wholesalers
  const canViewWholesalerList = usePermission("wholesalerList", "view");
  const canViewWholesalerOrderHistory = usePermission("wholesalerOrderHistory", "view");
  const canViewWholesalerCreditManagement = usePermission("wholesalerCreditManagement", "view");
  const canViewWholesalerPaymentDues = usePermission("wholesalerPaymentDues", "view");
  const canViewWholesalerReports = usePermission("wholesalerReports", "view");
  const canViewWholesalers = canViewWholesalerList || canViewWholesalerOrderHistory || canViewWholesalerCreditManagement || canViewWholesalerPaymentDues || canViewWholesalerReports;

  // Retailers
  const canViewRetailersList = usePermission("retailersList", "view");
  const canViewRetailerOrderHistory = usePermission("retailerOrderHistory", "view");
  const canViewRetailerCreditManagement = usePermission("retailerCreditManagement", "view");
  const canViewRetailerPaymentDues = usePermission("retailerPaymentDues", "view");
  const canViewRetailerReports = usePermission("retailerReports", "view");
  const canViewRetailers = canViewRetailersList || canViewRetailerOrderHistory || canViewRetailerCreditManagement || canViewRetailerPaymentDues || canViewRetailerReports;

  // Vendors
  const canViewVendorList = usePermission("vendorList", "view");
  const canViewVendorOrderList = usePermission("vendorOrderList", "view");
  const canViewVendorPayments = usePermission("vendorPayments", "view");
  const canViewVendorPaymentDues = usePermission("vendorPaymentDues", "view");
  const canViewVendorReports = usePermission("vendorReports", "view");
  const canViewVendors = canViewVendorList || canViewVendorOrderList || canViewVendorPayments || canViewVendorPaymentDues || canViewVendorReports;

  // Salesman
  const canViewSalesmanList = usePermission("salesmanList", "view");
  const canViewSalesmanTargetsIncentives = usePermission("salesmanTargetsIncentives", "view");
  const canViewSalesmanPerformance = usePermission("salesmanPerformance", "view");
  const canViewSalesmanOrderHistory = usePermission("salesmanOrderHistory", "view");
  const canViewSalesmanReport = usePermission("salesmanReport", "view");
  const canViewSalesCashSettlement = usePermission("salesCashSettlement", "view");
  const canViewSalesman = canViewSalesmanList || canViewSalesmanTargetsIncentives || canViewSalesmanPerformance || canViewSalesmanOrderHistory || canViewSalesmanReport || canViewSalesCashSettlement;

  // Delivery
  const canViewDeliveryList = usePermission("deliveryList", "view");
  const canViewDeliveryTrackingUpdates = usePermission("deliveryTrackingUpdates", "view");
  const canViewDeliveryPersonList = usePermission("deliveryPersonList", "view");
  const canViewDeliveryPerformancePayroll = usePermission("deliveryPerformancePayroll", "view");
  const canViewDeliveryReports = usePermission("deliveryReports", "view");
  const canViewDelivery = canViewDeliveryList || canViewDeliveryTrackingUpdates || canViewDeliveryPersonList || canViewDeliveryPerformancePayroll || canViewDeliveryReports;

  // Payment & Credit
  const canViewPaymentTransactionList = usePermission("paymentTransactionList", "view");
  const canViewRecordManualPayment = usePermission("recordManualPayment", "view");
  const canViewOutstandingPayment = usePermission("outstandingPayment", "view");
  const canViewProcessRefund = usePermission("processRefund", "view");
  const canViewPaymentCreditReport = usePermission("paymentCreditReport", "view");
  const canViewPaymentAndCredit = canViewPaymentTransactionList || canViewRecordManualPayment || canViewOutstandingPayment || canViewProcessRefund || canViewPaymentCreditReport;

  // Inventory
  const canViewAddStock = usePermission("addStock", "view");
  const canViewInventoryList = usePermission("inventoryList", "view");
  const canViewInventoryLog = usePermission("inventoryLog", "view");
  const canViewInventoryReports = usePermission("inventoryReports", "view");
  const canViewInventory = canViewAddStock || canViewInventoryList || canViewInventoryLog || canViewInventoryReports;

  // Petty Cash
  const canViewPettycashTransactionList = usePermission("pettycashTransactionList", "view");
  const canViewPettyCashReport = usePermission("pettyCashReport", "view");
  const canViewPettyCash = canViewPettycashTransactionList || canViewPettyCashReport;

  // Tax
  const canViewTaxList = usePermission("taxList", "view");
  const canViewTax = canViewTaxList;
  return (
    <section className={mobileMenu ? "overlay active" : "overlay "}>
      {/* sidebar */}
      <aside
        className={
          sidebarActive
            ? "sidebar active "
            : mobileMenu
              ? "sidebar sidebar-open"
              : "sidebar"
        }
      >
        <button
          onClick={mobileMenuControl}
          type="button"
          className="sidebar-close-btn"
        >
          <Icon icon="radix-icons:cross-2" />
        </button>
        <div>
          <Link to="/dashboard" className="sidebar-logo" style={{ backgroundColor: "#fdfdfd" }} >
            <img
              src="/assets/images/logo/Colors-logo.jpg"
              alt="site logo"
              className="light-logo w-100"
            />
            <img
              src="/assets/images/logo/Colors-logo.jpg"
              alt="site logo"
              className="dark-logo w-100"
            />
            <img
              src="/assets/images/logo/Colors-logo.jpg"
              alt="site logo"
              className="logo-icon w-100"
            />
          </Link>
        </div>
        <div className="sidebar-menu-area">
          <ul className="sidebar-menu" id="sidebar-menu">
            {canViewDashboard && (
              <li className="sidebar-menu-group-title">
                <NavLink to="/dashboard" className={(navData) =>
                  navData.isActive ? "active-page" : ""
                }>
                  <Icon icon="bx:bx-home-alt" className="menu-icon" />
                  Dashboard
                </NavLink>
              </li>
            )}

            {/* Website (Banner) */}
            {canViewWebsite && (
              <li className="dropdown">
                <Link to="#">
                  <Icon icon="mdi:web" className="menu-icon" />
                  <span>Website</span>
                </Link>
                <ul className="sidebar-submenu">
                  {canViewHomePage && (
                    <li>
                      <NavLink to="/home-page" className={(navData) => navData.isActive ? "active-page" : ""}>
                        Home Banner
                      </NavLink>
                    </li>
                  )}
                </ul>
              </li>
            )}

            {/* Catalog */}
            {canViewCatalog && (
              <li className="dropdown">
                <Link to="#">
                  <Icon icon="bx:category" className="menu-icon" />
                  <span>Catalog</span>
                </Link>
                <ul className="sidebar-submenu">
                  {canViewCategories && (
                    <li><NavLink to="/category" className={(navData) => navData.isActive ? "active-page" : ""}>Categories</NavLink></li>
                  )}
                  {canViewAttributes && (
                    <li><NavLink to="/attribute" className={(navData) => navData.isActive ? "active-page" : ""}>Attributes</NavLink></li>
                  )}
                  {canViewBrands && (
                    <li><NavLink to="/brand" className={(navData) => navData.isActive ? "active-page" : ""}>Brands</NavLink></li>
                  )}
                  {canViewTaxList && (
                    <li><NavLink to="/tax-list" className={(navData) => navData.isActive ? "active-page" : ""}>Tax</NavLink></li>
                  )}
                  {canViewProducts && (
                    <li><NavLink to="/product" className={(navData) => navData.isActive ? "active-page" : ""}>Products</NavLink></li>
                  )}
                </ul>
              </li>
            )}

            {/* Orders */}
            {canViewOrders && (
              <li className="dropdown">
                <Link to="#">
                  <Icon icon="mdi:order-bool-ascending" className="menu-icon" />
                  <span>Orders</span>
                </Link>
                <ul className="sidebar-submenu">
                  {canViewCustomerOrder && (
                    <li><NavLink to="/customer-order" className={(navData) => navData.isActive ? "active-page" : ""}>Customer Orders</NavLink></li>
                  )}
                  {canViewReturnRequest && (
                    <li><NavLink to="/return-request" className={(navData) => navData.isActive ? "active-page" : ""}>Return Orders</NavLink></li>
                  )}
                  <li><NavLink to="/cancelled-order" className={(navData) => navData.isActive ? "active-page" : ""}>Cancelled Orders</NavLink></li>
                </ul>
              </li>
            )}

            {/* Users */}
            {canViewUsers && (
              <li className="dropdown">
                <Link to="#">
                  <Icon icon="bx:user" className="menu-icon" />
                  <span>Users</span>
                </Link>
                <ul className="sidebar-submenu">
                  {canViewUsersList && (
                    <li><NavLink to="/users-list" className={(navData) => navData.isActive ? "active-page" : ""}>User List</NavLink></li>
                  )}
                  {canViewUserRolePermission && (
                    <li><NavLink to="/user-role-permission" className={(navData) => navData.isActive ? "active-page" : ""}>User Role & Permission</NavLink></li>
                  )}
                  {canViewCustomerList && (
                    <li><NavLink to="/customer-list" className={(navData) => navData.isActive ? "active-page" : ""}>Customer List</NavLink></li>
                  )}
                </ul>
              </li>
            )}

            {/* Vendor */}
            {canViewVendors && (
              <li className="dropdown">
                <Link to="#">
                  <Icon icon="mdi:store" className="menu-icon" />
                  <span>Vendor</span>
                </Link>
                <ul className="sidebar-submenu">
                  {canViewVendorList && (
                    <li><NavLink to="/vendor-list" className={(navData) => navData.isActive ? "active-page" : ""}>Vendor List</NavLink></li>
                  )}
                  <li><NavLink to="/vendor-purchase" className={(navData) => navData.isActive ? "active-page" : ""}>Vendor Purchase</NavLink></li>
                </ul>
              </li>
            )}

            {/* Reports */}
            <li className="dropdown">
              <Link to="#">
                <Icon icon="mdi:chart-bar" className="menu-icon" />
                <span>Reports</span>
              </Link>
              <ul className="sidebar-submenu">
                <li><NavLink to="/product-report" className={(navData) => navData.isActive ? "active-page" : ""}>Product Reports</NavLink></li>
              </ul>
            </li>
          </ul>
        </div >
      </aside >

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={sidebarControl}
                >
                  {sidebarActive ? (
                    <Icon
                      icon="iconoir:arrow-right"
                      className="icon text-2xl non-active"
                    />
                  ) : (
                    <Icon
                      icon="heroicons:bars-3-solid"
                      className="icon text-2xl non-active "
                    />
                  )}
                </button>
                <button
                  onClick={mobileMenuControl}
                  type="button"
                  className="sidebar-mobile-toggle"
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                {/* ThemeToggleButton */}
                {/* <ThemeToggleButton /> */}

                {/* Notification dropdown end */}
                <div className="dropdown">
                  <button
                    className="d-flex justify-content-center align-items-center rounded-circle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <img
                      src="/assets/images/admin_profile.png"
                      alt="image_user"
                      className="w-40-px h-40-px object-fit-cover rounded-circle"
                    />
                  </button>
                  <div className="dropdown-menu to-top dropdown-menu-sm">
                    <div className="py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2">
                      <div>
                        <h6 className="text-lg text-primary-light fw-semibold mb-2">
                          {user?.name || ''}
                        </h6>
                        <span className="text-secondary-light fw-medium text-sm">
                          {user?.role?.roleName || user?.role || user?.type || ''}
                        </span>
                      </div>
                      <button type="button" className="hover-text-danger">
                        <Icon
                          icon="radix-icons:cross-1"
                          className="icon text-xl"
                        />
                      </button>
                    </div>
                    <ul className="to-top-list">
                      {/* <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/view-profile'
                        >
                          <Icon
                            icon='solar:user-linear'
                            className='icon text-xl'
                          />{" "}
                          My Profile
                        </Link>
                      </li> 
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/email'
                        >
                          <Icon
                            icon='tabler:message-check'
                            className='icon text-xl'
                          />{" "}
                          Inbox
                        </Link>
                      </li> 
                      <li>
                        <Link
                          className='dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'
                          to='/company'
                        >
                          <Icon
                            icon='icon-park-outline:setting-two'
                            className='icon text-xl'
                          />
                          Setting
                        </Link>
                      </li> */}
                      <li onClick={logOutFunct}>
                        <Link
                          className="dropdown-item text-black px-0 py-8 hover-bg-transparent hover-text-danger d-flex align-items-center gap-3"
                          to="/"
                        >
                          <Icon icon="lucide:power" className="icon text-xl" />{" "}
                          Log Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
                {/* Profile dropdown end */}
              </div>
            </div>
          </div>
        </div>

        {/* dashboard-main-body */}
        <div className="dashboard-main-body">{children}</div>
        <ToastContainer position="top-right" autoClose={3000} />

        {/* Footer section */}
        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0">© {new Date().getFullYear()} COLORS BOUTIQUE. All Rights Reserved.</p>
            </div>
            <div className="col-auto">
              <p className="mb-0">
                Developed & Maintained By{" "}
                <span className="text-primary-600">Ocean Softwares</span>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section >
  );
};

export default MasterLayout;

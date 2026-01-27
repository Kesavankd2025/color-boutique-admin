import React, { createContext, useState, useContext } from "react";

// Create Context
const AlertContext = createContext();

// Custom hook to use Alert Context
export const useAlert = () => useContext(AlertContext);

// Alert Provider Component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  // Function to show alert
  const showAlert = (message, type = "success") => {
    setAlert({ message, type });

    // Hide alert after 3 seconds
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
      {alert && <GlobalAlert message={alert.message} type={alert.type} />}
    </AlertContext.Provider>
  );
};

// Global Alert Component
const GlobalAlert = ({ message, type }) => {
  return (
    <div
      className={`alert alert-${type} bg-${type}-600 text-white border-${type}-600 px-24 py-11 mb-0 fw-semibold text-lg radius-8 d-flex align-items-center justify-content-between`}
      role="alert"
      style={{position:"fixed",top:'10px',right:"10px", width:"350px"}}
    >
      {message}
      <button className="remove-button text-white text-xxl line-height-1">
        <i className="icon iconamoon:sign-times-light" />
      </button>
    </div>
  );
};

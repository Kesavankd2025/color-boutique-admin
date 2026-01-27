import React from "react";
import { Icon } from "@iconify/react";

const AccessDeniedLayer = () => {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Main Content */}
      <main className="flex-grow-1 d-flex align-items-center">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6 text-center">
              <div className="position-relative d-inline-block">
                <div className="position-absolute w-100 h-100 bg-primary-100 rounded-circle" style={{ top: '10px', left: '10px' }}></div>
                <div className="position-relative bg-white p-4 rounded-circle shadow" style={{ width: '150px', height: '150px' }}>
                  <Icon
                    icon="mdi:shield-lock"
                    className="text-danger"
                    style={{ fontSize: '5rem' }}
                  />
                </div>
              </div>

              <h1 className="fw-bold text-gray-800 mb-4">
                Access Restricted
              </h1>

              <p className="lead text-muted mb-5">
                You don't have permission to access this page.
            Contact your system admin to request the necessary permissions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccessDeniedLayer;

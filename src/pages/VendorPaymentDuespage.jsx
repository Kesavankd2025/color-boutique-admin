import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import VendorPaymentDues from "../components/VendorPaymentDuesLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const VendorPaymentDuesPage = () => {
    const hasPermission = usePermission("vendorPaymentDues", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Payment & Dues" header="Payment & Dues" />

        {/* UsersListLayer */}
        {hasPermission ? <VendorPaymentDues /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default VendorPaymentDuesPage;

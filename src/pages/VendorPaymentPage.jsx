import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import VendorPayment from "../components/VendorPaymentLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const VendorPaymentPage = () => {
    const hasPermission = usePermission("vendorPayments", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Vendor Payment" header="Vendor Payment" />

        {/* UsersListLayer */}
        {hasPermission ? <VendorPayment /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default VendorPaymentPage;

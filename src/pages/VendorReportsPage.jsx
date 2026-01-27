import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import VendorReport from "../components/VendorReportsLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const VendorReportsPage = () => {
    const hasPermission = usePermission("vendorReports", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Vendor Reports" header="Vendor Reports"  button="Vendor Reports"/>

        {/* FormPageLayer */}
        {hasPermission ? <VendorReport /> : <AccessDeniedLayer />}
      </MasterLayout>

    </>
  );
};

export default VendorReportsPage;

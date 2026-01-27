import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RetailerReportLayer from "../components/RetailerReportsLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const RetailerReportPage = () => {
  const hasPermission = usePermission("retailerReports", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Retailer Report" />

        {/* Retailer Report */}
        {hasPermission ? <RetailerReportLayer /> : <AccessDeniedLayer />}

      </MasterLayout>
    </>
  );
};

export default RetailerReportPage;

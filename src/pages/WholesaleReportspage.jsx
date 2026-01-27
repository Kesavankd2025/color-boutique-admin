import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WholesalerReport from "../components/WholesaleReportsLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const WholesaleReportPage = () => {
  const hasPermission = usePermission("wholesalerReports", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Category Form" header="Wholesaler Reports"  button="Wholesaler Reports"/>

        {/* FormPageLayer */}
        {hasPermission ? <WholesalerReport /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default WholesaleReportPage;

import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import TaxListLayer from "../components/TaxListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const TaxListPage = () => {
    const hasPermission = usePermission("taxList", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        {/* <Breadcrumb title="Tax List " /> */}
        <Breadcrumb title="Tax List" header="Tax List" />

        {/* Tax List */}
        {hasPermission ? <TaxListLayer /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default TaxListPage; 

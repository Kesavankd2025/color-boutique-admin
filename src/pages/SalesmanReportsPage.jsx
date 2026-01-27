import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SalesmanReport from "../components/SalesmanReportsLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const SalesmanReportsPage = () => {
  const hasPermission = usePermission("salesmanReport", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Salesman Report" header="Salesman Reports "  />

        {/* FormPageLayer */}
        {hasPermission ? <SalesmanReport /> : <AccessDeniedLayer />}


      </MasterLayout>

    </>
  );
};

export default SalesmanReportsPage;

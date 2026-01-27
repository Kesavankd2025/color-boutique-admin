import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";
import SalesmanPerformance from "../components/SalesmanPerformanceLayer";
const SalesmanPerformancePage = () => {
  const hasPermission = usePermission("salesmanPerformance", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Salesman Performance" header="Salesman " />

        {/* UsersListLayer */}
        {hasPermission ? <SalesmanPerformance /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default SalesmanPerformancePage;

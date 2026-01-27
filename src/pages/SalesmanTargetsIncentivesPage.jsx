import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SalesmanTargetIncentive from "../components/SalesmanTargetIncentivesLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const SalesmanTargetsIncentivesPage = () => {
    const hasPermission = usePermission("salesmanTargetsIncentives", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Salesman Targets & Incentives" header="Salesman Targets & Incentives" />

        {/* FormPageLayer */}
        {hasPermission ? <SalesmanTargetIncentive /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default SalesmanTargetsIncentivesPage;

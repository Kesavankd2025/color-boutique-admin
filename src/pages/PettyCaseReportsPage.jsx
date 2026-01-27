import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PettyCashReportsLayer from "../components/PettyCaseReportsLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const PettyCashReportsPage = () => {
    const hasPermission = usePermission("pettyCashReport", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Petty Cash Reports  " />

        {/* Petty Cash Reports  */}
        {hasPermission ? <PettyCashReportsLayer /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default PettyCashReportsPage; 
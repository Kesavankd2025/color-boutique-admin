import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

import ProcessRefund from "../components/ProcessRefund";

const ProcessRefundPage = () => {
    const hasPermission = usePermission("processRefund", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Process Refund" header="Process Refund" />

        {/* UsersListLayer */}
        {hasPermission ? <ProcessRefund /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default ProcessRefundPage;

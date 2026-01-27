import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


import ReportPayment from "../components/ReportPayment";

const ReportPaymentPage = () => {
    const hasPermission = usePermission("recordManualPayment", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Record Manual Payment" header="Record Manual Payment" />

        {/* UsersListLayer */}
        {hasPermission ? <ReportPayment /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default ReportPaymentPage;

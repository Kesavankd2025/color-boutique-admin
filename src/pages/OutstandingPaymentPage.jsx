import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


import OutstandingPayment from "../components/OutstandingPayment";

const OutstandingPaymentPage = () => {
    const hasPermission = usePermission("outstandingPayment", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Outstanding Payments" header="Outstanding Payments" />

        {/* UsersListLayer */}
        {hasPermission ? <OutstandingPayment /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default OutstandingPaymentPage;

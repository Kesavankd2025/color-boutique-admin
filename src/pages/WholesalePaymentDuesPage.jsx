import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WholesalePaymentDues from "../components/WholesalePaymentDuesLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const WholesalePaymentDuesPage = () => {
    const hasPermission = usePermission("wholesalerPaymentDues", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Payment & Dues" header="Wholesaler Payment & Dues" />

        {/* UsersListLayer */}
        {hasPermission ? <WholesalePaymentDues /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default WholesalePaymentDuesPage;

import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RetailerPaymentAndDuesLayer from "../components/PaymentAndDuesLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const PaymentAndDuesPage = () => {
  const hasPermission = usePermission("retailerPaymentDues", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Payment And Dues" />

        {/* Payment And Dues*/}
        {hasPermission ? <RetailerPaymentAndDuesLayer /> : <AccessDeniedLayer />}

      </MasterLayout>
    </>
  );
};

export default PaymentAndDuesPage;

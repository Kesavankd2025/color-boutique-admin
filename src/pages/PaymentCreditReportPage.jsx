import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PaymentCreditReportLayer from "../components/PaymentCreditReportlayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const PaymentCreditReportPage = () => {
    const hasPermission = usePermission("paymentCreditReport", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Category Form" header="Payment Credit Report"  button="Payment Credit Report"/>

        {/* FormPageLayer */}
        {hasPermission ? <PaymentCreditReportLayer /> : <AccessDeniedLayer />}


      </MasterLayout>

    </>
  );
};

export default PaymentCreditReportPage;

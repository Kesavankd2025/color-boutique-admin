import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";
import RetailerCreditManagementLayer from "../components/RetailerCreditManagementLayer";

const CreditManagementPage = () => {
  const hasPermission = usePermission("retailerCreditManagement", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Retailer Credit Management" header="Retailer Credit Management" />

        {/* Credit Management */}
        {hasPermission ? <RetailerCreditManagementLayer /> : <AccessDeniedLayer />}
      </MasterLayout>

    </>
  );
};

export default CreditManagementPage;

import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


import WholesaleCreditManagement from "../components/WholesaleCreditManagementLayer";

const UsersListPage = () => {
    const hasPermission = usePermission("wholesalerCreditManagement", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Wholesaler Order History" header="Wholesaler Credit Management" />

        {/* UsersListLayer */}
        {hasPermission ? <WholesaleCreditManagement /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default UsersListPage;

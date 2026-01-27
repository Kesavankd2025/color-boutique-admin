import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


import WholesaleOrderHistory from "../components/wholsaleOrderHistoryLayer";

const UsersListPage = () => {
    const hasPermission = usePermission("wholesalerOrderHistory", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Wholesaler Orders" header="Wholesaler Orders" />

        {/* UsersListLayer */}
        {hasPermission ? <WholesaleOrderHistory /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default UsersListPage;

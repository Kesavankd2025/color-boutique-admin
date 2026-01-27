import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

import SalesmanOrderHistory from "../components/SalesmanOrderHistoryLayer";

const SalesmanOrderHistoryPage = () => {
  const hasPermission = usePermission("salesmanOrderHistory", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Salesman List" header="Salesman List" />

        {/* UsersListLayer */}
        {hasPermission ? <SalesmanOrderHistory /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default SalesmanOrderHistoryPage;

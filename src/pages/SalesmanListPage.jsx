import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

import SalesmanList from "../components/SalesmanListLayer";

const SalesmanListPage = () => {
    const hasPermission = usePermission("salesmanList", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Salesman" header="Salesman" />

        {/* UsersListLayer */}
        {hasPermission ? <SalesmanList /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default SalesmanListPage;

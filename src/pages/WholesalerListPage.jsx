import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


import WholeSalerPage from "../components/WholesalerList";

const UsersListPage = () => {
    const hasPermission = usePermission("wholesalerList", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Wholesaler List" header="Wholesaler" />

        {/* UsersListLayer */}
        {hasPermission ? <WholeSalerPage /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default UsersListPage;

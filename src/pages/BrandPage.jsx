import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import BrandPage from "../components/BrandPage";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const BrandPageRoutes = () => {
  const hasPermission = usePermission("brands", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Brand" header="Brand List" />

        {/* UsersListLayer */}
        {hasPermission ? <BrandPage /> : <AccessDeniedLayer/>}

      </MasterLayout>

    </>
  );
};

export default BrandPageRoutes;

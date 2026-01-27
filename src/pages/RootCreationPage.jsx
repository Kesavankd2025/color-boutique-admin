import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RootCreationListLayer from "../components/RootCreationPageLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const RootCreationListPage = () => {
  const hasPermission = usePermission("rootCreation", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Route  Creation " header= "Route  Creation List" />

        {/* Delivery Person List  */}
        {hasPermission ? <RootCreationListLayer /> : <AccessDeniedLayer/>}


      </MasterLayout>
    </>
  );
};

export default RootCreationListPage;

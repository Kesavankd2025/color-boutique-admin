import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";

import AttributePage from "../components/AttributPage";
import AccessDeniedLayer from "../components/AccessDeniedLayer";
import usePermission from "../hook/usePermission";

const AttributePageRoutes = () => {
  const hasPermission = usePermission("attributes", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Attributes" header="Attributes" />

        {/* UsersListLayer */}
        {hasPermission ? <AttributePage /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default AttributePageRoutes;

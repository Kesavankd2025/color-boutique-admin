import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ReturnRequestLayer from "../components/ReturnRequestLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const ReturnRequest = () => {
  const hasPermission = usePermission("returnRequest", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Return Request " header="Return Request" />

        {/* UsersListLayer */}
        {hasPermission ? <ReturnRequestLayer /> : <AccessDeniedLayer />}

      </MasterLayout>
    </>
  );
};

export default ReturnRequest; 
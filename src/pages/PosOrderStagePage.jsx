import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb"
import PosOrderPageLayer from "../components/PosOrderStage";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const PosOrderPage = () => {
  const hasPermission = usePermission("posOrder", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="POS Order"  header="POS Order "/>

        {/* EmailLayer */}
        {hasPermission ? <PosOrderPageLayer /> : <AccessDeniedLayer />}

      </MasterLayout>
    </>
  );
};

export default PosOrderPage;

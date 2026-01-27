import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb"
import PosOrderPageLayer from "../components/PosOrderPageLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const PosOrders = () => {
    const hasPermission = usePermission("posOrderHistroy", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="POS Order"  header="POS Order List"/>

        {/* EmailLayer */}
        {hasPermission ? <PosOrderPageLayer /> : <AccessDeniedLayer />}

      </MasterLayout>
    </>
  );
};

export default PosOrders;

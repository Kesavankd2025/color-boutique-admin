import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveryListLayer from "../components/DeliveryListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const DeliveryListPage = () => {
  const hasPermission = usePermission("deliveryList", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Delivery List" />

        {/* Delivery List */}
        {hasPermission ? <DeliveryListLayer /> : <AccessDeniedLayer />}


      </MasterLayout>
    </>
  );
};

export default DeliveryListPage;

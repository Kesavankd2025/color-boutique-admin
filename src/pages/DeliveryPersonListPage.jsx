import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveryPersonListLayer from "../components/DeleveryPersonListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const DeliveryPersonListPage = () => {
  const hasPermission = usePermission("deliveryPersonList", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Delivery Person List " />

        {/* Delivery Person List  */}
        {hasPermission ? <DeliveryPersonListLayer /> : <AccessDeniedLayer />}

      </MasterLayout>
    </>
  );
};

export default DeliveryPersonListPage;

import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveryTrackingUpdateLayer from "../components/DeliveryTrackingUpdateLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const DeliveryTrackingUpdatePage = () => {
  const hasPermission = usePermission("deliveryTrackingUpdates", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Delivery Tracking Update" />

        {/* Delivery Tracking Update */}
        {hasPermission ? <DeliveryTrackingUpdateLayer /> : <AccessDeniedLayer />}

      </MasterLayout>
    </>
  );
};

export default DeliveryTrackingUpdatePage;

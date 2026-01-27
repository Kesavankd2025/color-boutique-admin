import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveryReportsLayer from "../components/DeliveryReportsLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const DeliveryReportsPage = () => {
  const hasPermission = usePermission("deliveryReports", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Delivery Reports " />

        {/* Delivery Reports  */}
        {hasPermission ? <DeliveryReportsLayer /> : <AccessDeniedLayer />}


      </MasterLayout>
    </>
  );
};

export default DeliveryReportsPage;

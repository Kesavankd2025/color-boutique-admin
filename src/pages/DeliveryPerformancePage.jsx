import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveryPerformanceLayer from "../components/DeliveryPerformanceLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const DeliveryPerformancePage = () => {
  const hasPermission = usePermission("deliveryPerformancePayroll", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Delivery Performance " />

        {/* Delivery Performance  */}
        {hasPermission ? <DeliveryPerformanceLayer /> : <AccessDeniedLayer />}


      </MasterLayout>
    </>
  );
};

export default DeliveryPerformancePage;

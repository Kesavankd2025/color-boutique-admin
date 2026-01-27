import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb"
import CustomerOrderLayer from "../components/CustomerOrderStagePage";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";



const CustomerOrderStages = () => {
    const hasPermission = usePermission("customerOrderHistroy", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Customer Order"  header="Customer Order List"/>

        {/* EmailLayer */}
        {hasPermission ? <CustomerOrderLayer /> : <AccessDeniedLayer />}


      </MasterLayout>
    </>
  );
};

export default CustomerOrderStages;

import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WholeSaleOrdersLayer from "../components/WholeSaleOrdersLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";



const OrdersListPage = () => {
  const hasPermission = usePermission("orderList", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Wholesale Order List" header="Wholesale Order List" />

        {/* Wholesale Order List */}
        {hasPermission ? <WholeSaleOrdersLayer /> : <AccessDeniedLayer/>}

      </MasterLayout>

    </>
  );
};

export default OrdersListPage;

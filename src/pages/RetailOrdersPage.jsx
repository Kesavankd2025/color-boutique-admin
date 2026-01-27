import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RetailersOrdersLayer from "../components/RetailerOrderPageLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const OrdersListPage = () => {
  const hasPermission = usePermission("retailerOrderList", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Retailer Order List" header="Retailer Order List" />

        {/* Wholesale Order List */}
        {hasPermission ? <RetailersOrdersLayer /> : <AccessDeniedLayer />}
      </MasterLayout>
    </>
  );
};

export default OrdersListPage;

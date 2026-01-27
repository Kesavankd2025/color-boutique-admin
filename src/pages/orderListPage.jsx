import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import OrderListLayer from "../components/CreateOrderListLayer";



const OrderListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        {/* <Breadcrumb title="Orders List" /> */}

        {/* PaginationLayer */}
        <OrderListLayer />

      </MasterLayout>

    </>
  );
};

export default OrderListPage; 

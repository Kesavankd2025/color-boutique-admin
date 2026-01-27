import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import OrdersInvoiceDetailLayer from "../components/OrdersInvoiceDetailLayer";


const OrdersInvoiceDetailPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Wholesaler Order Details" header="Wholesaler Order Details" />

        {/* UsersListLayer */}
        <OrdersInvoiceDetailLayer />

      </MasterLayout>

    </>
  );
};

export default OrdersInvoiceDetailPage;

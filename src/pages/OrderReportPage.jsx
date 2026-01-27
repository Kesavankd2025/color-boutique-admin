import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import OrderReportLayer from "../components/OrderReportLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const OrderReportPage = () => {
  const hasPermission = usePermission("orderReport", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Order Report" header="Order Report" />

        {/* PaginationLayer */}
        {hasPermission ? <OrderReportLayer /> : <AccessDeniedLayer />}
      </MasterLayout>
    </>
  );
};

export default OrderReportPage;

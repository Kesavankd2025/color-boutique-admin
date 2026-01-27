import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RetailerOrderHistoryLayer from "../components/RetailerOrderHistoryLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const RetailerOrderHistoryPage = () => {
    const hasPermission = usePermission("retailerOrderHistory", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Retailer Orders" header="Retailer Orders" />

        {/* UsersListLayer */}
        {hasPermission ? <RetailerOrderHistoryLayer /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default RetailerOrderHistoryPage;

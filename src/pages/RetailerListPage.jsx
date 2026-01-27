import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RetailerListLayer from "../components/RetailerListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const RetailerListPage = () => {
  const hasPermission = usePermission("retailersList", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Retailer List" header="Retailer List" />

        {/* Retailer List */}
              {hasPermission ? <RetailerListLayer /> : <AccessDeniedLayer />}


      </MasterLayout>
    </>
  );
};

export default RetailerListPage;

import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import InventoryStockListLayer from "../components/InventoryStockListPageLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const InventoryStockListPage = () => {
    const hasPermission = usePermission("addStock", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add stock" />

        {/* Inventory List */}
        {hasPermission ? <InventoryStockListLayer /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default InventoryStockListPage;

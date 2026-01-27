import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import InventoryListLayer from "../components/InventoryListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const InventoryListPage = () => {
    const hasPermission = usePermission("inventoryList", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Inventory List" />

        {/* Inventory List */}
        {hasPermission ? <InventoryListLayer /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default InventoryListPage;

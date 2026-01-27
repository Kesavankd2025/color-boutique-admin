import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import InventoryLogLayer from "../components/InventoryLogLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const InventoryLogPage = () => {
    const hasPermission = usePermission("inventoryLog", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Inventory Log" />

        {/* Inventory Log */}
        {hasPermission ? <InventoryLogLayer /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default InventoryLogPage;

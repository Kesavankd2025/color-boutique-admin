import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import InventoryAddStockListLayer from "../components/InventoryAddStockFormPageLayer";


const InventoryStockListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add stock" />

        {/* Inventory List */}
        <InventoryAddStockListLayer />

      </MasterLayout>

    </>
  );
};

export default InventoryStockListPage;

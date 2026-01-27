import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DamagedGoodsManagementLayer from "../components/DamagedGoodsManagementLayer";


const DamagedGoodsManagement = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Damaged Goods Management" />

        {/* DropdownLayer */}
        <DamagedGoodsManagementLayer />


      </MasterLayout>
    </>
  );
};

export default DamagedGoodsManagement;

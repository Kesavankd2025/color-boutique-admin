import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddWerehouseLayer from "../components/AddWarehouseLayer";


const AddWerehousePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Werehouse" />

        {/* AddUserLayer */}
        <AddWerehouseLayer />


      </MasterLayout>
    </>
  );
};

export default AddWerehousePage;

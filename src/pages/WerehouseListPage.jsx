import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WerehouseListLayer from "../components/WarehouseListLayer";



const WerehouseList = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Werehouse List" header="Werehouse List" />

        {/* UsersListLayer */}
        <WerehouseListLayer />

      </MasterLayout>

    </>
  );
};

export default WerehouseList;

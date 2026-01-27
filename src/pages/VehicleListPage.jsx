import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import VehicleListLayer from "../components/VehicleListLayer";

const VehicleListPage = () => {
  return (
    <>

      <MasterLayout>
      <Breadcrumb title="Vehicles" header="Vehicle List" />
        {/* <Breadcrumb title="Vehicle List " /> */}

        <VehicleListLayer />

      </MasterLayout>

    </>
  );
};

export default VehicleListPage; 

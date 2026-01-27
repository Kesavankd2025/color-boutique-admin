import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AssignDeliveryPersonLayer from "../components/AssignDeliveryPersonLayer";


const AssignDeliveryPersonPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Assign Delivery Person " />

        {/* Assign Delivery Person */}
        <AssignDeliveryPersonLayer />


      </MasterLayout>
    </>
  );
};

export default AssignDeliveryPersonPage;

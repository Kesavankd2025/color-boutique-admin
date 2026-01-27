import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DashBoardLayerTwo from "../components/DashBoardLayerTwo";


const PurchaseHistory = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Purchase courses list" header="Booking list" />

        {/* DashBoardLayerTwo */}
        <DashBoardLayerTwo />

      </MasterLayout>
    </>
  );
};

export default PurchaseHistory;

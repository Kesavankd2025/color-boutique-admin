import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RepackingOrderListLayer from "../components/RepackingOrderListLayer";


const RepackingOrderListPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Repacking Order List " />

        {/* Repacking Order List  */}
        <RepackingOrderListLayer />


      </MasterLayout>
    </>
  );
};

export default RepackingOrderListPage;

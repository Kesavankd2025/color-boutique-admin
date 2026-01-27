import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RepackingAndWastageUpdateLayer from "../components/RepackingWastageUpdateLayer";


const RepackingAndWastageUpdatePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Repacking And Wastage Update " />

        {/* Repacking And Wastage Update  */}
        <RepackingAndWastageUpdateLayer />


      </MasterLayout>
    </>
  );
};

export default RepackingAndWastageUpdatePage;

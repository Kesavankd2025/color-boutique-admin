import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RepackingReportsLayer from "../components/RepackingReportsLayer";


const RepackingReportsPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Repacking Reports  " />

        {/*Repacking Reports   */}
        <RepackingReportsLayer />


      </MasterLayout>
    </>
  );
};

export default RepackingReportsPage;

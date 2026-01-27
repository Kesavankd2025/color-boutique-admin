import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AssignSalemansLayer from "../components/AssignSalesmansLayer";


const AssignSalemansPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Assign Salemans" />

        {/* Assign Salemans */}
        <AssignSalemansLayer />


      </MasterLayout>
    </>
  );
};

export default AssignSalemansPage;

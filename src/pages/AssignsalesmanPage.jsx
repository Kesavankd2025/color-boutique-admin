import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AssignSalemanLayer from "../components/AssignSalesmanLayer";


const AssignSalemanPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Assign Saleman" />

        {/* AlertLayer */}
        <AssignSalemanLayer />


      </MasterLayout>
    </>
  );
};

export default AssignSalemanPage;

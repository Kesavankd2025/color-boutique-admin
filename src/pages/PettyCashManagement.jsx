import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PettyCashManagementLayer from "../components/pettyCashManagementLayer";



const PettyCashManagementPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        {/* <Breadcrumb title="Petty Cash Management " /> */}
        <Breadcrumb title="Petty Cash Management" header="Petty Cash Management" />

        {/* Petty Cash Transaction List */}
        <PettyCashManagementLayer />

      </MasterLayout>

    </>
  );
};

export default PettyCashManagementPage; 

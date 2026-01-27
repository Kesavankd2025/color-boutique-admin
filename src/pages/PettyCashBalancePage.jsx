import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PettyCashBalanceLayer from "../components/PettyCaseBalanceLayer";



const PettyCashBalancePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Petty Cash Balance  " />

        {/* Petty Cash Balance  */}
        <PettyCashBalanceLayer />

      </MasterLayout>

    </>
  );
};

export default PettyCashBalancePage; 

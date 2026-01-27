import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AdjustCreditLimitLayer from "../components/AdjustCreditLimitLayer";


const AdjustCreditLimitPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Adjust Credit Limit" header="Adjust Credit Limit" />

        {/* Adjust Credit Limit */}
        <AdjustCreditLimitLayer />


      </MasterLayout>

    </>
  );
};

export default AdjustCreditLimitPage;

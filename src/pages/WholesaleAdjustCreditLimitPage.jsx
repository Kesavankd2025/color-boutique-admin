import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WholesaleAdjustCreditLimit from "../components/WholesaleAdjustCreditLimitLayer";



const CategoryPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Adjust Credit Limit" header="Adjust Credit Limit" />

        {/* FormPageLayer */}
        <WholesaleAdjustCreditLimit />


      </MasterLayout>

    </>
  );
};

export default CategoryPage;

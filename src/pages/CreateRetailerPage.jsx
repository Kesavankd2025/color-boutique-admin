import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateRetailerLayer from "../components/CreateRetailerLayer";


const CreateRetailerPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Create Retailer Layer"/>

        {/* Create Retailer Layer */}
        <CreateRetailerLayer />


      </MasterLayout>

    </>
  );
};

export default CreateRetailerPage;

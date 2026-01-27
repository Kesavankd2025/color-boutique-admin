import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateWholesalerFormLayer from "../components/CreateWholesalerFormLayer";


const CreateProductList = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Create Wholesaler List"/>

        {/* ProductListLayer */}
        <CreateWholesalerFormLayer />

      </MasterLayout>

    </>
  );
};

export default CreateProductList;

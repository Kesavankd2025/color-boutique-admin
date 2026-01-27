import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ProductListPage from "../components/CreateProductListLayer";


const CreateProductList = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Product Form" header="Product Form" />

        {/* ProductListLayer */}
        <ProductListPage />
        
      </MasterLayout>

    </>
  );
};

export default CreateProductList;

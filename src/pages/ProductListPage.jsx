import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ProductListPage from "../components/ProductListPage";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const ProductsListPage = () => {
  const hasPermission = usePermission("products", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */} 
        <Breadcrumb title="Product List" header="Product List" />

        {/* ProductListLayer */}
        {hasPermission ? <ProductListPage /> : <AccessDeniedLayer/>}

      </MasterLayout>

    </>
  );
};

export default ProductsListPage;

import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CategoryPageLayer from "../components/CategoryPageLayer";
import AccessDeniedLayer from "../components/AccessDeniedLayer";
import usePermission from "../hook/usePermission";
// import FormPageLayer from "../components/FormPageLayer";



const CategoryPage = () => {
  const hasPermission = usePermission("categories", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Category Form" header="Product Categories"  button="Add Product"/>

        {/* FormPageLayer */}
        {hasPermission ? <CategoryPageLayer /> : <AccessDeniedLayer />}


      </MasterLayout>

    </>
  );
};

export default CategoryPage;

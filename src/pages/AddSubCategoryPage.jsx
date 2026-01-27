import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddSubCategoryPage from "../components/AddSubCategoryPage";
// import FormPageLayer from "../components/FormPageLayer";



const CategoryPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Category Form" header="Sub Category Form" />

        {/* FormPageLayer */}
        <AddSubCategoryPage />


      </MasterLayout>

    </>
  );
};

export default CategoryPage;

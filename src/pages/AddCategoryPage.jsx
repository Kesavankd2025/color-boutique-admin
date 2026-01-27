import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddCategoryPage from "../components/AddCategoryPage";
// import FormPageLayer from "../components/FormPageLayer";



const CategoryPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Category Form" header="Category Form" />

        {/* FormPageLayer */}
        <AddCategoryPage />


      </MasterLayout>

    </>
  );
};

export default CategoryPage;

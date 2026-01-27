import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddChildCategoryPage from "../components/AddChildCategoryPage";
// import FormPageLayer from "../components/FormPageLayer";


const CategoryPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Category Form" header="Child Category Form" />

        {/* FormPageLayer */}
        <AddChildCategoryPage />


      </MasterLayout>

    </>
  );
};

export default CategoryPage;

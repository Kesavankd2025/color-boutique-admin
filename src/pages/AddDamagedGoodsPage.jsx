import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import AddSubCategoryPage from "../components/AddSubCategoryPage";
import AddDamagedGoodsLayer from "../components/AddDamagedGoodsLayer";



const AddDamagedGoodsPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Damaged Goods Page" header="Add Damaged Goods Page" />

        {/* FormPageLayer */}
        <AddDamagedGoodsLayer />


      </MasterLayout>

    </>
  );
};

export default AddDamagedGoodsPage;

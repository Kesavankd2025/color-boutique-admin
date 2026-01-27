import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SalesmanAssignWholesalerRetailer from "../components/SalesmanAssignWholesalerRetailerLayer";



const CategoryPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Salesman Assign Wholesaler / Retailer" header="Salesman Assign Wholesaler / Retailer" />

        {/* FormPageLayer */}
        <SalesmanAssignWholesalerRetailer />


      </MasterLayout>

    </>
  );
};

export default CategoryPage;

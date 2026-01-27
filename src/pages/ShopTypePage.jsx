import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ShopTypePage from "../components/ShopType";
// import UsersListLayer from "../components/UsersListLayer";


const ShopType = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Shop type" header="Shop Type" />

        {/* UsersListLayer */}
        <ShopTypePage />

      </MasterLayout>

    </>
  );
};

export default ShopType;

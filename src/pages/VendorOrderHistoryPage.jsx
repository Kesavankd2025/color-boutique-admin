import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";


import VendorOrderHistory from "../components/VendorOrderHistoryLayer";

const UsersListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Vendor Order History" header="Vendor Order History" />

        {/* UsersListLayer */}
        <VendorOrderHistory />

      </MasterLayout>

    </>
  );
};

export default UsersListPage;

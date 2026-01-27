import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";
import ManagementPageLayer from "../components/ManagementPageLayer";


const ManagementPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Management Team" header="Management Team" />

        {/* UsersListLayer */}
        <ManagementPageLayer />

      </MasterLayout>

    </>
  );
};

export default ManagementPage; 

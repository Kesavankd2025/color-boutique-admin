import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import StackTransferManagementLayer from "../components/StackTransferManagementLayer";



const StackTransferManagementList = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Stack Transfer Management List" header="Stack Transfer Management List" />

        {/* UsersListLayer */}
        <StackTransferManagementLayer />

      </MasterLayout>

    </>
  );
};

export default StackTransferManagementList;

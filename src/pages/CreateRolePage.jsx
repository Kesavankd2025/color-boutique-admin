import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateRoleLayer from "../components/CreateRoleLayer";


const CreateRolePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Create Role" header="Create Role" />

        {/* Create Role */}
        <CreateRoleLayer />


      </MasterLayout>

    </>
  );
};

export default CreateRolePage;

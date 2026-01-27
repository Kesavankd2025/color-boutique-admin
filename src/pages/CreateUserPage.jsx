import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CreateUserLayer from "../components/CreateUserLayer";


const CreateUserPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="User Form" header="User Form" />

        {/* Create User */}
        <CreateUserLayer />


      </MasterLayout>

    </>
  );
};

export default CreateUserPage;

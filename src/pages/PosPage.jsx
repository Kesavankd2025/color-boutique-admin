import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";


import PosList from "../components/PosList";


const UsersListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="POS" header="POS" />

        {/* UsersListLayer */}
        <PosList />

      </MasterLayout>

    </>
  );
};

export default UsersListPage;

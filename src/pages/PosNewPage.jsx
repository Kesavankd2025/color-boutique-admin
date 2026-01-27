import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";
import PosNewList from "../components/PosNewList";

const PosNewPage = () => {
    const hasPermission = usePermission("posNew", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="POS" header="POS" />

        {/* UsersListLayer */}
        {hasPermission ? <PosNewList /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default PosNewPage;

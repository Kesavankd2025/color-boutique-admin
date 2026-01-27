import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UsersListLayer from "../components/UsersListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const UsersListPage = () => {
  const hasPermission = usePermission("usersList", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Users" header="User List" />

        {/* UsersListLayer */}
        {hasPermission ? <UsersListLayer /> : <AccessDeniedLayer />}

      </MasterLayout>
    </>
  );
};

export default UsersListPage; 
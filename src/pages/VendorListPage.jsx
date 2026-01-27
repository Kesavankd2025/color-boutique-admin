import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import VendorList from "../components/VendorListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const VendorListPage = () => {
  const hasPermission = usePermission("vendorList", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Vendor List" header="Vendor List" />

        {/* UsersListLayer */}
        {hasPermission ? <VendorList /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default VendorListPage;

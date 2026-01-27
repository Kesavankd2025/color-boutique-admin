import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";
import OfferPageLayer from "../components/OfferPageLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const OfferPage = () => {
  const hasPermission = usePermission("offerCreations", "view");
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Offers" header="Offers List" />

        {/* UsersListLayer */}
        {hasPermission ? <OfferPageLayer /> : <AccessDeniedLayer/>}

      </MasterLayout>

    </>
  );
};

export default OfferPage;

import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import HomePage from "../components/HomePageLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const HomeBannerPage = () => {
  const hasPermission = usePermission("homePage", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Home Page" header="Home Banner " />

        {/* UsersListLayer */}
        {hasPermission ? <HomePage /> : <AccessDeniedLayer />}
      </MasterLayout>
    </>
  );
};

export default HomeBannerPage;

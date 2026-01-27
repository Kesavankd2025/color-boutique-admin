import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import NalsuvaiDashBoardLayer from "../components/NalsuvaiDashboardLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const HomePageOne = () => {
  const hasPermission = usePermission("dashboard", "view");
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="AI" />

        {/*NalSuvai DashBoardLayer */}
       {hasPermission ? (
          <NalsuvaiDashBoardLayer />
        ) : (
          <AccessDeniedLayer />
        )}

      </MasterLayout>
    </>
  );
};

export default HomePageOne;

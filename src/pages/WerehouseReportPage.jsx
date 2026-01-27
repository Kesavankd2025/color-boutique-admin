import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import WerehouseReportLayer from "../components/WareHouseReportLayer";



const WerehouseReport = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Werehouse Report" header="Werehouse Report" />

        {/* UsersListLayer */}
        <WerehouseReportLayer />

      </MasterLayout>

    </>
  );
};

export default WerehouseReport;

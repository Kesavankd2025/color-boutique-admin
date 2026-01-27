import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ManualReport from "../components/RecordManualPayment";
// import FormPageLayer from "../components/FormPageLayer";



const ManualReportPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Category Form" header="Create Category" />

        {/* FormPageLayer */}
        <ManualPayment />


      </MasterLayout>

    </>
  );
};

export default ManualReportPage;

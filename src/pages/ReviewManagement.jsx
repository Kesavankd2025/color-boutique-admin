import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";
import ReviewPage from "../components/ReviewManagemnet.controller";


const ReviewManagementPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Review " header="Review Management" />

        {/* UsersListLayer */}
        <ReviewPage />

      </MasterLayout>

    </>
  );
};

export default ReviewManagementPage; 

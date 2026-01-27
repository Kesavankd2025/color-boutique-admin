import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";
import ContactUsListLayer from "../components/ContactUsListLayer";


const UsersListPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Contact us" header="Contact Us list" />

        {/* UsersListLayer */}
        <ContactUsListLayer />

      </MasterLayout>

    </>
  );
};

export default UsersListPage; 

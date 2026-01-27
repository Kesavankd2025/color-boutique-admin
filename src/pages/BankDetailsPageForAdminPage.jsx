import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import BankDetailForAdminPageLayer from "../components/BankDetailsForAdminPageLayer";

const BankDetailsForAdminPage = () => {
  return (
    <>

      <MasterLayout>

        {/* <Breadcrumb title="Bank List " /> */}
        <Breadcrumb title="Bank List" header="Bank Account List" />

        <BankDetailForAdminPageLayer />

      </MasterLayout>

    </>
  );
};

export default BankDetailsForAdminPage; 

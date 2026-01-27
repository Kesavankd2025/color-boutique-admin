import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";


import TransactionPage from "../components/AddTransactionPageLayer";

const AddTransactionPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Payment Transaction" header="Box Cash Transaction List" />

        {/* UsersListLayer */}
        <TransactionPage />

      </MasterLayout>

    </>
  );
};

export default AddTransactionPage;

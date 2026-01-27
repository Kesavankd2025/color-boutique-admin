import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ExpenseTypeLayer from "../components/ExpenseType";


const ExpenseTypePage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Expense type" header="Expense Type" />

        {/* ExpenseTypePage */}
        <ExpenseTypeLayer />

      </MasterLayout>

    </>
  );
};

export default ExpenseTypePage;

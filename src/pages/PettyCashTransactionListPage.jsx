import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PettyCashTransactionListLayer from "../components/PettyCashTransactionListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const PettyCashTransactionListPage = () => {
    const hasPermission = usePermission("pettycashTransactionList", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Petty Cash Transaction List " header="Petty Cash Transaction List" />

        {/* Petty Cash Transaction List */}
        {hasPermission ? <PettyCashTransactionListLayer /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default PettyCashTransactionListPage; 

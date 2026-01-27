import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

import TransactionPage from "../components/TransactionList";

const UsersListPage = () => {
    const hasPermission = usePermission("paymentTransactionList", "view");
    return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Payment Transaction List" header="Transaction List" />

        {/* UsersListLayer */}
        {hasPermission ? <TransactionPage /> : <AccessDeniedLayer />}

      </MasterLayout>

    </>
  );
};

export default UsersListPage;

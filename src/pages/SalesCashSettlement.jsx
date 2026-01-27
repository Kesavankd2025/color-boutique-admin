import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SalesCashSettlementComponent from "../components/SalesCashSettlement";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const SalesCashSettlement = () => {
    const hasPermission = usePermission("salesCashSettlement", "view");
    return (
        <MasterLayout>
            <Breadcrumb title="Sales Cash Settlement" header="Sales Cash Settlement" />
            {hasPermission ? <SalesCashSettlementComponent /> : <AccessDeniedLayer />}
        </MasterLayout>
    );
};

export default SalesCashSettlement;
import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import VendorOrderList from "../components/VendorOrderListPage";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const VendorPurchasePage = () => {
    const hasPermission = usePermission("vendorOrderList", "view");
    return (
        <>
            <MasterLayout>
                <Breadcrumb title="Vendor Purchase" header="Vendor Purchase List" />
                {hasPermission ? <VendorOrderList /> : <AccessDeniedLayer />}
            </MasterLayout>
        </>
    );
};

export default VendorPurchasePage;

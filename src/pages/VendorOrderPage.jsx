import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import VendorOrderList from "../components/VendorOrderListPage";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const VendorOrderPage = () => {
    const hasPermission = usePermission("vendorOrderList", "view");
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Vendor Purchase List" header="Vendor Purchase List" />

                {/* UsersListLayer */}
                {hasPermission ? <VendorOrderList /> : <AccessDeniedLayer />}
            </MasterLayout>

        </>
    );
};

export default VendorOrderPage;

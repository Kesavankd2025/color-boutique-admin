import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb"
import CancelledOrderLayer from "../components/CancelledOrderLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const CancelledOrders = () => {
    const hasPermission = usePermission("customerOrder", "view"); // Using same permission as customer order for now
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Cancelled Orders" header="Cancelled Order List" />

                {/* Layer */}
                {hasPermission ? <CancelledOrderLayer /> : <AccessDeniedLayer />}


            </MasterLayout>
        </>
    );
};

export default CancelledOrders;

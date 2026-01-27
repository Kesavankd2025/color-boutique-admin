import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveryManRequestPage from "../components/DeliveryManRequestPage";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const DeliveryManRequest = () => {
    const hasPermission = usePermission("deliveryManRequest", "view");
    return (
        <MasterLayout>
            <Breadcrumb title="Delivery Man Request List" header="Delivery Man Request List" />
            {hasPermission ? <DeliveryManRequestPage /> : <AccessDeniedLayer />}
        </MasterLayout>
    );
};

export default DeliveryManRequest;
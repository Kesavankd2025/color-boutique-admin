import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import DeliveryManComplaintList from "../components/DeliveryManComplaintList";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const DeliveryManComplaint = () => {
    const hasPermission = usePermission("deliveryManComplaint", "view");
    return (
        <MasterLayout>
            <Breadcrumb title="Delivery Man Complaint List" header="Delivery Man Complaint List" />
            {hasPermission ? <DeliveryManComplaintList /> : <AccessDeniedLayer />}
        </MasterLayout>
    );
};

export default DeliveryManComplaint;
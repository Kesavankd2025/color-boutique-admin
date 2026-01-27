import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CustomerListLayer from "../components/CustomerListPageLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const CustomerListPage = () => {
    const hasPermission = usePermission("customerList", "view");
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Users" header="Customer List" />

                {/* UsersListLayer */}
                {hasPermission ? <CustomerListLayer /> : <AccessDeniedLayer />}

            </MasterLayout>

        </>
    );
};

export default CustomerListPage; 

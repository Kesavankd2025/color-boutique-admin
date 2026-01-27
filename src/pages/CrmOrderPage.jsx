import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";
import CrmOrderPageLayer from "../components/CrmOrderPageLayer";

const CrmOrderPage = () => {
    const hasPermission = usePermission("posNew", "view");
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="CRM" header="CRM" />

                {/* UsersListLayer */}
                {hasPermission ? <CrmOrderPageLayer /> : <AccessDeniedLayer />}

            </MasterLayout>

        </>
    );
};

export default CrmOrderPage;

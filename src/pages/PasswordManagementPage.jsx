import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import PasswordManagementLayer from "../components/PasswordManagemantLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const PasswordManagementPage = () => {
    const hasPermission = usePermission("passwordManagement", "view");
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Password Management " header="Password Management " />

                {/*Password Management*/}
                {hasPermission ? <PasswordManagementLayer /> : <AccessDeniedLayer />}

            </MasterLayout>
        </>
    );
};

export default PasswordManagementPage; 

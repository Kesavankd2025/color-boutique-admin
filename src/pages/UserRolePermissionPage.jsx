import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UserRolePermissionLayer from "../components/UserRoleAndPermissionLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const UserRolePermissionPage = () => {
    const hasPermission = usePermission("userRolePermission", "view");
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="User Role Permission" header="User Role Permission" />

                {/*User Role Permission */}
                {hasPermission ? <UserRolePermissionLayer /> : <AccessDeniedLayer />}

            </MasterLayout>

        </>
    );
};

export default UserRolePermissionPage; 

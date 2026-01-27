import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UserActivityLogLayer from "../components/UserActivityLogsLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const UserActivityLogPage = () => {
    const hasPermission = usePermission("userActivityLog", "view");
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="User Activity Log " header=" User Activity Log " />

                {/*User Activity Log  */}
                {hasPermission ? <UserActivityLogLayer /> : <AccessDeniedLayer />}

            </MasterLayout>

        </>
    );
};

export default UserActivityLogPage; 

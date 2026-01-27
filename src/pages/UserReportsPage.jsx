import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import UserReportsLayer from "../components/UsersReportLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const UserReportsPage = () => {
    const hasPermission = usePermission("usersReport", "view");
    return (
        <>
            {/* MasterLayout */}
            <MasterLayout>
                {/* Breadcrumb */}
                <Breadcrumb title="User Reports " header=" User Reports " />

                {/*User Reports  */}
                {hasPermission ? <UserReportsLayer /> : <AccessDeniedLayer />}

            </MasterLayout>

        </>
    );
};

export default UserReportsPage; 

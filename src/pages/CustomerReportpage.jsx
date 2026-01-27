import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CustomerReportsLayer from "../components/CustomerReportsLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";

const CustomerReportPage = () => {
    const hasPermission = usePermission("customerReports", "view");
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Category Form" header="Customer Reports" button="Customer Reports" />

                {/* FormPageLayer */}
                {hasPermission ? <CustomerReportsLayer /> : <AccessDeniedLayer />}

            </MasterLayout>

        </>
    );
};

export default CustomerReportPage;

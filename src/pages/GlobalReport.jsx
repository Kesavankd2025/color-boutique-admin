import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";
import GlobalReportPageLayer from "../components/GlobalReportPageLayer";


const UsersListPage = () => {
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Product Report" header="Product Report" />

                {/* UsersListLayer */}
                <GlobalReportPageLayer />

            </MasterLayout>

        </>
    );
};

export default UsersListPage;

import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CrmListLayer from "../components/CrmUserListPageLayer";

const CrmListPage = () => {
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="CRM User List" />

                {/* PaginationLayer */}
                <CrmListLayer />

            </MasterLayout>

        </>
    );
};

export default CrmListPage; 

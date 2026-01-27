import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import CrmOrderListLayer from "../components/CrmOrderListPageLayer";

const CrmorderListPage = () => {
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="CRM Orders List" />

                {/* PaginationLayer */}
                <CrmOrderListLayer />

            </MasterLayout>

        </>
    );
};

export default CrmorderListPage; 

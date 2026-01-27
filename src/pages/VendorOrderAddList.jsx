
import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";
import VendorAddList from "../components/VendorPurchaseAddListPageLayer"

// import VendorAddOrderPageLayer from "../components/VendorAddOrderPageLayer"; // Correct

const VendorAddOrderPage = () => {
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Vendor Purchase List" header="Vendor Purchase List" />

                {/* UsersListLayer */}
                <VendorAddList />

            </MasterLayout>

        </>
    );
};

export default VendorAddOrderPage;

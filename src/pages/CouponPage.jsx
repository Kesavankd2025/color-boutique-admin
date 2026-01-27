import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
// import UsersListLayer from "../components/UsersListLayer";
import CouponPageLayer from "../components/CouponPageLayer";
import usePermission from "../hook/usePermission";
import AccessDeniedLayer from "../components/AccessDeniedLayer";


const CouponPage = () => {
  const hasPermission = usePermission("couponCreation", "view");
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Coupon" header="Coupon List" />

                {/* UsersListLayer */}
                {hasPermission ? <CouponPageLayer /> : <AccessDeniedLayer/>}

            </MasterLayout>

        </>
    );
};

export default CouponPage;

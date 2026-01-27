import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import OrdersInvoiceDetailPosLayer from "../components/PosOrderInvoicePageLayer";


const PosInvoiceDetailPage = () => {
    return (
        <>

            {/* MasterLayout */}
            <MasterLayout>

                {/* Breadcrumb */}
                <Breadcrumb title="Pos Order Details" header="Pos Order Details" />

                {/* UsersListLayer */}
                <OrdersInvoiceDetailPosLayer />

            </MasterLayout>

        </>
    );
};

export default PosInvoiceDetailPage;

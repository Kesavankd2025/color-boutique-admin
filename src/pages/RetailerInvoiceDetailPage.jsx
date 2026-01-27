import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import OrdersInvoiceDetailRetailerLayer from "../components/OrdersInvoiceDetailLayerRetailer";


const RetailerInvoiceDetailPage = () => {
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Retailer Order Details" header="Retailer Order Details" />

        {/* UsersListLayer */}
        <OrdersInvoiceDetailRetailerLayer/>

      </MasterLayout>

    </>
  );
};

export default RetailerInvoiceDetailPage;

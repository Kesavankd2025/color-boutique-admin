import apiClient from '../network/apiClient';
import ShowNotifications from '../utils/notification';

class PaymentApi {
  async paymentOrderList(input) {
    try {
      const response = await apiClient.get('/payment/order-list', {
        params: {
            limit: input.pageSize,
            page: input.pageIndex,
        }
    });

      if (response.status === 200 || response.status === 201) {
        return {
          response: response.data,
          status: true
        };
      } else {
        // ShowNotifications.showAlertNotification('Something went wrong', true);
        console.log(response)
        return {
          status: false
        };
      }
    } catch (error) {
    //   ShowNotifications.showAxiosErrorAlert(error);
    console.log(error)
      return {
        response: null,
        status: false
      };
    }
  }
}

const paymentApi = new PaymentApi();

export default paymentApi;
import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class deliveryApi {

  async DeliveryTrack(input) {
    try {
      const response = await apiClient.get('/order-list', {
        params: input
      })

      if (response.status == 200 || response.status == 201) {
        return {
          response: response.data,
          status: true
        }
      } else {
        //ShowNotifications.showAlertNotification('Some thing went wrong', true)
        return {
          status: false
        }
      }
    } catch (error) {
      // ShowNotifications.showAxiosErrorAlert(error)
      return {
        response: null,
        status: false
      }
    }
  }

}

const DeliveryApi = new deliveryApi()
export default DeliveryApi

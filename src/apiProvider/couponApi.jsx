import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class couponApi {
  async couponCreate(input) {
    try {
      const response = await apiClient.post('/coupons', input)

      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message, true)
        return {
          status: true
        }
      } else {
        ShowNotifications.showAlertNotification('Some thing went wrong', true)
        return {
          status: false
        }
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errorDetails ||
        error?.message ||
        "Something went wrong";
      ShowNotifications.showAxiosErrorAlert(message)
      return {
        response: null,
        status: false
      }
    }
  }

  async updateCoupon(id, input) {
    try {
      const response = await apiClient.put(`/coupons/${id}`, input)

      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message, true)
        return {
          status: true
        }
      } else {
        ShowNotifications.showAlertNotification('Some thing went wrong', true)
        return {
          status: false
        }
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errorDetails ||
        error?.message ||
        "Something went wrong";
      ShowNotifications.showAxiosErrorAlert(message)
      return {
        response: null,
        status: false
      }
    }
  }

  async couponList(input) {

    try {
      const response = await apiClient.get('/coupons', { params: input })

      if (response.status === 200 || response.status === 201) {
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

  async getCouponById(input) {

    try {
      const response = await apiClient.get(`/coupons/${input}`)

      if (response.status === 200 || response.status === 201) {
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

  async deleteCoupon(id) {
    try {
      const response = await apiClient.patch(`/coupons/${id}`)

      if (response.status === 200 || response.status === 201) {
        ShowNotifications.showAlertNotification(response.data.message, true)
        return {
          response: response.data,
          status: true
        }
      } else {
        ShowNotifications.showAlertNotification('Some thing went wrong', true)
        return {
          status: false
        }
      }
    } catch (error) {
      ShowNotifications.showAxiosErrorAlert(error)
      return {
        response: null,
        status: false
      }
    }
  }
}

const CouponApi = new couponApi()
export default CouponApi

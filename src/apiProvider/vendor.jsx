import { start } from '@popperjs/core'
import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class VendorApi {
  async vendorcreate(input) {
    try {
      const response = await apiClient.post('/vendor', input)

      if (response.status == 200 || response.status == 201) {
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
    } catch (err) {
      ShowNotifications.showAxiosErrorAlert(err)
      return {
        response: null,
        status: false
      }
    }
  }

  async vendorList(input) {
    try {
      const params = {
        page: input.page || 0,
        limit: input.limit || 10,
        search: input.search || "",
        format: input.format || ''
      };
      console.log(params, "parmssss")

      const response = await apiClient.get('/vendor/list/dtls', {
        params
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

  async vendorDetails(input) {
    try {
      const response = await apiClient.get(`/vendor/${input}`)

      if (response.status == 200 || response.status == 201) {
        return {
          response: response.data,
          status: true
        }
      } else {
        // ShowNotifications.showAlertNotification('Some thing went wrong', true)
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
  async updatevendor(input, id) {
    try {
      const response = await apiClient.patch(`/vendor/edit/${id}`, input)
      if (response.status == 200 || response.status == 201) {
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
      ShowNotifications.showAxiosErrorAlert(error)
      return {
        response: null,
        status: false
      }
    }
  }
  async deletetVendor(id) {
    try {
      const response = await apiClient.patch(`/vendor/delete/${id}`)

      if (response.status == 200 || response.status == 201) {
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

  async getProductBasedOnVendor(input) {
    try {
      const response = await apiClient.get(`/vendor/product/list`, {
        params: {
          type: "customer",
          vendorId: input
        }
      })

      if (response.status == 200 || response.status == 201) {
        return {
          response: response.data,
          status: true
        }
      } else {
        // ShowNotifications.showAlertNotification('Some thing went wrong', true)
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

  async vendorPurchase(input) {
    try {
      const response = await apiClient.post('/purchases', input)

      if (response.status == 200 || response.status == 201) {
        ShowNotifications.showAlertNotification(response.data.message, true)
        return {
          status: true, response: response.data,
        }
      } else {
        ShowNotifications.showAlertNotification('Some thing went wrong', true)
        return {
          status: false
        }
      }
    } catch (err) {
      ShowNotifications.showAxiosErrorAlert(err)
      return {
        response: null,
        status: false
      }
    }
  }
  async getPurchaselist(input) {
    try {
      const params = {
        page: input.page || 0,
        limit: input.limit || 10,
      };

      if (input?.filters && typeof input.filters === 'object' && Object.keys(input.filters).length > 0) {
        if (input.filters.name && typeof input.filters.name === 'string') {
          params.search = input.filters.name.trim();
        } else if (input.filters.values && typeof input.filters.values === 'string') {
          params.search = input.filters.values.trim();
        }
      }
      const response = await apiClient.get('/purchases', {
        params
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


  async stockUpdate(input, id) {
    try {
      const response = await apiClient.put(`/purchases/${id}`, input)
      if (response.status == 200 || response.status == 201) {
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
      ShowNotifications.showAxiosErrorAlert(error)
      return {
        response: null,
        status: false
      }
    }
  }

  async getVendordOrdePaymentList(input) {
    try {
      const response = await apiClient.get('/vendor-purchases')

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

  async getVendordOrdePaymentDueList(input) {
    try {
      const response = await apiClient.get('/vendor/payment-dues/list')

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
  async getVendorTodayPaymentList(input) {
    try {
      const response = await apiClient.get('/vendor/today/payment-dues/list')

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

  async updateVendorPayment(input, id) {
    try {
      const response = await apiClient.put(`/update-payment/${id}`, input)
      if (response.status == 200 || response.status == 201) {
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
      ShowNotifications.showAxiosErrorAlert(error)
      return {
        response: null,
        status: false
      }
    }
  }
  async getVendorPurchases(input) {
    try {
      const response = await apiClient.get('/vendor-purchases', {
        params: {
          vendorId: input.vendorId,
          page: input.page || 0,
          limit: input.limit || 10,
          search: input.search || '',
          startDate: input.startDate || '',
          endDate: input.endDate || ''
        }
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
  async getPurchaseOrderDetails(input) {
    try {
      const response = await apiClient.get(`/purchases/${input}`)

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

const VendorApis = new VendorApi()
export default VendorApis

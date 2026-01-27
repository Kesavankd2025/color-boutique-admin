import { toast } from 'react-toastify'
import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class AttributeApi {
  async attributecreate(input) {
    try {
      const response = await apiClient.post('/attribute', input)
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
      if (err.message === "Attribute name already exists") {
        toast.error("Unit name already exists");
      }
      return {
        response: null,
        status: false
      }
    }
  }

  async attributeList(input) {
    try {
      const params = {
        page: input.page || 0,
        limit: input.limit || 10,
        search: input.search || ""
      };


     const response = await apiClient.get('/attribute/list/dtls', {
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

  async attributeDetails(input) {
    try {
      const response = await apiClient.get(`/attribute/${input}`)

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
  async updateattribute(input, id) {
    try {
      const response = await apiClient.patch(`/attribute/edit/${id}`, input)
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
  async deleteAttribute(id) {
    try {
       const response = await apiClient.patch(`/attribute/delete/${id}`)

      if (response.status == 200 || response.status == 201) {
        // ShowNotifications.showAlertNotification(response.data.message, true)

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

  // Api for the shop type
  async shoptypecreate(input) {
    try {
      const response = await apiClient.post('/shop-type', input)

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
            const message =
                error?.response?.data?.message ||
                error?.response?.data?.errorDetails ||
                error?.message ||
                "Something went wrong";
 
            ShowNotifications.showAlertNotification(message, false);
 
            return {
                response: null,
                status: false
            }
        }
  }
  async shoptypeList(input) {
    try {
      const params = {
        page: input.page || 0,
        limit: input.limit || 10,
        search: input.search || ""
      };
      const response = await apiClient.get('/shop-type', {
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
  async updateshoptype(input, id) {
    try {
      const response = await apiClient.patch(`/shop-type/${id}`, input)
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
  async deleteShopType(id) {
    try {
      const response = await apiClient.delete(`/shop-type/${id}`)

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
  async shoptypeDetails(input) {
    try {
      const response = await apiClient.get(`shop-type/${input}`)

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

}

const AttribiteApis = new AttributeApi()
export default AttribiteApis

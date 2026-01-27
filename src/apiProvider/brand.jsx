import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class brandApi {
  async brandcreate(input) {
    try {
      const response = await apiClient.post('/brand', input)

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

  async brandList(input) {
    const params = {
      page: input.page || 0,
      limit: input.limit || 10,
    };

    if (input?.filters && typeof input.filters === 'object' && Object.keys(input.filters).length > 0) {
      if (input.filters.name && typeof input.filters.name === 'string') {
        params.search = input.filters.name.trim();
      } 
    }
    console.log(params,"params")
    try {
      const response = await apiClient.get('/brand/list/dtls', {
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

  async brandDetails(input) {
    try {
      const response = await apiClient.get(`/brand/${input}`)

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
  async updateBrand(input, id) {
    try {
      const response = await apiClient.patch(`/brand/edit/${id}`, input)
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
  async deleteBrand(id) {
    try {
      const response = await apiClient.patch(`/brand/delete/${id}`)

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
}

const BrandApi = new brandApi()
export default BrandApi

import apiClient from '../network/apiClient'
// import ShowNotifications from '../utils/notification'
// import axios from 'axios';
class dashboardApi {

  async getLatestCustomer(input) {

    try {
      const response = await apiClient.get(`/dashboard/recent-customer`)

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

  async getTopSelling(input) {
    console.log(input, "iii");

    try {
      const response = await apiClient.get(`/dashboard/top-selling-product`, { params: { dateFilter: input } })

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

  async getOverAllSales() {
    try {
      const response = await apiClient.get('/dashboard/sales-overview');
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
      console.error('Error fetching overall sales:', error);
      throw error;
    }
  }

  async getOverview(input) {
    try {
      const response = await apiClient.get('/dashboard/by-month', { params: { filterType: input } });
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
      console.error('Error fetching overview:', error);
      throw error;
    }
  }

  async getInvoice() {
    try {
      const response = await apiClient.get('/dashboard/invoices');
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
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

}

const DashboardApi = new dashboardApi()
export default DashboardApi

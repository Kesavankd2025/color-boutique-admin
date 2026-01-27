import { toast } from 'react-toastify'
import apiClient from '../network/apiClient'
import ShowNotifications from '../utils/notification'

class ExpenseApi {
  // Create Expense Type
  async createExpenseType(input) {
    try {
      const response = await apiClient.post('/expense-type', input)
      if (response.status == 200 || response.status == 201) {
        ShowNotifications.showAlertNotification(response.data.message, true)
        return {
          status: true
        }
      } else {
        ShowNotifications.showAlertNotification('Something went wrong', true)
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

  // Get Expense Type List
  async expenseTypeList(input) {
    try {
      const params = {
        page: input.page || 0,
        limit: input.limit || 10,
        search: input.search || ''
      };

      // Handle search filters
      // if (input?.filters && typeof input.filters === 'object' && Object.keys(input.filters).length > 0) {
      //   if (input.filters.name && typeof input.filters.name === 'string') {
      //     params.search = input.filters.name.trim();
      //   } else if (input.filters.values && typeof input.filters.values === 'string') {
      //     params.search = input.filters.values.trim();
      //   }
      // }

      const response = await apiClient.get('/expense-type', {
        params
      })

      if (response.status == 200 || response.status == 201) {
        return {
          response: response.data,
          status: true
        }
      } else {
        return {
          status: false
        }
      }
    } catch (error) {
      return {
        response: null,
        status: false
      }
    }
  }

  // Get Expense Type Details
  async getExpenseTypeDetails(id) {
    try {
      const response = await apiClient.get(`/expense-type/${id}`)

      if (response.status == 200 || response.status == 201) {
        return {
          response: response.data,
          status: true
        }
      } else {
        return {
          status: false
        }
      }
    } catch (error) {
      return {
        response: null,
        status: false
      }
    }
  }

  // Update Expense Type
  async updateExpenseType(input, id) {
    try {
      const response = await apiClient.patch(`/expense-type/${id}`, input)
      if (response.status == 200 || response.status == 201) {
        ShowNotifications.showAlertNotification(response.data.message, true)
        return {
          status: true
        }
      } else {
        ShowNotifications.showAlertNotification('Something went wrong', true)
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

  // Delete Expense Type
  async deleteExpenseType(id) {
    try {
      const response = await apiClient.delete(`/expense-type/${id}`)

      if (response.status == 200 || response.status == 201) {
        ShowNotifications.showAlertNotification(response.data.message, true)
        return {
          response: response.data,
          status: true
        }
      } else {
        ShowNotifications.showAlertNotification('Something went wrong', true)
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

const ExpenseApis = new ExpenseApi()
export default ExpenseApis